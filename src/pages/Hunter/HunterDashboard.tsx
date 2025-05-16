import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import Spinner from "../../components/spinner.tsx";
import api from "../../api/axios";

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
    return (
      <Spinner />
    );
  }

  if (error) {
    return (
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-8 bg-gradient-to-r from-yellow-900 to-gray-900 border-b-2 border-yellow-600">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-yellow-500 mb-2">Captain's Logbook</h1>
          <p className="text-yellow-300 text-xl">Navigate your voyages, treasures, and achievements</p>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Stats Overview */}
        {/*<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">*/}
        {/*  <div className="rounded-lg border-t-4 border-amber-500 bg-gray-700 p-6 shadow">*/}
        {/*    <h2 className="mb-2 text-xl font-semibold text-white">*/}
        {/*      Active Hunt*/}
        {/*    </h2>*/}
        {/*    <p className="text-3xl font-bold text-amber-500">*/}
        {/*      {mockActiveHunts.length}*/}
        {/*    </p>*/}
        {/*  </div>*/}
        {/*  <div className="rounded-lg border-t-4 border-green-500 bg-gray-700 p-6 shadow">*/}
        {/*    <h2 className="mb-2 text-xl font-semibold text-white">*/}
        {/*      Completed Hunts*/}
        {/*    </h2>*/}
        {/*    <p className="text-3xl font-bold text-green-500">*/}
        {/*      {mockCompletedHunts.length}*/}
        {/*    </p>*/}
        {/*  </div>*/}
        {/*  <div className="rounded-lg border-t-4 border-amber-500 bg-gray-700 p-6 shadow">*/}
        {/*    <h2 className="mb-2 text-xl font-semibold text-white">*/}
        {/*      Total Score*/}
        {/*    </h2>*/}
        {/*    <p className="text-3xl font-bold text-amber-500">*/}
        {/*      {userScore.total}*/}
        {/*    </p>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/* Hunts Tabs */}
        <div className="mb-8 rounded-lg bg-gray-800 shadow-lg border-2 border-yellow-900 overflow-hidden">
          <div className="border-b-2 border-yellow-800">
            <nav className="flex w-full justify-between bg-gradient-to-r from-gray-800 to-yellow-900 p-4">
              <div>
                <button
                  onClick={() => setActiveTab("active")}
                  className={`px-8 py-4 text-base font-bold rounded-t-lg transition-all duration-200 ${
                    activeTab === "active"
                      ? "border-b-4 border-yellow-500 text-yellow-400 bg-gray-800 bg-opacity-50"
                      : "text-yellow-300 hover:text-yellow-400 hover:border-b-4 hover:border-yellow-600"
                  }`}
                >
                  Current Voyage
                </button>
              </div>
              <div>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`px-8 py-4 text-base font-bold rounded-t-lg transition-all duration-200 ${
                    activeTab === "completed"
                      ? "border-b-4 border-yellow-500 text-yellow-400 bg-gray-800 bg-opacity-50"
                      : "text-yellow-300 hover:text-yellow-400 hover:border-b-4 hover:border-yellow-600"
                  }`}
                >
                  Completed Voyages
                </button>
              </div>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "active" ? (
              <div>
                {activeHunts.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {activeHunts.map((hunt) => (
                      <div
                        key={hunt.id}
                        className="rounded-lg border-2 border-yellow-800 bg-gradient-to-b from-gray-800 to-gray-900 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <h3 className="mb-4 text-xl font-bold text-yellow-400">
                          {hunt.title}
                        </h3>
                        <div className="mb-4">
                          <div className="mb-2 flex justify-between text-sm text-yellow-300 font-medium">
                            <span>Voyage Progress</span>
                            <span className="text-yellow-300 font-bold">{hunt.progress}%</span>
                          </div>
                          <div className="h-3 w-full rounded-full bg-gray-700 border border-yellow-800 p-0.5">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-yellow-600 to-yellow-500"
                              style={{ width: `${hunt.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="mb-5 flex justify-between text-sm">
                          <span className="text-yellow-300">
                            <span className="text-yellow-300 font-bold">{hunt.completedChallenges}</span>/{hunt.totalChallenges} Challenges
                          </span>
                          <span className="text-yellow-300">
                            Ends: <span className="text-yellow-300 font-bold">{hunt.dueDate}</span>
                          </span>
                        </div>
                        <Link
                          to={`${ROUTES.HUNT_MAP_PIECES.replace(":huntId", hunt.id)}`}
                          className="block rounded-lg bg-yellow-600 hover:bg-yellow-500 px-6 py-3 text-center text-white font-bold transition-all duration-200 shadow-md hover:shadow-lg border-2 border-yellow-700"
                        >
                          Continue Voyage
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-xl text-yellow-300 mb-4">
                      No active voyages on your horizon
                    </p>
                    <p className="text-gray-400">
                      Set sail on a new adventure to begin your journey!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {completedHunts.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border-2 border-yellow-800">
                    <table className="min-w-full divide-y divide-yellow-900">
                      <thead className="bg-gradient-to-r from-gray-800 to-yellow-900">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold tracking-wider text-yellow-400 uppercase">
                            Voyage
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold tracking-wider text-yellow-400 uppercase">
                            Completed
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold tracking-wider text-yellow-400 uppercase">
                            Treasure
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold tracking-wider text-yellow-400 uppercase">
                            Rank
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold tracking-wider text-yellow-400 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-yellow-900 bg-gray-800">
                        {completedHunts.map((hunt) => (
                          <tr key={hunt.id} className="hover:bg-gray-700 transition-colors duration-200">
                            <td className="px-6 py-5 text-base font-medium whitespace-nowrap text-yellow-300">
                              {hunt.title}
                            </td>
                            <td className="px-6 py-5 text-base whitespace-nowrap text-yellow-300">
                              {hunt.completedDate}
                            </td>
                            <td className="px-6 py-5 text-base whitespace-nowrap text-yellow-300 font-bold">
                              {hunt.score} <span className="text-xs text-yellow-400">points</span>
                            </td>
                            <td className="px-6 py-5 text-base whitespace-nowrap text-yellow-300 font-bold">
                              #{hunt.rank}
                            </td>
                            <td className="px-6 py-5 text-base font-medium whitespace-nowrap">
                              <Link
                                to={`${ROUTES.HUNT_RANKING.replace(":huntId", hunt.id)}`}
                                className="text-yellow-500 hover:text-yellow-300 transition-colors duration-200 flex items-center"
                              >
                                <span>View Crew Ranks</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-xl text-yellow-300 mb-4">
                      No completed voyages in your logbook
                    </p>
                    <p className="text-gray-400">
                      Complete your first adventure to see your achievements here!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Treasure Details */}
        {userScore && (
          <div className="rounded-lg bg-gray-800 shadow-lg border-2 border-yellow-900 overflow-hidden">
            <div className="border-b-2 border-yellow-800 p-5 bg-gradient-to-r from-gray-800 to-yellow-900">
              <h2 className="text-2xl font-bold text-yellow-500">Treasure Vault</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="rounded-lg border-2 border-yellow-700 bg-gradient-to-b from-gray-800 to-gray-900 p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-xl font-bold text-yellow-400">
                      Current Bounty
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2 text-sm text-yellow-300 font-medium">Total Treasure</p>
                      <p className="text-4xl font-bold text-yellow-500">
                        {userScore.total}
                      </p>
                    </div>
                    <div>
                      <p className="mb-2 text-sm text-yellow-300 font-medium">Fleet Rank</p>
                      <p className="text-4xl font-bold text-yellow-500">
                        #{userScore.rank}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border-2 border-yellow-700 bg-gradient-to-b from-gray-800 to-gray-900 p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-xl font-bold text-yellow-400">
                      Treasure History
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2 text-sm text-yellow-300 font-medium">Last Plunder</p>
                      <p className="text-4xl font-bold text-yellow-500">
                        {userScore.lastEarned}
                      </p>
                    </div>
                    <div>
                      <p className="mb-2 text-sm text-yellow-300 font-medium">Greatest Haul</p>
                      <p className="text-4xl font-bold text-yellow-500">
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
