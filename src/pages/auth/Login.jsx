import { login } from "@/services/auth";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password, navigate }));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 ">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-1/2 bg-white p-4 rounded-md shadow-md border-2 border-gray-300 max-w-md"
      >
        <h1 className="text-2xl font-bold">Login</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border-2 border-gray-300 rounded-md p-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border-2 border-gray-300 rounded-md p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
