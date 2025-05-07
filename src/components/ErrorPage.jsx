import React from "react";
import { useLocation, useNavigate } from "react-router";

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5">
      <h1 className="text-4xl font-bold">404! Page Not Found!</h1>
      <button
        className="px-6 py-3 bg-red-500 text-white text-lg font-medium rounded-lg"
        onClick={() => navigate(location.state?.from || "/admin")}
      >
        Return !
      </button>
    </div>
  );
};

export default ErrorPage;
