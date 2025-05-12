import axios from "axios";
import { invoiceEndpoints } from "./apis";
export const getAllInvoices = async ({ token }) => {
  try {
    const response = await axios.get(invoiceEndpoints.ALL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.invoices;
  } catch (error) {
    console.log(error);
  }
};
