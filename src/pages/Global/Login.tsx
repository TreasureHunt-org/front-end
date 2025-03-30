import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../constants/API_BASE_URL";
import user from "/src/assets/user (1).png";
import "/src/App.css";

const Login: React.FC = () => {
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
        : roles?.includes("REVIEWER")
          ? "/reviewer-dashboard"
          : "/user-dashboard";
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
    <div className="login-form">
      <div className="user-login">
        <img className="user" alt="user" src={user} />
        <h3 className="login">Login to your account</h3>
      </div>

      <form className="login-inputs" onSubmit={handleFormSubmission}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={handleFormChange}
          autoComplete="username"
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          required
          value={formData.password}
          onChange={handleFormChange}
          autoComplete="current-password"
        />

        {error && (
          <p
            className="error-message"
            style={{ color: "red", margin: "10px 0" }}
          >
            {error}
          </p>
        )}

        <button className="btn" type="submit">
          LOGIN
        </button>
      </form>

      <Link
        className="register-link"
        to="/register"
        style={{ display: "block", marginTop: "20px", textAlign: "center" }}
      >
        Don't have an account?
      </Link>
    </div>
  );
};

export default Login;
