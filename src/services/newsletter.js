import axios from "axios";
import { newsletterEndpoints } from "./apis";

export const newsletter = async ({ token }) => {
  try {
    const response = await axios.get(newsletterEndpoints.ALL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data.newsletterUsers;
  } catch (error) {
    console.log(error);
  }
};
