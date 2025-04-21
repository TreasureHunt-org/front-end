import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const challengeTypes = ["CODING", "BUG_FIX", "MINI_GAME"];

interface Location {
  latitude: number;
  longitude: number;
}

interface Hunt {
  id: number;
  title: string;
  description: string;
  organizerId: number;
  startDate: string;
  endDate: string;
  huntStatus: string;
  location: Location;
}

const CreateChallenges: React.FC = () => {
  const { huntId } = useParams<{ huntId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [fetchedChallenges, setFetchedChallenges] = useState<any[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [huntData, setHuntData] = useState<Hunt | null>(null);
  const [challenges, setChallenges] = useState([
    {
      challengeType: "",
      title: "",
      description: "",
      points: 0,
      challengeCode: { language: "JAVA", code: "" },
      externalGameUri: "",
      bugDescription: "",
      expectedBehavior: "",
      testCases: [{ input: "", expectedOutput: "", order: 1 }],
      image: null as File | null,
    },
  ]);
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await api.get(`/hunts/${huntId}/challenges`);
        setFetchedChallenges(response.data);
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
      }
    };

    if (huntId) fetchChallenges();
  }, [huntId]);

  const handleAddChallenge = () => {
    setChallenges([
      ...challenges,
      {
        challengeType: "",
        title: "",
        description: "",
        points: 0,
        challengeCode: { language: "JAVA", code: "" },
        externalGameUri: "",
        bugDescription: "",
        expectedBehavior: "",
        testCases: [{ input: "", expectedOutput: "", order: 1 }],
        image: null,
      },
    ]);
  };

  const handleChangeChallengeData = (
    challengeIndex: number,
    field: string,
    value: any,
  ) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[challengeIndex][field] = value;
    setChallenges(updatedChallenges);
  };

  const handleChangeTestCase = (
    challengeIndex: number,
    testCaseIndex: number,
    field: "input" | "expectedOutput",
    value: string,
  ) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[challengeIndex].testCases[testCaseIndex][field] = value;
    setChallenges(updatedChallenges);
  };

  const handleAddTestCase = (challengeIndex: number) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[challengeIndex].testCases.push({
      input: "",
      expectedOutput: "",
      order: updatedChallenges[challengeIndex].testCases.length + 1,
    });
    setChallenges(updatedChallenges);
  };

  const handleImageChange = (
    challengeIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const updatedChallenges = [...challenges];
    if (e.target.files) {
      updatedChallenges[challengeIndex].image = e.target.files[0];
    }
    setChallenges(updatedChallenges);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) return alert("Please log in first");

    const formData = new FormData();
    challenges.forEach((challenge) => {
      formData.append(
        "challengeData",
        JSON.stringify({
          ...challenge,
          testCases: challenge.testCases,
        }),
      );
      formData.append("image", challenge.image as Blob);
    });

    try {
      const response = await api.put(`/hunts/${huntId}/challenges`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Challenges submitted successfully!");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error adding challenges:", error);
    }
  };

  return (
    <div className="reviewer-account-container">
      <div className="reviewer-header">
        <h2 className="reviewer-title">Create Challenges for Hunt #{huntId}</h2>
        <button onClick={() => navigate(-1)} className="send-btn">
          ← Back to Hunt
        </button>
      </div>

      {huntData && (
        <div className="hunt-details">
          <h3>Hunt Details</h3>
          <p>
            <strong>Title:</strong> {huntData.title}
          </p>
          <p>
            <strong>Description:</strong> {huntData.description}
          </p>
          <p>
            <strong>Status:</strong> {huntData.huntStatus}
          </p>
          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(huntData.startDate).toLocaleString()}
          </p>
          <p>
            <strong>End Date:</strong>{" "}
            {new Date(huntData.endDate).toLocaleString()}
          </p>
          <p>
            <strong>Location:</strong> {huntData.location.latitude},{" "}
            {huntData.location.longitude}
          </p>
        </div>
      )}

      {challenges.map((challenge, index) => (
        <form
          className="reviewer-form"
          key={index}
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor={`challengeType-${index}`}>Challenge Type</label>
          <select
            id={`challengeType-${index}`}
            value={challenge.challengeType}
            onChange={(e) =>
              handleChangeChallengeData(index, "challengeType", e.target.value)
            }
            className="reviewer-form-input"
          >
            <option value="">Select Challenge Type</option>
            {challengeTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {challenge.challengeType === "CODING" && (
            <>
              <label htmlFor={`title-${index}`}>Challenge Title</label>
              <input
                id={`title-${index}`}
                type="text"
                value={challenge.title}
                onChange={(e) =>
                  handleChangeChallengeData(index, "title", e.target.value)
                }
                className="reviewer-form-input"
              />

              <label htmlFor={`description-${index}`}>
                Challenge Description
              </label>
              <textarea
                id={`description-${index}`}
                value={challenge.description}
                onChange={(e) =>
                  handleChangeChallengeData(
                    index,
                    "description",
                    e.target.value,
                  )
                }
                className="announcement-textarea"
                required
              />

              <label htmlFor={`points-${index}`}>Points</label>
              <input
                id={`points-${index}`}
                type="number"
                value={challenge.points}
                onChange={(e) =>
                  handleChangeChallengeData(index, "points", +e.target.value)
                }
                className="reviewer-form-input"
              />

              <label htmlFor={`challengeCode-${index}`}>Challenge Code</label>
              <textarea
                id={`challengeCode-${index}`}
                value={challenge.challengeCode.code}
                onChange={(e) =>
                  handleChangeChallengeData(index, "challengeCode", {
                    ...challenge.challengeCode,
                    code: e.target.value,
                  })
                }
                className="announcement-textarea"
              />

              <label htmlFor={`testCases-${index}`}>Test Cases</label>
              {challenge.testCases.map((tc, idx) => (
                <div key={idx} style={{ display: "flex", gap: "1rem" }}>
                  <input
                    type="text"
                    placeholder="Test Case Input"
                    value={tc.input}
                    onChange={(e) =>
                      handleChangeTestCase(index, idx, "input", e.target.value)
                    }
                    className="reviewer-form-input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Expected Output"
                    value={tc.expectedOutput}
                    onChange={(e) =>
                      handleChangeTestCase(
                        index,
                        idx,
                        "expectedOutput",
                        e.target.value,
                      )
                    }
                    className="reviewer-form-input"
                    required
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddTestCase(index)}
                className="send-btn"
              >
                + Add Test Case
              </button>
            </>
          )}

          {/* {challenge.challengeType === "BUG_FIX" && <></>} */}

          {/* {challenge.challengeType === "MINI_GAME" && (
            <>
            </>
          )} */}

          <label htmlFor={`image-${index}`}>Challenge Image</label>
          <input
            id={`image-${index}`}
            type="file"
            onChange={(e) => handleImageChange(index, e)}
            className="reviewer-form-input"
            required
          />
        </form>
      ))}

      <button type="button" onClick={handleAddChallenge} className="send-btn">
        + Add Another Challenge
      </button>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitted || challenges.some((ch) => !ch.challengeType)}
        className="send-btn"
      >
        Submit for Review
      </button>

      {fetchedChallenges.length > 0 && (
        <div className="existing-challenges">
          <h3>Existing Challenges</h3>
          <ul>
            {fetchedChallenges.map((ch, index) => (
              <li key={ch.challengeId || index}>
                <strong>{ch.challengeType}</strong>: {ch.title} - {ch.points}{" "}
                pts
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreateChallenges;
