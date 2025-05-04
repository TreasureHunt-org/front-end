import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import square from "/src/assets/square.jpg";
import API_BASE_URL from "../../constants/API_BASE_URL";
import Challenge from "../Organizer/Challenge";

interface Challenge {
  challengeId: number;
  title: string;
  description: string;
  points: number;
  challengeType: string;
  externalGameUri: string;
  testCases: any[];
  optimalSolutions: any[];
  challengeCodes: any[];
  createdAt: string;
  solved?: boolean;
}

const HuntMapPieces: React.FC = () => {
  const { huntId } = useParams<{ huntId: string }>();
  const navigate = useNavigate();

  const [huntData, setHuntData] = useState<any>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [unlockedPieces, setUnlockedPieces] = useState<number>(0);
  const [totalPieces, setTotalPieces] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [huntExpired, setHuntExpired] = useState<boolean>(false);
  const [codeInput, setCodeInput] = useState<string>("");
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [challengeImages, setChallengeImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchHunt = async () => {
      try {
        const res = await api.get(`${API_BASE_URL}/hunts/${huntId}`);
        const data = res.data;
        setHuntData(data);

        const now = new Date();
        const end = new Date(data.endDate);
        const remaining =
          now < end ? Math.floor((end.getTime() - now.getTime()) / 1000) : 0;

        setRemainingSeconds(remaining);
        setHuntExpired(remaining <= 0);
      } catch (err) {
        console.error("Error fetching hunt data", err);
      }
    };

    fetchHunt();
  }, [huntId]);

  useEffect(() => {
    const fetchChallengesAndImages = async () => {
      try {
        const res = await api.get(`${API_BASE_URL}/hunts/${huntId}/challenges`);
        const challengesData: Challenge[] = res.data;
        setChallenges(challengesData);
        setTotalPieces(challengesData.length);
        setUnlockedPieces(challengesData.length);

        const images = await Promise.all(
          challengesData.map(async (challenge) => {
            try {
              const res = await api.get(
                `${API_BASE_URL}/hunts/challenges/${challenge.challengeId}/img`,
                { responseType: "blob" },
              );
              return URL.createObjectURL(res.data);
            } catch (err) {
              console.warn(
                `Image not found for challenge ${challenge.challengeId}`,
              );
              return square; // fallback image
            }
          }),
        );

        setChallengeImages(images);
      } catch (err) {
        console.error("Failed to fetch challenges or images", err);
      }
    };

    fetchChallengesAndImages();
  }, [huntId]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      setHuntExpired(true);
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setHuntExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const pointsCollected = unlockedPieces * 50;

  const handleSubmitCode = async () => {
    if (codeInput.trim().length !== 6) {
      setSubmitMessage("Please enter a valid code!");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitMessage("");

      const res = await api.post(
        `${API_BASE_URL}/hunts/${huntId}/submit-code`,
        {
          huntId,
          code: codeInput.trim(),
        },
      );

      if (res.data.success) {
        setSubmitMessage("Code submitted successfully!");
      } else {
        setSubmitMessage("Incorrect or already used code.");
      }
    } catch (error) {
      console.error("Submission failed", error);
      setSubmitMessage("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChallenge = (challengeId: number) => {
    navigate(`/challenge/${challengeId}`);
  };
  return (
    <div className="map-pieces-container">
      <div>
        <button className="rank-btn" onClick={() => navigate("/hunt-ranking")}>
          View Hunt Rankings 🏆
        </button>
      </div>

      {/* Timer */}
      <div className="timer">
        <h2>
          Time Left:{" "}
          <span>
            {huntExpired ? "⏱️ Hunt Finished" : formatTime(remainingSeconds)}
          </span>
        </h2>
      </div>

      {!huntExpired ? (
        <>
          <progress
            value={unlockedPieces}
            max={totalPieces}
            className="progress-bar"
          ></progress>
          <p>{unlockedPieces} Pieces Collected</p>

          <div className="points">
            <h2>⭐ Points: {pointsCollected}</h2>
          </div>

          <div className="map-pieces">
            {challenges.map((challenge, index) => (
              <img
                key={challenge.challengeId}
                onClick={() => handleOpenChallenge(challenge.challengeId)}
                className={`square ${index < unlockedPieces ? "unlocked" : "locked"}`}
                src={
                  index < challengeImages.length
                    ? challengeImages[index]
                    : square
                }
                alt={`map-piece-${index}`}
              />
            ))}
          </div>

          {unlockedPieces === totalPieces && (
            <div className="code-entry-section">
              <br />
              <span className="timer">🎉 All Map Pieces Unlocked!</span>
              <br />
              <p>
                Go and Visit the revealed location to get the hidden treasure
                code.
              </p>
              <p>Hurry up!</p>
              <br />
              <p>Please enter the treasure code you discovered:</p>

              <input
                type="text"
                maxLength={6}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Enter code here"
                style={{
                  marginTop: "0.5rem",
                  padding: "0.6rem",
                  fontSize: "1.2rem",
                  textAlign: "center",
                  width: "200px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
              <br />
              <button
                style={{
                  marginTop: "1rem",
                  padding: "0.6rem 1.2rem",
                  backgroundColor: "#f39c12",
                  color: "#fff",
                  border: "none",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                disabled={submitting}
                onClick={handleSubmitCode}
              >
                {submitting ? "Submitting..." : "Submit Code"}
              </button>

              {submitMessage && (
                <p style={{ marginTop: "1rem", color: "red" }}>
                  {submitMessage}
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="hunt-finished-message">
          <h2 style={{ marginTop: "2rem", color: "red" }}>
            The hunt has ended. Better luck next time!
          </h2>
          <button
            className="rank-btn"
            onClick={() => navigate("/hunt-ranking")}
          >
            View Hunt Rankings 🏆
          </button>
        </div>
      )}
    </div>
  );
};

export default HuntMapPieces;
