
import React, { useEffect, useState } from "react";

import {
  ArrowLeft,
  Mail,
  Globe,
  MapPin,
  Building2,
  CalendarDays,
  UserRound,
  Award,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { getSpeakerByIdApi } from "../../api/speakerApis";

const SpeakersDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [speaker, setSpeaker] = useState(null);
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSpeakerDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getSpeakerByIdApi(id);

        const responseData = response?.data;

        const speakerData =
          responseData?.data ||
          responseData?.speaker ||
          null;

        if (!speakerData) {
          throw new Error("Speaker details not found");
        }

        setSpeaker(speakerData);

        if (speakerData.conferenceId) {
          const conferenceId =
            typeof speakerData.conferenceId === "object"
              ? speakerData.conferenceId?._id
              : speakerData.conferenceId;

          if (conferenceId) {
            try {
              const conferenceResponse = await fetch(
                `/api/v1/conferences/${conferenceId}`
              );

              const conferenceContentType =
                conferenceResponse.headers.get("content-type");

              if (
                conferenceContentType &&
                conferenceContentType.includes("application/json")
              ) {
                const conferenceResult =
                  await conferenceResponse.json();

                if (conferenceResponse.ok) {
                  setConference(
                    conferenceResult?.data ||
                      conferenceResult?.conference ||
                      null
                  );
                }
              }
            } catch (conferenceError) {
              console.error(
                "Fetch Conference Details Error:",
                conferenceError
              );
            }
          }
        }
      } catch (error) {
        console.error(
          "Fetch Speaker Details Error:",
          error
        );

        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch speaker details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (!id) {
      setError("Speaker ID is missing");
      setLoading(false);
      return;
    }

    fetchSpeakerDetails();
  }, [id]);

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getConferenceTitle = () => {
    if (!conference) {
      return "Conference";
    }

    return (
      conference.title ||
      conference.name ||
      conference.basicInformation?.title ||
      conference.basicInformation?.conferenceTitle ||
      "Conference"
    );
  };

  const getConferenceDate = () => {
    if (!conference) {
      return "Not available";
    }

    if (conference.date) {
      return conference.date;
    }

    if (conference.startDate && conference.endDate) {
      return `${formatDate(conference.startDate)} - ${formatDate(
        conference.endDate
      )}`;
    }

    if (conference.startDate) {
      return formatDate(conference.startDate);
    }

    if (
      conference.conferenceDates?.startDate &&
      conference.conferenceDates?.endDate
    ) {
      return `${formatDate(
        conference.conferenceDates.startDate
      )} - ${formatDate(
        conference.conferenceDates.endDate
      )}`;
    }

    return "Not available";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-7 h-7 text-violet-600 animate-spin" />

          <p className="text-sm text-gray-500">
            Loading speaker details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !speaker) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-4">

        {/* Back to Speakers */}
        <button
          type="button"
          onClick={() => navigate("/admin/speakers")}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-violet-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Speakers
        </button>

        <div className="mt-5 max-w-xl mx-auto rounded-xl border border-red-100 bg-red-50 p-6 text-center">
          <XCircle className="w-9 h-9 text-red-500 mx-auto mb-2" />

          <h2 className="text-base font-semibold text-gray-900">
            Unable to load speaker
          </h2>

          <p className="mt-1.5 text-sm text-gray-600">
            {error || "Speaker details were not found."}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="w-full px-3 sm:px-4 lg:px-5 py-3">

        {/* =========================================
            BACK BUTTON
        ========================================== */}
        <div className="mb-3">
          <button
            type="button"
            onClick={() => navigate("/admin/speakers")}
            className="group inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all duration-200 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >
            <ArrowLeft
              className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            />

            <span>Back to Speakers</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

          <div className="h-1 bg-violet-600" />

          <div className="p-4 sm:p-5 lg:p-6">

            {/* =========================================
                SPEAKER HEADER
            ========================================== */}
            <div className="flex flex-col md:flex-row gap-5">

              <div className="shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">

                  {speaker.imageUrl ? (
                    <img
                      src={speaker.imageUrl}
                      alt={speaker.fullName || "Speaker"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserRound className="w-14 h-14 text-gray-300" />
                    </div>
                  )}

                </div>
              </div>

              <div className="flex-1 min-w-0">

                <div className="flex flex-wrap items-center gap-1.5 mb-2">

                  {speaker.status === "Active" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                      <XCircle className="w-3 h-3" />
                      {speaker.status || "Inactive"}
                    </span>
                  )}

                  {speaker.speakerType && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold">
                      <Award className="w-3 h-3" />
                      {speaker.speakerType}
                    </span>
                  )}

                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                  {speaker.fullName || "Unnamed Speaker"}
                </h1>

                {speaker.designation && (
                  <p className="mt-1 text-base font-medium text-violet-600">
                    {speaker.designation}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">

                  {speaker.organization && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{speaker.organization}</span>
                    </div>
                  )}

                  {speaker.country && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{speaker.country}</span>
                    </div>
                  )}

                </div>

                <div className="mt-4 flex flex-wrap gap-2">

                  {speaker.email && (
                    <a
                      href={`mailto:${speaker.email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </a>
                  )}

                  {speaker.linkedin && (
                    <a
                      href={speaker.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition"
                    >
                      LinkedIn
                    </a>
                  )}

                  {speaker.website && (
                    <a
                      href={speaker.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Website
                    </a>
                  )}

                </div>
              </div>
            </div>

            {/* =========================================
                ABOUT + SPEAKER INFORMATION
            ========================================== */}
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">

              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">

                  <div className="flex items-center gap-2 mb-3">
                    <UserRound className="w-4 h-4 text-violet-600" />

                    <h2 className="text-base font-semibold text-gray-900">
                      About Speaker
                    </h2>
                  </div>

                  <p className="text-sm leading-6 text-gray-600 whitespace-pre-line">
                    {speaker.bio || "No biography available."}
                  </p>

                </div>
              </div>

              <div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">

                  <h2 className="text-base font-semibold text-gray-900 mb-4">
                    Speaker Information
                  </h2>

                  <div className="space-y-3.5">

                    <div>
                      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                        Speaker Type
                      </p>

                      <p className="mt-0.5 text-sm font-medium text-gray-800">
                        {speaker.speakerType || "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                        Organization
                      </p>

                      <p className="mt-0.5 text-sm font-medium text-gray-800">
                        {speaker.organization || "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                        Country
                      </p>

                      <p className="mt-0.5 text-sm font-medium text-gray-800">
                        {speaker.country || "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                        Display Order
                      </p>

                      <p className="mt-0.5 text-sm font-medium text-gray-800">
                        {speaker.displayOrder ?? 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                        Status
                      </p>

                      <p className="mt-0.5 text-sm font-medium text-gray-800">
                        {speaker.status || "Not available"}
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* =========================================
                ASSIGNED CONFERENCE
            ========================================== */}
            <div className="mt-4">

              <div className="bg-white rounded-xl border border-gray-200 p-4">

                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays className="w-4 h-4 text-violet-600" />

                  <h2 className="text-base font-semibold text-gray-900">
                    Assigned Conference
                  </h2>
                </div>

                {conference ? (
                  <div className="rounded-xl bg-violet-50 border border-violet-100 p-4">

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                      <div>

                        <h3 className="text-base font-semibold text-gray-900">
                          {getConferenceTitle()}
                        </h3>

                        <div className="mt-2.5 flex flex-col gap-1.5">

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarDays className="w-3.5 h-3.5 text-violet-600" />

                            <span>
                              {getConferenceDate()}
                            </span>
                          </div>

                          {conference.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-3.5 h-3.5 text-violet-600" />

                              <span>
                                {conference.location}
                              </span>
                            </div>
                          )}

                          {conference.mode && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Globe className="w-3.5 h-3.5 text-violet-600" />

                              <span>
                                {conference.mode}
                              </span>
                            </div>
                          )}

                        </div>
                      </div>

                      {conference.status && (
                        <span className="w-fit px-2.5 py-1 rounded-full bg-white text-violet-700 text-xs font-semibold border border-violet-200">
                          {conference.status}
                        </span>
                      )}

                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">

                    <p className="text-sm text-gray-500">
                      No conference details available for this speaker.
                    </p>

                    {speaker.conferenceId && (
                      <p className="mt-1.5 text-xs text-gray-400 break-all">
                        Conference ID:{" "}
                        {typeof speaker.conferenceId === "object"
                          ? speaker.conferenceId._id
                          : speaker.conferenceId}
                      </p>
                    )}

                  </div>
                )}

              </div>
            </div>

            {/* =========================================
                CONTACT + RECORD INFORMATION
            ========================================== */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="bg-white rounded-xl border border-gray-200 p-4">

                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                  Contact Details
                </h2>

                <div className="space-y-2.5">

                  {speaker.email && (
                    <a
                      href={`mailto:${speaker.email}`}
                      className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-violet-600 transition"
                    >
                      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                        <Mail className="w-3.5 h-3.5 text-violet-600" />
                      </div>

                      <span className="break-all">
                        {speaker.email}
                      </span>
                    </a>
                  )}

                  {speaker.linkedin && (
                    <a
                      href={speaker.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-violet-600 transition"
                    >
                      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0" />

                      <span className="truncate">
                        LinkedIn Profile
                      </span>
                    </a>
                  )}

                  {speaker.website && (
                    <a
                      href={speaker.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-violet-600 transition"
                    >
                      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                        <Globe className="w-3.5 h-3.5 text-violet-600" />
                      </div>

                      <span className="truncate">
                        {speaker.website}
                      </span>
                    </a>
                  )}

                  {!speaker.email &&
                    !speaker.linkedin &&
                    !speaker.website && (
                      <p className="text-sm text-gray-500">
                        No contact information available.
                      </p>
                    )}

                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">

                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                  Record Information
                </h2>

                <div className="space-y-3">

                  <div>
                    <p className="text-[11px] text-gray-400">
                      Speaker ID
                    </p>

                    <p className="mt-0.5 text-xs font-mono text-gray-600 break-all">
                      {speaker._id ||
                        speaker.id ||
                        "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-gray-400">
                      Conference ID
                    </p>

                    <p className="mt-0.5 text-xs font-mono text-gray-600 break-all">
                      {typeof speaker.conferenceId === "object"
                        ? speaker.conferenceId._id
                        : speaker.conferenceId ||
                          "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-gray-400">
                      Created At
                    </p>

                    <p className="mt-0.5 text-sm text-gray-700">
                      {formatDate(speaker.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-gray-400">
                      Last Updated
                    </p>

                    <p className="mt-0.5 text-sm text-gray-700">
                      {formatDate(speaker.updatedAt)}
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakersDetailsPage;
