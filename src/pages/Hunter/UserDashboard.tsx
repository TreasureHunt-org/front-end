import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "../Admin/AdminDashboard/AdminDashboard";
import HunterDashboard from "./HunterDashboard/HunterDashboard.tsx";
import OrganizerDashboard from "../Organizer/OrganizerDashboard";
import ReviewerDashboard from "../Reviewer/ReviewerDashboard";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/app routes/routes.ts";

interface UserData {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

const UserDashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData>();
  const { user, roles } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/auth/me");

        if (response.headers["content-type"].includes("text/html")) {
          setError(
            "Received an HTML error page. The API might be misconfigured.",
          );
          return;
        }

        if (!response.data || !response.data.data) {
          setError("User data is not available");
          return;
        }

        const user = response.data;
        if (user.data.length > 0) {
          setUserData({
            id: user.data[0].id,
            username: user.data[0].username,
            email: user.data[0].email,
            roles: user.data[0].roles,
          });
        } else {
          setError("User data is empty");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
      }
    };
    if (roles?.includes("ADMIN")) {
      navigate("/admin-dashboard");
      return;
    }
    if (roles?.includes("HUNTER")) {
      navigate(ROUTES.HUNTER_DASHBOARD);
      return;
    }
    if (roles?.includes("ORGANIZER")) {
      navigate("/organizer-dashboard");
    }

    fetchUserData();
  }, [user]);

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboard">
      {userData ? (
        <>
          {roles?.includes("ADMIN") && <AdminDashboard />}
          {roles?.includes("HUNTER") && <HunterDashboard />}
          {roles?.includes("ORGANIZER") && <OrganizerDashboard />}
          {roles?.includes("REVIEWER") && <ReviewerDashboard />}
        </>
      ) : (
        <div className="absolute top-20 left-1/2 z-50 -translate-x-1/2 transform">
          <span className="h-10 w-10 animate-spin rounded-full border-t-4 border-b-4 border-amber-500"></span>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
