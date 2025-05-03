import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "../Admin/AdminDashboard";
import HunterDashboard from "../Hunter/HunterDashboard";
import OrganizerDashboard from "../Organizer/OrganizerDashboard";
import ReviewerDashboard from "../Reviewer/ReviewerDashboard";
import api from "../../api/axios";

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/auth/me");

        console.log("API Response:", response);
        console.log("Response Status:", response.status);

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

    fetchUserData();
  }, [user]);

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboard">
      {userData ? (
        <>
          <h1>Welcome, {userData.username}!</h1>
          <p>Email: {userData.email}</p>
          <p>Role: {userData.roles.join(", ")}</p>

          {roles?.includes("ADMIN") && <AdminDashboard />}
          {roles?.includes("HUNTER") && <HunterDashboard />}
          {roles?.includes("ORGANIZER") && <OrganizerDashboard />}
          {roles?.includes( "REVIEWER") && <ReviewerDashboard />}
        </>
      ) : (
        <p>Wait a moment</p>
      )}
    </div>
  );
};

export default UserDashboard;
