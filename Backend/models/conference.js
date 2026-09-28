const mongoose = require("mongoose");

const registrationTypeSchema = new mongoose.Schema(
    {
        registrationType: {
            type: String,
            required: true,
            trim: true,
        },

        earlyBirdFee: {
            type: Number,
            required: true,
            min: 0,
        },

        regularFee: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: "USD",
            trim: true,
        },
    },
    { _id: true }
);

const speakerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        designation: {
            type: String,
            trim: true,
        },

        organization: {
            type: String,
            trim: true,
        },

        country: {
            type: String,
            trim: true,
        },

        biography: {
            type: String,
            trim: true,
        },

        image: {
            url: {
                type: String,
                default: "",
            },

            publicId: {
                type: String,
                default: "",
            },
        },

        linkedin: {
            type: String,
            default: "",
            trim: true,
        },
    },
    { _id: true }
);

const organizingCommitteeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        role: {
            type: String,
            required: true,
            trim: true,
        },

        organization: {
            type: String,
            trim: true,
        },
    },
    { _id: true }
);

const conferenceProgramSchema = new mongoose.Schema(
    {
        sessionTitle: {
            type: String,
            required: true,
            trim: true,
        },

        sessionType: {
            type: String,
            enum: [
                "Keynote",
                "Workshop",
                "Panel Discussion",
                "Oral Presentation",
                "Poster Presentation",
                "Networking",
                "Break",
                "Other",
            ],
            default: "Keynote",
        },

        date: {
            type: Date,
        },

        roomHall: {
            type: String,
            trim: true,
        },

        startTime: {
            type: String,
            trim: true,
        },

        endTime: {
            type: String,
            trim: true,
        },

        speakerChair: {
            type: String,
            trim: true,
        },
    },
    { _id: true }
);

const mediaSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            default: "",
        },

        publicId: {
            type: String,
            default: "",
        },

        resourceType: {
            type: String,
            default: "image",
        },

        format: {
            type: String,
            default: "",
        },
    },
    { _id: false }
);

const venueInformationSchema = new mongoose.Schema(
    {
        venueName: {
            type: String,
            trim: true,
        },

        address: {
            type: String,
            trim: true,
        },

        city: {
            type: String,
            trim: true,
        },

        state: {
            type: String,
            trim: true,
        },

        country: {
            type: String,
            trim: true,
            default: "India",
        },

        googleMapsUrl: {
            type: String,
            trim: true,
        },
    },
    { _id: false }
);

const submissionSettingsSchema = new mongoose.Schema(
    {
        enableAbstractSubmission: {
            type: Boolean,
            default: true,
        },

        enableFullPaperSubmission: {
            type: Boolean,
            default: false,
        },

        allowOralPresentation: {
            type: Boolean,
            default: true,
        },

        allowPosterPresentation: {
            type: Boolean,
            default: false,
        },

        allowVirtualPresentation: {
            type: Boolean,
            default: false,
        },

        reviewType: {
            type: String,
            enum: [
                "Single Blind",
                "Double Blind",
                "Open Review",
            ],
            default: "Single Blind",
        },

        maximumAbstractWords: {
            type: Number,
            default: 300,
            min: 1,
        },
    },
    { _id: false }
);

const contactInformationSchema = new mongoose.Schema(
    {
        contactEmail: {
            type: String,
            trim: true,
            lowercase: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        whatsApp: {
            type: String,
            trim: true,
        },

        website: {
            type: String,
            trim: true,
        },
    },
    { _id: false }
);

const socialMediaSchema = new mongoose.Schema(
    {
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
        basicInformation: {
            conferenceName: {
                type: String,
                required: true,
                trim: true,
            },

            shortName: {
                type: String,
                required: true,
                trim: true,
            },

            category: {
                type: String,
                required: true,
                trim: true,
            },

            conferenceType: {
                type: String,
                enum: ["Physical", "Virtual", "Hybrid"],
                default: "Physical",
            },

            status: {
                type: String,
                enum: [
                    "Draft",
                    "Published",
                    "Completed",
                    "Cancelled",
                ],
                default: "Draft",
            },

            conferenceDescription: {
                type: String,
                trim: true,
            },
        },

        conferenceDates: {
            startDate: {
                type: Date,
                required: true,
            },

            endDate: {
                type: Date,
                required: true,
            },

            registrationStartDate: {
                type: Date,
            },

            registrationDeadline: {
                type: Date,
            },

            abstractSubmissionDeadline: {
                type: Date,
            },

            fullPaperSubmissionDeadline: {
                type: Date,
            },

            timeZone: {
                type: String,
                default: "Asia/Kolkata",
            },
        },

        venueInformation: venueInformationSchema,

        registrationTypes: {
            type: [registrationTypeSchema],
            default: [],
        },

        submissionSettings: submissionSettingsSchema,

        conferenceTopics: {
            type: [String],
            default: [],
        },

        speakers: {
            type: [speakerSchema],
            default: [],
        },

        organizingCommittee: {
            type: [organizingCommitteeSchema],
            default: [],
        },

        conferenceProgram: {
            type: [conferenceProgramSchema],
            default: [],
        },

        conferenceMedia: {
            conferenceLogo: {
                type: mediaSchema,
                default: () => ({}),
            },

            heroBanner: {
                type: mediaSchema,
                default: () => ({}),
            },

            conferenceBrochure: {
                type: mediaSchema,
                default: () => ({}),
            },
        },

        contactInformation: contactInformationSchema,

        socialMedia: socialMediaSchema,

        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Conference = mongoose.model(
    "Conference",
    conferenceSchema
);

module.exports = Conference;