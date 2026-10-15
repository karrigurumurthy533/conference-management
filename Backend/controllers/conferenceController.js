const mongoose = require("mongoose");
const Conference = require("../models/conference");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload");

/**
 * Conference CRUD handlers only.
 *
 * Media rules used everywhere in this file:
 *  - Existing media is kept by sending its URL string in conferenceData.
 *  - A newly picked file is sent as multipart and the matching JSON slot is null.
 *  - Old Cloudinary assets that are no longer referenced are deleted only AFTER the
 *    database write succeeds, and files uploaded during a failed request are removed.
 *    Matching is done by URL, never by array position, so adding / removing /
 *    re-ordering items in the admin form cannot attach the wrong image to an item.
 */

/* =========================================================
   PARSING / NORMALISING
========================================================= */

const parseJsonIfNeeded = (value, fieldName = "field") => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    if (["conferenceData", "data"].includes(fieldName)) {
      throw new Error(`Invalid JSON in ${fieldName}`);
    }
    return value;
  }
};

const cleanText = (value) => (typeof value === "string" ? value.trim() : undefined);
const textOrEmpty = (value) => (typeof value === "string" ? value.trim() : "");

// string -> trimmed string, null -> "" (explicit removal), anything else -> undefined (not sent)
const urlOrEmpty = (value) => {
  if (value === null) return "";
  return typeof value === "string" ? value.trim() : undefined;
};

const toBool = (value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "boolean") return value;
  const text = String(value).trim().toLowerCase();
  if (["true", "1", "on", "yes"].includes(text)) return true;
  if (["false", "0", "off", "no"].includes(text)) return false;
  return undefined;
};

// Accepts string[] or a multi-line string, returns trimmed non-empty strings.
const toStringList = (value) => {
  if (value === undefined) return undefined;
  const list = typeof value === "string" ? value.split(/\r?\n/) : value;
  if (!Array.isArray(list)) return [];
  return list
    .map((item) => (item === null || item === undefined ? "" : String(item).trim()))
    .filter(Boolean);
};

const normalizeKeywords = (value) => {
  if (value === undefined) return undefined;
  const list =
    typeof value === "string" ? value.split(/[\n,]/) : Array.isArray(value) ? value : [];
  const seen = new Set();
  const result = [];
  for (const item of list) {
    const keyword = String(item ?? "").trim();
    if (!keyword) continue;
    const key = keyword.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(keyword);
  }
  return result;
};

const SEO_TEXT_FIELDS = [
  "metaTitle",
  "metaDescription",
  "focusKeyword",
  "canonicalUrl",
  "ogTitle",
  "ogDescription",
  "ogImageAlt",
  "twitterTitle",
  "twitterDescription",
  "twitterImageAlt",
];
const SEO_ENUM_FIELDS = ["ogType", "twitterCard"];

/**
 * Maps the admin form SEO payload to the seoSchema in the model.
 * Fields that are not sent stay undefined so existing values are preserved on update.
 * Old names (keywords / index / follow) are accepted as aliases.
 */
const normalizeSeo = (raw) => {
  if (raw === undefined) return undefined;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};

  const seo = {};

  for (const field of SEO_TEXT_FIELDS) {
    const value = cleanText(raw[field]);
    if (value !== undefined) seo[field] = value;
  }

  for (const field of SEO_ENUM_FIELDS) {
    const value = cleanText(raw[field]);
    if (value) seo[field] = value; // empty enum values are ignored (defaults apply)
  }

  const keywords = normalizeKeywords(
    raw.metaKeywords !== undefined ? raw.metaKeywords : raw.keywords
  );
  if (keywords !== undefined) seo.metaKeywords = keywords;

  const robotsIndex = toBool(raw.robotsIndex !== undefined ? raw.robotsIndex : raw.index);
  if (robotsIndex !== undefined) seo.robotsIndex = robotsIndex;

  const robotsFollow = toBool(raw.robotsFollow !== undefined ? raw.robotsFollow : raw.follow);
  if (robotsFollow !== undefined) seo.robotsFollow = robotsFollow;

  for (const field of ["ogImage", "twitterImage"]) {
    const value = urlOrEmpty(raw[field]);
    if (value !== undefined) seo[field] = value;
  }

  return seo;
};

const parseConferenceData = (req) => {
  let data = req.body?.conferenceData ?? req.body?.data ?? req.body;
  data = parseJsonIfNeeded(data, req.body?.conferenceData !== undefined ? "conferenceData" : "data");

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid conference data. Send an object or JSON in conferenceData.");
  }

  const jsonFields = [
    "speakers", "committee", "sponsors", "keyHighlights", "keyPoints",
    "topics", "tracks", "whoShouldAttend", "registration", "registrationCategories",
    "registrationOptions", "recentPosts", "contact", "venue", "registrationDates",
    "otherData", "welcomeMessage", "submission", "venueInformation", "conferenceDates",
    "aboutContent", "marketAnalysis", "faqs", "socialLinks",
    // new fields
    "galleryImages", "gallery", "latestUpdates", "recentpostUpdates", "seo",
  ];

  for (const field of jsonFields) {
    if (data[field] !== undefined && typeof data[field] === "string") {
      const parsed = parseJsonIfNeeded(data[field], field);
      if (parsed !== data[field]) data[field] = parsed;
    }
  }

  if (typeof data.keyPoints === "string") {
    data.keyPoints = data.keyPoints.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
  }
  if (typeof data.whoShouldAttend === "string") {
    data.whoShouldAttend = data.whoShouldAttend.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  }

  // topics must be string[] (accept legacy {title}/{name} objects too)
  if (typeof data.topics === "string") {
    data.topics = data.topics.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
  }
  if (Array.isArray(data.topics)) {
    data.topics = data.topics
      .map((t) => (typeof t === "string" ? t : t?.title || t?.name || ""))
      .map((t) => String(t).trim())
      .filter(Boolean);
  }

  // never let the client overwrite internal ids
  delete data.id;
  delete data._id;

  /* GALLERY: frontend key "galleryImages" (alias "gallery").
     Strings = existing URLs, null = slot for a new file (galleryImage_<index>). Positions are kept here. */
  if (data.galleryImages === undefined && data.gallery !== undefined) {
    data.galleryImages = data.gallery;
  }
  delete data.gallery;
  if (data.galleryImages !== undefined) {
    const list =
      typeof data.galleryImages === "string"
        ? data.galleryImages.split(/\r?\n/)
        : data.galleryImages;
    data.galleryImages = Array.isArray(list)
      ? list.map((url) => (typeof url === "string" && url.trim() ? url.trim() : null))
      : [];
  }

  /* SCROLLING SENTENCES */
  for (const field of ["latestUpdates", "recentpostUpdates"]) {
    if (data[field] !== undefined) data[field] = toStringList(data[field]);
  }

  /* SEO */
  if (data.seo !== undefined) data.seo = normalizeSeo(data.seo);

  /* RECENT POSTS: title, description, date, image (URL kept, new file = recentPostImage_<index>).
     Positions are kept here; empty posts are removed after the uploads are matched. */
  if (Array.isArray(data.recentPosts)) {
    data.recentPosts = data.recentPosts.map((post) => {
      if (typeof post === "string") {
        return { title: "", description: "", url: post.trim(), date: "", image: "" };
      }
      if (!post || typeof post !== "object") {
        return { title: "", description: "", url: "", date: "", image: "" };
      }
      return {
        title: textOrEmpty(post.title),
        description: textOrEmpty(post.description),
        url: textOrEmpty(post.url),
        date: textOrEmpty(post.date),
        image: textOrEmpty(post.image),
      };
    });
  }

  return data;
};

/* =========================================================
   UPLOAD HELPERS
========================================================= */

const getUploadedFiles = (req) => {
  if (Array.isArray(req.files)) return req.files;
  if (req.files && typeof req.files === "object") return Object.values(req.files).flat().filter(Boolean);
  return req.file ? [req.file] : [];
};

const findFile = (files, ...fieldNames) => files.find((file) => fieldNames.includes(file.fieldname));

const newContext = () => ({ uploaded: [] });

const uploadRequired = async (file, folder, resourceType, ctx) => {
  const result = await uploadToCloudinary(file, folder, resourceType);
  if (!result?.secure_url) throw new Error(`Upload failed for ${file.originalname || file.fieldname}`);
  ctx.uploaded.push({ url: result.secure_url, type: resourceType });
  return result.secure_url;
};

const safeDeleteCloudinary = async (url, resourceType) => {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) return;
  try {
    await deleteFromCloudinary(url, resourceType);
  } catch (error) {
    console.warn("Cloudinary old asset cleanup failed:", error.message);
  }
};

// Remove files uploaded during a request that failed afterwards.
const cleanupUploaded = async (ctx) => {
  await Promise.all(ctx.uploaded.map((item) => safeDeleteCloudinary(item.url, item.type)));
};

// Every Cloudinary-backed URL stored on a conference.
const collectMedia = (conference) => {
  const c = conference?.toObject ? conference.toObject() : conference || {};
  const items = [];
  const add = (url, type = "image") => {
    if (typeof url === "string" && url.trim()) items.push({ url: url.trim(), type });
  };

  add(c.image);
  add(c.aboutImage);
  add(c.video, "video");
  add(c.otherData?.marketAnalysis?.image);
  (c.speakers || []).forEach((speaker) => add(speaker?.image));
  (c.committee || []).forEach((member) => add(member?.image));
  (c.sponsors || []).forEach((url) => add(url));
  (c.galleryImages || []).forEach((url) => add(url));
  (c.recentPosts || []).forEach((post) => add(post?.image));
  add(c.seo?.ogImage);
  add(c.seo?.twitterImage);

  return items;
};

// Delete assets that were stored before the update but are no longer used anywhere.
const deleteStaleMedia = async (before, after) => {
  const keep = new Set(after.map((item) => item.url));
  const seen = new Set();
  const stale = before.filter((item) => {
    if (keep.has(item.url) || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
  await Promise.all(stale.map((item) => safeDeleteCloudinary(item.url, item.type)));
};

const uploadConferenceMedia = async ({ req, data, existing, ctx }) => {
  const files = getUploadedFiles(req);
  const ex = existing?.toObject ? existing.toObject() : existing || {};

  // HERO IMAGE
  const hero = findFile(files, "conferenceImage", "heroImage", "image");
  if (hero) {
    data.image = await uploadRequired(hero, "globalscion/conferences/hero", "image", ctx);
  } else if (existing && data.image === undefined) {
    data.image = ex.image || "";
  } else if (data.image === null) {
    data.image = "";
  }

  // ABOUT IMAGE
  const about = findFile(files, "aboutImage");
  if (about) {
    data.aboutImage = await uploadRequired(about, "globalscion/conferences/about", "image", ctx);
  } else if (existing && data.aboutImage === undefined) {
    data.aboutImage = ex.aboutImage || "";
  } else if (data.aboutImage === null) {
    data.aboutImage = "";
  }

  // MARKET ANALYSIS IMAGE
  const market = findFile(files, "marketImage");
  const existingOtherData = ex.otherData || {};
  const incomingOtherData = data.otherData && typeof data.otherData === "object" ? data.otherData : {};
  data.otherData = {
    ...existingOtherData,
    ...incomingOtherData,
    marketAnalysis: {
      ...(existingOtherData.marketAnalysis || {}),
      ...(incomingOtherData.marketAnalysis || {}),
    },
  };
  if (market) {
    data.otherData.marketAnalysis.image = await uploadRequired(
      market, "globalscion/conferences/market", "image", ctx
    );
  } else if (!data.otherData.marketAnalysis.image) {
    // frontend sends image: null -> keep the existing URL instead of wiping it
    data.otherData.marketAnalysis.image = ex.otherData?.marketAnalysis?.image || "";
  }

  // VIDEO
  const videoFile = findFile(files, "conferenceVideo", "videoFile", "video");
  if (videoFile) {
    data.video = await uploadRequired(videoFile, "globalscion/conferences/videos", "video", ctx);
  } else if (data.video === undefined) {
    data.video = ex.video || "";
  } else if (data.video === null || data.video === "") {
    // user clicked "Remove" in the UI (old file is deleted after the save)
    data.video = "";
  } else if (typeof data.video === "string") {
    data.video = data.video.trim();
  }

  // SPEAKER images (existing URL comes in the payload; no position based fallback)
  if (Array.isArray(data.speakers)) {
    data.speakers = await Promise.all(data.speakers.map(async (speaker, index) => {
      const item = speaker && typeof speaker === "object" ? { ...speaker } : {};
      const file = findFile(files,
        `speakerImage_${index}`, `speakerImages_${index}`, `speakerImages[${index}]`,
        `speakers[${index}][image]`, `speakers.${index}.image`);
      if (file) {
        item.image = await uploadRequired(file, "globalscion/conferences/speakers", "image", ctx);
      } else {
        item.image = textOrEmpty(item.image);
      }
      return item;
    }));
  } else if (existing && data.speakers === undefined) {
    data.speakers = ex.speakers || [];
  }

  // COMMITTEE images
  if (Array.isArray(data.committee)) {
    data.committee = await Promise.all(data.committee.map(async (member, index) => {
      const item = member && typeof member === "object" ? { ...member } : {};
      const file = findFile(files,
        `committeeImage_${index}`, `committeeImages_${index}`, `committeeImages[${index}]`,
        `committee[${index}][image]`, `committee.${index}.image`);
      if (file) {
        item.image = await uploadRequired(file, "globalscion/conferences/committee", "image", ctx);
      } else {
        item.image = textOrEmpty(item.image);
      }
      return item;
    }));
  } else if (existing && data.committee === undefined) {
    data.committee = ex.committee || [];
  }

  // SPONSORS
  const sponsorFiles = files.filter((file) => /^sponsorImage_\d+$/.test(file.fieldname));
  const sponsors = Array.isArray(data.sponsors)
    ? [...data.sponsors]
    : existing ? [...(ex.sponsors || [])] : [];
  const sponsorUploads = await Promise.all(sponsorFiles.map(async (file) => ({
    index: Number(file.fieldname.replace("sponsorImage_", "")),
    url: await uploadRequired(file, "globalscion/conferences/sponsors", "image", ctx),
  })));
  for (const { index, url } of sponsorUploads) sponsors[index] = url;
  data.sponsors = sponsors
    .filter((value) => typeof value === "string" && value.trim())
    .map((value) => value.trim());

  // GALLERY IMAGES
  const galleryFiles = files.filter((file) => /^galleryImage_\d+$/.test(file.fieldname));
  const gallery = Array.isArray(data.galleryImages)
    ? [...data.galleryImages]
    : existing ? [...(ex.galleryImages || [])] : [];
  const galleryUploads = await Promise.all(galleryFiles.map(async (file) => ({
    index: Number(file.fieldname.replace("galleryImage_", "")),
    url: await uploadRequired(file, "globalscion/conferences/gallery", "image", ctx),
  })));
  for (const { index, url } of galleryUploads) gallery[index] = url;
  data.galleryImages = gallery.filter((value) => typeof value === "string" && value.trim());

  // RECENT POST images
  if (Array.isArray(data.recentPosts)) {
    data.recentPosts = await Promise.all(data.recentPosts.map(async (post, index) => {
      const item = { ...post };
      const file = findFile(files, `recentPostImage_${index}`);
      if (file) {
        item.image = await uploadRequired(file, "globalscion/conferences/recent-posts", "image", ctx);
      }
      return item;
    }));
    data.recentPosts = data.recentPosts.filter(
      (post) => post.title || post.description || post.image || post.url || post.date
    );
  }

  // SEO (merged with the stored values so partial updates never wipe other SEO fields)
  const ogFile = findFile(files, "seoOgImage");
  const twitterFile = findFile(files, "seoTwitterImage");
  if (data.seo !== undefined || ogFile || twitterFile) {
    const seo = { ...(ex.seo || {}), ...(data.seo || {}) };
    if (ogFile) {
      seo.ogImage = await uploadRequired(ogFile, "globalscion/conferences/seo", "image", ctx);
    }
    if (twitterFile) {
      seo.twitterImage = await uploadRequired(twitterFile, "globalscion/conferences/seo", "image", ctx);
    }
    data.seo = seo;
  }

  return data;
};

/* =========================================================
   HANDLERS
========================================================= */

exports.createConference = async (req, res) => {
  const ctx = newContext();
  try {
    let data = parseConferenceData(req);
    if (!String(data.title || "").trim()) {
      return res.status(400).json({ success: false, message: "Conference title is required" });
    }
    if (!String(data.category || "").trim()) {
      return res.status(400).json({ success: false, message: "Conference category is required" });
    }

    data = await uploadConferenceMedia({ req, data, existing: null, ctx });
    const conference = await Conference.create({
      ...data,
      title: String(data.title).trim(),
      category: String(data.category).trim(),
      createdBy: req.user?._id || null,
    });

    return res.status(201).json({ success: true, message: "Conference created successfully", data: conference });
  } catch (error) {
    await cleanupUploaded(ctx);
    console.error("Create conference error:", error);
    return res.status(400).json({ success: false, message: error.message || "Failed to create conference" });
  }
};

exports.getAllConferences = async (req, res) => {
  try {
    const conferences = await Conference.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, count: conferences.length, data: conferences });
  } catch (error) {
    console.error("Get conferences error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch conferences" });
  }
};

exports.getConferenceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid conference ID" });
    }
    const conference = await Conference.findById(id).lean();
    if (!conference) return res.status(404).json({ success: false, message: "Conference not found" });
    return res.status(200).json({ success: true, data: conference });
  } catch (error) {
    console.error("Get conference by ID error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch conference" });
  }
};

exports.updateConference = async (req, res) => {
  const ctx = newContext();
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid conference ID" });
    }
    const existing = await Conference.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: "Conference not found" });

    const mediaBefore = collectMedia(existing);

    let data = parseConferenceData(req);
    data = await uploadConferenceMedia({ req, data, existing, ctx });
    data.updatedBy = req.user?._id || null;

    const updatedConference = await Conference.findByIdAndUpdate(id, { $set: data }, {
      new: true,
      runValidators: true,
      context: "query",
    });

    // the database now holds the new state -> safe to remove assets nobody uses any more
    await deleteStaleMedia(mediaBefore, collectMedia(updatedConference));

    return res.status(200).json({ success: true, message: "Conference updated successfully", data: updatedConference });
  } catch (error) {
    await cleanupUploaded(ctx);
    console.error("Update conference error:", error);
    return res.status(400).json({ success: false, message: error.message || "Failed to update conference" });
  }
};

exports.publishConference = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid conference ID" });
    }
    const conference = await Conference.findByIdAndUpdate(id, {
      $set: { status: "Published", updatedBy: req.user?._id || null },
    }, { new: true, runValidators: true });
    if (!conference) return res.status(404).json({ success: false, message: "Conference not found" });
    return res.status(200).json({ success: true, message: "Conference published successfully", data: conference });
  } catch (error) {
    console.error("Publish conference error:", error);
    return res.status(500).json({ success: false, message: "Failed to publish conference" });
  }
};

exports.deleteConference = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid conference ID" });
    }
    const conference = await Conference.findById(id);
    if (!conference) return res.status(404).json({ success: false, message: "Conference not found" });

    await Conference.findByIdAndDelete(id);

    // delete every stored asset (hero, about, video, market, speakers, committee,
    // sponsors, gallery, recent post images, SEO social images)
    await deleteStaleMedia(collectMedia(conference), []);

    return res.status(200).json({ success: true, message: "Conference deleted successfully" });
  } catch (error) {
    console.error("Delete conference error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete conference" });
  }
};
