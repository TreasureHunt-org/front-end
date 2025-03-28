import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminDashboard from "../Admin/AdminDashboard";
import HunterDashboard from "./HunterDashboard";
import OrganizerDashboard from "../Organizer/OrganizerDashboard";
import ReviewerDashboard from "../Reviewer/ReviewerDashboard";

const UserDashboard = () => {
  interface UserData {
    id: string;
    username: string;
    email: string;
    roles: string[];
  }

  type UserRole = ["ADMIN" | "HUNTER" | "ORGANIZER" | "REVIEWER"];

  const [userData, setUserData] = useState<UserData>();
  const [userRole, setUserRole] = useState<UserRole>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/auth/me");
        const user = response.data.data[0];
        console.log(response.data);
        if (user) {
          setUserData(user);
          setUserRole(user.roles);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="dashboard">
      {userData ? (
        <>
          <h1>Welcome, {userData.username}!</h1>
          <p>Email: {userData.email}</p>
          <p>Role: {userData.roles[1]}</p>

          {userRole?.includes("ADMIN") && <AdminDashboard />}
          {userRole?.includes("HUNTER") && <HunterDashboard />}
          {userRole?.includes("ORGANIZER") && <OrganizerDashboard />}
          {userRole?.includes("REVIEWER") && <ReviewerDashboard />}

          {/* {userRole === "ADMIN" && (
            <>
              <AdminDashboard />
            </>
          )}

          {userRole === "HUNTER" && (
            <>
              <HunterDashboard />
            </> */}

          {/* // <div>
            //   <h2>Active Hunts</h2>
            //   {/* <ul>
            //     {userData.activeHunts.map((hunt) => (
            //       <li key={hunt.id}>
            //         <span>{hunt.title}</span> - Status: {hunt.status}
            //       </li>
            //     ))}
            //   </ul>
            // </div>
          )} */}

          {/* {userRole === "ORGANIZER" && (
            <>
              <OrganizerDashboard />
            </> }
            // <div>
            //   <h2>Your Created Hunts</h2>
            //   {
            //   <ul>
            //     {userData.createdHunts.map((hunt) => (
            //       <li key={hunt.id}>
            //         <span>{hunt.title}</span> - Participants:{" "}
            //         {hunt.participants.length}
            //       </li>
            //     ))}
            //   </ul> }
            // </div>
          )}

          {/* <div>
            <h2>Notifications</h2>
          </div> */}

          {/* <button
            className="btn"
            onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");

              window.location.replace("/login");
            }}
          >
            Logout
          </button> */}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default UserDashboard;
