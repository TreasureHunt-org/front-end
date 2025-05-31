import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import "../HuntLeaderboard/HuntLeaderboard.css";

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
}

const HuntLeaderboard = () => {
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState<"rank" | "username" | "score">("rank");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Sample data for leaderboard entries
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, username: "Hunter1", score: 500 },
    { rank: 2, username: "Hunter2", score: 450 },
    { rank: 3, username: "Hunter3", score: 400 },
    { rank: 4, username: "Hunter4", score: 350 },
    { rank: 5, username: "Hunter5", score: 300 },
    { rank: 6, username: "Hunter6", score: 250 },
    { rank: 7, username: "Hunter7", score: 200 },
    { rank: 8, username: "Hunter8", score: 150 },
    { rank: 9, username: "Hunter9", score: 100 },
    { rank: 10, username: "Hunter10", score: 50 },
  ];

  // Sorting logic
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (sortBy === "rank") return a.rank - b.rank;
    if (sortBy === "username") return a.username.localeCompare(b.username);
    return a.score - b.score;
  });

  // Paginated leaderboard
  const paginatedLeaderboard = sortedLeaderboard.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Filtered leaderboard by search query
  const filteredLeaderboard = paginatedLeaderboard.filter((entry) =>
    entry.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <motion.div
      className="leaderboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="leaderboard-title">
          The Ultimate Problem-Solving Hunt: The Trials of the Mind
        </h1>
        <button
          className="rank-btn"
          onClick={() => navigate("/hunt-map-pieces")}
        >
          Back to Challenges
        </button>
      </div>
      <input
        type="text"
        placeholder="Search Hunters"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th onClick={() => setSortBy("rank")}>Rank</th>
            <th onClick={() => setSortBy("username")}>Hunter</th>
            <th onClick={() => setSortBy("score")}>Score</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeaderboard.map((entry) => (
            <tr
              key={entry.rank}
              className={entry.rank === 1 ? "top-scorer" : ""}
            >
              <td>{entry.rank}</td>
              <td>
                <img
                  src={`https://avatars.dicebear.com/api/human/${entry.username}.svg`}
                  alt={entry.username}
                  className="avatar"
                />
                {entry.username}
              </td>
              <td>
                <div className="score-bar">
                  <div
                    className="score-bar-fill"
                    style={{ width: `${(entry.score / 500) * 100}%` }}
                  />
                </div>
                {entry.score} pts
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
          Prev
        </button>
        <span>Page {currentPage}</span>
        <button onClick={() => setCurrentPage((prev) => prev + 1)}>Next</button>
      </div>
    </motion.div>
  );
};

export default HuntLeaderboard;
