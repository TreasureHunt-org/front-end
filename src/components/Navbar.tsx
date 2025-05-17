import { Link } from "react-router-dom";
import pirateFlag from "../assets/pirate-flag (2).png";
import "../App.css";
import Avatar from "/src/assets/user (1).png";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/axios.ts";

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
            <img
              src={userImage || Avatar}
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

// import { Link } from "react-router-dom";
// import pirateFlag from "../assets/pirate-flag (2).png";
// import "../App.css";
// import Avatar from "/src/assets/user (1).png";
// import { useAuth } from "../context/AuthContext";
// import api from "../api/axios.ts";
// import { useEffect, useState } from "react";
// import { ROUTES } from "../constants/routes";

// const Navbar = () => {
//   const { user, logout, isAuthenticated } = useAuth();
//   const [userImage, setUserImage] = useState<string | null>(null);
//   const roles = user?.roles;
//   const fetchUserImage = async () => {
//     try {
//       const response = await api.get(`/users/${user?.id}/image`, {
//         responseType: "blob", // 👈 THIS IS IMPORTANT
//       });
//       return response.data; // This is a Blob now
//     } catch (error) {
//       console.error("Error fetching user image:", error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const fetchImage = async () => {
//       const blob = await fetchUserImage();
//       if (blob) {
//         const imageUrl = URL.createObjectURL(blob);
//         setUserImage(imageUrl);
//       }
//     };
//     fetchImage();

//     // Cleanup if component unmounts or image changes
//     return () => {
//       if (userImage) URL.revokeObjectURL(userImage);
//     };
//   }, [user?.id]);

//   return (
//     <nav className="sticky top-0 z-50 w-full border-b-2 border-yellow-600 px-2 py-3 text-white shadow-lg backdrop-blur-lg">
//       <div className="flex w-full items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <img
//             className="h-16 w-auto transform transition-transform duration-300 hover:rotate-12"
//             src={pirateFlag}
//             alt="Pirate Flag"
//           />
//           <h1 className="text-left text-3xl font-bold tracking-wider text-yellow-500">
//             Treasure Hunt
//           </h1>
//         </div>

//         <div className="flex items-center space-x-8">
//           <Link
//             to={ROUTES.HOME}
//             className="font-medium text-yellow-300 transition-colors duration-200 hover:text-yellow-400"
//           >
//             Home
//           </Link>
//           <Link
//             to={ROUTES.HUNTS}
//             className="font-medium text-yellow-300 transition-colors duration-200 hover:text-yellow-400"
//           >
//             Hunts
//           </Link>
//           <Link
//             to={ROUTES.LEADERBOARD}
//             className="font-medium text-yellow-300 transition-colors duration-200 hover:text-yellow-400"
//           >
//             Leaderboard
//           </Link>
//           <Link
//             to={ROUTES.ABOUT}
//             className="font-medium text-yellow-300 transition-colors duration-200 hover:text-yellow-400"
//           >
//             About
//           </Link>

//           {isAuthenticated ? (
//             <div className="flex items-center space-x-4">
//               <Link to={ROUTES.USER_PROFILE} className="group">
//                 <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-yellow-600 shadow-md transition-all duration-200 group-hover:border-yellow-400">
//                   <img
//                     src={userImage || Avatar}
//                     alt="Avatar"
//                     className="h-full w-full object-cover"
//                     onError={(e) => {
//                       const target = e.target as HTMLImageElement;
//                       target.src = Avatar;
//                     }}
//                   />
//                 </div>
//               </Link>

//               {/* <div className="flex flex-col">
//                 <Link
//                   to={ROUTES.USER_PROFILE}
//                   className="font-bold text-yellow-400 transition-colors duration-200 hover:text-yellow-300"
//                 >
//                   {user?.username || "Captain"}
//                 </Link>
//               </div> */}

//               <div>
//                 <Link
//                   to={
//                     roles?.includes("ADMIN")
//                       ? "/admin-dashboard"
//                       : "/user-profile"
//                   }
//                   className="dashboard-link"
//                 >
//                   {user?.username || "User"}
//                   {user?.id}
//                 </Link>
//               </div>

//               <button className="login-btn" onClick={logout}>
//                 LOGOUT
//               </button>
//             </div>
//           ) : (
//             <Link to={ROUTES.LOGIN} className="login-link">
//               <button className="login-btn">LOGIN</button>
//             </Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
