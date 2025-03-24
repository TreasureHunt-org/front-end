import user from "/src/assets/user (1).png";
import "/src/App.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmission = async (error: React.FormEvent) => {
    error.preventDefault();
    setError("");

    const trimmedData = {
      email: formData.email.trim(),
      password: formData.password.trim(),
    };

    if (!trimmedData.email || !trimmedData.password) {
      setError("");
      setError("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://b965-92-253-108-63.ngrok-free.app/api/v1/treasure-hunt/auth/signin",
        trimmedData,
      );

      console.log("login successfu:", response.data);
      alert("Login successful!");
      navigate("/user-dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "Login failed.");
      } else setError("Login failed. Please try again.");
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
        />

        {/* <label htmlFor="username">Username</label>
        <input type="text" id="username" required /> */}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          required
          value={formData.password}
          onChange={handleFormChange}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button className="btn" type="submit">
          LOGIN
        </button>
      </form>

      <Link className="register-link" to="/register">
        Don't have an account?
      </Link>
    </div>
  );
};

export default Login;
