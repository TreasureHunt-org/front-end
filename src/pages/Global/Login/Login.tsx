import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../../constants/apiURL/API_BASE_URL";
import user from "/src/assets/user (1).png";

import "../Login/Login.css";
import RegisterModal from "../Register/RegisterModal";
const Login: React.FC = () => {
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;
    if (!email.trim() || !password.trim()) {
      setError("Please fill all fields.");
      return;
    }

    // const trimmedData = {
    //   email: formData.email.trim(),
    //   password: formData.password.trim(),
    // };

    // if (!trimmedData.email || !trimmedData.password) {
    //   setError("");
    //   setError("Please fill all fields.");
    //   return;
    // }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        email: email.trim(),
        password: password.trim(),
        // email: trimmedData.email,
        // password: trimmedData.password,
      });
      console.log("login successfull:", response.data);

      if (!response.data.success || !response.data.data?.[0]) {
        throw new Error("Invalid response from server");
      }

      const { accessToken, refreshToken, roles } = response.data.data[0];
      if (!accessToken || !refreshToken) {
        throw new Error("Tokens missing in response.");
      }

      // store both tokens
      // const accessToken = response.data.data[0].accessToken;
      // localStorage.setItem("accessToken", accessToken);

      // // const refreshToken = response.data.data[0].refreshToken;
      // localStorage.setItem("refreshToken", refreshToken);

      // alert("Login successful!");
      console.log("Navigating to user dashboard...");

      // axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      // const primaryRole = response.data.data[0].roles?.[0];

      // context login function
      login(accessToken, refreshToken, roles);

      // redirect based on role
      // navigate(
      //   primaryRole === "ADMIN" ? "/admin-dashboard" : "/user-dashboard",
      // );

      const role = roles?.includes("ADMIN")
        ? "/admin-dashboard"
        : // : roles?.includes("REVIEWER")
          //   ? "/reviewer-dashboard"
          "/user-dashboard";
      console.log("=====>Role<====:", role);

      navigate(role);
      window.location.reload();
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.response) {
        if (error.response.data?.errors?.length) {
          setError(error.response.data.errors.join(", "));
        } else {
          setError(error.response.data?.message || "Login failed");
        }
      } else if (error.request) {
        setError("No response from server. Please try again.");
      } else {
        setError(error.message || "Login failed");
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-6 flex flex-col items-center">
        <img src={user} alt="user icon" className="mb-2 h-20 w-20" />
        <h3 className="text-xl font-semibold text-white">Welcome back</h3>
      </div>

      <div className="w-full max-w-xs">
        <form className="flex flex-col gap-4" onSubmit={handleFormSubmission}>
          <div className="flex w-full flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-left text-sm text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={handleFormChange}
              autoComplete="username"
              className="w-full rounded border border-gray-600 bg-[#333] px-3 py-2 text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-[#f39c12] focus:outline-none"
            />
          </div>

          <div className="flex w-full flex-col">
            <label
              htmlFor="password"
              className="mb-1 text-left text-sm text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={formData.password}
              onChange={handleFormChange}
              autoComplete="current-password"
              className="w-full rounded border border-gray-600 bg-[#333] px-3 py-2 text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-[#f39c12] focus:outline-none"
            />
          </div>

          {error && (
            <p className="-mt-2 mb-3 text-center text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded bg-[#f39c12] py-2 text-lg font-semibold text-white transition-colors hover:bg-[#e67e22]"
          >
            LOGIN
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            className="text-sm text-[#f39c12] underline hover:text-[#e67e22]"
            onClick={() => setRegisterOpen(true)}
          >
            Don’t have an account?
          </button>
        </div>
      </div>

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setRegisterOpen(false)}
      />
    </div>
  );
};

export default Login;
