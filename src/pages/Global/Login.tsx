import user from "/src/assets/user (1).png";
import "/src/App.css";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="login-form">
      <div className="user-login">
        <img className="user" alt="user" src={user} />
        <h3 className="login">Login to your account</h3>
      </div>

      <form className="login-inputs">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" required />

        <label htmlFor="username">Username</label>
        <input type="text" id="username" required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" required />

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
