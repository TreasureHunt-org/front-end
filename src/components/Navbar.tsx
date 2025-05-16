import { Link } from "react-router-dom";
import pirateFlag from "../assets/pirate-flag (2).png";
import "../App.css";
import Avatar from "/src/assets/user (1).png";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios.ts";
import { useEffect, useState } from "react";
import { ROUTES } from "../constants/routes";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [userImage, setUserImage] = useState<string | null>(null);

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
    <nav className="bg-gray-900 text-white shadow-lg border-b-2 border-yellow-600 sticky top-0 z-50 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img className="h-16 w-auto transform hover:rotate-12 transition-transform duration-300" src={pirateFlag} alt="Pirate Flag" />
          <h1 className="text-3xl text-left font-bold text-yellow-500 tracking-wider">Treasure Hunt</h1>
        </div>

        <div className="flex items-center space-x-8">
          <Link to={ROUTES.HOME} className="text-yellow-300 hover:text-yellow-400 transition-colors duration-200 font-medium">
            Home
          </Link>
          <Link to={ROUTES.HUNTS} className="text-yellow-300 hover:text-yellow-400 transition-colors duration-200 font-medium">
            Hunts
          </Link>
          <Link to={ROUTES.LEADERBOARD} className="text-yellow-300 hover:text-yellow-400 transition-colors duration-200 font-medium">
            Leaderboard
          </Link>
          <Link to={ROUTES.ABOUT} className="text-yellow-300 hover:text-yellow-400 transition-colors duration-200 font-medium">
            About
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to={ROUTES.USER_PROFILE} className="group">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-600 group-hover:border-yellow-400 transition-all duration-200 shadow-md">
                  <img
                    src={userImage || Avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = Avatar;
                    }}
                  />
                </div>
              </Link>

              <div className="flex flex-col">
                <Link
                  to={ROUTES.USER_PROFILE}
                  className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors duration-200"
                >
                  {user?.username || "Captain"}
                </Link>
              </div>
              <button 
                className="bg-yellow-800 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-bold shadow-md transform hover:scale-105 transition-all duration-200 border border-yellow-600"
                onClick={logout}
              >
                Abandon Ship
              </button>
            </div>
          ) : (
            <Link to={ROUTES.LOGIN}>
              <button className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg font-bold shadow-md transform hover:scale-105 transition-all duration-200">
                BOARD SHIP
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
