import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";

const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  // Validate token before redirecting
  const isValidToken = useMemo(() => {
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (err) {
      console.log(err);
      return false;
    }
  }, [token]);

  // Redirect to dashboard if token is valid
  if (isValidToken) {
    return <Navigate to={"/admin"} />;
  }
  return children;
};

export default PublicRoute;
