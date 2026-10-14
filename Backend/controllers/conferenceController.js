const mongoose = require("mongoose");
const Conference = require("../models/conference");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload");

/**
 * Conference CRUD handlers only.
 */

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

  // FIX: topics must be string[] (accept legacy {title}/{name} objects too)
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

  if (Array.isArray(data.recentPosts)) {
    data.recentPosts = data.recentPosts.map((post) => {
      if (typeof post === "string") return { url: post.trim() };
      if (!post || typeof post !== "object") return null;
      return {
        title: typeof post.title === "string" ? post.title.trim() : "",
        description: typeof post.description === "string" ? post.description.trim() : "",
        url: typeof post.url === "string" ? post.url.trim() : "",
        date: typeof post.date === "string" ? post.date.trim() : "",
      };
    }).filter(Boolean);
  }

  return data;
};

const getUploadedFiles = (req) => {
  if (Array.isArray(req.files)) return req.files;
  if (req.files && typeof req.files === "object") return Object.values(req.files).flat().filter(Boolean);
  return req.file ? [req.file] : [];
};

const findFile = (files, ...fieldNames) => files.find((file) => fieldNames.includes(file.fieldname));

const uploadRequired = async (file, folder, resourceType) => {
  const result = await uploadToCloudinary(file, folder, resourceType);
  if (!result?.secure_url) throw new Error(`Upload failed for ${file.originalname || file.fieldname}`);
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

const uploadConferenceMedia = async ({ req, data, existing }) => {
  const files = getUploadedFiles(req);

  // HERO IMAGE
  const hero = findFile(files, "conferenceImage", "heroImage", "image");
  if (hero) {
    const oldUrl = existing?.image;
    data.image = await uploadRequired(hero, "globalscion/conferences/hero", "image");
    if (oldUrl && oldUrl !== data.image) await safeDeleteCloudinary(oldUrl, "image");
  } else if (existing && data.image === undefined) {
    data.image = existing.image || "";
  }

  // ABOUT IMAGE
  const about = findFile(files, "aboutImage");
  if (about) {
    const oldUrl = existing?.aboutImage;
    data.aboutImage = await uploadRequired(about, "globalscion/conferences/about", "image");
    if (oldUrl && oldUrl !== data.aboutImage) await safeDeleteCloudinary(oldUrl, "image");
  } else if (existing && data.aboutImage === undefined) {
    data.aboutImage = existing.aboutImage || "";
  }

  // MARKET ANALYSIS IMAGE
  const market = findFile(files, "marketImage");
  const existingOtherData = existing?.otherData?.toObject
    ? existing.otherData.toObject()
    : (existing?.otherData || {});
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
    const oldUrl = existing?.otherData?.marketAnalysis?.image;
    data.otherData.marketAnalysis.image = await uploadRequired(market, "globalscion/conferences/market", "image");
    if (oldUrl && oldUrl !== data.otherData.marketAnalysis.image) await safeDeleteCloudinary(oldUrl, "image");
  } else if (!data.otherData.marketAnalysis.image) {
    // FIX: frontend sends image: null -> keep the existing URL instead of wiping it
    data.otherData.marketAnalysis.image = existing?.otherData?.marketAnalysis?.image || "";
  }

  // VIDEO
  const videoFile = findFile(files, "conferenceVideo", "videoFile", "video");
  if (videoFile) {
    const oldUrl = existing?.video;
    data.video = await uploadRequired(videoFile, "globalscion/conferences/videos", "video");
    if (oldUrl && oldUrl !== data.video) await safeDeleteCloudinary(oldUrl, "video");
  } else if (data.video === undefined) {
    data.video = existing?.video || "";
  } else if (data.video === null || data.video === "") {
    // FIX: user clicked "Remove" in the UI
    if (existing?.video) await safeDeleteCloudinary(existing.video, "video");
    data.video = "";
  } else if (typeof data.video === "string") {
    data.video = data.video.trim();
  }

  // SPEAKER images
  if (Array.isArray(data.speakers)) {
    data.speakers = await Promise.all(data.speakers.map(async (speaker, index) => {
      const item = speaker && typeof speaker === "object" ? { ...speaker } : {};
      const file = findFile(files,
        `speakerImage_${index}`, `speakerImages_${index}`, `speakerImages[${index}]`,
        `speakers[${index}][image]`, `speakers.${index}.image`);
      const oldUrl = existing?.speakers?.[index]?.image || "";
      if (file) {
        item.image = await uploadRequired(file, "globalscion/conferences/speakers", "image");
        if (oldUrl && oldUrl !== item.image) await safeDeleteCloudinary(oldUrl, "image");
      } else if (!item.image && oldUrl) {
        item.image = oldUrl;
      }
      return item;
    }));
  } else if (existing && data.speakers === undefined) {
    data.speakers = existing.speakers || [];
  }

  // COMMITTEE images
  if (Array.isArray(data.committee)) {
    data.committee = await Promise.all(data.committee.map(async (member, index) => {
      const item = member && typeof member === "object" ? { ...member } : {};
      const file = findFile(files,
        `committeeImage_${index}`, `committeeImages_${index}`, `committeeImages[${index}]`,
        `committee[${index}][image]`, `committee.${index}.image`);
      const oldUrl = existing?.committee?.[index]?.image || "";
      if (file) {
        item.image = await uploadRequired(file, "globalscion/conferences/committee", "image");
        if (oldUrl && oldUrl !== item.image) await safeDeleteCloudinary(oldUrl, "image");
      } else if (!item.image && oldUrl) {
        item.image = oldUrl;
      }
      return item;
    }));
  } else if (existing && data.committee === undefined) {
    data.committee = existing.committee || [];
  }

  // SPONSORS
  const sponsorFiles = files.filter((file) => /^sponsorImage_\d+$/.test(file.fieldname));
  if (Array.isArray(data.sponsors)) data.sponsors = [...data.sponsors];
  else data.sponsors = existing?.sponsors ? [...existing.sponsors] : [];
  for (const file of sponsorFiles) {
    const index = Number(file.fieldname.replace("sponsorImage_", ""));
    const oldUrl = data.sponsors[index] || existing?.sponsors?.[index] || "";
    const url = await uploadRequired(file, "globalscion/conferences/sponsors", "image");
    data.sponsors[index] = url;
    if (oldUrl && oldUrl !== url) await safeDeleteCloudinary(oldUrl, "image");
  }
  data.sponsors = data.sponsors.filter((value) => typeof value === "string" && value.trim());

  return data;
};

exports.createConference = async (req, res) => {
  try {
    let data = parseConferenceData(req);
    if (!String(data.title || "").trim()) {
      return res.status(400).json({ success: false, message: "Conference title is required" });
    }
    if (!String(data.category || "").trim()) {
      return res.status(400).json({ success: false, message: "Conference category is required" });
    }

    data = await uploadConferenceMedia({ req, data, existing: null });
    const conference = await Conference.create({
      ...data,
      title: String(data.title).trim(),
      category: String(data.category).trim(),
      createdBy: req.user?._id || null,
    });

    return res.status(201).json({ success: true, message: "Conference created successfully", data: conference });
  } catch (error) {
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
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid conference ID" });
    }
    const existing = await Conference.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: "Conference not found" });

    let data = parseConferenceData(req);
    data = await uploadConferenceMedia({ req, data, existing });
    data.updatedBy = req.user?._id || null;

    const updatedConference = await Conference.findByIdAndUpdate(id, { $set: data }, {
      new: true,
      runValidators: true,
      context: "query",
    });
    return res.status(200).json({ success: true, message: "Conference updated successfully", data: updatedConference });
  } catch (error) {
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

    await Promise.all([
      safeDeleteCloudinary(conference.image, "image"),
      safeDeleteCloudinary(conference.aboutImage, "image"),
      safeDeleteCloudinary(conference.video, "video"),
      safeDeleteCloudinary(conference.otherData?.marketAnalysis?.image, "image"),
      ...(conference.speakers || []).map((speaker) => safeDeleteCloudinary(speaker.image, "image")),
      ...(conference.committee || []).map((member) => safeDeleteCloudinary(member.image, "image")),
      ...(conference.sponsors || []).map((url) => safeDeleteCloudinary(url, "image")),
    ]);

    await Conference.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Conference deleted successfully" });
  } catch (error) {
    console.error("Delete conference error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete conference" });
  }
};
