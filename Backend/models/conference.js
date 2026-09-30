const mongoose = require("mongoose");

const registrationCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    earlyBirdPrice: {
      type: Number,
      default: 0,
    },
    earlyBirdDeadline: {
      type: Date,
      default: null,
    },
    regularPrice: {
      type: Number,
      default: 0,
    },
    onsitePrice: {
      type: Number,
      default: 0,
    },
    benefits: {
      type: [String],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const welcomeMessageSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "Welcome Message",
    },
    paragraphs: {
      type: [String],
      default: [],
    },
    signature: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const speakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    default: "",
    trim: true,
  },
  organization: {
    type: String,
    default: "",
    trim: true,
  },
  specialty: {
    type: String,
    default: "",
    trim: true,
  },
  country: {
    type: String,
    default: "",
    trim: true,
  },
  image: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
});

const committeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    default: "",
    trim: true,
  },
  organization: {
    type: String,
    default: "",
    trim: true,
  },
  image: {
    type: String,
    default: "",
  },
});

const highlightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const whyAttendSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const benefitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const delegateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    time: {
      type: String,
      default: "",
    },
    session: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const agendaSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      default: "",
    },
    schedule: {
      type: [sessionSchema],
      default: [],
    },
  },
  { _id: false }
);

const ePosterSchema = new mongoose.Schema(
  {
    benefits: {
      type: [String],
      default: [],
    },

    guidelinesIntro: {
      type: String,
      default: "",
    },

    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    posterContent: {
      type: [String],
      default: [],
    },

    designRequirements: {
      type: [String],
      default: [],
    },

    submissionGuidelines: {
      type: [String],
      default: [],
    },

    reviewAndAcceptance: {
      type: [String],
      default: [],
    },

    presentation: {
      type: [String],
      default: [],
    },

    certificate: {
      type: [String],
      default: [],
    },

    closingNotes: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const marketAnalysisSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "",
    },
    paragraphs: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const otherDataSchema = new mongoose.Schema(
  {
    whyToAttend: {
      type: [whyAttendSchema],
      default: [],
    },

    sampleAgenda: {
      type: [agendaSchema],
      default: [],
    },

    benefitsOfAttending: {
      type: [benefitSchema],
      default: [],
    },

    delegates: {
      type: [delegateSchema],
      default: [],
    },

    posterPresentersLive: {
      type: [String],
      default: [],
    },

    ePosterPresenters: {
      type: ePosterSchema,
      default: () => ({}),
    },

    marketAnalysis: {
      type: marketAnalysisSchema,
      default: () => ({}),
    },
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    abstractSubmission: {
      type: Boolean,
      default: true,
    },

    paperSubmission: {
      type: Boolean,
      default: false,
    },

    oralPresentation: {
      type: Boolean,
      default: true,
    },

    posterPresentation: {
      type: Boolean,
      default: true,
    },

    virtualPresentation: {
      type: Boolean,
      default: false,
    },

    reviewType: {
      type: String,
      default: "Single Blind",
      trim: true,
    },

    maxAbstractWords: {
      type: Number,
      default: 300,
    },
  },
  { _id: false }
);

const venueSchema = new mongoose.Schema(
  {
    venueName: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    mapUrl: {
      type: String,
      default: "",
    },

    onlineLink: {
      type: String,
      default: "",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
  },
  { _id: false }
);

const registrationDatesSchema = new mongoose.Schema(
  {
    registrationStartDate: {
      type: Date,
      default: null,
    },

    registrationDeadline: {
      type: Date,
      default: null,
    },

    abstractDeadline: {
      type: Date,
      default: null,
    },

    paperDeadline: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    whatsapp: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    instagram: {
      type: String,
      default: "",
      trim: true,
    },

    facebook: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const conferenceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    aboutImage: {
      type: String,
      default: "",
    },

    date: {
      type: String,
      default: "",
    },

    time: {
      type: String,
      default: "Webinar",
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    location: {
      type: String,
      default: "",
    },

    mode: {
      type: String,
      enum: ["Webinar", "Physical", "Hybrid", "Online"],
      default: "Webinar",
    },

    participants: {
      type: String,
      default: "Global",
    },

    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },

    venue: {
      type: venueSchema,
      default: () => ({}),
    },

    registrationDates: {
      type: registrationDatesSchema,
      default: () => ({}),
    },

    registrationCategories: {
      type: [registrationCategorySchema],
      default: [],
    },

    /* =========================================
       WELCOME MESSAGE
    ========================================= */

    welcomeMessage: {
      type: welcomeMessageSchema,
      default: () => ({
        heading: "Welcome Message",
        paragraphs: [],
        signature: "",
      }),
    },

    /* =========================================
       SPEAKERS
    ========================================= */

    speakers: {
      type: [speakerSchema],
      default: [],
    },

    /* =========================================
       COMMITTEE
    ========================================= */

    committee: {
      type: [committeeSchema],
      default: [],
    },

    /* =========================================
       WHO SHOULD ATTEND
    ========================================= */

    whoShouldAttend: {
      type: [String],
      default: [],
    },

    whoShouldAttendDescription: {
      type: String,
      default: "",
    },

    /* =========================================
       KEY HIGHLIGHTS
    ========================================= */

    keyHighlights: {
      type: [highlightSchema],
      default: [],
    },

    /* =========================================
       TOPICS
    ========================================= */

    topics: {
      type: [topicSchema],
      default: [],
    },

    /* =========================================
       TRACKS
    ========================================= */

    tracks: {
      type: [trackSchema],
      default: [],
    },

    /* =========================================
       OTHER DATA
    ========================================= */

    otherData: {
      type: otherDataSchema,
      default: () => ({}),
    },

    /* =========================================
       SUBMISSION
    ========================================= */

    submission: {
      type: submissionSchema,
      default: () => ({}),
    },

    /* =========================================
       CONTACT
    ========================================= */

    contact: {
      type: contactSchema,
      default: () => ({}),
    },

    /* =========================================
       SPONSORS
    ========================================= */

    sponsors: {
      type: [String],
      default: [],
    },

    /* =========================================
       ADMIN INFO
    ========================================= */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* =========================================
   INDEXES
========================================= */

conferenceSchema.index({ title: "text", description: "text" });
conferenceSchema.index({ category: 1 });
conferenceSchema.index({ status: 1 });
conferenceSchema.index({ startDate: 1 });

module.exports = mongoose.model("Conference", conferenceSchema);