
import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getConferencesApi,
  getConferenceByIdApi,
  getSpeakersApi,
  getSpeakerByIdApi,
  getSpeakersByConferenceApi,
  createRegistrationApi,
  getRegistrationByIdApi,
  createDownloadBrochureApi,
  createAbstractApi,
} from "../api/api";

export const getConferences =
  createAsyncThunk(
    "user/getConferences",
    async (_, { rejectWithValue }) => {
      try {
        const response =
          await getConferencesApi();

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch conferences"
        );
      }
    }
  );

export const getConferenceById =
  createAsyncThunk(
    "user/getConferenceById",
    async (id, { rejectWithValue }) => {
      try {
        const response =
          await getConferenceByIdApi(id);

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch conference"
        );
      }
    }
  );

export const getSpeakers =
  createAsyncThunk(
    "user/getSpeakers",
    async (_, { rejectWithValue }) => {
      try {
        const response =
          await getSpeakersApi();

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch speakers"
        );
      }
    }
  );

export const getSpeakerById =
  createAsyncThunk(
    "user/getSpeakerById",
    async (id, { rejectWithValue }) => {
      try {
        const response =
          await getSpeakerByIdApi(id);

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch speaker"
        );
      }
    }
  );

export const getSpeakersByConference =
  createAsyncThunk(
    "user/getSpeakersByConference",
    async (
      conferenceId,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await getSpeakersByConferenceApi(
            conferenceId
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch conference speakers"
        );
      }
    }
  );

export const createRegistration =
  createAsyncThunk(
    "user/createRegistration",
    async (data, { rejectWithValue }) => {
      try {
        const response =
          await createRegistrationApi(data);

        return response;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Registration failed"
        );
      }
    }
  );

export const getRegistrationById =
  createAsyncThunk(
    "user/getRegistrationById",
    async (id, { rejectWithValue }) => {
      try {
        const response =
          await getRegistrationByIdApi(id);

        return response;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch registration"
        );
      }
    }
  );

export const createDownloadBrochure =
  createAsyncThunk(
    "user/createDownloadBrochure",
    async (data, { rejectWithValue }) => {
      try {
        const response =
          await createDownloadBrochureApi(data);

        return response;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Brochure request failed"
        );
      }
    }
  );

export const createAbstract =
  createAsyncThunk(
    "user/createAbstract",
    async (data, { rejectWithValue }) => {
      try {
        const response =
          await createAbstractApi(data);

        return response;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Abstract submission failed"
        );
      }
    }
  );

const initialState = {
  conferences: [],
  conference: null,
  speakers: [],
  speaker: null,
  conferenceSpeakers: [],

  conferenceLoading: false,
  conferenceError: null,

  speakerLoading: false,
  speakerError: null,

  registration: null,
  registrationLoading: false,
  registrationError: null,
  registrationSuccess: false,

  registrationDetails: null,
  registrationDetailsLoading: false,
  registrationDetailsError: null,

  brochure: null,
  brochureLoading: false,
  brochureError: null,
  brochureSuccess: false,

  abstract: null,
  abstractLoading: false,
  abstractError: null,
  abstractSuccess: false,
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    clearConference: (state) => {
      state.conference = null;
    },

    clearSpeaker: (state) => {
      state.speaker = null;
    },

    clearRegistration: (state) => {
      state.registration = null;
      state.registrationLoading = false;
      state.registrationError = null;
      state.registrationSuccess = false;
    },

    clearRegistrationDetails: (
      state
    ) => {
      state.registrationDetails = null;
      state.registrationDetailsLoading =
        false;
      state.registrationDetailsError = null;
    },

    clearBrochure: (state) => {
      state.brochure = null;
      state.brochureLoading = false;
      state.brochureError = null;
      state.brochureSuccess = false;
    },

    clearAbstract: (state) => {
      state.abstract = null;
      state.abstractLoading = false;
      state.abstractError = null;
      state.abstractSuccess = false;
    },

    clearUserState: (state) => {
      state.conferences = [];
      state.conference = null;
      state.speakers = [];
      state.speaker = null;
      state.conferenceSpeakers = [];

      state.conferenceLoading = false;
      state.conferenceError = null;

      state.speakerLoading = false;
      state.speakerError = null;

      state.registration = null;
      state.registrationLoading = false;
      state.registrationError = null;
      state.registrationSuccess = false;

      state.registrationDetails = null;
      state.registrationDetailsLoading =
        false;
      state.registrationDetailsError = null;

      state.brochure = null;
      state.brochureLoading = false;
      state.brochureError = null;
      state.brochureSuccess = false;

      state.abstract = null;
      state.abstractLoading = false;
      state.abstractError = null;
      state.abstractSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        getConferences.pending,
        (state) => {
          state.conferenceLoading = true;
          state.conferenceError = null;
        }
      )

      .addCase(
        getConferences.fulfilled,
        (state, action) => {
          state.conferenceLoading = false;

          state.conferences =
            action.payload?.data ||
            action.payload ||
            [];
        }
      )

      .addCase(
        getConferences.rejected,
        (state, action) => {
          state.conferenceLoading = false;
          state.conferenceError =
            action.payload;
        }
      )

      .addCase(
        getConferenceById.pending,
        (state) => {
          state.conferenceLoading = true;
          state.conferenceError = null;
          state.conference = null;
        }
      )

      .addCase(
        getConferenceById.fulfilled,
        (state, action) => {
          state.conferenceLoading = false;

          state.conference =
            action.payload?.data ||
            action.payload;
        }
      )

      .addCase(
        getConferenceById.rejected,
        (state, action) => {
          state.conferenceLoading = false;
          state.conferenceError =
            action.payload;
        }
      )

      .addCase(
        getSpeakers.pending,
        (state) => {
          state.speakerLoading = true;
          state.speakerError = null;
        }
      )

      .addCase(
        getSpeakers.fulfilled,
        (state, action) => {
          state.speakerLoading = false;

          state.speakers =
            action.payload?.data ||
            action.payload ||
            [];
        }
      )

      .addCase(
        getSpeakers.rejected,
        (state, action) => {
          state.speakerLoading = false;
          state.speakerError =
            action.payload;
        }
      )

      .addCase(
        getSpeakerById.pending,
        (state) => {
          state.speakerLoading = true;
          state.speakerError = null;
          state.speaker = null;
        }
      )

      .addCase(
        getSpeakerById.fulfilled,
        (state, action) => {
          state.speakerLoading = false;

          state.speaker =
            action.payload?.data ||
            action.payload;
        }
      )

      .addCase(
        getSpeakerById.rejected,
        (state, action) => {
          state.speakerLoading = false;
          state.speakerError =
            action.payload;
        }
      )

      .addCase(
        getSpeakersByConference.pending,
        (state) => {
          state.speakerLoading = true;
          state.speakerError = null;
        }
      )

      .addCase(
        getSpeakersByConference.fulfilled,
        (state, action) => {
          state.speakerLoading = false;

          state.conferenceSpeakers =
            action.payload?.data ||
            action.payload ||
            [];
        }
      )

      .addCase(
        getSpeakersByConference.rejected,
        (state, action) => {
          state.speakerLoading = false;
          state.speakerError =
            action.payload;
        }
      )

      .addCase(
        createRegistration.pending,
        (state) => {
          state.registrationLoading = true;
          state.registrationError = null;
          state.registrationSuccess = false;
        }
      )

      .addCase(
        createRegistration.fulfilled,
        (state, action) => {
          state.registrationLoading = false;
          state.registration =
            action.payload;
          state.registrationSuccess = true;
          state.registrationError = null;
        }
      )

      .addCase(
        createRegistration.rejected,
        (state, action) => {
          state.registrationLoading = false;

          state.registrationError =
            action.payload ||
            "Registration failed";

          state.registrationSuccess = false;
        }
      )

      .addCase(
        getRegistrationById.pending,
        (state) => {
          state.registrationDetailsLoading =
            true;

          state.registrationDetailsError =
            null;

          state.registrationDetails =
            null;
        }
      )

      .addCase(
        getRegistrationById.fulfilled,
        (state, action) => {
          state.registrationDetailsLoading =
            false;

          state.registrationDetails =
            action.payload?.data ||
            action.payload;

          state.registrationDetailsError =
            null;
        }
      )

      .addCase(
        getRegistrationById.rejected,
        (state, action) => {
          state.registrationDetailsLoading =
            false;

          state.registrationDetailsError =
            action.payload ||
            "Failed to fetch registration";

          state.registrationDetails = null;
        }
      )

      .addCase(
        createDownloadBrochure.pending,
        (state) => {
          state.brochureLoading = true;
          state.brochureError = null;
          state.brochureSuccess = false;
        }
      )

      .addCase(
        createDownloadBrochure.fulfilled,
        (state, action) => {
          state.brochureLoading = false;
          state.brochure =
            action.payload;
          state.brochureSuccess = true;
          state.brochureError = null;
        }
      )

      .addCase(
        createDownloadBrochure.rejected,
        (state, action) => {
          state.brochureLoading = false;

          state.brochureError =
            action.payload ||
            "Brochure request failed";

          state.brochureSuccess = false;
        }
      )

      .addCase(
        createAbstract.pending,
        (state) => {
          state.abstractLoading = true;
          state.abstractError = null;
          state.abstractSuccess = false;
        }
      )

      .addCase(
        createAbstract.fulfilled,
        (state, action) => {
          state.abstractLoading = false;
          state.abstract =
            action.payload;
          state.abstractSuccess = true;
          state.abstractError = null;
        }
      )

      .addCase(
        createAbstract.rejected,
        (state, action) => {
          state.abstractLoading = false;

          state.abstractError =
            action.payload ||
            "Abstract submission failed";

          state.abstractSuccess = false;
        }
      );
  },
});

export const {
  clearConference,
  clearSpeaker,
  clearRegistration,
  clearRegistrationDetails,
  clearBrochure,
  clearAbstract,
  clearUserState,
} = userSlice.actions;

export default userSlice.reducer;
