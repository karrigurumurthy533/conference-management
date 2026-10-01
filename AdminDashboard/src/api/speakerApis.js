import axiosInstance from "../redux/axiosInstance";

export const createSpeakerApi = (speakerData) => {
  return axiosInstance.post(
    "/admin/speakers",
    speakerData
  );
};

export const getSpeakersApi = () => {
  return axiosInstance.get(
    "/admin/speakers"
  );
};

export const getSpeakerByIdApi = (id) => {
  return axiosInstance.get(
    `/admin/speakers/${id}`
  );
};

export const getSpeakersByConferenceApi = (
  conferenceId
) => {
  return axiosInstance.get(
    `/admin/speakers/conference/${conferenceId}`
  );
};

export const updateSpeakerApi = ({
  speakerId,
  speakerData,
}) => {
  return axiosInstance.put(
    `/admin/speakers/${speakerId}`,
    speakerData
  );
};

export const deleteSpeakerApi = (speakerId) => {
  return axiosInstance.delete(
    `/admin/speakers/${speakerId}`
  );
};

export const deleteAllSpeakersApi = () => {
  return axiosInstance.delete(
    "/admin/speakers"
  );
};

export const deleteConferenceSpeakersApi = (
  conferenceId
) => {
  return axiosInstance.delete(
    `/admin/speakers/conference/${conferenceId}`
  );
};