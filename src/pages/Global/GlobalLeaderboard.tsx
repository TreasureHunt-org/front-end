import React from "react";
import { useNavigate } from "react-router-dom";
import user from "/src/assets/user (1).png";
const GlobalLeaderboard: React.FC = () => {
  const navigate = useNavigate();

  const goToMinigameChallenge = () => {
    navigate("/minigamechallenge");
  };

  return (
    <div className="container">
      <section className="section">
        <h2 className="sectionTitle">Global Ranking</h2>

        <div className="topRankingContainer">
          <div className="topRankingItem">
            <span className="rank">2</span>
            <img src={user} alt="Profile" className="profileImage" />
            <span className="username">Aya</span>
            <span className="points">1980 pt</span>
          </div>

          <div className="topRankingItem">
            <span className="rank">1</span>
            <img src={user} alt="Profile" className="profileImage" />
            <span className="username">Hamza23</span>
            <span className="points">2000 pt</span>
          </div>

          <div className="topRankingItem">
            <span className="rank">3</span>
            <img src={user} alt="Profile" className="profileImage" />
            <span className="username">monsters</span>
            <span className="points">1980 pt</span>
          </div>
        </div>

        <div className="rankingContainer">
          <div className="rankingItem">
            <span className="rank">#4</span>
            <img src={user} alt="Profile" className="profileImage" />
            <span className="username">Faresah223</span>
            <span className="points">1156 pt</span>
          </div>

          <div className="rankingItem">
            <span className="rank">#5</span>
            <img src={user} alt="Profile" className="profileImage" />
            <span className="username">Ahmad</span>
            <span className="points">1155 pt</span>
          </div>

          <div className="rankingItem">
            <span className="rank">#6</span>
            <img src={user} alt="Profile" className="profileImage" />
            <span className="username">Ayman</span>
            <span className="points">1504 pt</span>
          </div>
        </div>
      </section>
      <button
        onClick={goToMinigameChallenge}
        style={{
          backgroundColor: "#f39c12",
          color: "white",
          padding: "10px",
          margin: "10px",
        }}
      >
        Go
      </button>
    </div>
  );
};

export default GlobalLeaderboard;
