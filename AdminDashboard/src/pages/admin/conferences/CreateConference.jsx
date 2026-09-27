import React, { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  FileText,
  Globe2,
  Image,
  Info,
  Link2,
  Plus,
  Save,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateConference = () => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("basic");

  const [formData, setFormData] = useState({
    conferenceName: "",
    shortName: "",
    category: "",
    type: "Physical",
    status: "Draft",
    description: "",

    startDate: "",
    endDate: "",
    registrationStartDate: "",
    registrationDeadline: "",
    abstractDeadline: "",
    paperDeadline: "",
    timezone: "Asia/Kolkata",

    venueName: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    mapUrl: "",
    onlineLink: "",

    contactEmail: "",
    phone: "",
    whatsapp: "",

    website: "",
    linkedin: "",
    instagram: "",
    facebook: "",

    logo: null,
    banner: null,
    brochure: null,

    abstractSubmission: true,
    paperSubmission: false,
    oralPresentation: true,
    posterPresentation: true,
    virtualPresentation: false,

    reviewType: "Single Blind",
    maxAbstractWords: "300",

    topics: [],
  });

  const [registrationTypes, setRegistrationTypes] = useState([
    {
      id: Date.now(),
      type: "Student",
      earlyBird: "",
      regular: "",
      currency: "USD",
    },
  ]);

  const [speakers, setSpeakers] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [newTopic, setNewTopic] = useState("");

  // =========================================================
  // SECTIONS
  // =========================================================

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
      label: "Registration",
      icon: Users,
    },
    {
      id: "submission",
      label: "Submissions",
      icon: FileText,
    },
    {
      id: "speakers",
      label: "Speakers",
      icon: Users,
    },
    {
      id: "program",
      label: "Program",
      icon: CalendarDays,
    },
    {
      id: "media",
      label: "Media",
      icon: Image,
    },
    {
      id: "contact",
      label: "Contact",
      icon: Globe2,
    },
  ];

  const currentIndex = sections.findIndex(
    (section) => section.id === activeSection
  );

  // =========================================================
  // COMMON CLASSES
  // =========================================================

  const inputClass =
    "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10";

  const textareaClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10";

  const labelClass =
    "mb-1.5 block text-[12px] font-semibold text-slate-700";

  const cardClass =
    "rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.035)]";

  const compactButton =
    "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-[12px] font-semibold transition";

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // FILE CHANGE
  // =========================================================

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  // =========================================================
  // TOPICS
  // =========================================================

  const addTopic = () => {
    const topic = newTopic.trim();

    if (!topic) return;

    if (formData.topics.includes(topic)) {
      setNewTopic("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      topics: [...prev.topics, topic],
    }));

    setNewTopic("");
  };

  const removeTopic = (index) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }));
  };

  // =========================================================
  // REGISTRATION
  // =========================================================

  const addRegistrationType = () => {
    setRegistrationTypes((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "",
        earlyBird: "",
        regular: "",
        currency: "USD",
      },
    ]);
  };

  const updateRegistrationType = (id, field, value) => {
    setRegistrationTypes((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removeRegistrationType = (id) => {
    setRegistrationTypes((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // =========================================================
  // SPEAKERS
  // =========================================================

  const addSpeaker = () => {
    setSpeakers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        designation: "",
        organization: "",
        country: "",
        bio: "",
      },
    ]);
  };

  const updateSpeaker = (id, field, value) => {
    setSpeakers((prev) =>
      prev.map((speaker) =>
        speaker.id === id
          ? {
              ...speaker,
              [field]: value,
            }
          : speaker
      )
    );
  };

  const removeSpeaker = (id) => {
    setSpeakers((prev) =>
      prev.filter((speaker) => speaker.id !== id)
    );
  };

  // =========================================================
  // COMMITTEE
  // =========================================================

  const addCommitteeMember = () => {
    setCommittee((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        role: "",
        organization: "",
      },
    ]);
  };

  const updateCommitteeMember = (id, field, value) => {
    setCommittee((prev) =>
      prev.map((member) =>
        member.id === id
          ? {
              ...member,
              [field]: value,
            }
          : member
      )
    );
  };

  const removeCommitteeMember = (id) => {
    setCommittee((prev) =>
      prev.filter((member) => member.id !== id)
    );
  };

  // =========================================================
  // SESSIONS
  // =========================================================

  const addSession = () => {
    setSessions((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        speaker: "",
        room: "",
        type: "Keynote",
      },
    ]);
  };

  const updateSession = (id, field, value) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? {
              ...session,
              [field]: value,
            }
          : session
      )
    );
  };

  const removeSession = (id) => {
    setSessions((prev) =>
      prev.filter((session) => session.id !== id)
    );
  };

  // =========================================================
  // SAVE
  // =========================================================

  const saveConference = (publish = false) => {
    const payload = {
      ...formData,
      registrationTypes,
      speakers,
      committee,
      sessions,
      status: publish ? "Published" : "Draft",
    };

    console.log("Conference Payload:", payload);

    alert(
      publish
        ? "Conference published successfully!"
        : "Conference saved as draft!"
    );
  };

  // =========================================================
  // BASIC INFORMATION
  // =========================================================

  const renderBasicSection = () => (
    <div className={cardClass}>
      <SectionHeader
        title="Basic Information"
        description="Add the primary information about your conference."
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="Conference Name *" full>
          <input
            name="conferenceName"
            value={formData.conferenceName}
            onChange={handleChange}
            placeholder="International Conference on Healthcare Innovation"
            className={inputClass}
          />
        </Field>

        <Field label="Short Name">
          <input
            name="shortName"
            value={formData.shortName}
            onChange={handleChange}
            placeholder="ICHI 2026"
            className={inputClass}
          />
        </Field>

        <Field label="Category *">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select category</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Medical">Medical</option>
            <option value="Technology">Technology</option>
            <option value="Research">Research</option>
            <option value="Science">Science</option>
            <option value="Education">Education</option>
            <option value="Business">Business</option>
          </select>
        </Field>

        <Field label="Conference Type">
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="Physical">Physical</option>
            <option value="Virtual">Virtual</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </Field>

        <Field label="Status">
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

        <Field label="Conference Description *" full>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Write a detailed description about the conference..."
            className={textareaClass}
          />
        </Field>
      </div>
    </div>
  );

  // =========================================================
  // DATES & VENUE
  // =========================================================

  const renderDatesSection = () => (
    <div className="space-y-3">
      <div className={cardClass}>
        <SectionHeader
          title="Conference Dates"
          description="Configure conference and submission deadlines."
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

          <Field label="End Date *">
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
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

          <Field label="Abstract Submission Deadline">
            <input
              type="date"
              name="abstractDeadline"
              value={formData.abstractDeadline}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="Full Paper Submission Deadline">
            <input
              type="date"
              name="paperDeadline"
              value={formData.paperDeadline}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="Time Zone" full>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Asia/Kolkata">
                India Standard Time (IST)
              </option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">
                Eastern Time
              </option>
              <option value="Europe/London">
                London Time
              </option>
              <option value="Asia/Dubai">
                Gulf Standard Time
              </option>
            </select>
          </Field>
        </div>
      </div>

      <div className={cardClass}>
        <SectionHeader title="Venue Information" />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Venue Name" full>
            <input
              name="venueName"
              value={formData.venueName}
              onChange={handleChange}
              placeholder="Grand Convention Center"
              className={inputClass}
            />
          </Field>

          <Field label="Address" full>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              placeholder="Complete venue address"
              className={textareaClass}
            />
          </Field>

          <Field label="City">
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Hyderabad"
              className={inputClass}
            />
          </Field>

          <Field label="State">
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Telangana"
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

          <Field label="Google Maps URL">
            <input
              name="mapUrl"
              value={formData.mapUrl}
              onChange={handleChange}
              placeholder="https://maps.google.com/..."
              className={inputClass}
            />
          </Field>

          {(formData.type === "Virtual" ||
            formData.type === "Hybrid") && (
            <Field label="Online Meeting Link" full>
              <input
                name="onlineLink"
                value={formData.onlineLink}
                onChange={handleChange}
                placeholder="https://zoom.us/..."
                className={inputClass}
              />
            </Field>
          )}
        </div>
      </div>
    </div>
  );

  // =========================================================
  // REGISTRATION
  // =========================================================

  const renderRegistrationSection = () => (
    <div className={cardClass}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <SectionHeader
          title="Registration Types"
          description="Configure registration categories and fees."
        />

        <button
          type="button"
          onClick={addRegistrationType}
          className={`${compactButton} shrink-0 bg-violet-600 text-white hover:bg-violet-700`}
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Add Type</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {registrationTypes.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-slate-200 bg-slate-50 p-3"
          >
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-5">
              <Field label="Registration Type">
                <input
                  value={item.type}
                  onChange={(e) =>
                    updateRegistrationType(
                      item.id,
                      "type",
                      e.target.value
                    )
                  }
                  placeholder="Student"
                  className={inputClass}
                />
              </Field>

              <Field label="Early Bird">
                <input
                  type="number"
                  value={item.earlyBird}
                  onChange={(e) =>
                    updateRegistrationType(
                      item.id,
                      "earlyBird",
                      e.target.value
                    )
                  }
                  placeholder="99"
                  className={inputClass}
                />
              </Field>

              <Field label="Regular Fee">
                <input
                  type="number"
                  value={item.regular}
                  onChange={(e) =>
                    updateRegistrationType(
                      item.id,
                      "regular",
                      e.target.value
                    )
                  }
                  placeholder="149"
                  className={inputClass}
                />
              </Field>

              <Field label="Currency">
                <select
                  value={item.currency}
                  onChange={(e) =>
                    updateRegistrationType(
                      item.id,
                      "currency",
                      e.target.value
                    )
                  }
                  className={inputClass}
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </Field>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() =>
                    removeRegistrationType(item.id)
                  }
                  className="h-10 w-full rounded-lg border border-red-200 bg-white text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 size={15} className="mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // =========================================================
  // SUBMISSION
  // =========================================================

  const renderSubmissionSection = () => (
    <div className="space-y-3">
      <div className={cardClass}>
        <SectionHeader
          title="Submission Settings"
          description="Configure abstract and paper submission options."
        />

        <div className="space-y-1.5">
          {[
            [
              "abstractSubmission",
              "Enable Abstract Submission",
            ],
            [
              "paperSubmission",
              "Enable Full Paper Submission",
            ],
            [
              "oralPresentation",
              "Allow Oral Presentation",
            ],
            [
              "posterPresentation",
              "Allow Poster Presentation",
            ],
            [
              "virtualPresentation",
              "Allow Virtual Presentation",
            ],
          ].map(([name, label]) => (
            <label
              key={name}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 transition hover:border-violet-200 hover:bg-violet-50/30"
            >
              <span className="text-[13px] font-medium text-slate-700">
                {label}
              </span>

              <input
                type="checkbox"
                name={name}
                checked={formData[name]}
                onChange={handleChange}
                className="h-4 w-4 accent-violet-600"
              />
            </label>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Review Type">
            <select
              name="reviewType"
              value={formData.reviewType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Single Blind">Single Blind</option>
              <option value="Double Blind">Double Blind</option>
              <option value="Open Review">Open Review</option>
            </select>
          </Field>

          <Field label="Maximum Abstract Words">
            <input
              type="number"
              name="maxAbstractWords"
              value={formData.maxAbstractWords}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <div className={cardClass}>
        <SectionHeader
          title="Conference Topics"
          description="Add topics or scientific tracks covered by the conference."
        />

        <div className="flex gap-2">
          <input
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTopic();
              }
            }}
            placeholder="Enter conference topic"
            className={inputClass}
          />

          <button
            type="button"
            onClick={addTopic}
            className="h-10 w-10 shrink-0 rounded-lg bg-violet-600 text-white transition hover:bg-violet-700"
          >
            <Plus size={17} className="mx-auto" />
          </button>
        </div>

        {formData.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {formData.topics.map((topic, index) => (
              <div
                key={`${topic}-${index}`}
                className="flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-[12px] font-medium text-violet-700"
              >
                {topic}

                <button
                  type="button"
                  onClick={() => removeTopic(index)}
                  className="text-violet-500 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // =========================================================
  // SPEAKERS
  // =========================================================

  const renderSpeakersSection = () => (
    <div className="space-y-3">
      <div className={cardClass}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <SectionHeader
            title="Speakers"
            description="Add keynote and invited speakers."
          />

          <button
            type="button"
            onClick={addSpeaker}
            className={`${compactButton} shrink-0 bg-violet-600 text-white hover:bg-violet-700`}
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Add Speaker</span>
          </button>
        </div>

        <div className="space-y-3">
          {speakers.length === 0 && (
            <EmptyState
              icon={Users}
              text="No speakers added yet."
            />
          )}

          {speakers.map((speaker, index) => (
            <div
              key={speaker.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <div className="mb-2.5 flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-slate-800">
                  Speaker {index + 1}
                </h3>

                <button
                  type="button"
                  onClick={() => removeSpeaker(speaker.id)}
                  className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                <input
                  value={speaker.name}
                  onChange={(e) =>
                    updateSpeaker(
                      speaker.id,
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Speaker Name"
                  className={inputClass}
                />

                <input
                  value={speaker.designation}
                  onChange={(e) =>
                    updateSpeaker(
                      speaker.id,
                      "designation",
                      e.target.value
                    )
                  }
                  placeholder="Designation"
                  className={inputClass}
                />

                <input
                  value={speaker.organization}
                  onChange={(e) =>
                    updateSpeaker(
                      speaker.id,
                      "organization",
                      e.target.value
                    )
                  }
                  placeholder="Organization"
                  className={inputClass}
                />

                <input
                  value={speaker.country}
                  onChange={(e) =>
                    updateSpeaker(
                      speaker.id,
                      "country",
                      e.target.value
                    )
                  }
                  placeholder="Country"
                  className={inputClass}
                />

                <textarea
                  value={speaker.bio}
                  onChange={(e) =>
                    updateSpeaker(
                      speaker.id,
                      "bio",
                      e.target.value
                    )
                  }
                  placeholder="Speaker biography"
                  rows={2}
                  className={`${textareaClass} md:col-span-2`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <SectionHeader title="Organizing Committee" />

          <button
            type="button"
            onClick={addCommitteeMember}
            className={`${compactButton} shrink-0 bg-violet-600 text-white hover:bg-violet-700`}
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Add Member</span>
          </button>
        </div>

        <div className="space-y-2">
          {committee.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 md:grid-cols-4"
            >
              <input
                value={member.name}
                onChange={(e) =>
                  updateCommitteeMember(
                    member.id,
                    "name",
                    e.target.value
                  )
                }
                placeholder="Name"
                className={inputClass}
              />

              <input
                value={member.role}
                onChange={(e) =>
                  updateCommitteeMember(
                    member.id,
                    "role",
                    e.target.value
                  )
                }
                placeholder="Role"
                className={inputClass}
              />

              <input
                value={member.organization}
                onChange={(e) =>
                  updateCommitteeMember(
                    member.id,
                    "organization",
                    e.target.value
                  )
                }
                placeholder="Organization"
                className={inputClass}
              />

              <button
                type="button"
                onClick={() =>
                  removeCommitteeMember(member.id)
                }
                className="h-10 rounded-lg border border-red-200 bg-white text-red-500 transition hover:bg-red-50"
              >
                <Trash2 size={15} className="mx-auto" />
              </button>
            </div>
          ))}

          {committee.length === 0 && (
            <p className="py-5 text-center text-[12px] text-slate-500">
              No committee members added.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // =========================================================
  // PROGRAM
  // =========================================================

  const renderProgramSection = () => (
    <div className={cardClass}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <SectionHeader
          title="Conference Program"
          description="Create sessions and schedule."
        />

        <button
          type="button"
          onClick={addSession}
          className={`${compactButton} shrink-0 bg-violet-600 text-white hover:bg-violet-700`}
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Add Session</span>
        </button>
      </div>

      <div className="space-y-3">
        {sessions.length === 0 && (
          <EmptyState
            icon={CalendarDays}
            text="No sessions added yet."
          />
        )}

        {sessions.map((session, index) => (
          <div
            key={session.id}
            className="rounded-lg border border-slate-200 bg-slate-50 p-3"
          >
            <div className="mb-2.5 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-slate-800">
                Session {index + 1}
              </h3>

              <button
                type="button"
                onClick={() => removeSession(session.id)}
                className="rounded-lg p-1.5 text-red-500 transition hover:bg-red-50"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              <input
                value={session.title}
                onChange={(e) =>
                  updateSession(
                    session.id,
                    "title",
                    e.target.value
                  )
                }
                placeholder="Session Title"
                className={inputClass}
              />

              <select
                value={session.type}
                onChange={(e) =>
                  updateSession(
                    session.id,
                    "type",
                    e.target.value
                  )
                }
                className={inputClass}
              >
                <option value="Keynote">Keynote</option>
                <option value="Plenary">Plenary</option>
                <option value="Workshop">Workshop</option>
                <option value="Oral">
                  Oral Presentation
                </option>
                <option value="Poster">Poster Session</option>
                <option value="Panel">Panel Discussion</option>
              </select>

              <input
                type="date"
                value={session.date}
                onChange={(e) =>
                  updateSession(
                    session.id,
                    "date",
                    e.target.value
                  )
                }
                className={inputClass}
              />

              <input
                value={session.room}
                onChange={(e) =>
                  updateSession(
                    session.id,
                    "room",
                    e.target.value
                  )
                }
                placeholder="Room / Hall"
                className={inputClass}
              />

              <input
                type="time"
                value={session.startTime}
                onChange={(e) =>
                  updateSession(
                    session.id,
                    "startTime",
                    e.target.value
                  )
                }
                className={inputClass}
              />

              <input
                type="time"
                value={session.endTime}
                onChange={(e) =>
                  updateSession(
                    session.id,
                    "endTime",
                    e.target.value
                  )
                }
                className={inputClass}
              />

              <input
                value={session.speaker}
                onChange={(e) =>
                  updateSession(
                    session.id,
                    "speaker",
                    e.target.value
                  )
                }
                placeholder="Speaker / Chair"
                className={`${inputClass} md:col-span-2`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // =========================================================
  // MEDIA
  // =========================================================

  const renderMediaSection = () => (
    <div className={cardClass}>
      <SectionHeader
        title="Conference Media"
        description="Upload branding assets and conference documents."
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          {
            field: "logo",
            title: "Conference Logo",
            accept: "image/png,image/jpeg,image/webp",
            icon: Image,
          },
          {
            field: "banner",
            title: "Hero Banner",
            accept: "image/png,image/jpeg,image/webp",
            icon: Image,
          },
          {
            field: "brochure",
            title: "Conference Brochure",
            accept: "application/pdf",
            icon: FileText,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <label
              key={item.field}
              className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-violet-400 hover:bg-violet-50/30"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Icon size={22} />
              </div>

              <p className="mt-2.5 text-[13px] font-semibold text-slate-800">
                {item.title}
              </p>

              <p className="mt-1 max-w-full truncate px-2 text-[11px] text-slate-500">
                {formData[item.field]
                  ? formData[item.field].name
                  : "Click to upload"}
              </p>

              <div className="mt-2.5 inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-3 text-[11px] font-semibold text-violet-600 shadow-sm">
                <Upload size={13} />
                Choose File
              </div>

              <input
                type="file"
                accept={item.accept}
                onChange={(e) =>
                  handleFileChange(e, item.field)
                }
                className="hidden"
              />
            </label>
          );
        })}
      </div>
    </div>
  );

  // =========================================================
  // CONTACT
  // =========================================================

  const renderContactSection = () => (
    <div className="space-y-3">
      <div className={cardClass}>
        <SectionHeader title="Contact Information" />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Contact Email">
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="conference@example.com"
              className={inputClass}
            />
          </Field>

          <Field label="Phone">
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className={inputClass}
            />
          </Field>

          <Field label="WhatsApp">
            <input
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className={inputClass}
            />
          </Field>

          <Field label="Website">
            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <div className={cardClass}>
        <SectionHeader title="Social Media" />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            ["linkedin", "LinkedIn", "LinkedIn URL"],
            ["instagram", "Instagram", "Instagram URL"],
            ["facebook", "Facebook", "Facebook URL"],
          ].map(([name, label, placeholder]) => (
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
                  placeholder={placeholder}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </Field>
          ))}
        </div>
      </div>
    </div>
  );

  // =========================================================
  // RENDER SECTION
  // =========================================================

  const renderSection = () => {
    switch (activeSection) {
      case "basic":
        return renderBasicSection();

      case "dates":
        return renderDatesSection();

      case "registration":
        return renderRegistrationSection();

      case "submission":
        return renderSubmissionSection();

      case "speakers":
        return renderSpeakersSection();

      case "program":
        return renderProgramSection();

      case "media":
        return renderMediaSection();

      case "contact":
        return renderContactSection();

      default:
        return renderBasicSection();
    }
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

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

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex min-h-[60px] items-center justify-between gap-3 px-3 sm:px-5">
          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-[16px] font-bold text-slate-900">
                Create Conference
              </h1>

              <p className="hidden truncate text-[11px] text-slate-500 sm:block">
                Create and publish a new conference.
              </p>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => saveConference(false)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50 sm:px-3"
            >
              <Save size={15} />

              <span className="hidden sm:inline">
                Save Draft
              </span>
            </button>

            <button
              type="button"
              onClick={() => saveConference(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-[12px] font-semibold text-white transition hover:bg-violet-700 sm:px-3.5"
            >
              <Check size={15} />

              <span>Publish</span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="mx-auto w-full max-w-[1450px] px-3 py-3 sm:px-4">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_5px_rgba(0,0,0,0.035)]">
          <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[215px_minmax(0,1fr)]">
            {/* =================================================
                STEP TRACKER
            ================================================= */}

            <aside className="border-b border-slate-200 bg-slate-50/80 p-3 lg:border-b-0 lg:border-r">
              <div className="relative">
                {sections.map((section, index) => {
                  const Icon = section.icon;

                  const active =
                    activeSection === section.id;

                  const completed = index < currentIndex;

                  const upcoming = index > currentIndex;

                  return (
                    <div
                      key={section.id}
                      className="relative flex min-h-[61px]"
                    >
                      {index < sections.length - 1 && (
                        <span
                          className={`absolute left-[15px] top-[31px] h-[calc(100%-1px)] w-px ${
                            index < currentIndex
                              ? "bg-violet-500"
                              : "bg-slate-200"
                          }`}
                        />
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setActiveSection(section.id)
                        }
                        className="group relative z-10 flex w-full items-start gap-2.5 text-left"
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                            completed || active
                              ? "border-violet-600 bg-violet-600 text-white"
                              : "border-slate-300 bg-white text-slate-400 group-hover:border-violet-300 group-hover:text-violet-500"
                          }`}
                        >
                          {completed ? (
                            <Check
                              size={14}
                              strokeWidth={2.5}
                            />
                          ) : (
                            <Icon size={14} />
                          )}
                        </span>

                        <div className="min-w-0 pt-0.5">
                          <p
                            className={`text-[10px] font-bold uppercase tracking-wide ${
                              active || completed
                                ? "text-violet-600"
                                : "text-slate-400"
                            }`}
                          >
                            Step {index + 1}
                          </p>

                          <p
                            className={`mt-0.5 text-[12px] font-semibold leading-4 ${
                              active
                                ? "text-slate-900"
                                : completed
                                ? "text-violet-700"
                                : upcoming
                                ? "text-slate-500"
                                : "text-slate-700"
                            }`}
                          >
                            {section.label}
                          </p>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* =================================================
                CONTENT
            ================================================= */}

            <main className="min-w-0 bg-slate-50/50 p-3 sm:p-4">
              {renderSection()}

              {/* =================================================
                  BOTTOM NAVIGATION
              ================================================= */}

              <div className="mt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={goPrevious}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3.5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {currentIndex <
                sections.length - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 text-[12px] font-semibold text-white transition hover:bg-violet-700"
                  >
                    Continue

                    <ChevronDown
                      size={15}
                      className="-rotate-90"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => saveConference(true)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 text-[12px] font-semibold text-white transition hover:bg-violet-700"
                  >
                    <Check size={15} />
                    Create Conference
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

// =========================================================
// REUSABLE FIELD
// =========================================================

const Field = ({ label, children, full = false }) => {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-1.5 block text-[12px] font-semibold text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
};

// =========================================================
// SECTION HEADER
// =========================================================

const SectionHeader = ({ title, description }) => {
  return (
    <div className="mb-4 min-w-0">
      <h2 className="text-[15px] font-bold text-slate-900">
        {title}
      </h2>

      {description && (
        <p className="mt-0.5 text-[12px] leading-5 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
};

// =========================================================
// EMPTY STATE
// =========================================================

const EmptyState = ({ icon: Icon, text }) => {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 py-8 text-center">
      <Icon
        className="mx-auto text-slate-300"
        size={30}
      />

      <p className="mt-2 text-[12px] text-slate-500">
        {text}
      </p>
    </div>
  );
};

export default CreateConference;