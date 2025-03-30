import { Link } from "react-router-dom";
import pirateFlag from "../assets/pirate-flag (2).png";
import "../App.css";
import Avatar from "/src/assets/user (1).png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const roles = user?.roles;

  return (
    <nav className="navbar">
      <div className="logo-title">
        <img className="logo" src={pirateFlag} alt="Pirate Flag" />
        <h1 className="title">Treasure Hunt</h1>
      </div>
      <div className="menu">
        <Link to="/" className="menu-link">
          Home
        </Link>
        <Link to="/hunts" className="menu-link">
          Hunts
        </Link>
        <Link to="/leaderboard" className="menu-link">
          Leaderboard
        </Link>
        <Link to="/about" className="menu-link">
          About
        </Link>

        {isAuthenticated ? (
          <div className="user-info">
            <img
              src={user?.avatar || Avatar}
              alt="Avatar"
              className="avatar"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = Avatar;
              }}
            />

            <div>
              <Link
                to={
                  roles?.includes("ADMIN")
                    ? "/admin-dashboard"
                    : roles?.includes("REVIEWER")
                      ? "/reviewer-dashboard"
                      : "/user-dashboard"
                }
                className="dashboard-link"
              >
                {user?.username || "User"}
                {user?.id}
              </Link>
            </div>
            <button className="login-btn" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-link">
            <button className="login-btn">LOGIN</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
