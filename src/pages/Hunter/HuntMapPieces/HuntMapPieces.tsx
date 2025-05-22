import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import square from "/src/assets/square.jpg";

import "../../Hunter/HuntMapPieces/HuntMapPieces.css";
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
  const [challengeImages, setChallengeImages] = useState<string[]>([]);
  const [unlockedPieces, setUnlockedPieces] = useState(0);
  const [totalPieces, setTotalPieces] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [huntExpired, setHuntExpired] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const challengesRef = useRef<Challenge[]>([]);

  const loadAllImages = async (list: Challenge[]) => {
    const urls = await Promise.all(
      list.map(async (ch) => {
        if (!ch.solved) return square;
        try {
          const res = await api.get(`/hunts/challenges/${ch.challengeId}/img`, {
            responseType: "blob",
          });
          return URL.createObjectURL(res.data);
        } catch {
          return square;
        }
      }),
    );
    setChallengeImages(urls);
  };

  useEffect(() => {
    challengesRef.current = challenges;
  }, [challenges]);

  const fetchHuntAndChallenges = async () => {
    try {
      const [huntRes, challRes, infoRes] = await Promise.all([
        api.get(`/hunts/${huntId}`),
        api.get(`/hunts/${huntId}/challenges`),
        api.get(`/hunts/${huntId}/challenges/info`),
      ]);

      const hunt = huntRes.data;
      const list: Challenge[] = challRes.data;
      const info = infoRes.data;

      setHuntData(hunt);

      const now = new Date(),
        end = new Date(hunt.endDate),
        rem =
          now < end ? Math.floor((end.getTime() - now.getTime()) / 1000) : 0;
      setRemainingSeconds(rem);
      setHuntExpired(rem <= 0);

      const solvedMap = new Map(
        info.challenges.map((c: any) => [c.challenge_id, c.solved]),
      );
      const updated = list.map((ch) => ({
        ...ch,
        solved: Boolean(solvedMap.get(ch.challengeId)),
      }));

      setChallenges(updated);
      setTotalPieces(updated.length);
      setUnlockedPieces(info.challenges.filter((c: any) => c.solved).length);
      setTotalPoints(info.pointsCollected);

      await loadAllImages(updated);
    } catch (e) {
      console.error("Error fetching hunt or challenges", e);
    }
  };
  useEffect(() => {
    if (huntId) fetchHuntAndChallenges();
  }, [huntId]);

  useEffect(() => {
    const onSolve = (e: any) => {
      const { challengeId, points } = e.detail;
      const currentChallenges = [...challengesRef.current];
      const idx = currentChallenges.findIndex(
        (c) => c.challengeId === challengeId,
      );

      if (idx === -1) return;

      const updatedChallenges = currentChallenges.map((c) =>
        c.challengeId === challengeId ? { ...c, solved: true } : c,
      );

      setChallenges(updatedChallenges);
      setUnlockedPieces((u) => u + 1);
      setTotalPoints((t) => t + points);

      (async () => {
        try {
          const res = await api.get(`/hunts/challenges/${challengeId}/img`, {
            responseType: "blob",
          });
          const imageUrl = URL.createObjectURL(res.data);

          setChallengeImages((prev) => {
            const newImages = [...prev];
            newImages[idx] = imageUrl;
            return newImages;
          });
        } catch (error) {
          console.error("Failed to load challenge image:", error);
        }
      })();
    };
    window.addEventListener("challengeSolved", onSolve);
    return () => window.removeEventListener("challengeSolved", onSolve);
  }, []);
  // countdown
  useEffect(() => {
    if (remainingSeconds <= 0) {
      setHuntExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setRemainingSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          setHuntExpired(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleSubmitCode = async () => {
    if (codeInput.trim().length !== 6) {
      setSubmitMessage("Please enter a valid code!");
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.post(`/hunts/${huntId}/submit-code`, {
        huntId,
        code: codeInput.trim(),
      });
      setSubmitMessage(
        res.data.success
          ? "Code submitted successfully!"
          : "Incorrect or used code.",
      );
    } catch {
      setSubmitMessage("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="map-pieces-container">
      <button className="rank-btn" onClick={() => navigate("/hunt-ranking")}>
        View Hunt Rankings 🏆
      </button>

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
          />
          <p>{unlockedPieces} Pieces Collected</p>
          <div className="points">
            <h2>⭐ Points: {totalPoints}</h2>
          </div>
          <div className="map-pieces">
            {challenges.map((ch, i) => {
              const imgSrc = ch.solved ? challengeImages[i] || square : square;

              return (
                <img
                  key={ch.challengeId}
                  src={imgSrc}
                  className={`square ${ch.solved ? "unlocked" : "locked"}`}
                  onClick={() => navigate(`/challenge/${ch.challengeId}`)}
                  alt={
                    ch.solved
                      ? `Solved challenge ${ch.title}`
                      : `Locked challenge ${ch.title}`
                  }
                  onError={(e) => {
                    <img
                      class="square unlocked"
                      alt="Solved challenge Find the Sum of Two Numbers"
                      src="/src/assets/square.jpg"
                    ></img>;
                    const img = e.target as HTMLImageElement;
                    if (img.src !== square) {
                      img.src = square;
                    }
                  }}
                />
              );
            })}
          </div>

          {unlockedPieces === totalPieces && (
            <div className="code-entry-section">
              <br />
              <span className="timer">🎉 All Map Pieces Unlocked!</span>
              <p>Visit the treasure location to get your code!</p>
              <input
                type="text"
                maxLength={6}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Enter code"
              />
              <button onClick={handleSubmitCode} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Code"}
              </button>
              {submitMessage && <p style={{ color: "red" }}>{submitMessage}</p>}
            </div>
          )}
        </>
      ) : (
        <div className="hunt-finished-message">
          <h2 style={{ color: "red" }}>
            The hunt has ended. Better luck next time!
          </h2>
        </div>
      )}
    </div>
  );
};

export default HuntMapPieces;
