import React, { useState, useEffect } from "react";
import user from "/src/assets/user (1).png";
import api from "../../api/axios";
import Avatar from "/src/assets/user (1).png";

// Define the user type for leaderboard
interface LeaderboardUser {
  id: number;
  username: string;
  points: number;
  profileImage?: string;
}

// Define the API response type
interface LeaderboardResponse {
  content: LeaderboardUser[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // current page
}

const GlobalLeaderboard: React.FC = () => {
  // State for leaderboard data
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch leaderboard data
  const fetchLeaderboard = async (page: number) => {
    setLoading(true);
    try {
      // API Comment: The leaderboard endpoint should be:
      // GET /leaderboard?page={page}&size={size}
      // Response should include:
      // - content: array of users with id, username, points, profileImage
      // - totalPages: total number of pages
      // - totalElements: total number of users
      // - size: page size
      // - number: current page number (0-based)

      // Mock API call with fake data
      // In production, this would be:
      // const response = await api.get(`/leaderboard?page=${page}&size=10`);
      // const data: LeaderboardResponse = response.data;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate fake data
      const fakeData: LeaderboardResponse = generateFakeData(page);

      // Update state with fake data
      if (page === 0) {
        // First page includes top 3 users
        setTopUsers(fakeData.content.slice(0, 3));
        setUsers(fakeData.content.slice(3));
      } else {
        setUsers(fakeData.content);
      }

      setTotalPages(fakeData.totalPages);
      setCurrentPage(fakeData.number);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    }
  };

  // Generate fake data for demonstration
  const generateFakeData = (page: number): LeaderboardResponse => {
    const size = 10;
    const totalElements = 50;
    const totalPages = Math.ceil(totalElements / size);

    let content: LeaderboardUser[] = [];

    // First page has special handling for top 3
    if (page === 0) {
      content = [
        // Top 3 users sorted by rank (for display purposes)
        { id: 1, username: "Hamza23", points: 2000 }, // First place
        { id: 2, username: "Aya", points: 1980 },     // Second place
        { id: 3, username: "monsters", points: 1950 }, // Third place

        // Rest of the users
        { id: 4, username: "Faresah223", points: 1800 },
        { id: 5, username: "Ahmad", points: 1750 },
        { id: 6, username: "Ayman", points: 1700 },
        { id: 7, username: "Sara", points: 1650 },
        { id: 8, username: "Mohammed", points: 1600 },
        { id: 9, username: "Layla", points: 1550 },
        { id: 10, username: "Omar", points: 1500 }
      ];
    } else {
      // Generate users for other pages
      const startId = page * size + 1;
      for (let i = 0; i < size; i++) {
        const id = startId + i;
        if (id <= totalElements) {
          content.push({
            id,
            username: `User${id}`,
            points: 2000 - (id * 10)
          });
        }
      }
    }

    return {
      content,
      totalPages,
      totalElements,
      size,
      number: page
    };
  };

  // Load initial data
  useEffect(() => {
    fetchLeaderboard(0);
  }, []);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchLeaderboard(newPage);
    }
  };

  // Render skeleton loader for the entire page
  if (loading && currentPage === 0) {
    return (
      <div className="container">
        <section className="section">
          <h2 className="sectionTitle">Global Ranking</h2>

          {/* Skeleton for top 3 users */}
          <div className="topRankingContainer">
            {/* Second place skeleton */}
            <div className="skeleton-topRankingItem">
              <div className="skeleton skeleton-rank"></div>
              <div className="skeleton skeleton-profileImage"></div>
              <div className="skeleton skeleton-username"></div>
              <div className="skeleton skeleton-points"></div>
            </div>

            {/* First place skeleton (center, larger) */}
            <div className="skeleton-topRankingItem">
              <div className="skeleton skeleton-rank"></div>
              <div className="skeleton skeleton-profileImage skeleton-profileImage-large"></div>
              <div className="skeleton skeleton-username"></div>
              <div className="skeleton skeleton-points"></div>
            </div>

            {/* Third place skeleton */}
            <div className="skeleton-topRankingItem">
              <div className="skeleton skeleton-rank"></div>
              <div className="skeleton skeleton-profileImage"></div>
              <div className="skeleton skeleton-username"></div>
              <div className="skeleton skeleton-points"></div>
            </div>
          </div>

          {/* Skeleton for regular ranking items */}
          <div className="rankingContainer">
            {[...Array(7)].map((_, index) => (
              <div className="skeleton-rankingItem" key={index}>
                <div className="skeleton skeleton-rank" style={{ width: '40px' }}></div>
                <div className="skeleton skeleton-profileImage" style={{ width: '40px', height: '40px' }}></div>
                <div className="skeleton skeleton-username" style={{ width: '30%' }}></div>
                <div className="skeleton skeleton-points" style={{ width: '20%' }}></div>
              </div>
            ))}
          </div>

          {/* Skeleton for pagination */}
          <div className="skeleton-pagination">
            <div className="skeleton skeleton-button"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-button"></div>
          </div>
        </section>
      </div>
    );
  }

  // Render skeleton loader for just the list when changing pages
  if (loading && currentPage !== 0) {
    return (
      <div className="container">
        <section className="section">
          <h2 className="sectionTitle">Global Ranking</h2>

          {/* Skeleton for regular ranking items */}
          <div className="rankingContainer">
            {[...Array(10)].map((_, index) => (
              <div className="skeleton-rankingItem" key={index}>
                <div className="skeleton skeleton-rank" style={{ width: '40px' }}></div>
                <div className="skeleton skeleton-profileImage" style={{ width: '40px', height: '40px' }}></div>
                <div className="skeleton skeleton-username" style={{ width: '30%' }}></div>
                <div className="skeleton skeleton-points" style={{ width: '20%' }}></div>
              </div>
            ))}
          </div>

          {/* Pagination (keep real pagination for page changes) */}
          <div className="pagination">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0 || loading}
            >
              Previous
            </button>
            <span>Page {currentPage + 1} of {totalPages}</span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1 || loading}
            >
              Next
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container">
      <section className="section">
        <h2 className="sectionTitle">Global Ranking</h2>

        {currentPage === 0 && (
          <div className="topRankingContainer">
            {/* Second place */}
            <div className="topRankingItem">
              <span className="rank">2</span>
              <img src={user} alt="Profile" className="profileImage" />
              <span className="username">{topUsers[1]?.username || "Aya"}</span>
              <span className="points">{topUsers[1]?.points || 1980} pt</span>
            </div>

            {/* First place (center, larger) */}
            <div className="topRankingItem">
              <span className="rank">1</span>
              <img src={user} alt="Profile" className="profileImage" />
              <span className="username">{topUsers[0]?.username || "Hamza23"}</span>
              <span className="points">{topUsers[0]?.points || 2000} pt</span>
            </div>

            {/* Third place */}
            <div className="topRankingItem">
              <span className="rank">3</span>
              <img src={user} alt="Profile" className="profileImage" />
              <span className="username">{topUsers[2]?.username || "monsters"}</span>
              <span className="points">{topUsers[2]?.points || 1950} pt</span>
            </div>
          </div>
        )}

        <div className="rankingContainer">
          {users.map((user, index) => (
            <div className="rankingItem" key={user.id}>
              <span className="rank">#{currentPage === 0 ? index + 4 : currentPage * 10 + index + 1}</span>
              <img src={user.profileImage || Avatar} alt="Profile" className="profileImage" />
              <span className="username">{user.username}</span>
              <span className="points">{user.points} pt</span>
            </div>
          ))}

          {users.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '1rem' }}>No users found</div>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0 || loading}
          >
            Previous
          </button>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1 || loading}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default GlobalLeaderboard;
