import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/app routes/routes.ts";
import Spinner from "../../components/Spinner/Spinner.tsx";
import api from "../../api/axios";
import "./HunterDashboard.css";

// Interfaces for type safety
interface ActiveHunt {
  id: string;
  title: string;
  progress: number;
  completedChallenges: number;
  totalChallenges: number;
  dueDate: string;
}

interface CompletedHunt {
  id: string;
  title: string;
  completedDate: string;
  score: number;
  rank: number;
}

interface UserScore {
  total: number;
  rank: number;
  lastEarned: number;
  highestScore: number;
}

const HunterDashboard = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for API data
  const [activeHunts, setActiveHunts] = useState<ActiveHunt[]>([]);
  const [completedHunts, setCompletedHunts] = useState<CompletedHunt[]>([]);
  const [userScore, setUserScore] = useState<UserScore | null>(null);

  // Fetch active hunts
  useEffect(() => {
    const fetchActiveHunts = async () => {
      try {
        const response = await api.get("/hunts/active");
        if (response.data && response.data.data) {
          setActiveHunts(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching active hunts:", err);
        setError("Failed to load active hunts");
      }
    };

    fetchActiveHunts();
  }, []);

  // Fetch completed hunts
  useEffect(() => {
    const fetchCompletedHunts = async () => {
      try {
        const response = await api.get("/hunts/completed");
        if (response.data && response.data.data) {
          setCompletedHunts(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching completed hunts:", err);
        setError("Failed to load completed hunts");
      }
    };

    fetchCompletedHunts();
  }, []);

  // Fetch user score
  useEffect(() => {
    const fetchUserScore = async () => {
      try {
        const response = await api.get("/users/score");
        if (response.data && response.data.data) {
          setUserScore(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching user score:", err);
        setError("Failed to load user score");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserScore();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="empty-state">
        <h2 className="empty-state-title" style={{ color: '#e74c3c' }}>Error</h2>
        <p className="empty-state-subtitle" style={{ color: '#e74c3c' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">
            Captain's Logbook
          </h1>
          <p className="dashboard-subtitle">
            Navigate your voyages, treasures, and achievements
          </p>
        </div>
      </div>

      <div className="dashboard-content">

        {/* Hunts Tabs */}
        <div className="hunts-container">
          <div className="tabs-header">
            <nav className="tabs-nav">
              <div>
                <button
                  onClick={() => setActiveTab("active")}
                  className={`tab-button ${
                    activeTab === "active"
                      ? "tab-button-active"
                      : "tab-button-inactive"
                  }`}
                >
                  Current Voyage
                </button>
              </div>
              <div>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`tab-button ${
                    activeTab === "completed"
                      ? "tab-button-active"
                      : "tab-button-inactive"
                  }`}
                >
                  Completed Voyages
                </button>
              </div>
            </nav>
          </div>

          <div className="tabs-content">
            {activeTab === "active" ? (
              <div>
                {activeHunts.length > 0 ? (
                  <div className="hunt-grid">
                    {activeHunts.map((hunt) => (
                      <div
                        key={hunt.id}
                        className="hunt-card"
                      >
                        <h3 className="hunt-title">
                          {hunt.title}
                        </h3>
                        <div className="progress-container">
                          <div className="progress-header">
                            <span>Voyage Progress</span>
                            <span className="progress-value">
                              {hunt.progress}%
                            </span>
                          </div>
                          <div className="progress-bar-container">
                            <div
                              className="progress-bar"
                              style={{ width: `${hunt.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="hunt-details">
                          <span className="hunt-challenges">
                            <span className="hunt-value">
                              {hunt.completedChallenges}
                            </span>
                            /{hunt.totalChallenges} Challenges
                          </span>
                          <span className="hunt-due-date">
                            Ends:{" "}
                            <span className="hunt-value">
                              {hunt.dueDate}
                            </span>
                          </span>
                        </div>
                        <Link
                          to={`${ROUTES.HUNT_MAP_PIECES.replace(":huntId", hunt.id)}`}
                          className="continue-button"
                        >
                          Continue Voyage
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p className="empty-state-title">
                      No active voyages on your horizon
                    </p>
                    <p className="empty-state-subtitle">
                      Set sail on a new adventure to begin your journey!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {completedHunts.length > 0 ? (
                  <div className="hunts-table">
                    <table>
                      <thead>
                        <tr>
                          <th>
                            Voyage
                          </th>
                          <th>
                            Completed
                          </th>
                          <th>
                            Treasure
                          </th>
                          <th>
                            Rank
                          </th>
                          <th>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedHunts.map((hunt) => (
                          <tr
                            key={hunt.id}
                          >
                            <td>
                              {hunt.title}
                            </td>
                            <td>
                              {hunt.completedDate}
                            </td>
                            <td>
                              {hunt.score}{" "}
                              <span>
                                points
                              </span>
                            </td>
                            <td>
                              #{hunt.rank}
                            </td>
                            <td>
                              <Link
                                to={`${ROUTES.HUNT_RANKING.replace(":huntId", hunt.id)}`}
                                className="view-ranks-link"
                              >
                                <span>View Crew Ranks</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="view-ranks-icon"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p className="empty-state-title">
                      No completed voyages in your logbook
                    </p>
                    <p className="empty-state-subtitle">
                      Complete your first adventure to see your achievements
                      here!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Treasure Details */}
        {userScore && (
          <div className="treasure-container">
            <div className="treasure-header">
              <h2 className="treasure-title">
                Treasure Vault
              </h2>
            </div>
            <div className="treasure-content">
              <div className="treasure-grid">
                <div className="treasure-card">
                  <div className="treasure-card-header">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="treasure-icon"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h3 className="treasure-card-title">
                      Current Bounty
                    </h3>
                  </div>
                  <div className="treasure-stats">
                    <div className="treasure-stat">
                      <p className="treasure-stat-label">
                        Total Treasure
                      </p>
                      <p className="treasure-stat-value">
                        {userScore.total}
                      </p>
                    </div>
                    <div className="treasure-stat">
                      <p className="treasure-stat-label">
                        Fleet Rank
                      </p>
                      <p className="treasure-stat-value">
                        #{userScore.rank}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="treasure-card">
                  <div className="treasure-card-header">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="treasure-icon"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h3 className="treasure-card-title">
                      Treasure History
                    </h3>
                  </div>
                  <div className="treasure-stats">
                    <div className="treasure-stat">
                      <p className="treasure-stat-label">
                        Last Plunder
                      </p>
                      <p className="treasure-stat-value">
                        {userScore.lastEarned}
                      </p>
                    </div>
                    <div className="treasure-stat">
                      <p className="treasure-stat-label">
                        Greatest Haul
                      </p>
                      <p className="treasure-stat-value">
                        {userScore.highestScore}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HunterDashboard;
