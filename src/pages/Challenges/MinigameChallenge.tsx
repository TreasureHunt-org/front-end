import React from "react";
import Navbar2 from "../../components/Navbar2";
import gameBackground from "../assets/game.png";
import "./MinigameChallenge.css";
import BugFixChallenge from "./BugFixChallenge";
import { useNavigate } from "react-router-dom";

const MinigameChallenge: React.FC = () => {
  const navigate = useNavigate();
  const goToBugFixChallenge = () => {
    navigate("/bugfixchallenge");
  };
  return (
    <div className="minigame-container">
      <Navbar2 />
      <div className="content"></div>
      <div className="button"></div>
      <button
        onClick={goToBugFixChallenge}
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

export default MinigameChallenge;
