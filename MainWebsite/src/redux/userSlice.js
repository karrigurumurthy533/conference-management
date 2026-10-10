
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
  sendContactApi,
  subscribeApi,
  getAllReviewsApi
} from "../api/api";



// =====================================================
// GET ALL CONFERENCES
// =====================================================
export const getConferences = createAsyncThunk(
  "user/getConferences",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getConferencesApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch conferences"
      );
    }
  }
);

// =====================================================
// GET CONFERENCE BY ID
// =====================================================
export const getConferenceById = createAsyncThunk(
  "user/getConferenceById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getConferenceByIdApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch conference"
      );
    }
  }
);

// =====================================================
// GET ALL SPEAKERS
// =====================================================
export const getSpeakers = createAsyncThunk(
  "user/getSpeakers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSpeakersApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch speakers"
      );
    }
  }
);

// =====================================================
// GET SPEAKER BY ID
// =====================================================
export const getSpeakerById = createAsyncThunk(
  "user/getSpeakerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getSpeakerByIdApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch speaker"
      );
    }
  }
);

// =====================================================
// GET SPEAKERS BY CONFERENCE
// =====================================================
export const getSpeakersByConference = createAsyncThunk(
  "user/getSpeakersByConference",
  async (conferenceId, { rejectWithValue }) => {
    try {
      const response =
        await getSpeakersByConferenceApi(conferenceId);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch conference speakers"
      );
    }
  }
);

// =====================================================
// CREATE REGISTRATION
// =====================================================
export const createRegistration = createAsyncThunk(
  "user/createRegistration",
  async (data, { rejectWithValue }) => {
    try {
      return await createRegistrationApi(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  }
);

// =====================================================
// GET REGISTRATION BY ID
// =====================================================
export const getRegistrationById = createAsyncThunk(
  "user/getRegistrationById",
  async (id, { rejectWithValue }) => {
    try {
      return await getRegistrationByIdApi(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch registration"
      );
    }
  }
);

// =====================================================
// CREATE BROCHURE REQUEST
// =====================================================
export const createDownloadBrochure = createAsyncThunk(
  "user/createDownloadBrochure",
  async (data, { rejectWithValue }) => {
    try {
      return await createDownloadBrochureApi(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Brochure request failed"
      );
    }
  }
);

// =====================================================
// CREATE ABSTRACT
// =====================================================
export const createAbstract = createAsyncThunk(
  "user/createAbstract",
  async (data, { rejectWithValue }) => {
    try {
      return await createAbstractApi(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Abstract submission failed"
      );
    }
  }
);

// =====================================================
// SEND CONTACT MESSAGE
// =====================================================
export const sendContact = createAsyncThunk(
  "user/sendContact",
  async (data, { rejectWithValue }) => {
    try {
      return await sendContactApi(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to send contact message"
      );
    }
  }
);

// =====================================================
// SUBSCRIBE TO CONFERENCE
// =====================================================
export const subscribe = createAsyncThunk(
  "user/subscribe",
  async (data, { rejectWithValue }) => {
    try {
      return await subscribeApi(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to subscribe"
      );
    }
  }
);

// =====================================================
// GET ALL REVIEWS
// =====================================================
export const getAllReviews = createAsyncThunk(
  "user/getAllReviews",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getAllReviewsApi(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch reviews"
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================
const initialState = {
  // Conferences
  conferences: [],
  conference: null,
  conferenceLoading: false,
  conferenceError: null,

  // Speakers
  speakers: [],
  speaker: null,
  conferenceSpeakers: [],
  speakerLoading: false,
  speakerError: null,

  // Registration
  registration: null,
  registrationLoading: false,
  registrationError: null,
  registrationSuccess: false,

  registrationDetails: null,
  registrationDetailsLoading: false,
  registrationDetailsError: null,

  // Brochure
  brochure: null,
  brochureLoading: false,
  brochureError: null,
  brochureSuccess: false,

  // Abstract
  abstract: null,
  abstractLoading: false,
  abstractError: null,
  abstractSuccess: false,

  // Contact
  contact: null,
  contactLoading: false,
  contactError: null,
  contactSuccess: false,

  // Subscribe
  subscribeData: null,
  subscribeLoading: false,
  subscribeError: null,
  subscribeSuccess: false,

  // Reviews
  reviews: [],
  reviewsPagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  reviewsLoading: false,
  reviewsError: null,
};

// =====================================================
// USER SLICE
// =====================================================
const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    // CLEAR CONFERENCE
    clearConference: (state) => {
      state.conference = null;
    },

    // CLEAR SPEAKER
    clearSpeaker: (state) => {
      state.speaker = null;
    },

    // CLEAR REGISTRATION
    clearRegistration: (state) => {
      state.registration = null;
      state.registrationLoading = false;
      state.registrationError = null;
      state.registrationSuccess = false;
    },

    // CLEAR REGISTRATION DETAILS
    clearRegistrationDetails: (state) => {
      state.registrationDetails = null;
      state.registrationDetailsLoading = false;
      state.registrationDetailsError = null;
    },

    // CLEAR BROCHURE
    clearBrochure: (state) => {
      state.brochure = null;
      state.brochureLoading = false;
      state.brochureError = null;
      state.brochureSuccess = false;
    },

    // CLEAR ABSTRACT
    clearAbstract: (state) => {
      state.abstract = null;
      state.abstractLoading = false;
      state.abstractError = null;
      state.abstractSuccess = false;
    },

    // CLEAR CONTACT
    clearContact: (state) => {
      state.contact = null;
      state.contactLoading = false;
      state.contactError = null;
      state.contactSuccess = false;
    },

    // CLEAR SUBSCRIBE
    clearSubscribe: (state) => {
      state.subscribeData = null;
      state.subscribeLoading = false;
      state.subscribeError = null;
      state.subscribeSuccess = false;
    },

    // CLEAR REVIEWS
    clearReviews: (state) => {
      state.reviews = [];
      state.reviewsPagination = {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
      state.reviewsLoading = false;
      state.reviewsError = null;
    },

    // CLEAR EVERYTHING
    clearUserState: (state) => {
      state.conferences = [];
      state.conference = null;
      state.conferenceLoading = false;
      state.conferenceError = null;

      state.speakers = [];
      state.speaker = null;
      state.conferenceSpeakers = [];
      state.speakerLoading = false;
      state.speakerError = null;

      state.registration = null;
      state.registrationLoading = false;
      state.registrationError = null;
      state.registrationSuccess = false;

      state.registrationDetails = null;
      state.registrationDetailsLoading = false;
      state.registrationDetailsError = null;

      state.brochure = null;
      state.brochureLoading = false;
      state.brochureError = null;
      state.brochureSuccess = false;

      state.abstract = null;
      state.abstractLoading = false;
      state.abstractError = null;
      state.abstractSuccess = false;

      state.contact = null;
      state.contactLoading = false;
      state.contactError = null;
      state.contactSuccess = false;

      state.subscribeData = null;
      state.subscribeLoading = false;
      state.subscribeError = null;
      state.subscribeSuccess = false;

      state.reviews = [];
      state.reviewsPagination = {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
      state.reviewsLoading = false;
      state.reviewsError = null;
    },
  },

  // =====================================================
  // EXTRA REDUCERS
  // =====================================================
  extraReducers: (builder) => {
    builder

      // CONFERENCES
      .addCase(getConferences.pending, (state) => {
        state.conferenceLoading = true;
        state.conferenceError = null;
      })

      .addCase(getConferences.fulfilled, (state, action) => {
        state.conferenceLoading = false;
        state.conferences =
          action.payload?.data ||
          action.payload ||
          [];
        state.conferenceError = null;
      })

      .addCase(getConferences.rejected, (state, action) => {
        state.conferenceLoading = false;
        state.conferenceError =
          action.payload || "Failed to fetch conferences";
      })

      // CONFERENCE BY ID
      .addCase(getConferenceById.pending, (state) => {
        state.conferenceLoading = true;
        state.conferenceError = null;
        state.conference = null;
      })

      .addCase(getConferenceById.fulfilled, (state, action) => {
        state.conferenceLoading = false;
        state.conference =
          action.payload?.data ||
          action.payload;
        state.conferenceError = null;
      })

      .addCase(getConferenceById.rejected, (state, action) => {
        state.conferenceLoading = false;
        state.conferenceError =
          action.payload || "Failed to fetch conference";
      })

      // SPEAKERS
      .addCase(getSpeakers.pending, (state) => {
        state.speakerLoading = true;
        state.speakerError = null;
      })

      .addCase(getSpeakers.fulfilled, (state, action) => {
        state.speakerLoading = false;
        state.speakers =
          action.payload?.data ||
          action.payload ||
          [];
        state.speakerError = null;
      })

      .addCase(getSpeakers.rejected, (state, action) => {
        state.speakerLoading = false;
        state.speakerError =
          action.payload || "Failed to fetch speakers";
      })

      // SPEAKER BY ID
      .addCase(getSpeakerById.pending, (state) => {
        state.speakerLoading = true;
        state.speakerError = null;
        state.speaker = null;
      })

      .addCase(getSpeakerById.fulfilled, (state, action) => {
        state.speakerLoading = false;
        state.speaker =
          action.payload?.data ||
          action.payload;
        state.speakerError = null;
      })

      .addCase(getSpeakerById.rejected, (state, action) => {
        state.speakerLoading = false;
        state.speakerError =
          action.payload || "Failed to fetch speaker";
      })

      // SPEAKERS BY CONFERENCE
      .addCase(getSpeakersByConference.pending, (state) => {
        state.speakerLoading = true;
        state.speakerError = null;
      })

      .addCase(
        getSpeakersByConference.fulfilled,
        (state, action) => {
          state.speakerLoading = false;
          state.conferenceSpeakers =
            action.payload?.data ||
            action.payload ||
            [];
          state.speakerError = null;
        }
      )

      .addCase(
        getSpeakersByConference.rejected,
        (state, action) => {
          state.speakerLoading = false;
          state.speakerError =
            action.payload ||
            "Failed to fetch conference speakers";
        }
      )

      // CREATE REGISTRATION
      .addCase(createRegistration.pending, (state) => {
        state.registrationLoading = true;
        state.registrationError = null;
        state.registrationSuccess = false;
      })

      .addCase(
        createRegistration.fulfilled,
        (state, action) => {
          state.registrationLoading = false;
          state.registration = action.payload;
          state.registrationSuccess = true;
          state.registrationError = null;
        }
      )

      .addCase(
        createRegistration.rejected,
        (state, action) => {
          state.registrationLoading = false;
          state.registrationError =
            action.payload || "Registration failed";
          state.registrationSuccess = false;
        }
      )

      // REGISTRATION DETAILS
      .addCase(getRegistrationById.pending, (state) => {
        state.registrationDetailsLoading = true;
        state.registrationDetailsError = null;
        state.registrationDetails = null;
      })

      .addCase(
        getRegistrationById.fulfilled,
        (state, action) => {
          state.registrationDetailsLoading = false;
          state.registrationDetails =
            action.payload?.data ||
            action.payload;
          state.registrationDetailsError = null;
        }
      )

      .addCase(
        getRegistrationById.rejected,
        (state, action) => {
          state.registrationDetailsLoading = false;
          state.registrationDetailsError =
            action.payload || "Failed to fetch registration";
          state.registrationDetails = null;
        }
      )

      // BROCHURE
      .addCase(createDownloadBrochure.pending, (state) => {
        state.brochureLoading = true;
        state.brochureError = null;
        state.brochureSuccess = false;
      })

      .addCase(
        createDownloadBrochure.fulfilled,
        (state, action) => {
          state.brochureLoading = false;
          state.brochure = action.payload;
          state.brochureSuccess = true;
          state.brochureError = null;
        }
      )

      .addCase(
        createDownloadBrochure.rejected,
        (state, action) => {
          state.brochureLoading = false;
          state.brochureError =
            action.payload || "Brochure request failed";
          state.brochureSuccess = false;
        }
      )

      // ABSTRACT
      .addCase(createAbstract.pending, (state) => {
        state.abstractLoading = true;
        state.abstractError = null;
        state.abstractSuccess = false;
      })

      .addCase(createAbstract.fulfilled, (state, action) => {
        state.abstractLoading = false;
        state.abstract = action.payload;
        state.abstractSuccess = true;
        state.abstractError = null;
      })

      .addCase(createAbstract.rejected, (state, action) => {
        state.abstractLoading = false;
        state.abstractError =
          action.payload || "Abstract submission failed";
        state.abstractSuccess = false;
      })

      // CONTACT
      .addCase(sendContact.pending, (state) => {
        state.contactLoading = true;
        state.contactError = null;
        state.contactSuccess = false;
        state.contact = null;
      })

      .addCase(sendContact.fulfilled, (state, action) => {
        state.contactLoading = false;
        state.contact = action.payload;
        state.contactSuccess = true;
        state.contactError = null;
      })

      .addCase(sendContact.rejected, (state, action) => {
        state.contactLoading = false;
        state.contactError =
          action.payload || "Failed to send contact message";
        state.contactSuccess = false;
        state.contact = null;
      })

      // SUBSCRIBE
      .addCase(subscribe.pending, (state) => {
        state.subscribeLoading = true;
        state.subscribeError = null;
        state.subscribeSuccess = false;
        state.subscribeData = null;
      })

      .addCase(subscribe.fulfilled, (state, action) => {
        state.subscribeLoading = false;
        state.subscribeData =
          action.payload?.data ||
          action.payload;
        state.subscribeSuccess = true;
        state.subscribeError = null;
      })

      .addCase(subscribe.rejected, (state, action) => {
        state.subscribeLoading = false;
        state.subscribeError =
          action.payload || "Failed to subscribe";
        state.subscribeSuccess = false;
        state.subscribeData = null;
      })

      // GET ALL REVIEWS
      .addCase(getAllReviews.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })

      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;

        const response = action.payload;

        if (Array.isArray(response?.data)) {
          state.reviews = response.data;
        } else if (Array.isArray(response?.data?.data)) {
          state.reviews = response.data.data;
        } else if (Array.isArray(response)) {
          state.reviews = response;
        } else {
          state.reviews = [];
        }

        state.reviewsPagination =
          response?.pagination ||
          response?.data?.pagination || {
            total: state.reviews.length,
            page: 1,
            limit: state.reviews.length || 10,
            totalPages: state.reviews.length ? 1 : 0,
          };

        state.reviewsError = null;
      })

      .addCase(getAllReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError =
          action.payload || "Failed to fetch reviews";
      });
  },
});

// =====================================================
// EXPORT ACTIONS
// =====================================================
export const {
  clearConference,
  clearSpeaker,
  clearRegistration,
  clearRegistrationDetails,
  clearBrochure,
  clearAbstract,
  clearContact,
  clearSubscribe,
  clearReviews,
  clearUserState,
} = userSlice.actions;

// =====================================================
// EXPORT REDUCER
// =====================================================
export default userSlice.reducer;
