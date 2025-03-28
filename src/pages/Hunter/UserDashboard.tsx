import { useEffect, useState } from "react";
import api from "../../api/axios";

const UserDashboard = () => {
  interface UserData {
    id: string;
    username: string;
    email: string;
    roles: string[];
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/auth/me");
        const user = response.data[0];
        console.log(response);
        if (user) {
          setUserData(user);
          // setUserRole(user.roles?.[0] && user.roles?.[1]);
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
          <h1 style={{ color: "red" }}>Welcome, {userData.username}!</h1>
          <p style={{ color: "red" }}>Email: {userData.email}</p>
          <p style={{ color: "red" }}>Role: {userData.roles}</p>

          {userRole === "HUNTER" && (
            <div>
              <h2>Active Hunts</h2>
              {/* <ul>
                {userData.activeHunts.map((hunt) => (
                  <li key={hunt.id}>
                    <span>{hunt.title}</span> - Status: {hunt.status}
                  </li>
                ))}
              </ul>  */}
            </div>
          )}

          {userRole === "ORGANIZER" && (
            <div>
              <h2>Your Created Hunts</h2>
              {/*
              <ul>
                {userData.createdHunts.map((hunt) => (
                  <li key={hunt.id}>
                    <span>{hunt.title}</span> - Participants:{" "}
                    {hunt.participants.length}
                  </li>
                ))}
              </ul> */}
            </div>
          )}

          <div>
            <h2>Notifications</h2>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("refreshToken");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default UserDashboard;
