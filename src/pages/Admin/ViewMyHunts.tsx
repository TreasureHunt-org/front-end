import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../constants/API_BASE_URL";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

interface Location {
  latitude: number;
  longitude: number;
}

interface Hunt {
  id: number;
  title: string;
  description: string;
  organizerId: number;
  startDate: string;
  endDate: string;
  huntStatus: string;
  location: Location;
}

const ViewMyHunts: React.FC = () => {
  const [draftHunts, setDraftHunts] = useState<Hunt[]>([]);

  const { isAuthenticated } = useAuth();

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchMyHunts = async () => {
      if (!isAuthenticated || !accessToken) return;

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        const response = await api.get(API_BASE_URL + "/hunts/me");

        const allHunts: Hunt[] = response.data.content || [];
        const draftOnly = allHunts.filter(
          (hunt) => hunt.huntStatus === "DRAFT",
        );
        setDraftHunts(draftOnly);
      } catch (err) {
        console.error("Error fetching hunts:", err);
      }
    };

    fetchMyHunts();
  }, [isAuthenticated, accessToken]);

  if (!isAuthenticated) {
    return <div>Please log in to view your hunts</div>;
  }
  const calculateDuration = (start: string, end: string): string => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffInMs = endTime.getTime() - startTime.getTime();

    const totalMinutes = Math.floor(diffInMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);

    return parts.length > 0 ? parts.join(", ") : "0 minutes";
  };

  return (
    <div className="view-hunts-container">
      <h2 className="view-hunts-title">My Draft Hunts</h2>

      <Link to={ROUTES.CREATE_HUNT}>
        <button className="btn">Create New Hunt</button>
      </Link>

      {draftHunts.length === 0 ? (
        <p>You have no draft hunts.</p>
      ) : (
        <ul className="hunts-list">
          {draftHunts.map((hunt) => (
            <li key={hunt.id} className="hunt-item">
              <h3>
                <strong>Title:</strong>
                {hunt.title}
              </h3>
              <p>
                <strong>Description:</strong> {hunt.description}
              </p>
              <p>
                <strong>Start:</strong>{" "}
                {new Date(hunt.startDate).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong> {new Date(hunt.endDate).toLocaleString()}
              </p>
              <p>
                <strong>Duration:</strong>{" "}
                {calculateDuration(hunt.startDate, hunt.endDate)}
              </p>

              <p>
                <strong>Status:</strong> {hunt.huntStatus}
              </p>
              <p>
                <strong>Location:</strong>
                {hunt.location.latitude},{hunt.location.longitude}
              </p>

              <button className="btn">Add Challenges</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewMyHunts;
