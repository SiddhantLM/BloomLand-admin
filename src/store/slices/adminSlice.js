import {
  adminEndpoints,
  blogEndpoints,
  ticketEndpoints,
} from "@/services/apis";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  requests: null,
  approved: null,
  attendees: null,
  events: [],
  tickets: [],
  blogs: [],
  isLoading: false,
  error: null,
};

// export const getRequests = createAsyncThunk(
//   "admin/getRequests",
//   async (_, { getState }) => {
//     const { token } = getState().auth;
//     const response = await axios.get(eventEndpoints.getEventRequests, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data.requests;
//   }
// );

// export const getApproved = createAsyncThunk(
//   "admin/getApproved",
//   async (_, { getState }) => {
//     const { token } = getState().auth;
//     const response = await axios.get(eventEndpoints.getEventRequests, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data.approved;
//   }
// );

// export const getAttendees = createAsyncThunk(
//   "admin/getApproved",
//   async (_, { getState }) => {
//     const { token } = getState().auth;
//     const response = await axios.get(eventEndpoints.getEventRequests, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data.attendees;
//   }
// );

export const getEvents = createAsyncThunk(
  "admin/getEvents",
  async (_, { getState }) => {
    const { token } = getState().auth;
    const response = await axios.get(adminEndpoints.getEvents, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data);
    return response.data.events;
  }
);

export const getTickets = createAsyncThunk(
  "admin/getTickets",
  async (_, { getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(ticketEndpoints.fetchAll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.tickets;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getBlogs = createAsyncThunk(
  "admin/getBlogs",
  async (_, { getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(blogEndpoints.fetchAll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data);
      return response.data.blogs;
    } catch (error) {
      console.log(error);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
    setAttendees: (state, action) => {
      state.attendees = action.payload;
    },
    setApproved: (state, action) => {
      state.approved = action.payload;
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    //REQUESTS ALL USERS
    // builder.addCase(getRequests.pending, (state) => {
    //   state.isLoading = true;
    // });
    // builder.addCase(getRequests.fulfilled, (state, action) => {
    //   state.users.requested = action.payload;
    //   state.isLoading = false;
    // });
    // builder.addCase(getRequests.rejected, (state, action) => {
    //   state.error = action.payload;
    // });

    // //APPROVED ALL USERS
    // builder.addCase(getApproved.pending, (state) => {
    //   state.isLoading = true;
    // });
    // builder.addCase(getApproved.fulfilled, (state, action) => {
    //   state.users.approved = action.payload;
    //   state.isLoading = false;
    // });
    // builder.addCase(getApproved.rejected, (state, action) => {
    //   state.error = action.payload;
    // });

    // //ATTENDEES ALL USERS
    // builder.addCase(getAttendees.pending, (state) => {
    //   state.isLoading = true;
    // });
    // builder.addCase(getAttendees.fulfilled, (state, action) => {
    //   state.users.attendees = action.payload;
    //   state.isLoading = false;
    // });
    // builder.addCase(getAttendees.rejected, (state, action) => {
    //   state.error = action.payload;
    // });

    builder.addCase(getEvents.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getEvents.fulfilled, (state, action) => {
      state.events = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getEvents.rejected, (state, action) => {
      state.error = action.payload;
    });

    builder.addCase(getTickets.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getTickets.fulfilled, (state, action) => {
      state.tickets = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getTickets.rejected, (state, action) => {
      state.error = action.payload;
    });

    builder.addCase(getBlogs.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getBlogs.fulfilled, (state, action) => {
      state.blogs = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getBlogs.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export const {
  setRequests,
  setApproved,
  setAttendees,
  setEvents,
  setError,
  setLoading,
} = adminSlice.actions;
export default adminSlice.reducer;
