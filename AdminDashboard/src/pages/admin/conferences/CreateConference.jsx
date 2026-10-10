import { useState, useEffect } from "react";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  Globe2,
  Image as ImageIcon,
  Info,
  Link2,
  Plus,
  Save,
  Trash2,
  Users,
  BookOpen,
  Mic2,
  Layers,
  DollarSign,
  ListChecks,
  Presentation,
  BarChart3,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import ImageUploader from "../../../components/admin/ImageUploader";
import MultiImageUploader from "../../../components/admin/MultiImageUploader";

import {
  getConferenceById,
  updateConference,
  createConference,
} from "../../../redux/conferenceSlice";

/* =========================================================
   REGISTRATION HELPERS
========================================================= */

const emptyRegistrationItem = () => ({
  speakerRegistration: "",
  delegateRegistration: "",
  posterRegistration: "",
  packageA: "",
  packageB: "",
});

const defaultRegistrationCategory = (name) => ({
  category: name,
  prices: {
    GBP: emptyRegistrationItem(),
    USD: emptyRegistrationItem(),
    EUR: emptyRegistrationItem(),
  },
});

/* =========================================================
   COMPONENT
========================================================= */

const CreateConference = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();

  /*
    id exists  -> UPDATE MODE
    id missing -> CREATE MODE
  */
  const isEditMode = Boolean(id);

  /* =========================================================
     REDUX STATE
  ========================================================= */

  const { loading: conferenceLoading, error: conferenceError } = useSelector(
    (state) => state.conference,
  );

  /* =========================================================
     LOCAL STATE
  ========================================================= */

  const [activeSection, setActiveSection] = useState("basic");
  const [saving, setSaving] = useState(false);

  /* =========================================================
     BASIC DATA
  ========================================================= */

  const [formData, setFormData] = useState({
    id: "",

    category: "",
    title: "",
    subtitle: "",
    description: "",

    image: null,
    aboutImage: null,

    date: "",
    time: "Webinar",

    startDate: "",
    endDate: "",

    location: "",
    mode: "Webinar",
    participants: "Global",

    status: "Draft",

    venueName: "",
    address: "",
    city: "",
    state: "",
    country: "India",

    mapUrl: "",
    onlineLink: "",

    timezone: "Asia/Kolkata",

    registrationStartDate: "",
    registrationDeadline: "",
    abstractDeadline: "",
    paperDeadline: "",

    contactEmail: "",
    phone: "",
    whatsapp: "",

    website: "",
    linkedin: "",
    instagram: "",
    facebook: "",

    welcomeHeading: "Welcome Message",
    welcomeParagraphs: [""],
    welcomeSignature: "",

    whoShouldAttendDescription: "",

    marketHeading: "",
    marketParagraphs: [""],
    marketImage: null,

    submission: {
      abstractSubmission: true,
      paperSubmission: false,
      oralPresentation: true,
      posterPresentation: true,
      virtualPresentation: false,
      reviewType: "Single Blind",
      maxAbstractWords: 300,
    },
  });

  /* =========================================================
     REGISTRATION
  ========================================================= */

  const [registrationCategories, setRegistrationCategories] = useState([
    defaultRegistrationCategory("Academic"),
    defaultRegistrationCategory("Business"),
    defaultRegistrationCategory("Others"),
    defaultRegistrationCategory("Student"),
  ]);

  /* =========================================================
     ARRAYS
  ========================================================= */

  const [speakers, setSpeakers] = useState([]);
  const [committee, setCommittee] = useState([]);

  const [topics, setTopics] = useState([]);
  const [tracks, setTracks] = useState([]);

  const [keyHighlights, setKeyHighlights] = useState([]);

  const [whoShouldAttend, setWhoShouldAttend] = useState([]);

  const [whyToAttend, setWhyToAttend] = useState([]);

  const [benefitsOfAttending, setBenefitsOfAttending] = useState([]);

  const [delegates, setDelegates] = useState([]);

  const [posterPresentersLive, setPosterPresentersLive] = useState([]);

  const [sessions, setSessions] = useState([]);

  const [sponsors, setSponsors] = useState([]);

  /* =========================================================
     E-POSTER
  ========================================================= */

  const [ePoster, setEPoster] = useState({
    benefits: [],

    guidelinesIntro: "",

    specifications: {
      Format: "PDF or PowerPoint (PPT/PPTX)",
      Orientation: "Portrait",
      "Recommended Size": "A0 (841 mm × 1189 mm)",
      Language: "English",
      "Maximum File Size": "20 MB",
    },

    posterContent: [],
    designRequirements: [],
    submissionGuidelines: [],
    reviewAndAcceptance: [],
    presentation: [],
    certificate: [],
    closingNotes: [],
  });

  /* =========================================================
     SECTIONS
  ========================================================= */

  const sections = [
    {
      id: "basic",
      label: "Basic Information",
      icon: Info,
    },
    {
      id: "dates",
      label: "Dates & Venue",
      icon: CalendarDays,
    },
    {
      id: "registration",
      label: "Registration & Pricing",
      icon: DollarSign,
    },
    {
      id: "welcome",
      label: "Welcome Message",
      icon: BookOpen,
    },
    {
      id: "speakers",
      label: "Speakers & Committee",
      icon: Mic2,
    },
    {
      id: "content",
      label: "Topics & Tracks",
      icon: Layers,
    },
    {
      id: "highlights",
      label: "Highlights",
      icon: ListChecks,
    },
    {
      id: "agenda",
      label: "Agenda",
      icon: CalendarDays,
    },
    {
      id: "attendees",
      label: "Who Should Attend",
      icon: Users,
    },
    {
      id: "benefits",
      label: "Benefits",
      icon: Check,
    },
    {
      id: "poster",
      label: "Poster / E-Poster",
      icon: Presentation,
    },
    {
      id: "market",
      label: "Market Analysis",
      icon: BarChart3,
    },
    {
      id: "media",
      label: "Media & Sponsors",
      icon: ImageIcon,
    },
    {
      id: "contact",
      label: "Contact & Social",
      icon: Globe2,
    },
  ];

  const currentIndex = sections.findIndex((item) => item.id === activeSection);

  /* =========================================================
     CLASSES
  ========================================================= */

  const inputClass =
    "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10";

  const textareaClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10";

  const cardClass =
    "rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.035)]";

  const buttonClass =
    "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-[12px] font-semibold transition";

  /* =========================================================
     LOAD EXISTING CONFERENCE
  ========================================================= */

  useEffect(() => {
    /*
      CREATE MODE

      If there is no ID, do NOT call getConferenceById().
    */

    if (!id) {
      setFormData((prev) => ({
        ...prev,
        id: "",
      }));

      setActiveSection("basic");

      return;
    }

    /*
      UPDATE MODE

      Existing conference is loaded by ID.
    */

    const loadConference = async () => {
      try {
        const result = await dispatch(getConferenceById(id)).unwrap();

        const conference = result?.conference || result?.data || result;

        if (!conference) {
          throw new Error("Conference data not found");
        }

        console.log("EDIT CONFERENCE DATA:", conference);

        const venue = conference.venue || {};

        const registrationDates = conference.registrationDates || {};

        const welcomeMessage = conference.welcomeMessage || {};

        const contact = conference.contact || {};

        const otherData = conference.otherData || {};

        const marketAnalysis = otherData.marketAnalysis || {};

        /* ---------------------------------------------
           BASIC DATA
        --------------------------------------------- */

        setFormData((prev) => ({
          ...prev,

          id: conference.id || conference._id || id,

          category: conference.category || "",

          title: conference.title || "",

          subtitle: conference.subtitle || "",

          description: conference.description || "",

          image: conference.image || null,

          aboutImage: conference.aboutImage || null,

          date: conference.date || "",

          time: conference.time || "Webinar",

          startDate: conference.startDate
            ? new Date(conference.startDate).toISOString().slice(0, 10)
            : "",

          endDate: conference.endDate
            ? new Date(conference.endDate).toISOString().slice(0, 10)
            : "",

          location: conference.location || "",

          mode: conference.mode || "Webinar",

          participants: conference.participants || "Global",

          status: conference.status || "Draft",

          /* ---------------------------------------------
             VENUE
          --------------------------------------------- */

          venueName: venue.venueName || "",

          address: venue.address || "",

          city: venue.city || "",

          state: venue.state || "",

          country: venue.country || "India",

          mapUrl: venue.mapUrl || "",

          onlineLink: venue.onlineLink || "",

          timezone: venue.timezone || "Asia/Kolkata",

          /* ---------------------------------------------
             REGISTRATION DATES
          --------------------------------------------- */

          registrationStartDate: registrationDates.registrationStartDate
            ? new Date(registrationDates.registrationStartDate)
                .toISOString()
                .slice(0, 10)
            : "",

          registrationDeadline: registrationDates.registrationDeadline
            ? new Date(registrationDates.registrationDeadline)
                .toISOString()
                .slice(0, 10)
            : "",

          abstractDeadline: registrationDates.abstractDeadline
            ? new Date(registrationDates.abstractDeadline)
                .toISOString()
                .slice(0, 10)
            : "",

          paperDeadline: registrationDates.paperDeadline
            ? new Date(registrationDates.paperDeadline)
                .toISOString()
                .slice(0, 10)
            : "",

          /* ---------------------------------------------
             CONTACT
          --------------------------------------------- */

          contactEmail: contact.email || "",

          phone: contact.phone || "",

          whatsapp: contact.whatsapp || "",

          website: contact.website || "",

          linkedin: contact.linkedin || "",

          instagram: contact.instagram || "",

          facebook: contact.facebook || "",

          /* ---------------------------------------------
             WELCOME
          --------------------------------------------- */

          welcomeHeading: welcomeMessage.heading || "Welcome Message",

          welcomeParagraphs: welcomeMessage.paragraphs?.length
            ? welcomeMessage.paragraphs
            : [""],

          welcomeSignature: welcomeMessage.signature || "",

          /* ---------------------------------------------
             ATTENDEES
          --------------------------------------------- */

          whoShouldAttendDescription:
            conference.whoShouldAttendDescription || "",

          /* ---------------------------------------------
             MARKET
          --------------------------------------------- */

          marketHeading: marketAnalysis.heading || "",

          marketParagraphs: marketAnalysis.paragraphs?.length
            ? marketAnalysis.paragraphs
            : [""],

          marketImage: marketAnalysis.image || null,

          /* ---------------------------------------------
             SUBMISSION
          --------------------------------------------- */

          submission: {
            ...prev.submission,
            ...(conference.submission || {}),
          },
        }));

        /* ---------------------------------------------
           REGISTRATION
        --------------------------------------------- */

        setRegistrationCategories(
          conference.registration?.length
            ? conference.registration
            : [
                defaultRegistrationCategory("Academic"),
                defaultRegistrationCategory("Business"),
                defaultRegistrationCategory("Others"),
                defaultRegistrationCategory("Student"),
              ],
        );

        /* ---------------------------------------------
           SPEAKERS
        --------------------------------------------- */

        setSpeakers(
          (conference.speakers || []).map((speaker) => ({
            ...speaker,

            id: speaker.id || speaker._id || crypto.randomUUID(),

            image: speaker.image || null,
          })),
        );

        /* ---------------------------------------------
           COMMITTEE
        --------------------------------------------- */

        setCommittee(
          (conference.committee || []).map((member) => ({
            ...member,

            id: member.id || member._id || crypto.randomUUID(),

            image: member.image || null,
          })),
        );

        /* ---------------------------------------------
           CONTENT
        --------------------------------------------- */

        setTopics(conference.topics || []);

        setTracks(conference.tracks || []);

        setKeyHighlights(conference.keyHighlights || []);

        setWhoShouldAttend(conference.whoShouldAttend || []);

        /* ---------------------------------------------
           OTHER DATA
        --------------------------------------------- */

        setWhyToAttend(otherData.whyToAttend || []);

        setBenefitsOfAttending(otherData.benefitsOfAttending || []);

        setDelegates(otherData.delegates || []);

        setPosterPresentersLive(otherData.posterPresentersLive || []);

        setSessions(otherData.sampleAgenda || []);

        /* ---------------------------------------------
           E-POSTER
        --------------------------------------------- */

        setEPoster(
          otherData.ePosterPresenters || {
            benefits: [],

            guidelinesIntro: "",

            specifications: {
              Format: "PDF or PowerPoint (PPT/PPTX)",

              Orientation: "Portrait",

              "Recommended Size": "A0 (841 mm × 1189 mm)",

              Language: "English",

              "Maximum File Size": "20 MB",
            },

            posterContent: [],
            designRequirements: [],
            submissionGuidelines: [],
            reviewAndAcceptance: [],
            presentation: [],
            certificate: [],
            closingNotes: [],
          },
        );

        /* ---------------------------------------------
           SPONSORS
        --------------------------------------------- */

        setSponsors(conference.sponsors || []);
      } catch (error) {
        console.error("GET CONFERENCE BY ID ERROR:", error);

        toast.error(
          typeof error === "string"
            ? error
            : error?.message || "Unable to load conference data",
        );
      }
    };

    loadConference();
  }, [id, dispatch]);

  /* =========================================================
     CHANGE HANDLERS
  ========================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmissionChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,

      submission: {
        ...prev.submission,

        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  /* =========================================================
     ARRAY HELPERS
  ========================================================= */

  const addArrayItem = (setter, value) => {
    setter((prev) => [...prev, value]);
  };

  const removeArrayItem = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const updateArrayItem = (setter, index, value) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  /* =========================================================
     SPEAKERS
  ========================================================= */

  const addSpeaker = () => {
    addArrayItem(setSpeakers, {
      id: crypto.randomUUID(),

      name: "",
      role: "",
      organization: "",
      specialty: "",
      country: "",

      image: null,

      bio: "",
    });
  };

  /* =========================================================
     COMMITTEE
  ========================================================= */

  const addCommittee = () => {
    addArrayItem(setCommittee, {
      id: crypto.randomUUID(),

      name: "",
      role: "",
      organization: "",

      image: null,
    });
  };

  /* =========================================================
     TOPIC
  ========================================================= */

  const addTopic = () => {
    addArrayItem(setTopics, "");
  };

  /* =========================================================
     TRACK
  ========================================================= */

  const addTrack = () => {
    addArrayItem(setTracks, {
      title: "",
      description: "",
    });
  };

  /* =========================================================
     HIGHLIGHT
  ========================================================= */

  const addHighlight = () => {
    addArrayItem(setKeyHighlights, {
      title: "",
      description: "",
    });
  };

  /* =========================================================
     ATTENDEE
  ========================================================= */

  const addAttendee = () => {
    addArrayItem(setWhoShouldAttend, "");
  };

  /* =========================================================
     WHY ATTEND
  ========================================================= */

  const addWhyAttend = () => {
    addArrayItem(setWhyToAttend, {
      title: "",
      description: "",
    });
  };

  /* =========================================================
     BENEFITS
  ========================================================= */

  const addBenefit = () => {
    addArrayItem(setBenefitsOfAttending, {
      title: "",
      description: "",
    });
  };

  /* =========================================================
     DELEGATES
  ========================================================= */

  const addDelegate = () => {
    addArrayItem(setDelegates, {
      title: "",
      description: "",
    });
  };

  /* =========================================================
     POSTER
  ========================================================= */

  const addPosterPoint = (field) => {
    setEPoster((prev) => ({
      ...prev,

      [field]: [...prev[field], ""],
    }));
  };

  const updatePosterPoint = (field, index, value) => {
    setEPoster((prev) => ({
      ...prev,

      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const removePosterPoint = (field, index) => {
    setEPoster((prev) => ({
      ...prev,

      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  /* =========================================================
     AGENDA
  ========================================================= */

  const addSession = () => {
    addArrayItem(setSessions, {
      day: "",

      schedule: [
        {
          time: "",
          session: "",
        },
      ],
    });
  };

  const addSchedule = (dayIndex) => {
    setSessions((prev) =>
      prev.map((day, index) =>
        index === dayIndex
          ? {
              ...day,

              schedule: [
                ...day.schedule,

                {
                  time: "",
                  session: "",
                },
              ],
            }
          : day,
      ),
    );
  };

  const updateSchedule = (dayIndex, scheduleIndex, field, value) => {
    setSessions((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,

              schedule: day.schedule.map((item, j) =>
                j === scheduleIndex
                  ? {
                      ...item,

                      [field]: value,
                    }
                  : item,
              ),
            }
          : day,
      ),
    );
  };

  /* =========================================================
     REGISTRATION
  ========================================================= */

  const updateRegistrationPrice = (categoryIndex, currency, field, value) => {
    setRegistrationCategories((prev) =>
      prev.map((category, index) =>
        index === categoryIndex
          ? {
              ...category,

              prices: {
                ...category.prices,

                [currency]: {
                  ...category.prices[currency],

                  [field]: value,
                },
              },
            }
          : category,
      ),
    );
  };

  /* =========================================================
     BUILD CONFERENCE JSON
  ========================================================= */

  const buildConferenceData = () => {
    return {
      /*
          ID is handled separately.
          In CREATE mode it will be removed.
        */

      id: formData.id,

      category: formData.category,

      title: formData.title,

      subtitle: formData.subtitle,

      date: formData.date,

      time: formData.time,

      startDate: formData.startDate,

      endDate: formData.endDate,

      location: formData.location,

      mode: formData.mode,

      participants: formData.participants,

      description: formData.description,

      /* ---------------------------------------------
           VENUE
        --------------------------------------------- */

      venue: {
        venueName: formData.venueName,

        address: formData.address,

        city: formData.city,

        state: formData.state,

        country: formData.country,

        mapUrl: formData.mapUrl,

        onlineLink: formData.onlineLink,

        timezone: formData.timezone,
      },

      /* ---------------------------------------------
           REGISTRATION DATES
        --------------------------------------------- */

      registrationDates: {
        registrationStartDate: formData.registrationStartDate,

        registrationDeadline: formData.registrationDeadline,

        abstractDeadline: formData.abstractDeadline,

        paperDeadline: formData.paperDeadline,
      },

      /* ---------------------------------------------
           REGISTRATION
        --------------------------------------------- */

      registration: registrationCategories,

      /* ---------------------------------------------
           WELCOME
        --------------------------------------------- */

      welcomeMessage: {
        heading: formData.welcomeHeading,

        paragraphs: formData.welcomeParagraphs.filter(Boolean),

        signature: formData.welcomeSignature,
      },

      /* ---------------------------------------------
           SPEAKERS
        --------------------------------------------- */

      speakers: speakers.map(({ id, _id, ...speaker }) => ({
        ...speaker,

        image: speaker.image instanceof File ? null : speaker.image || null,
      })),

      /* ---------------------------------------------
           COMMITTEE
        --------------------------------------------- */

      committee: committee.map(({ id, _id, ...member }) => ({
        ...member,

        image: member.image instanceof File ? null : member.image || null,
      })),

      /* ---------------------------------------------
           ATTENDEES
        --------------------------------------------- */

      whoShouldAttend: whoShouldAttend.filter(Boolean),

      whoShouldAttendDescription: formData.whoShouldAttendDescription,

      /* ---------------------------------------------
           HIGHLIGHTS
        --------------------------------------------- */

      keyHighlights,

      /* ---------------------------------------------
           TOPICS
        --------------------------------------------- */

      topics: topics.filter(Boolean),

      /* ---------------------------------------------
           TRACKS
        --------------------------------------------- */

      tracks,

      /* ---------------------------------------------
           OTHER DATA
        --------------------------------------------- */

      otherData: {
        whyToAttend,

        sampleAgenda: sessions,

        benefitsOfAttending,

        delegates,

        posterPresentersLive: posterPresentersLive.filter(Boolean),

        ePosterPresenters: {
          ...ePoster,
        },

        marketAnalysis: {
          heading: formData.marketHeading,

          paragraphs: formData.marketParagraphs.filter(Boolean),

          /*
              Image is handled through
              multipart upload.
            */
          image: null,
        },
      },

      /* ---------------------------------------------
           SUBMISSION
        --------------------------------------------- */

      submission: formData.submission,

      /* ---------------------------------------------
           CONTACT
        --------------------------------------------- */

      contact: {
        email: formData.contactEmail,

        phone: formData.phone,

        whatsapp: formData.whatsapp,

        website: formData.website,

        linkedin: formData.linkedin,

        instagram: formData.instagram,

        facebook: formData.facebook,
      },

      /* ---------------------------------------------
           STATUS
        --------------------------------------------- */

      status: formData.status,
    };
  };

  /* =========================================================
     CREATE / UPDATE CONFERENCE
  ========================================================= */

  const saveConference = async (publish = false) => {
    /*
      Determine mode from URL ID.

      CREATE:
      /admin/conferences/create
      id = undefined

      UPDATE:
      /admin/conferences/:id/edit
      id = actual Mongo ID
    */

    const conferenceId = formData.id || id;

    const editMode = Boolean(conferenceId);

    try {
      setSaving(true);

      const conferenceData = buildConferenceData();

      /* ---------------------------------------------
         STATUS
      --------------------------------------------- */

      conferenceData.status = publish ? "Published" : "Draft";

      /* ---------------------------------------------
         ID

         UPDATE -> include ID
         CREATE -> remove ID
      --------------------------------------------- */

      if (editMode) {
        conferenceData.id = conferenceId;
      } else {
        delete conferenceData.id;
      }

      /* ---------------------------------------------
         FORM DATA
      --------------------------------------------- */

      const form = new FormData();

      form.append("conferenceData", JSON.stringify(conferenceData));

      /* ---------------------------------------------
         MAIN IMAGE
      --------------------------------------------- */

      if (formData.image instanceof File) {
        form.append("conferenceImage", formData.image);
      }

      /* ---------------------------------------------
         ABOUT IMAGE
      --------------------------------------------- */

      if (formData.aboutImage instanceof File) {
        form.append("aboutImage", formData.aboutImage);
      }

      /* ---------------------------------------------
         MARKET IMAGE
      --------------------------------------------- */

      if (formData.marketImage instanceof File) {
        form.append("marketImage", formData.marketImage);
      }

      /* ---------------------------------------------
         SPEAKER IMAGES
      --------------------------------------------- */

      speakers.forEach((speaker) => {
        if (speaker.image instanceof File) {
          form.append("speakerImages", speaker.image);
        }
      });

      /* ---------------------------------------------
         COMMITTEE IMAGES
      --------------------------------------------- */

      committee.forEach((member) => {
        if (member.image instanceof File) {
          form.append("committeeImages", member.image);
        }
      });

      /* ---------------------------------------------
         SPONSOR IMAGES
      --------------------------------------------- */

      sponsors.forEach((sponsor) => {
        if (sponsor.file instanceof File) {
          form.append("sponsorImages", sponsor.file);
        }
      });

      if (editMode) {
        const result = await dispatch(
          updateConference({
            id: conferenceId,

            formData: form,
          }),
        ).unwrap();

        toast.success(
          publish
            ? "Conference updated and published successfully!"
            : "Conference updated successfully!",
        );
      } else {
        await dispatch(createConference(form)).unwrap();

        toast.success(
          publish
            ? "Conference created and published successfully!"
            : "Conference created successfully!",
        );
      }

      navigate("/admin/conferences");
    } catch (error) {
      console.error(
        editMode ? "UPDATE CONFERENCE ERROR:" : "CREATE CONFERENCE ERROR:",
        error,
      );

      const message =
        typeof error === "string"
          ? error
          : error?.message ||
            conferenceError ||
            (editMode
              ? "Something went wrong while updating conference"
              : "Something went wrong while creating conference");
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     BASIC
  ========================================================= */

  const renderBasic = () => (
    <div className={cardClass}>
      <SectionHeader
        title="Basic Conference Information"
        description="This information will be used throughout the public conference website."
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="Category *">
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Autism Research"
            className={inputClass}
          />
        </Field>

        <Field label="Conference Title *" full>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="2nd International Conference on Autism Research and Innovations"
            className={inputClass}
          />
        </Field>

        <Field label="Subtitle" full>
          <input
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Next-Generation Autism Research..."
            className={inputClass}
          />
        </Field>

        <Field label="Description" full>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className={textareaClass}
          />
        </Field>

        <ImageUploader
          label="Conference Hero Image"
          value={formData.image}
          onChange={(file) =>
            setFormData((prev) => ({
              ...prev,
              image: file,
            }))
          }
        />

        <ImageUploader
          label="About Conference Image"
          value={formData.aboutImage}
          onChange={(file) =>
            setFormData((prev) => ({
              ...prev,
              aboutImage: file,
            }))
          }
        />

        <Field label="Conference Status">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="Draft">Draft</option>

            <option value="Published">Published</option>

            <option value="Closed">Closed</option>
          </select>
        </Field>

        <Field label="Conference Mode">
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="Webinar">Webinar</option>

            <option value="Physical">Physical</option>

            <option value="Hybrid">Hybrid</option>
          </select>
        </Field>

        <Field label="Participants">
          <select
            name="participants"
            value={formData.participants}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="Global">Global</option>

            <option value="National">National</option>

            <option value="Regional">Regional</option>
          </select>
        </Field>
      </div>
    </div>
  );

  /* =========================================================
     DATES
  ========================================================= */

  const renderDates = () => (
    <div className="space-y-3">
      <div className={cardClass}>
        <SectionHeader
          title="Conference Dates"
          description="Configure all conference and registration dates."
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Start Date *">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="End Date">
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="Display Date">
            <input
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="April 06-07, 2027"
              className={inputClass}
            />
          </Field>

          <Field label="Time">
            <input
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="Webinar"
              className={inputClass}
            />
          </Field>

          <Field label="Registration Start Date">
            <input
              type="date"
              name="registrationStartDate"
              value={formData.registrationStartDate}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="Registration Deadline">
            <input
              type="date"
              name="registrationDeadline"
              value={formData.registrationDeadline}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="Abstract Deadline">
            <input
              type="date"
              name="abstractDeadline"
              value={formData.abstractDeadline}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="Paper Deadline">
            <input
              type="date"
              name="paperDeadline"
              value={formData.paperDeadline}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <div className={cardClass}>
        <SectionHeader title="Venue Information" />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Venue Name">
            <input
              name="venueName"
              value={formData.venueName}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="Location">
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Webinar"
              className={inputClass}
            />
          </Field>

          <Field label="Address" full>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className={textareaClass}
            />
          </Field>

          <Field label="City">
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="State">
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="Country">
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="Timezone">
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Asia/Kolkata">Asia/Kolkata</option>

              <option value="UTC">UTC</option>

              <option value="Europe/London">Europe/London</option>

              <option value="America/New_York">America/New_York</option>
            </select>
          </Field>

          <Field label="Google Maps URL">
            <input
              name="mapUrl"
              value={formData.mapUrl}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="Online Link">
            <input
              name="onlineLink"
              value={formData.onlineLink}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
        </div>
      </div>
    </div>
  );

  /* =========================================================
     REGISTRATION
  ========================================================= */

  const registrationFields = [
    ["speakerRegistration", "Speaker Registration"],

    ["delegateRegistration", "Delegate Registration"],

    ["posterRegistration", "Poster Registration"],

    ["packageA", "Package A (Registration + 2 Nights Accommodation)"],

    ["packageB", "Package B (Registration + 3 Nights Accommodation)"],
  ];

  const renderRegistration = () => (
    <div className={cardClass}>
      <SectionHeader
        title="Registration & Currency Pricing"
        description="Each registration category can have separate GBP, USD and EUR prices."
      />

      <div className="mb-4 rounded-xl border border-violet-100 bg-violet-50/50 p-3">
        <div className="flex items-center gap-2">
          <DollarSign size={18} className="text-violet-600" />

          <div>
            <p className="text-[13px] font-bold text-slate-800">
              Currency Based Registration
            </p>

            <p className="text-[11px] text-slate-500">
              Public registration page can switch currency without changing
              conference data.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {registrationCategories.map((category, categoryIndex) => (
          <div
            key={category.category}
            className="overflow-hidden rounded-xl border border-slate-200"
          >
            <div className="flex items-center justify-between bg-slate-800 px-4 py-3">
              <h3 className="text-sm font-bold text-white">
                {category.category}
              </h3>

              <span className="text-[11px] text-slate-300">
                Registration Pricing
              </span>
            </div>

            {["GBP", "USD", "EUR"].map((currency) => (
              <div key={currency} className="border-t border-slate-200 p-3">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-bold text-violet-700">
                    {currency}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {registrationFields.map(([field, label]) => (
                    <Field key={field} label={label}>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={category.prices[currency][field]}
                          onChange={(e) =>
                            updateRegistrationPrice(
                              categoryIndex,
                              currency,
                              field,
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          className={`${inputClass} pr-12`}
                        />

                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                          {currency}
                        </span>
                      </div>
                    </Field>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  /* =========================================================
     WELCOME
  ========================================================= */

  const renderWelcome = () => (
    <div className={cardClass}>
      <SectionHeader
        title="Welcome Message"
        description="This content will appear on the conference details page."
      />

      <Field label="Heading">
        <input
          name="welcomeHeading"
          value={formData.welcomeHeading}
          onChange={handleChange}
          className={inputClass}
        />
      </Field>

      <div className="mt-4 space-y-3">
        {formData.welcomeParagraphs.map((paragraph, index) => (
          <div key={index}>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-[12px] font-semibold text-slate-700">
                Paragraph {index + 1}
              </label>

              {formData.welcomeParagraphs.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,

                      welcomeParagraphs: prev.welcomeParagraphs.filter(
                        (_, i) => i !== index,
                      ),
                    }))
                  }
                  className="text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <textarea
              value={paragraph}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,

                  welcomeParagraphs: prev.welcomeParagraphs.map((item, i) =>
                    i === index ? e.target.value : item,
                  ),
                }))
              }
              rows={5}
              className={textareaClass}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          setFormData((prev) => ({
            ...prev,

            welcomeParagraphs: [...prev.welcomeParagraphs, ""],
          }))
        }
        className={`${buttonClass} mt-3 bg-violet-600 text-white hover:bg-violet-700`}
      >
        <Plus size={15} />
        Add Paragraph
      </button>

      <div className="mt-4">
        <Field label="Signature">
          <input
            name="welcomeSignature"
            value={formData.welcomeSignature}
            onChange={handleChange}
            placeholder="Warm Regards, Grace | Autism Conference 2027"
            className={inputClass}
          />
        </Field>
      </div>
    </div>
  );

  /* =========================================================
     SPEAKERS
  ========================================================= */

  const renderSpeakers = () => (
    <div className="space-y-3">
      <div className={cardClass}>
        <HeaderButton
          title="Speakers"
          description="Add speakers exactly as required by the public conference page."
          buttonText="Add Speaker"
          onClick={addSpeaker}
        />

        <div className="space-y-3">
          {speakers.length === 0 && (
            <EmptyState icon={Users} text="No speakers added." />
          )}

          {speakers.map((speaker, index) => (
            <div
              key={speaker.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[13px] font-bold">Speaker {index + 1}</h3>

                <button
                  type="button"
                  onClick={() => removeArrayItem(setSpeakers, index)}
                  className="text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  ["name", "Name"],
                  ["role", "Role / Designation"],
                  ["organization", "Organization"],
                  ["specialty", "Specialty"],
                  ["country", "Country"],
                ].map(([field, label]) => (
                  <Field key={field} label={label}>
                    <input
                      value={speaker[field] || ""}
                      onChange={(e) =>
                        updateArrayItem(setSpeakers, index, {
                          ...speaker,

                          [field]: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </Field>
                ))}

                <ImageUploader
                  label="Speaker Image"
                  value={speaker.image}
                  onChange={(file) =>
                    updateArrayItem(setSpeakers, index, {
                      ...speaker,

                      image: file,
                    })
                  }
                />

                <Field label="Biography" full>
                  <textarea
                    value={speaker.bio || ""}
                    onChange={(e) =>
                      updateArrayItem(setSpeakers, index, {
                        ...speaker,

                        bio: e.target.value,
                      })
                    }
                    rows={4}
                    className={textareaClass}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <HeaderButton
          title="Organizing Committee"
          buttonText="Add Member"
          onClick={addCommittee}
        />

        <div className="space-y-3">
          {committee.map((member, index) => (
            <div
              key={member.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[13px] font-bold">
                  Committee Member {index + 1}
                </h3>

                <button
                  type="button"
                  onClick={() => removeArrayItem(setCommittee, index)}
                  className="text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  ["name", "Name"],
                  ["role", "Role"],
                  ["organization", "Organization"],
                ].map(([field, label]) => (
                  <Field key={field} label={label}>
                    <input
                      value={member[field] || ""}
                      onChange={(e) =>
                        updateArrayItem(setCommittee, index, {
                          ...member,

                          [field]: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </Field>
                ))}

                <ImageUploader
                  label="Committee Image"
                  value={member.image}
                  onChange={(file) =>
                    updateArrayItem(setCommittee, index, {
                      ...member,

                      image: file,
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* =========================================================
     CONTENT
  ========================================================= */

  const renderContent = () => (
    <div className="space-y-3">
      <div className={cardClass}>
        <HeaderButton
          title="Conference Topics"
          description="Add scientific topics."
          buttonText="Add Topic"
          onClick={addTopic}
        />

        <div className="space-y-2">
          {topics.map((topic, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={typeof topic === "string" ? topic : topic?.name || ""}
                onChange={(e) =>
                  updateArrayItem(setTopics, index, e.target.value)
                }
                className={inputClass}
                placeholder="Autism Research"
              />

              <button
                type="button"
                onClick={() => removeArrayItem(setTopics, index)}
                className="w-10 rounded-lg border border-red-200 text-red-500"
              >
                <Trash2 size={14} className="mx-auto" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <HeaderButton
          title="Scientific Tracks"
          description="Create expandable tracks for conference details."
          buttonText="Add Track"
          onClick={addTrack}
        />

        <div className="space-y-3">
          {tracks.map((track, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <div className="mb-2 flex justify-between">
                <span className="text-[12px] font-bold">Track {index + 1}</span>

                <button
                  type="button"
                  onClick={() => removeArrayItem(setTracks, index)}
                  className="text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <input
                value={track.title || ""}
                onChange={(e) =>
                  updateArrayItem(setTracks, index, {
                    ...track,

                    title: e.target.value,
                  })
                }
                placeholder="Track Title"
                className={inputClass}
              />

              <textarea
                value={track.description || ""}
                onChange={(e) =>
                  updateArrayItem(setTracks, index, {
                    ...track,

                    description: e.target.value,
                  })
                }
                placeholder="Track Description"
                rows={3}
                className={`${textareaClass} mt-2`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* =========================================================
     HIGHLIGHTS
  ========================================================= */

  const renderHighlights = () => (
    <div className="space-y-3">
      <div className={cardClass}>
        <HeaderButton
          title="Key Highlights"
          description="Highlights shown on the conference details page."
          buttonText="Add Highlight"
          onClick={addHighlight}
        />

        {keyHighlights.map((item, index) => (
          <div
            key={index}
            className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
          >
            <div className="flex gap-2">
              <input
                value={item.title || ""}
                onChange={(e) =>
                  updateArrayItem(setKeyHighlights, index, {
                    ...item,

                    title: e.target.value,
                  })
                }
                placeholder="Live Keynote Presentations"
                className={inputClass}
              />

              <button
                type="button"
                onClick={() => removeArrayItem(setKeyHighlights, index)}
                className="w-10 text-red-500"
              >
                <Trash2 size={14} className="mx-auto" />
              </button>
            </div>

            <textarea
              value={item.description || ""}
              onChange={(e) =>
                updateArrayItem(setKeyHighlights, index, {
                  ...item,

                  description: e.target.value,
                })
              }
              placeholder="Description"
              rows={3}
              className={`${textareaClass} mt-2`}
            />
          </div>
        ))}
      </div>
    </div>
  );

  /* =========================================================
     ATTENDEES
  ========================================================= */

  const renderAttendees = () => (
    <div className={cardClass}>
      <HeaderButton
        title="Who Should Attend"
        description="Define the target audience for this conference."
        buttonText="Add Audience"
        onClick={addAttendee}
      />

      <Field label="Description">
        <textarea
          name="whoShouldAttendDescription"
          value={formData.whoShouldAttendDescription}
          onChange={handleChange}
          rows={4}
          className={textareaClass}
        />
      </Field>

      <div className="mt-4 space-y-2">
        {whoShouldAttend.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={item}
              onChange={(e) =>
                updateArrayItem(setWhoShouldAttend, index, e.target.value)
              }
              className={inputClass}
              placeholder="Autism Researchers"
            />

            <button
              type="button"
              onClick={() => removeArrayItem(setWhoShouldAttend, index)}
              className="w-10 text-red-500"
            >
              <Trash2 size={14} className="mx-auto" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  /* =========================================================
     BENEFITS
  ========================================================= */

  const renderBenefits = () => (
    <div className="space-y-3">
      <div className={cardClass}>
        <HeaderButton
          title="Why To Attend"
          buttonText="Add Item"
          onClick={addWhyAttend}
        />

        {whyToAttend.map((item, index) => (
          <ObjectItem
            key={index}
            item={item}
            index={index}
            setter={setWhyToAttend}
            titlePlaceholder="Stay Updated on Latest Developments"
          />
        ))}
      </div>

      <div className={cardClass}>
        <HeaderButton
          title="Benefits Of Attending"
          buttonText="Add Benefit"
          onClick={addBenefit}
        />

        {benefitsOfAttending.map((item, index) => (
          <ObjectItem
            key={index}
            item={item}
            index={index}
            setter={setBenefitsOfAttending}
            titlePlaceholder="Showcase Your Expertise"
          />
        ))}
      </div>

      <div className={cardClass}>
        <HeaderButton
          title="Delegate Benefits"
          buttonText="Add Delegate Benefit"
          onClick={addDelegate}
        />

        {delegates.map((item, index) => (
          <ObjectItem
            key={index}
            item={item}
            index={index}
            setter={setDelegates}
            titlePlaceholder="Latest Knowledge"
          />
        ))}
      </div>
    </div>
  );

  /* =========================================================
     AGENDA
  ========================================================= */

  const renderAgenda = () => (
    <div className={cardClass}>
      <HeaderButton
        title="Sample Agenda"
        description="Create Day 1, Day 2 and session schedules."
        buttonText="Add Day"
        onClick={addSession}
      />

      {sessions.map((day, dayIndex) => (
        <div
          key={dayIndex}
          className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3"
        >
          <div className="mb-3 flex gap-2">
            <input
              value={day.day || ""}
              onChange={(e) =>
                updateArrayItem(setSessions, dayIndex, {
                  ...day,

                  day: e.target.value,
                })
              }
              placeholder="Day 1 – April 06, 2027 | Webinar"
              className={inputClass}
            />

            <button
              type="button"
              onClick={() => removeArrayItem(setSessions, dayIndex)}
              className="w-10 text-red-500"
            >
              <Trash2 size={14} className="mx-auto" />
            </button>
          </div>

          {(day.schedule || []).map((schedule, scheduleIndex) => (
            <div
              key={scheduleIndex}
              className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-[150px_1fr_40px]"
            >
              <input
                value={schedule.time || ""}
                onChange={(e) =>
                  updateSchedule(
                    dayIndex,
                    scheduleIndex,
                    "time",
                    e.target.value,
                  )
                }
                placeholder="9:00 AM"
                className={inputClass}
              />

              <input
                value={schedule.session || ""}
                onChange={(e) =>
                  updateSchedule(
                    dayIndex,
                    scheduleIndex,
                    "session",
                    e.target.value,
                  )
                }
                placeholder="Opening Remarks & Welcome Address"
                className={inputClass}
              />

              <button
                type="button"
                onClick={() =>
                  setSessions((prev) =>
                    prev.map((item, i) =>
                      i === dayIndex
                        ? {
                            ...item,

                            schedule: item.schedule.filter(
                              (_, j) => j !== scheduleIndex,
                            ),
                          }
                        : item,
                    ),
                  )
                }
                className="rounded-lg border border-red-200 text-red-500"
              >
                <Trash2 size={14} className="mx-auto" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addSchedule(dayIndex)}
            className={`${buttonClass} bg-violet-50 text-violet-700`}
          >
            <Plus size={14} />
            Add Session
          </button>
        </div>
      ))}
    </div>
  );

  /* =========================================================
     POSTER
  ========================================================= */

  const posterFields = [
    ["benefits", "E-Poster Benefits"],

    ["posterContent", "Poster Content"],

    ["designRequirements", "Design Requirements"],

    ["submissionGuidelines", "Submission Guidelines"],

    ["reviewAndAcceptance", "Review & Acceptance"],

    ["presentation", "Presentation"],

    ["certificate", "Certificate"],

    ["closingNotes", "Closing Notes"],
  ];

  const renderPoster = () => (
    <div className={cardClass}>
      <SectionHeader
        title="Poster & E-Poster"
        description="Manage poster presentation information."
      />

      <Field label="E-Poster Guidelines Introduction">
        <textarea
          value={ePoster.guidelinesIntro}
          onChange={(e) =>
            setEPoster((prev) => ({
              ...prev,

              guidelinesIntro: e.target.value,
            }))
          }
          rows={5}
          className={textareaClass}
        />
      </Field>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {Object.entries(ePoster.specifications).map(([key, value]) => (
          <Field key={key} label={key}>
            <input
              value={value}
              onChange={(e) =>
                setEPoster((prev) => ({
                  ...prev,

                  specifications: {
                    ...prev.specifications,

                    [key]: e.target.value,
                  },
                }))
              }
              className={inputClass}
            />
          </Field>
        ))}
      </div>

      <div className="mt-5 space-y-5">
        {posterFields.map(([field, title]) => (
          <div key={field}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[13px] font-bold">{title}</h3>

              <button
                type="button"
                onClick={() => addPosterPoint(field)}
                className="text-[11px] font-bold text-violet-600"
              >
                + Add
              </button>
            </div>

            {(ePoster[field] || []).map((item, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <input
                  value={item}
                  onChange={(e) =>
                    updatePosterPoint(field, index, e.target.value)
                  }
                  className={inputClass}
                />

                <button
                  type="button"
                  onClick={() => removePosterPoint(field, index)}
                  className="w-10 text-red-500"
                >
                  <Trash2 size={14} className="mx-auto" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <SectionHeader title="Live Poster Presenters" />

        {posterPresentersLive.map((item, index) => (
          <div key={index} className="mb-2 flex gap-2">
            <input
              value={item}
              onChange={(e) =>
                updateArrayItem(setPosterPresentersLive, index, e.target.value)
              }
              className={inputClass}
            />

            <button
              type="button"
              onClick={() => removeArrayItem(setPosterPresentersLive, index)}
              className="w-10 text-red-500"
            >
              <Trash2 size={14} className="mx-auto" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addArrayItem(setPosterPresentersLive, "")}
          className={`${buttonClass} bg-violet-600 text-white`}
        >
          <Plus size={14} />
          Add Point
        </button>
      </div>
    </div>
  );

  /* =========================================================
     MARKET
  ========================================================= */

  const renderMarket = () => (
    <div className={cardClass}>
      <SectionHeader
        title="Market Analysis"
        description="Conference-specific market analysis content."
      />

      <Field label="Heading">
        <input
          name="marketHeading"
          value={formData.marketHeading}
          onChange={handleChange}
          placeholder="Autism Market Analysis"
          className={inputClass}
        />
      </Field>

      <div className="mt-4">
        {formData.marketParagraphs.map((paragraph, index) => (
          <div key={index} className="mb-3">
            <div className="mb-1 flex justify-between">
              <label className="text-[12px] font-semibold">
                Paragraph {index + 1}
              </label>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,

                    marketParagraphs: prev.marketParagraphs.filter(
                      (_, i) => i !== index,
                    ),
                  }))
                }
                className="text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <textarea
              value={paragraph}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,

                  marketParagraphs: prev.marketParagraphs.map((item, i) =>
                    i === index ? e.target.value : item,
                  ),
                }))
              }
              rows={5}
              className={textareaClass}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,

              marketParagraphs: [...prev.marketParagraphs, ""],
            }))
          }
          className={`${buttonClass} bg-violet-600 text-white`}
        >
          <Plus size={14} />
          Add Paragraph
        </button>
      </div>

      <div className="mt-5">
        <ImageUploader
          label="Market Analysis Image"
          value={formData.marketImage}
          onChange={(file) =>
            setFormData((prev) => ({
              ...prev,

              marketImage: file,
            }))
          }
        />
      </div>
    </div>
  );

  /* =========================================================
     MEDIA
  ========================================================= */

  const renderMedia = () => (
    <div className={cardClass}>
      <SectionHeader
        title="Media & Sponsors"
        description="Upload sponsor logos using drag and drop."
      />

      <MultiImageUploader
        label="Sponsor Logos"
        values={sponsors}
        onChange={setSponsors}
      />
    </div>
  );

  /* =========================================================
     CONTACT
  ========================================================= */

  const renderContact = () => (
    <div className="space-y-3">
      <div className={cardClass}>
        <SectionHeader title="Contact Information" />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Contact Email">
            <input
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="Phone">
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="WhatsApp">
            <input
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="Website">
            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <div className={cardClass}>
        <SectionHeader title="Social Media" />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            ["linkedin", "LinkedIn"],
            ["instagram", "Instagram"],
            ["facebook", "Facebook"],
          ].map(([name, label]) => (
            <Field key={name} label={label}>
              <div className="relative">
                <Link2
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400"
                />

                <input
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </Field>
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <SectionHeader title="Submission Settings" />

        <div className="space-y-2">
          {[
            ["abstractSubmission", "Enable Abstract Submission"],

            ["paperSubmission", "Enable Full Paper Submission"],

            ["oralPresentation", "Allow Oral Presentation"],

            ["posterPresentation", "Allow Poster Presentation"],

            ["virtualPresentation", "Allow Virtual Presentation"],
          ].map(([name, label]) => (
            <label
              key={name}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-3"
            >
              <span className="text-[13px] font-medium">{label}</span>

              <input
                type="checkbox"
                name={name}
                checked={formData.submission[name]}
                onChange={handleSubmissionChange}
                className="h-4 w-4 accent-violet-600"
              />
            </label>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Review Type">
            <select
              name="reviewType"
              value={formData.submission.reviewType}
              onChange={handleSubmissionChange}
              className={inputClass}
            >
              <option>Single Blind</option>

              <option>Double Blind</option>

              <option>Open Review</option>
            </select>
          </Field>

          <Field label="Maximum Abstract Words">
            <input
              type="number"
              name="maxAbstractWords"
              value={formData.submission.maxAbstractWords}
              onChange={handleSubmissionChange}
              className={inputClass}
            />
          </Field>
        </div>
      </div>
    </div>
  );

  /* =========================================================
     RENDER SECTION
  ========================================================= */

  const renderSection = () => {
    switch (activeSection) {
      case "basic":
        return renderBasic();

      case "dates":
        return renderDates();

      case "registration":
        return renderRegistration();

      case "welcome":
        return renderWelcome();

      case "speakers":
        return renderSpeakers();

      case "content":
        return renderContent();

      case "highlights":
        return renderHighlights();

      case "agenda":
        return renderAgenda();

      case "attendees":
        return renderAttendees();

      case "benefits":
        return renderBenefits();

      case "poster":
        return renderPoster();

      case "market":
        return renderMarket();

      case "media":
        return renderMedia();

      case "contact":
        return renderContact();

      default:
        return renderBasic();
    }
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goPrevious = () => {
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    }
  };

  const goNext = () => {
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex min-h-[62px] items-center justify-between gap-3 px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-violet-50 hover:text-violet-600"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-[16px] font-bold text-slate-900">
                {isEditMode ? "Update Conference" : "Create Conference"}
              </h1>

              <p className="hidden text-[11px] text-slate-500 sm:block">
                {isEditMode
                  ? "Update the selected conference and save changes to the API."
                  : "Create a new conference and save it to the API."}
              </p>
            </div>
          </div>

          {/* =================================================
              TOP ACTIONS
          ================================================== */}

          <div className="flex gap-2">
            {/* SAVE DRAFT / UPDATE DRAFT */}

            <button
              type="button"
              disabled={saving || conferenceLoading}
              onClick={() => saveConference(false)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 text-[12px] font-semibold text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={15} />

              {isEditMode ? "Update Draft" : "Save Draft"}
            </button>

            {/* CREATE / UPDATE & PUBLISH */}

            <button
              type="button"
              disabled={saving || conferenceLoading}
              onClick={() => saveConference(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={15} />

              {saving
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update & Publish"
                  : "Create & Publish"}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="mx-auto w-full max-w-[1500px] p-3">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-[235px_minmax(0,1fr)]">
            {/* =================================================
                SIDEBAR
            ================================================== */}

            <aside className="border-b border-slate-200 bg-slate-50 p-3 lg:border-b-0 lg:border-r">
              {sections.map((section, index) => {
                const Icon = section.icon;

                const active = activeSection === section.id;

                const completed = index < currentIndex;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`mb-1.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition ${
                      active
                        ? "bg-violet-100 text-violet-700"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        active || completed
                          ? "bg-violet-600 text-white"
                          : "bg-white text-slate-400"
                      }`}
                    >
                      {completed ? <Check size={14} /> : <Icon size={14} />}
                    </span>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wide opacity-60">
                        Step {index + 1}
                      </p>

                      <p className="text-[12px] font-semibold">
                        {section.label}
                      </p>
                    </div>
                  </button>
                );
              })}
            </aside>

            {/* =================================================
                CONTENT
            ================================================== */}

            <main className="min-w-0 bg-slate-50/50 p-3 sm:p-4">
              {renderSection()}

              <div className="mt-3 flex items-center justify-between">
                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={currentIndex === 0 || saving || conferenceLoading}
                  onClick={goPrevious}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-[12px] font-semibold disabled:opacity-40"
                >
                  Previous
                </button>

                {/* NEXT */}

                {currentIndex < sections.length - 1 ? (
                  <button
                    type="button"
                    disabled={saving || conferenceLoading}
                    onClick={goNext}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-violet-600 px-4 text-[12px] font-semibold text-white disabled:opacity-50"
                  >
                    Continue
                    <ChevronDown size={15} className="-rotate-90" />
                  </button>
                ) : (
                  /* LAST STEP */

                  <button
                    type="button"
                    onClick={() => saveConference(false)}
                    disabled={saving || conferenceLoading}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-violet-600 px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={15} />

                    {saving
                      ? isEditMode
                        ? "Updating..."
                        : "Creating..."
                      : isEditMode
                        ? "Update Conference"
                        : "Create Conference"}
                  </button>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   FIELD
========================================================= */

const Field = ({ label, children, full = false }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
      {label}
    </label>

    {children}
  </div>
);

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({ title, description }) => (
  <div className="mb-4">
    <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>

    {description && (
      <p className="mt-0.5 text-[12px] leading-5 text-slate-500">
        {description}
      </p>
    )}
  </div>
);

/* =========================================================
   HEADER BUTTON
========================================================= */

const HeaderButton = ({ title, description, buttonText, onClick }) => (
  <div className="mb-4 flex items-center justify-between gap-3">
    <SectionHeader title={title} description={description} />

    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-[12px] font-semibold text-white hover:bg-violet-700"
    >
      <Plus size={15} />

      {buttonText}
    </button>
  </div>
);

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({ icon: Icon, text }) => (
  <div className="rounded-lg border border-dashed border-slate-300 py-8 text-center">
    <Icon size={28} className="mx-auto text-slate-300" />

    <p className="mt-2 text-[12px] text-slate-500">{text}</p>
  </div>
);

/* =========================================================
   OBJECT ITEM
========================================================= */

const ObjectItem = ({ item, index, setter, titlePlaceholder }) => (
  <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
    <div className="flex gap-2">
      <input
        value={item?.title || ""}
        onChange={(e) =>
          setter((prev) =>
            prev.map((x, i) =>
              i === index
                ? {
                    ...x,

                    title: e.target.value,
                  }
                : x,
            ),
          )
        }
        placeholder={titlePlaceholder}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px]"
      />

      <button
        type="button"
        onClick={() => setter((prev) => prev.filter((_, i) => i !== index))}
        className="w-10 text-red-500"
      >
        <Trash2 size={14} className="mx-auto" />
      </button>
    </div>

    <textarea
      value={item?.description || ""}
      onChange={(e) =>
        setter((prev) =>
          prev.map((x, i) =>
            i === index
              ? {
                  ...x,

                  description: e.target.value,
                }
              : x,
          ),
        )
      }
      placeholder="Description"
      rows={3}
      className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px]"
    />
  </div>
);

export default CreateConference;
