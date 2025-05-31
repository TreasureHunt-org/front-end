import user from "/src/assets/user (1).png";
import "/src/App.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../Register/Register.css";
import LoginModal from "../Login/LoginModal";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [isLoginOpen, setLoginOpen] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedFormData = {
      email: formData.email.trim(),
      username: formData.username.trim(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim(),
    };
    if (
      !trimmedFormData.email ||
      !trimmedFormData.username ||
      !trimmedFormData.password ||
      !trimmedFormData.confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }
    setError("");
    if (
      trimmedFormData.password.length < 8 ||
      trimmedFormData.password.length > 25
    ) {
      setError("Password must be between 8 and 25 characters.");
      return;
    }
    if (trimmedFormData.password !== trimmedFormData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      const response = await axios.post(`/auth/signup`, formData);

      console.log("Response:", response.data);
      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "Registration failed.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-6 flex flex-col items-center">
        <img src={user} alt="user icon" className="mb-2 h-20 w-20" />
        <h3 className="text-xl font-semibold text-white">Create an account</h3>
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
              className="w-full rounded border border-gray-600 bg-[#333] px-3 py-2 text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-[#f39c12] focus:outline-none"
            />
          </div>

          <div className="flex w-full flex-col">
            <label
              htmlFor="username"
              className="mb-1 text-left text-sm text-white"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              required
              value={formData.username}
              onChange={handleFormChange}
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
              className="w-full rounded border border-gray-600 bg-[#333] px-3 py-2 text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-[#f39c12] focus:outline-none"
            />
          </div>

          <div className="flex w-full flex-col">
            <label
              htmlFor="confirmPassword"
              className="mb-1 text-left text-sm text-white"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleFormChange}
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
            Create Account
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            className="text-sm text-[#f39c12] underline hover:text-[#e67e22]"
            onClick={() => setLoginOpen(true)}
          >
            Already have an account?
          </button>
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
};

export default Register;
