import axios from "axios";
import { authEndpoints } from "./apis";
import { setToken } from "@/store/slices/authSlice";

export const login = ({ email, password, navigate }) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(authEndpoints.login, {
        email,
        password,
      });
      console.log(response);
      localStorage.setItem("token", response.data.token);
      dispatch(setToken(response.data.token));
      navigate("/admin");
    } catch (error) {
      console.log(error);
      throw new Error(error.response.data.message);
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    dispatch(setToken(null));
  };
};
