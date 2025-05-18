import { Link } from "react-router-dom";
import pirateFlag from "../../assets/pirate-flag (2).png";
import "../Navbar/Navbar.css";
import Avatar from "/src/assets/user (1).png";

import { useAuth } from "../../context/AuthContext";

import { useEffect, useState } from "react";
import api from "../../api/axios.ts";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [userImage, setUserImage] = useState<string | null>(null);
  const roles = user?.roles;
  const fetchUserImage = async () => {
    try {
      const response = await api.get(`/users/${user?.id}/image`, {
        responseType: "blob", // 👈 THIS IS IMPORTANT
      });
      return response.data; // This is a Blob now
    } catch (error) {
      console.error("Error fetching user image:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      const blob = await fetchUserImage();
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setUserImage(imageUrl);
      }
    };
    fetchImage();

    // Cleanup if component unmounts or image changes
    return () => {
      if (userImage) URL.revokeObjectURL(userImage);
    };
  }, [user?.id]);

  return (
    <nav className="navbar">
      <div className="flex items-center space-x-3">
        <img
          className="h-16 w-auto transform transition-transform duration-300 hover:rotate-12"
          src={pirateFlag}
          alt="Pirate Flag"
        />
        <h1 className="text-left text-3xl font-bold tracking-wider text-yellow-500">
          Treasure Hunt
        </h1>
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
            <div>
              <Link
                to={
                  roles?.includes("ADMIN")
                    ? "/admin-dashboard"
                    : "/user-dashboard"
                }
                className="dashboard-link"
              >
                {user?.username || "User"}
                {user?.id}
              </Link>
            </div>{" "}
            <img
              src={userImage || Avatar}
              alt="Avatar"
              className="avatar"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = Avatar;
              }}
            />
            <button className="bn" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-link">
            <button className="bn">LOGIN</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
