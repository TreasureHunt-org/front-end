import user from "/src/assets/user (1).png";
import "/src/App.css";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="register-form">
      <div className="user-register">
        <img className="user" alt="user" src={user} />
        <h3 className="register">Create an account</h3>
      </div>

      <form className="register-inputs">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" required />

        <label htmlFor="username">Username</label>
        <input type="text" id="username" required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" required />

        <label htmlFor="password">Confirm Password</label>
        <input type="password" id="password" required />

        <button className="btn" type="submit">
          Create Account
        </button>
      </form>

      <Link className="login-link" to="/login">
        Already have an account?{" "}
      </Link>
    </div>
  );
};
export default Register;
