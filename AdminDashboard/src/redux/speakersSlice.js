
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createSpeakerApi,
  getSpeakersApi,
  getSpeakerByIdApi,
  getSpeakersByConferenceApi,
  updateSpeakerApi,
  deleteSpeakerApi,
  deleteAllSpeakersApi,
  deleteConferenceSpeakersApi,
} from "../api/speakerApis";

/* =========================================================
   CREATE SPEAKER
========================================================= */

export const createSpeaker = createAsyncThunk(
  "speaker/createSpeaker",
  async (speakerData, { rejectWithValue }) => {
    try {
      const response = await createSpeakerApi(speakerData);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create speaker"
      );
    }
  }
);


/* =========================================================
   GET ALL SPEAKERS
========================================================= */

export const getSpeakers = createAsyncThunk(
  "speaker/getSpeakers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSpeakersApi();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch speakers"
      );
    }
  }
);


/* =========================================================
   GET SPEAKER BY ID
========================================================= */

export const getSpeakerById = createAsyncThunk(
  "speaker/getSpeakerById",
  async (speakerId, { rejectWithValue }) => {
    try {
      const response =
        await getSpeakerByIdApi(speakerId);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch speaker"
      );
    }
  }
);


/* =========================================================
   GET SPEAKERS BY CONFERENCE
========================================================= */

export const getSpeakersByConference =
  createAsyncThunk(
    "speaker/getSpeakersByConference",
    async (conferenceId, { rejectWithValue }) => {
      try {
        const response =
          await getSpeakersByConferenceApi(
            conferenceId
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch conference speakers"
        );
      }
    }
  );


/* =========================================================
   UPDATE SPEAKER
========================================================= */

export const updateSpeaker = createAsyncThunk(
  "speaker/updateSpeaker",
  async (
    { speakerId, speakerData },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await updateSpeakerApi({
          speakerId,
          speakerData,
        });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update speaker"
      );
    }
  }
);


/* =========================================================
   DELETE SPEAKER
========================================================= */

export const deleteSpeaker = createAsyncThunk(
  "speaker/deleteSpeaker",
  async (speakerId, { rejectWithValue }) => {
    try {
      const response =
        await deleteSpeakerApi(speakerId);

      return {
        ...response.data,
        speakerId,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete speaker"
      );
    }
  }
);


/* =========================================================
   DELETE ALL SPEAKERS
========================================================= */

export const deleteAllSpeakers =
  createAsyncThunk(
    "speaker/deleteAllSpeakers",
    async (_, { rejectWithValue }) => {
      try {
        const response =
          await deleteAllSpeakersApi();

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Failed to delete all speakers"
        );
      }
    }
  );


/* =========================================================
   DELETE CONFERENCE SPEAKERS
========================================================= */

export const deleteConferenceSpeakers =
  createAsyncThunk(
    "speaker/deleteConferenceSpeakers",
    async (conferenceId, { rejectWithValue }) => {
      try {
        const response =
          await deleteConferenceSpeakersApi(
            conferenceId
          );

        return {
          ...response.data,
          conferenceId,
        };
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Failed to delete conference speakers"
        );
      }
    }
  );


/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  speakers: [],
  selectedSpeaker: null,

  conferenceSpeakers: [],

  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,

  error: null,
  success: false,
  message: "",
};


/* =========================================================
   SLICE
========================================================= */

const speakersSlice = createSlice({
  name: "speaker",

  initialState,

  reducers: {
    clearSpeakerError: (state) => {
      state.error = null;
    },

    clearSpeakerSuccess: (state) => {
      state.success = false;
      state.message = "";
    },

    clearSelectedSpeaker: (state) => {
      state.selectedSpeaker = null;
    },

    clearConferenceSpeakers: (state) => {
      state.conferenceSpeakers = [];
    },
  },

  extraReducers: (builder) => {
    /* =====================================================
       CREATE SPEAKER
    ===================================================== */

    builder
      .addCase(
        createSpeaker.pending,
        (state) => {
          state.createLoading = true;
          state.loading = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        createSpeaker.fulfilled,
        (state, action) => {
          state.createLoading = false;
          state.loading = false;
          state.success = true;

          state.message =
            action.payload?.message ||
            "Speaker created successfully";

          const speaker =
            action.payload?.data;

          if (speaker) {
            state.speakers.unshift(speaker);
          }
        }
      )

      .addCase(
        createSpeaker.rejected,
        (state, action) => {
          state.createLoading = false;
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to create speaker";
        }
      );


    /* =====================================================
       GET ALL SPEAKERS
    ===================================================== */

    builder
      .addCase(
        getSpeakers.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getSpeakers.fulfilled,
        (state, action) => {
          state.loading = false;

          state.speakers =
            action.payload?.data || [];

          state.message =
            action.payload?.message || "";
        }
      )

      .addCase(
        getSpeakers.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch speakers";
        }
      );


    /* =====================================================
       GET SPEAKER BY ID
    ===================================================== */

    builder
      .addCase(
        getSpeakerById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
          state.selectedSpeaker = null;
        }
      )

      .addCase(
        getSpeakerById.fulfilled,
        (state, action) => {
          state.loading = false;

          state.selectedSpeaker =
            action.payload?.data ||
            action.payload ||
            null;

          state.message =
            action.payload?.message || "";
        }
      )

      .addCase(
        getSpeakerById.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch speaker";
        }
      );


    /* =====================================================
       GET SPEAKERS BY CONFERENCE
    ===================================================== */

    builder
      .addCase(
        getSpeakersByConference.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getSpeakersByConference.fulfilled,
        (state, action) => {
          state.loading = false;

          state.conferenceSpeakers =
            action.payload?.data || [];

          state.message =
            action.payload?.message || "";
        }
      )

      .addCase(
        getSpeakersByConference.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch conference speakers";
        }
      );


    /* =====================================================
       UPDATE SPEAKER
    ===================================================== */

    builder
      .addCase(
        updateSpeaker.pending,
        (state) => {
          state.updateLoading = true;
          state.loading = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        updateSpeaker.fulfilled,
        (state, action) => {
          state.updateLoading = false;
          state.loading = false;
          state.success = true;

          state.message =
            action.payload?.message ||
            "Speaker updated successfully";

          const updatedSpeaker =
            action.payload?.data;

          if (updatedSpeaker?._id) {
            const index =
              state.speakers.findIndex(
                (speaker) =>
                  speaker._id ===
                  updatedSpeaker._id
              );

            if (index !== -1) {
              state.speakers[index] =
                updatedSpeaker;
            }
          }

          if (
            state.selectedSpeaker?._id ===
            updatedSpeaker?._id
          ) {
            state.selectedSpeaker =
              updatedSpeaker;
          }
        }
      )

      .addCase(
        updateSpeaker.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to update speaker";
        }
      );


    /* =====================================================
       DELETE SPEAKER
    ===================================================== */

    builder
      .addCase(
        deleteSpeaker.pending,
        (state) => {
          state.deleteLoading = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        deleteSpeaker.fulfilled,
        (state, action) => {
          state.deleteLoading = false;
          state.success = true;

          state.message =
            action.payload?.message ||
            "Speaker deleted successfully";

          const speakerId =
            action.payload?.speakerId;

          state.speakers =
            state.speakers.filter(
              (speaker) =>
                speaker._id !== speakerId
            );

          if (
            state.selectedSpeaker?._id ===
            speakerId
          ) {
            state.selectedSpeaker = null;
          }

          state.conferenceSpeakers =
            state.conferenceSpeakers.filter(
              (speaker) =>
                speaker._id !== speakerId
            );
        }
      )

      .addCase(
        deleteSpeaker.rejected,
        (state, action) => {
          state.deleteLoading = false;

          state.error =
            action.payload ||
            "Failed to delete speaker";
        }
      );


    /* =====================================================
       DELETE ALL SPEAKERS
    ===================================================== */

    builder
      .addCase(
        deleteAllSpeakers.pending,
        (state) => {
          state.deleteLoading = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        deleteAllSpeakers.fulfilled,
        (state, action) => {
          state.deleteLoading = false;
          state.success = true;

          state.message =
            action.payload?.message ||
            "All speakers deleted successfully";

          state.speakers = [];
          state.conferenceSpeakers = [];
          state.selectedSpeaker = null;
        }
      )

      .addCase(
        deleteAllSpeakers.rejected,
        (state, action) => {
          state.deleteLoading = false;

          state.error =
            action.payload ||
            "Failed to delete all speakers";
        }
      );


    /* =====================================================
       DELETE CONFERENCE SPEAKERS
    ===================================================== */

    builder
      .addCase(
        deleteConferenceSpeakers.pending,
        (state) => {
          state.deleteLoading = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        deleteConferenceSpeakers.fulfilled,
        (state, action) => {
          state.deleteLoading = false;
          state.success = true;

          state.message =
            action.payload?.message ||
            "Conference speakers deleted successfully";

          const conferenceId =
            action.payload?.conferenceId;

          state.speakers =
            state.speakers.filter(
              (speaker) =>
                String(
                  speaker?.conferenceId?._id ||
                    speaker?.conferenceId
                ) !== String(conferenceId)
            );

          state.conferenceSpeakers = [];
        }
      )

      .addCase(
        deleteConferenceSpeakers.rejected,
        (state, action) => {
          state.deleteLoading = false;

          state.error =
            action.payload ||
            "Failed to delete conference speakers";
        }
      );
  },
});


/* =========================================================
   EXPORT REDUCERS
========================================================= */

export const {
  clearSpeakerError,
  clearSpeakerSuccess,
  clearSelectedSpeaker,
  clearConferenceSpeakers,
} = speakersSlice.actions;


/* =========================================================
   EXPORT REDUCER
========================================================= */

export default speakersSlice.reducer;
