import user from "/src/assets/user (1).png";
import "/src/App.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../Register/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    <div className="register-form">
      <div className="user-register">
        <img className="user" alt="user" src={user} />
        <h3 className="register">Create an account</h3>
      </div>

      <form className="register-inputs" onSubmit={handleFormSubmission}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={handleFormChange}
        />

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          required
          value={formData.username}
          onChange={handleFormChange}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          required
          value={formData.password}
          onChange={handleFormChange}
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          required
          value={formData.confirmPassword}
          onChange={handleFormChange}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="btn" type="submit">
          Create Account
        </button>
      </form>

      <Link className="login-link" to="/login">
        Already have an account?
      </Link>
    </div>
  );
};

export default Register;
