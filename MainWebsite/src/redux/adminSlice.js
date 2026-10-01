import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createConferenceApi,
  getConferencesApi,
  getConferenceByIdApi,
  getSpeakersApi,
  getSpeakerByIdApi,
  getSpeakersByConferenceApi,
  createRegistrationApi,
  createDownloadBrochureApi,
  createAbstractApi,
} from "../api/api";

export const createConference = createAsyncThunk(
  "admin/createConference",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createConferenceApi(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create conference"
      );
    }
  }
);

export const getConferences = createAsyncThunk(
  "admin/getConferences",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getConferencesApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch conferences"
      );
    }
  }
);

export const getConferenceById = createAsyncThunk(
  "admin/getConferenceById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getConferenceByIdApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch conference"
      );
    }
  }
);

export const getSpeakers = createAsyncThunk(
  "admin/getSpeakers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSpeakersApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch speakers"
      );
    }
  }
);

export const getSpeakerById = createAsyncThunk(
  "admin/getSpeakerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getSpeakerByIdApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch speaker"
      );
    }
  }
);

export const getSpeakersByConference = createAsyncThunk(
  "admin/getSpeakersByConference",
  async (conferenceId, { rejectWithValue }) => {
    try {
      const response = await getSpeakersByConferenceApi(conferenceId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch conference speakers"
      );
    }
  }
);

export const createRegistration = createAsyncThunk(
  "admin/createRegistration",
  async (data, { rejectWithValue }) => {
    try {
      return await createRegistrationApi(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create registration"
      );
    }
  }
);

export const createDownloadBrochure = createAsyncThunk(
  "admin/createDownloadBrochure",
  async (data, { rejectWithValue }) => {
    try {
      return await createDownloadBrochureApi(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to download brochure"
      );
    }
  }
);

export const createAbstract = createAsyncThunk(
  "admin/createAbstract",
  async (data, { rejectWithValue }) => {
    try {
      return await createAbstractApi(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to submit abstract"
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
  registration: null,
  brochureDownload: null,
  abstract: null,
  loading: false,
  error: null,
  success: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },

    clearAdminSuccess: (state) => {
      state.success = false;
    },

    clearSelectedConference: (state) => {
      state.conference = null;
    },

    clearSelectedSpeaker: (state) => {
      state.speaker = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createConference.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createConference.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.conferences.unshift(action.payload);
      })

      .addCase(createConference.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getConferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getConferences.fulfilled, (state, action) => {
        state.loading = false;
        state.conferences = action.payload?.data || action.payload || [];
      })

      .addCase(getConferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getConferenceById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.conference = null;
      })

      .addCase(getConferenceById.fulfilled, (state, action) => {
        state.loading = false;
        state.conference = action.payload?.data || action.payload;
      })

      .addCase(getConferenceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSpeakers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSpeakers.fulfilled, (state, action) => {
        state.loading = false;
        state.speakers = action.payload?.data || action.payload || [];
      })

      .addCase(getSpeakers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSpeakerById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.speaker = null;
      })

      .addCase(getSpeakerById.fulfilled, (state, action) => {
        state.loading = false;
        state.speaker = action.payload?.data || action.payload;
      })

      .addCase(getSpeakerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSpeakersByConference.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSpeakersByConference.fulfilled, (state, action) => {
        state.loading = false;
        state.conferenceSpeakers =
          action.payload?.data || action.payload || [];
      })

      .addCase(getSpeakersByConference.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.registration = action.payload;
      })

      .addCase(createRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createDownloadBrochure.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createDownloadBrochure.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.brochureDownload = action.payload;
      })

      .addCase(createDownloadBrochure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createAbstract.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createAbstract.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.abstract = action.payload;
      })

      .addCase(createAbstract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAdminError,
  clearAdminSuccess,
  clearSelectedConference,
  clearSelectedSpeaker,
} = adminSlice.actions;

export default adminSlice.reducer;