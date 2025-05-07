import axios from "axios";
import { adminEndpoints, eventEndpoints } from "./apis";
import {
  setApproved,
  setAttendees,
  setRequests,
} from "@/store/slices/adminSlice";

export const getRequests = ({ token }) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(eventEndpoints.getEventRequests, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setRequests(response.data.requests[0]));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getApproved = ({ token }) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(eventEndpoints.getEventApproved, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setApproved(response.data.approved[0]));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getAttendees = ({ token }) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(eventEndpoints.getEventAttendees, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setAttendees(response.data.attendees[0]));
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchUserById = async ({ userId, token }) => {
  try {
    const response = await axios.get(`${eventEndpoints.fetchUser}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.user;
  } catch (error) {
    console.log(error);
  }
};

export const approveRequest = async ({ userId, eventId, token }) => {
  try {
    await axios.post(
      `${adminEndpoints.approve}/${eventId}`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

export const rejectRequest = async ({ userId, eventId, token }) => {
  try {
    await axios.post(
      `${adminEndpoints.reject}/${eventId}`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

export const approveAllReq = async ({ userId, token, setLoading }) => {
  try {
    setLoading(true);
    await axios.post(
      adminEndpoints.approveAll,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.location.reload();
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

export const rejectAllReq = async ({ userId, token, setLoading }) => {
  try {
    setLoading(true);
    await axios.post(
      adminEndpoints.rejectAll,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.location.reload();
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

export const approveAllDay0 = async ({ userId, token, setLoading }) => {
  try {
    setLoading(true);
    await axios.post(
      adminEndpoints.approveDay0,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.location.reload();
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

export const approveAll10x = async ({ userId, token, setLoading }) => {
  try {
    setLoading(true);
    await axios.post(
      adminEndpoints.approve10x,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.location.reload();
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

export const approveAll100x = async ({ userId, token, setLoading }) => {
  try {
    setLoading(true);
    await axios.post(
      adminEndpoints.approve100x,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.location.reload();
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
