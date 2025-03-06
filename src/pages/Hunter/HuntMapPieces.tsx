import { useNavigate } from "react-router-dom";
import square from "/src/assets/square.jpg";

const HuntMapPieces = () => {
  const navigate = useNavigate();
  const totalPieces = 6;
  const unlockedPieces = 3;
  const pointsCollected = unlockedPieces * 50;

  return (
    <div className="map-pieces-container">
      {/* Timer */}
      <div className="timer">
        <h2>
          Time Left: <span>60s</span>
        </h2>
      </div>

      <progress
        value={unlockedPieces}
        max={totalPieces}
        className="progress-bar"
      ></progress>
      <p>
        {unlockedPieces} / {totalPieces} Pieces Collected
      </p>

      <div className="points">
        <h2>⭐ Points: {pointsCollected}</h2>
      </div>

      <div className="map-pieces">
        {[...Array(totalPieces)].map((_, index) => (
          <img
            key={index}
            className={`square ${index < unlockedPieces ? "unlocked" : "locked"}`}
            src={square}
            alt="map-piece"
          />
        ))}
      </div>

      {/* Hidden Treasure Message */}
      {unlockedPieces === totalPieces && (
        <div className="treasure">
          <h2>🎉 You Found the Treasure! 🎉</h2>
          <img src="/treasure.jpg" alt="Treasure" />
        </div>
      )}

      <button className="rank-btn" onClick={() => navigate("/hunt-ranking")}>
        View Hunt Rankings 🏆
      </button>
    </div>
  );
};

export default HuntMapPieces;
