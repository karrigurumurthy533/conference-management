const { body } = require("express-validator");

const createConferenceValidation = [
    body("basicInformation")
        .notEmpty()
        .withMessage("Basic information is required")
        .isObject()
        .withMessage("Basic information must be an object"),

    body("basicInformation.conferenceName")
        .trim()
        .notEmpty()
        .withMessage("Conference name is required"),

    body("basicInformation.shortName")
        .trim()
        .notEmpty()
        .withMessage("Conference short name is required"),

    body("basicInformation.category")
        .trim()
        .notEmpty()
        .withMessage("Conference category is required"),

    body("basicInformation.conferenceType")
        .optional()
        .isIn([
            "Physical",
            "Virtual",
            "Hybrid",
        ])
        .withMessage(
            "Conference type must be Physical, Virtual or Hybrid"
        ),

    body("basicInformation.status")
        .optional()
        .isIn([
            "Draft",
            "Published",
            "Completed",
            "Cancelled",
        ])
        .withMessage(
            "Invalid conference status"
        ),

    body("basicInformation.conferenceDescription")
        .optional()
        .trim(),

    body("conferenceDates")
        .notEmpty()
        .withMessage("Conference dates are required")
        .isObject()
        .withMessage("Conference dates must be an object"),

    body("conferenceDates.startDate")
        .notEmpty()
        .withMessage("Conference start date is required")
        .isISO8601()
        .withMessage("Invalid conference start date"),

    body("conferenceDates.endDate")
        .notEmpty()
        .withMessage("Conference end date is required")
        .isISO8601()
        .withMessage("Invalid conference end date"),

    body("conferenceDates.registrationStartDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid registration start date"),

    body("conferenceDates.registrationDeadline")
        .optional()
        .isISO8601()
        .withMessage("Invalid registration deadline"),

    body("conferenceDates.abstractSubmissionDeadline")
        .optional()
        .isISO8601()
        .withMessage(
            "Invalid abstract submission deadline"
        ),

    body("conferenceDates.fullPaperSubmissionDeadline")
        .optional()
        .isISO8601()
        .withMessage(
            "Invalid full paper submission deadline"
        ),

    body("conferenceDates.timeZone")
        .optional()
        .trim(),

    body("venueInformation")
        .optional()
        .isObject()
        .withMessage(
            "Venue information must be an object"
        ),

    body("registrationTypes")
        .optional()
        .isArray()
        .withMessage(
            "Registration types must be an array"
        ),

    body("submissionSettings")
        .optional()
        .isObject()
        .withMessage(
            "Submission settings must be an object"
        ),

    body("conferenceTopics")
        .optional()
        .isArray()
        .withMessage(
            "Conference topics must be an array"
        ),

    body("speakers")
        .optional()
        .isArray()
        .withMessage(
            "Speakers must be an array"
        ),

    body("organizingCommittee")
        .optional()
        .isArray()
        .withMessage(
            "Organizing committee must be an array"
        ),

    body("conferenceProgram")
        .optional()
        .isArray()
        .withMessage(
            "Conference program must be an array"
        ),

    body("conferenceMedia")
        .optional()
        .isObject()
        .withMessage(
            "Conference media must be an object"
        ),

    body("contactInformation")
        .optional()
        .isObject()
        .withMessage(
            "Contact information must be an object"
        ),

    body("socialMedia")
        .optional()
        .isObject()
        .withMessage(
            "Social media must be an object"
        ),

    body("slug")
        .optional()
        .trim()
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage(
            "Slug must contain only lowercase letters, numbers and hyphens"
        ),
];

module.exports = {
    createConferenceValidation,
};