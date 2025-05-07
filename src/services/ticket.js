import axios from "axios";
import { ticketEndpoints } from "./apis";

export const fetchTicketByID = async ({ token, ticketId }) => {
  try {
    const response = await axios.get(
      `${ticketEndpoints.fetchOne}/${ticketId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.ticket;
  } catch (error) {
    console.log(error);
  }
};

export const reply = async ({ token, ticketId, reply }) => {
  try {
    await axios.post(
      `${ticketEndpoints.reply}/${ticketId}`,
      { reply },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const close = async ({ token, ticketId }, navigate) => {
  try {
    await axios.put(
      `${ticketEndpoints.close}/${ticketId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    navigate("/admin/tickets");
  } catch (error) {
    console.log(error);
  }
};
