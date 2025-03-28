import { Link } from "react-router-dom";
import pirateFlag from "../assets/pirate-flag (2).png";
import "../App.css";
import Avatar from "/src/assets/user (1).png";

const Navbar = () => {
  const isLoggedIn = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <nav className="navbar">
      <div className="logo-title">
        <img className="logo" src={pirateFlag} alt="Pirate Flag" />
        <h1 className="title">Treasure Hunt</h1>
      </div>
      <div className="menu">
        <Link to="/">Home</Link>
        <Link to="/hunts">Hunts</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/about">About</Link>

        {isLoggedIn ? (
          <div className="user-info">
            <img
              src={user.avatar || Avatar}
              alt="User Avatar"
              className="avatar"
            />
            <span className="username">{user.username}</span>
            <Link to="/user-dashboard">Me</Link>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                window.location.replace("/login");
              }}
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button>LOGIN</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
