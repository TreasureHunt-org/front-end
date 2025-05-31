import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
// import square from "/src/assets/locked.png";
import square from "/src/assets/lock-up_9381880.png";
import unlocked from "/src/assets/unlocked.png";
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
  const [challengeImages, setChallengeImages] = useState<(string | null)[]>([]);
  const [unlockedPieces, setUnlockedPieces] = useState(0);
  const [totalPieces, setTotalPieces] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [huntExpired, setHuntExpired] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingStates, setLoadingStates] = useState<boolean[]>([]);

  const challengesRef = useRef<Challenge[]>([]);

  const formatTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) return "00:00:00:00";

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      days.toString().padStart(2, "0"),
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  };

  const loadImageWithRetry = useCallback(
    async (challengeId: number, retries = 3): Promise<string> => {
      try {
        const res = await api.get(
          `/hunts/challenges/${challengeId}/img?t=${Date.now()}`,
          {
            responseType: "blob",
            headers: {
              "Content-Type": "image",
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          },
        );

        return URL.createObjectURL(res.data);
      } catch (error) {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return loadImageWithRetry(challengeId, retries - 1);
        }
        throw error;
      }
    },
    [],
  );

  const loadAllImages = useCallback(
    async (list: Challenge[]) => {
      setLoadingStates(new Array(list.length).fill(true));

      const imagePromises = list.map(async (ch) => {
        if (!ch.solved) return null;

        try {
          return await loadImageWithRetry(ch.challengeId);
          // const url = await loadImageWithRetry(ch.challengeId);
          // return url;
        } catch (error) {
          console.error("Image load failed:", error);
          // console.error(
          //   `Failed to load image for challenge ${ch.challengeId}:`,
          //   error,
          // );
          // return square;
          return null;
        }
      });

      const urls = await Promise.all(imagePromises);
      console.log("Loaded image URLs:", urls);
      setChallengeImages(urls);
      setLoadingStates(new Array(list.length).fill(false));
    },
    [loadImageWithRetry],
  );

  const fetchHuntAndChallenges = useCallback(async () => {
    try {
      const [huntRes, challRes, infoRes] = await Promise.all([
        api.get(`/hunts/${huntId}`),
        api.get(`/hunts/${huntId}/challenges`),
        api.get(`/hunts/${huntId}/challenges/info`),
      ]);

      const hunt = huntRes.data;
      const list: Challenge[] = challRes.data;
      const info = infoRes.data;

      console.log(infoRes.data);

      setHuntData(hunt);
      const now = new Date();
      const end = new Date(hunt.endDate);
      const rem =
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
      challengesRef.current = updated;
      await loadAllImages(challengesRef.current);

      setTotalPieces(updated.length);
      setUnlockedPieces(info.challenges.filter((c: any) => c.solved).length);
      // setUnlockedPieces(info.solved);
      setTotalPoints(info.pointsCollected);

      // await loadAllImages(updated);
    } catch (e) {
      console.error("Initialization error:", e);
    }
  }, [huntId, loadAllImages]);

  useEffect(() => {
    const onSolve = async (e: any) => {
      const { challengeId, points } = e.detail;

      setChallenges((prev) => {
        const updated = prev.map((c) =>
          c.challengeId === challengeId ? { ...c, solved: true } : c,
        );
        challengesRef.current = updated;
        return updated;
      });

      setUnlockedPieces((u) => u + 1);
      setTotalPoints((t) => t + points);

      const idx = challengesRef.current.findIndex(
        (c) => c.challengeId === challengeId,
      );
      if (idx === -1) return;

      try {
        setLoadingStates((prev) => {
          const newStates = [...prev];
          newStates[idx] = true;
          return newStates;
        });

        const imageUrl = await loadImageWithRetry(challengeId);

        setChallengeImages((prev) => {
          const newImages = [...prev];
          if (prev[idx]) URL.revokeObjectURL(prev[idx]!);
          newImages[idx] = imageUrl;
          return newImages;
        });
        console.log(challengeImages);
      } catch (error) {
        console.error("Failed to load solved challenge image:", error);
      } finally {
        setLoadingStates((prev) => {
          const newStates = [...prev];
          newStates[idx] = false;
          return newStates;
        });
      }
    };

    window.addEventListener("challengeSolved", onSolve);
    return () => window.removeEventListener("challengeSolved", onSolve);
  }, [loadImageWithRetry]);

  useEffect(() => {
    if (huntId) fetchHuntAndChallenges();
  }, [huntId, fetchHuntAndChallenges]);

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

  useEffect(() => {
    return () => {
      challengeImages.forEach((url) => {
        // if (url && url !== square) {
        if (url && url !== "/src/assets/square.jpg") {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [challengeImages]);

  const handleSubmitCode = async () => {
    if (codeInput.trim().length !== 6) {
      setSubmitMessage("Code must be 6 characters!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/hunts/${huntId}/submit-code`, {
        huntId,
        code: codeInput.trim(),
      });
      setSubmitMessage(res.data.success ? "Code accepted!" : "Invalid code");
    } catch (error) {
      setSubmitMessage("Submission failed. Try again.");
      console.error("CODE SUBMISSION ERROR:", error);
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    const updateImagesForSolved = async () => {
      const promises = challenges.map(async (ch, index) => {
        if (ch.solved && !challengeImages[index]) {
          try {
            const url = await loadImageWithRetry(ch.challengeId);
            return url;
          } catch {
            return null;
          }
        }
        return challengeImages[index];
      });

      const updatedImages = await Promise.all(promises);
      setChallengeImages(updatedImages);
    };

    updateImagesForSolved();
  }, [challengeImages, challenges, loadImageWithRetry]);

  return (
    <div className="map-pieces-layout">
      <div className="left-section">
        <div className="map-pieces">
          {challenges.map((ch, i) => {
            // const imgSrc = ch.solved ? challengeImages[i] || square : square;
            const imgSrc =
              ch.solved && challengeImages[i] ? challengeImages[i]! : square;

            // const imgSrc = ch.solved && challengeImages[i];

            // const imgSrc =
            //   ch.solved &&
            //   challengeImages[i] &&
            //   !challengeImages[i].includes("square.jpg")
            //     ? challengeImages[i]
            //     : square;

            return (
              <div
                key={`challenge-${ch.challengeId}`}
                className="piece-container"
              >
                {loadingStates[i] && (
                  <div className="image-loading-overlay">
                    <div className="spinner"></div>
                  </div>
                )}
                <img
                  src={imgSrc}
                  className={`square ${ch.solved ? "unlocked" : "locked"}`}
                  onClick={() => navigate(`/challenge/${ch.challengeId}`)}
                  alt={
                    ch.solved ? `Solved: ${ch.title}` : `Locked: ${ch.title}`
                  }
                  // onError={(e) => {
                  //   const img = e.target as HTMLImageElement;
                  //   if (img.src !== square) {
                  //     img.src = square;
                  //   }
                  // }}

                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = unlocked;
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="right-section">
        <span>🏴‍☠️Tip :Solve Challenges to get the map pieces</span>

        <div className="timer">
          <h4>
            ⌛
            <span>
              {huntExpired ? "00:00:00:00" : formatTime(remainingSeconds)}
            </span>
          </h4>
        </div>

        {!huntExpired ? (
          <>
            <div className="points">
              <h2>⭐ {totalPoints}</h2>
            </div>
            <p>
              {unlockedPieces}/{totalPieces} Pieces Collected
            </p>
            <progress
              value={unlockedPieces}
              max={totalPieces}
              className="progress-bar"
            />

            {unlockedPieces === totalPieces && (
              <div className="code-entry-section">
                <h2 className="win-banner">
                  🎉 Congratulations! You’ve completed the hunt! 🎯
                </h2>
                <p>Enter your final code to claim your reward:</p>
                <input
                  type="text"
                  maxLength={6}
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="6-digit code"
                />
                <button onClick={handleSubmitCode} disabled={submitting}>
                  {submitting ? "..." : "Submit"}
                </button>
                {submitMessage && (
                  <p className="submit-message">{submitMessage}</p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="hunt-finished-message">
            <h2>Hunt has ended</h2>
          </div>
        )}
        <button className="rank-btn" onClick={() => navigate("/hunt-ranking")}>
          View Rankings 🏆
        </button>
      </div>
    </div>
  );
};

export default HuntMapPieces;
