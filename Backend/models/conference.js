const mongoose = require("mongoose");

/* ---------- helpers ---------- */
const titleDesc = () =>
  new mongoose.Schema(
    {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    },
    { _id: false }
  );

/* Legacy registration schema (kept so old data does not break) */
const registrationCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, default: 0 },
    currency: { type: String, default: "USD", trim: true },
    description: { type: String, default: "", trim: true },
    earlyBirdPrice: { type: Number, default: 0 },
    earlyBirdDeadline: { type: Date, default: null },
    regularPrice: { type: Number, default: 0 },
    onsitePrice: { type: Number, default: 0 },
    benefits: { type: [String], default: [] },
    active: { type: Boolean, default: true },
  },
  { _id: false }
);

/* NEW: matches the frontend `registration` payload
   [{ category, prices: { GBP: {...}, USD: {...}, EUR: {...} } }] */
const priceItemSchema = new mongoose.Schema(
  {
    speakerRegistration: { type: Number, default: 0 },
    delegateRegistration: { type: Number, default: 0 },
    posterRegistration: { type: Number, default: 0 },
    packageA: { type: Number, default: 0 },
    packageB: { type: Number, default: 0 },
  },
  { _id: false }
);

const registrationPricingSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    prices: {
      GBP: { type: priceItemSchema, default: () => ({}) },
      USD: { type: priceItemSchema, default: () => ({}) },
      EUR: { type: priceItemSchema, default: () => ({}) },
    },
  },
  { _id: false }
);

const welcomeMessageSchema = new mongoose.Schema(
  {
    heading: { type: String, default: "Welcome Message" },
    paragraphs: { type: [String], default: [] },
    signature: { type: String, default: "" },
  },
  { _id: false }
);

const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, default: "", trim: true },
  organization: { type: String, default: "", trim: true },
  specialty: { type: String, default: "", trim: true },
  country: { type: String, default: "", trim: true },
  image: { type: String, default: "" },
  bio: { type: String, default: "" },
});

const committeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, default: "", trim: true },
  organization: { type: String, default: "", trim: true },
  image: { type: String, default: "" },
});

const highlightSchema = titleDesc();
const trackSchema = titleDesc();
const whyAttendSchema = titleDesc();
const benefitSchema = titleDesc();
const delegateSchema = titleDesc();

const sessionSchema = new mongoose.Schema(
  {
    time: { type: String, default: "" },
    session: { type: String, default: "" },
  },
  { _id: false }
);

const agendaSchema = new mongoose.Schema(
  {
    day: { type: String, default: "" },
    schedule: { type: [sessionSchema], default: [] },
  },
  { _id: false }
);

const ePosterSchema = new mongoose.Schema(
  {
    benefits: { type: [String], default: [] },
    guidelinesIntro: { type: String, default: "" },
    specifications: { type: Map, of: String, default: {} },
    posterContent: { type: [String], default: [] },
    designRequirements: { type: [String], default: [] },
    submissionGuidelines: { type: [String], default: [] },
    reviewAndAcceptance: { type: [String], default: [] },
    presentation: { type: [String], default: [] },
    certificate: { type: [String], default: [] },
    closingNotes: { type: [String], default: [] },
  },
  { _id: false }
);

const marketAnalysisSchema = new mongoose.Schema(
  {
    heading: { type: String, default: "" },
    paragraphs: { type: [String], default: [] },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const otherDataSchema = new mongoose.Schema(
  {
    whyToAttend: { type: [whyAttendSchema], default: [] },
    sampleAgenda: { type: [agendaSchema], default: [] },
    benefitsOfAttending: { type: [benefitSchema], default: [] },
    delegates: { type: [delegateSchema], default: [] },
    posterPresentersLive: { type: [String], default: [] },
    ePosterPresenters: { type: ePosterSchema, default: () => ({}) },
    marketAnalysis: { type: marketAnalysisSchema, default: () => ({}) },
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    abstractSubmission: { type: Boolean, default: true },
    paperSubmission: { type: Boolean, default: false },
    oralPresentation: { type: Boolean, default: true },
    posterPresentation: { type: Boolean, default: true },
    virtualPresentation: { type: Boolean, default: false },
    reviewType: { type: String, default: "Single Blind", trim: true },
    maxAbstractWords: { type: Number, default: 300 },
  },
  { _id: false }
);

const venueSchema = new mongoose.Schema(
  {
    venueName: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    mapUrl: { type: String, default: "" },
    onlineLink: { type: String, default: "" },
    timezone: { type: String, default: "Asia/Kolkata" },
  },
  { _id: false }
);

const registrationDatesSchema = new mongoose.Schema(
  {
    registrationStartDate: { type: Date, default: null },
    registrationDeadline: { type: Date, default: null },
    abstractDeadline: { type: Date, default: null },
    paperDeadline: { type: Date, default: null },
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    email: { type: String, default: "", trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    whatsapp: { type: String, default: "", trim: true },
    website: { type: String, default: "", trim: true },
    linkedin: { type: String, default: "", trim: true },
    instagram: { type: String, default: "", trim: true },
    facebook: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const recentPostSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    url: { type: String, default: "", trim: true },
    date: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const conferenceSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "", trim: true },
    description: { type: String, default: "" },

    // URL of the uploaded conference video
    video: { type: String, default: "", trim: true },
    image: { type: String, default: "" },
    aboutImage: { type: String, default: "" },

    date: { type: String, default: "" },
    time: { type: String, default: "Webinar" },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    location: { type: String, default: "" },

    mode: {
      type: String,
      enum: ["Webinar", "Physical", "Hybrid", "Online"],
      default: "Webinar",
    },
    participants: { type: String, default: "Global" },

    // FIX: frontend dropdown has "Closed"
    status: {
      type: String,
      enum: ["Draft", "Published", "Closed", "Archived"],
      default: "Draft",
    },

    venue: { type: venueSchema, default: () => ({}) },
    registrationDates: { type: registrationDatesSchema, default: () => ({}) },

    // FIX: frontend sends `registration`
    registration: { type: [registrationPricingSchema], default: [] },
    // legacy
    registrationCategories: { type: [registrationCategorySchema], default: [] },

    welcomeMessage: {
      type: welcomeMessageSchema,
      default: () => ({ heading: "Welcome Message", paragraphs: [], signature: "" }),
    },

    speakers: { type: [speakerSchema], default: [] },
    committee: { type: [committeeSchema], default: [] },

    whoShouldAttend: { type: [String], default: [] },
    whoShouldAttendDescription: { type: String, default: "" },

    keyHighlights: { type: [highlightSchema], default: [] },
    keyPoints: { type: [String], default: [] },
    recentPosts: { type: [recentPostSchema], default: [] },

    // FIX: topics are plain strings (frontend sends string[])
    topics: { type: [String], default: [] },

    tracks: { type: [trackSchema], default: [] },

    otherData: { type: otherDataSchema, default: () => ({}) },
    submission: { type: submissionSchema, default: () => ({}) },
    contact: { type: contactSchema, default: () => ({}) },

    sponsors: { type: [String], default: [] },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true, versionKey: false }
);

conferenceSchema.index({ title: "text", description: "text" });
conferenceSchema.index({ category: 1 });
conferenceSchema.index({ status: 1 });
conferenceSchema.index({ startDate: 1 });

module.exports = mongoose.model("Conference", conferenceSchema);
