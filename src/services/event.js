import axios from "axios";
import { eventEndpoints } from "./apis";
import { getEvents } from "@/store/slices/adminSlice";

export const addEvent = ({ event, token }) => {
  return async (dispatch) => {
    try {
      await axios.post(eventEndpoints.addEvent, event, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(getEvents());
    } catch (error) {
      console.log(error);
    }
  };
};

export const getEventById = async (id) => {
  try {
    console.log(eventEndpoints.getEventById + id);
    const response = await axios.get(eventEndpoints.getEventById + id);
    return response.data.event;
  } catch (error) {
    console.log(error);
  }
};

export const updateEvent = async ({ event, token, setEvent, eventId }) => {
  try {
    const response = await axios.put(
      eventEndpoints.updateEvent + eventId,
      event,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setEvent(response.data.event);
  } catch (error) {
    console.log(error);
  }
};

export const deleteEvent = async ({ eventId, token, navigate }) => {
  try {
    await axios.delete(`${eventEndpoints.deleteEvent}/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    navigate("/admin/events");
  } catch (error) {
    console.log(error);
  }
};
