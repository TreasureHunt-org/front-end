import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext.tsx";
import api from "../../../../api/axios.ts";
import { Plus, Trash2 } from "lucide-react";

import "../CreateChallenges/CreateChallenges.css";

const challengeTypes = ["CODING", "BUGFIX", "GAME"];

interface ChallengeInput {
  challengeType: string;
  title: string;
  description: string;
  points: number;
  challengeCodes: { language: string; code: string }[];
  optimalSolutions?: { language: string; code: string }[];
  externalGameUri: string;
  testCases: { input: string; expectedOutput: string; order: number }[];
  image: File | null;
  imagePreview?: string;
}

const CreateChallenges: React.FC = () => {
  const { huntId } = useParams<{ huntId: string }>();
  const { isAuthenticated } = useAuth();
  const [fetchedChallenges, setFetchedChallenges] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [challenges, setChallenges] = useState<ChallengeInput[]>([
    {
      challengeType: "",
      title: "",
      description: "",
      points: 0,
      challengeCodes: [{ language: "JAVA", code: "" }],
      optimalSolutions: [{ language: "JAVA", code: "" }],
      externalGameUri: "",
      testCases: [{ input: "", expectedOutput: "", order: 1 }],
      image: null,
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (!huntId) return;
      try {
        // Optionally, fetch hunt details
        // const huntRes = await api.get(`/hunts/${huntId}`);
        // setHuntData(huntRes.data);

        const challengesRes = await api.get(`/hunts/${huntId}/challenges`);
        setFetchedChallenges(challengesRes.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [huntId]);

  const handleAddChallenge = () => {
    setChallenges((prev) => [
      ...prev,
      {
        challengeType: "",
        title: "",
        description: "",
        points: 0,
        challengeCodes: [{ language: "JAVA", code: "" }],
        optimalSolutions: [{ language: "JAVA", code: "" }],
        externalGameUri: "",
        testCases: [{ input: "", expectedOutput: "", order: 1 }],
        image: null,
      },
    ]);
  };

  const handleRemoveChallenge = (index: number) => {
    setChallenges((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeChallengeData = (
    challengeIndex: number,
    field: keyof Omit<ChallengeInput, "testCases" | "image" | "imagePreview">,
    value: any,
  ) => {
    setChallenges((prev) =>
      prev.map((challenge, i) =>
        i === challengeIndex ? { ...challenge, [field]: value } : challenge,
      ),
    );
  };

  const handleChangeTestCase = (
    challengeIndex: number,
    testCaseIndex: number,
    field: "input" | "expectedOutput",
    value: string,
  ) => {
    setChallenges((prev) =>
      prev.map((challenge, i) => {
        if (i === challengeIndex) {
          const updatedTestCases = challenge.testCases.map((tc, tci) =>
            tci === testCaseIndex ? { ...tc, [field]: value } : tc,
          );
          return { ...challenge, testCases: updatedTestCases };
        }
        return challenge;
      }),
    );
  };

  const handleRemoveTestCase = (
    challengeIndex: number,
    testCaseIndex: number,
  ) => {
    setChallenges((prev) =>
      prev.map((challenge, i) => {
        if (i === challengeIndex) {
          const updatedTestCases = challenge.testCases
            .filter((_, tci) => tci !== testCaseIndex)
            .map((tc, newIndex) => ({ ...tc, order: newIndex + 1 }));
          return { ...challenge, testCases: updatedTestCases };
        }
        return challenge;
      }),
    );
  };

  const handleAddTestCase = (challengeIndex: number) => {
    setChallenges((prev) =>
      prev.map((challenge, i) => {
        if (i === challengeIndex) {
          const newTestCase = {
            input: "",
            expectedOutput: "",
            order: challenge.testCases.length + 1,
          };
          return {
            ...challenge,
            testCases: [...challenge.testCases, newTestCase],
          };
        }
        return challenge;
      }),
    );
  };

  const handleImageChange = (
    challengeIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setChallenges((prev) =>
        prev.map((challenge, i) =>
          i === challengeIndex
            ? { ...challenge, image: file, imagePreview: previewUrl }
            : challenge,
        ),
      );
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setChallenges((prev) =>
        prev.map((challenge, i) =>
          i === challengeIndex
            ? { ...challenge, image: null, imagePreview: undefined }
            : challenge,
        ),
      );
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) return alert("Please log in first");
    if (challenges.some((ch) => !ch.challengeType)) {
      alert("Please select a challenge type for all challenges.");
      return;
    }
    if (challenges.some((ch) => !ch.image)) {
      alert("Please upload an image for all challenges.");
      return;
    }

    // Validate required fields based on challenge type
    for (const challenge of challenges) {
      if (challenge.challengeType === "GAME" && !challenge.externalGameUri) {
        alert("Please enter an external game URI for all GAME challenges.");
        return;
      }
      if (
        (challenge.challengeType === "CODING" ||
          challenge.challengeType === "BUGFIX") &&
        (!challenge.challengeCodes ||
          challenge.challengeCodes.length === 0 ||
          !challenge.challengeCodes[0].code)
      ) {
        alert(
          "Please enter challenge code for all CODING and BUGFIX challenges.",
        );
        return;
      }
      if (
        challenge.challengeType === "BUGFIX" &&
        (!challenge.optimalSolutions ||
          challenge.optimalSolutions.length === 0 ||
          !challenge.optimalSolutions[0].code)
      ) {
        alert("Please enter optimal solution for all BUGFIX challenges.");
        return;
      }
      if (
        (challenge.challengeType === "CODING" ||
          challenge.challengeType === "BUGFIX") &&
        (!challenge.testCases ||
          challenge.testCases.length === 0 ||
          !challenge.testCases[0].input ||
          !challenge.testCases[0].expectedOutput)
      ) {
        alert(
          "Please enter at least one test case for all CODING and BUGFIX challenges.",
        );
        return;
      }
    }

    setIsSubmitting(true);
    const formData = new FormData();

    challenges.forEach((challenge) => {
      // Create a copy of the challenge data
      const challengeDataToSend = { ...challenge };

      // Remove imagePreview as it's only for UI
      delete challengeDataToSend.imagePreview;

      // Format data based on challenge type
      if (challenge.challengeType === "GAME") {
        // For GAME, we only need externalGameUri
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        delete challengeDataToSend.challengeCodes;
        delete challengeDataToSend.optimalSolutions;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        delete challengeDataToSend.testCases;
      } else if (challenge.challengeType === "CODING") {
        // For CODING, we need challengeCodes and testCases
        delete challengeDataToSend.optimalSolutions;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        delete challengeDataToSend.externalGameUri;
      } else if (challenge.challengeType === "BUGFIX") {
        // For BUGFIX, we need challengeCodes, optimalSolutions, and testCases
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        delete challengeDataToSend.externalGameUri;
      }

      formData.append(`challengeData`, JSON.stringify(challengeDataToSend));
      if (challenge.image) {
        formData.append(`image`, challenge.image);
      }
    });

    try {
      await api.put(`/hunts/${huntId}/challenges`, formData);
      alert("Challenges submitted successfully!");
      // Reset state and refetch challenges
      setChallenges([
        {
          challengeType: "",
          title: "",
          description: "",
          points: 0,
          challengeCodes: [{ language: "JAVA", code: "" }],
          optimalSolutions: [{ language: "JAVA", code: "" }],
          externalGameUri: "",
          testCases: [{ input: "", expectedOutput: "", order: 1 }],
          image: null,
        },
      ]);
      const challengesRes = await api.get(`/hunts/${huntId}/challenges`);
      setFetchedChallenges(challengesRes.data || []);
    } catch (error: any) {
      console.error("Error adding challenges:", error);
      alert(
        `Submission failed: ${error.response?.data?.message || error.message}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup image preview URL on unmount
  useEffect(() => {
    return () => {
      challenges.forEach((challenge) => {
        if (challenge.imagePreview) {
          URL.revokeObjectURL(challenge.imagePreview);
        }
      });
    };
  }, [challenges]);

  const handleSubmitForReview = async () => {
    // this should be a POST request to submit the hunt for review
    // huntId
    const resp = await api.put(`/hunts/${huntId}`);
    if (resp.status === 200) {
      alert("Hunt submitted for review");
    } else {
      alert("Error submitting hunt for review");
    }
  };

  return (
    <div className="px-20 pb-10">
      {/* Header */}
      <div className="border-bpb-4 mb-6 flex items-center justify-between">
        {/* <h2 className="view-hunts-title">
          Create Challenges for Hunt #{huntId}
        </h2> */}
        {/*<button*/}
        {/*  onClick={() => navigate(-1)}*/}
        {/*  className="add-btn flex items-center justify-center"*/}
        {/*>*/}
        {/*  <ArrowLeft size={16} className="mr-2" />*/}
        {/*  Back*/}
        {/*</button>*/}
      </div>

      {/* Existing Challenges */}
      {fetchedChallenges.length > 0 && (
        <div className="mb-8 rounded-lg bg-[#333] p-4 text-white shadow">
          <h3 className="mb-3 text-lg font-semibold">Existing Challenges</h3>
          <ul className="list-inside list-disc space-y-1">
            {fetchedChallenges.map((ch, index) => (
              <li key={ch.challengeId || index}>
                <span className="font-medium">{ch.challengeType}</span>:{" "}
                {ch.title} ({ch.points} pts)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Challenge Forms */}
      <div className="space-y-6">
        {challenges.map((challenge, index) => (
          <div
            key={index}
            className="relative rounded-lg border border-gray-600 bg-[#333] p-6 text-white shadow"
          >
            {challenges.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveChallenge(index)}
                className="delete-btn absolute top-3 right-3 p-1"
                aria-label="Remove challenge"
              >
                <Trash2 size={16} className="delete-icon" />
              </button>
            )}
            <div className="grid grid-cols-1 gap-4">
              {/* Challenge Type */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold">
                  Challenge Type
                </label>
                <select
                  value={challenge.challengeType}
                  onChange={(e) =>
                    handleChangeChallengeData(
                      index,
                      "challengeType",
                      e.target.value,
                    )
                  }
                  className="filter-select rounded border border-gray-600 bg-[#444] px-3 py-2 text-white focus:border-[#f39c12] focus:outline-none"
                >
                  <option value="">Select Type</option>
                  {challengeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold">Title</label>
                <input
                  type="text"
                  value={challenge.title}
                  onChange={(e) =>
                    handleChangeChallengeData(index, "title", e.target.value)
                  }
                  className="rounded border border-gray-600 bg-[#444] px-3 py-2 text-white focus:border-[#f39c12] focus:outline-none"
                  placeholder="Enter challenge title"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold">
                  Description
                </label>
                <textarea
                  value={challenge.description}
                  onChange={(e) =>
                    handleChangeChallengeData(
                      index,
                      "description",
                      e.target.value,
                    )
                  }
                  className="rounded border border-gray-600 bg-[#444] px-3 py-2 text-white focus:border-[#f39c12] focus:outline-none"
                  placeholder="Enter challenge description"
                />
              </div>

              {/* Points */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold">Points</label>
                <input
                  type="number"
                  value={challenge.points}
                  onChange={(e) =>
                    handleChangeChallengeData(
                      index,
                      "points",
                      Number(e.target.value),
                    )
                  }
                  className="rounded border border-gray-600 bg-[#444] px-3 py-2 text-white focus:border-[#f39c12] focus:outline-none"
                  placeholder="0"
                />
              </div>

              {/* Conditional fields based on challenge type */}
              {challenge.challengeType === "GAME" && (
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold">
                    External Game URI
                  </label>
                  <input
                    type="text"
                    value={challenge.externalGameUri}
                    onChange={(e) =>
                      handleChangeChallengeData(
                        index,
                        "externalGameUri",
                        e.target.value,
                      )
                    }
                    className="rounded border border-gray-600 bg-[#444] px-3 py-2 text-white focus:border-[#f39c12] focus:outline-none"
                    placeholder="Enter external game URI"
                  />
                </div>
              )}

              {(challenge.challengeType === "CODING" ||
                challenge.challengeType === "BUGFIX") && (
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold">
                    Challenge Code
                  </label>
                  {challenge.challengeCodes.map((code, codeIndex) => (
                    <div key={codeIndex} className="mb-2">
                      <select
                        value={code.language}
                        onChange={(e) => {
                          const newChallengeCodes = [
                            ...challenge.challengeCodes,
                          ];
                          newChallengeCodes[codeIndex] = {
                            ...newChallengeCodes[codeIndex],
                            language: e.target.value,
                          };
                          handleChangeChallengeData(
                            index,
                            "challengeCodes",
                            newChallengeCodes,
                          );
                        }}
                        className="mb-2 w-full rounded border border-gray-600 bg-[#444] px-3 py-2 text-white focus:border-[#f39c12] focus:outline-none"
                      >
                        <option value="JAVA">Java</option>
                        <option value="PYTHON">Python</option>
                        <option value="JAVASCRIPT">JavaScript</option>
                      </select>
                      <textarea
                        value={code.code}
                        onChange={(e) => {
                          const newChallengeCodes = [
                            ...challenge.challengeCodes,
                          ];
                          newChallengeCodes[codeIndex] = {
                            ...newChallengeCodes[codeIndex],
                            code: e.target.value,
                          };
                          handleChangeChallengeData(
                            index,
                            "challengeCodes",
                            newChallengeCodes,
                          );
                        }}
                        className="w-full rounded border border-gray-600 bg-[#444] px-3 py-2 text-white focus:border-[#f39c12] focus:outline-none"
                        placeholder="Enter code"
                        rows={5}
                      />
                    </div>
                  ))}
                </div>
              )}

              {challenge.challengeType === "BUGFIX" && (
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-semibold">
                    Optimal Solution
                  </label>
                  {challenge.optimalSolutions?.map(
                    (solution, solutionIndex) => (
                      <div key={solutionIndex} className="mb-2">
                        <select
                          value={solution.language}
                          onChange={(e) => {
                            const newOptimalSolutions = [
                              ...(challenge.optimalSolutions || []),
                            ];
                            newOptimalSolutions[solutionIndex] = {
                              ...newOptimalSolutions[solutionIndex],
                              language: e.target.value,
                            };
                            handleChangeChallengeData(
                              index,
                              "optimalSolutions",
                              newOptimalSolutions,
                            );
                          }}
                          className="mb-2 w-full rounded border border-gray-600 bg-[#444] px-3 py-2 text-white focus:border-[#f39c12] focus:outline-none"
                        >
                          <option value="JAVA">Java</option>
                          <option value="PYTHON">Python</option>
                          <option value="JAVASCRIPT">JavaScript</option>
                        </select>
                        <textarea
                          value={solution.code}
                          onChange={(e) => {
                            const newOptimalSolutions = [
                              ...(challenge.optimalSolutions || []),
                            ];
                            newOptimalSolutions[solutionIndex] = {
                              ...newOptimalSolutions[solutionIndex],
                              code: e.target.value,
                            };
                            handleChangeChallengeData(
                              index,
                              "optimalSolutions",
                              newOptimalSolutions,
                            );
                          }}
                          className="w-full rounded border border-gray-600 bg-[#444] px-3 py-2 text-white focus:border-[#f39c12] focus:outline-none"
                          placeholder="Enter optimal solution code"
                          rows={5}
                        />
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* Test Cases - Only show for CODING and BUGFIX */}
              {(challenge.challengeType === "CODING" ||
                challenge.challengeType === "BUGFIX") && (
                <div className="w-full">
                  <h4 className="mb-2 text-sm font-semibold">Test Cases</h4>
                  {challenge.testCases.map((tc, tcIndex) => (
                    <div key={tcIndex} className="mb-2 flex items-center gap-3">
                      <input
                        type="text"
                        value={tc.input}
                        onChange={(e) =>
                          handleChangeTestCase(
                            index,
                            tcIndex,
                            "input",
                            e.target.value,
                          )
                        }
                        placeholder="Input"
                        className="flex-1 rounded border border-gray-600 bg-[#444] px-3 py-2 text-white focus:border-[#f39c12] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={tc.expectedOutput}
                        onChange={(e) =>
                          handleChangeTestCase(
                            index,
                            tcIndex,
                            "expectedOutput",
                            e.target.value,
                          )
                        }
                        placeholder="Expected Output"
                        className="flex-1 rounded border border-gray-600 bg-[#444] px-3 py-2 text-white focus:border-[#f39c12] focus:outline-none"
                      />
                      {challenge.testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTestCase(index, tcIndex)}
                          className="delete-btn p-1"
                          aria-label="Remove test case"
                        >
                          <Trash2 size={16} className="delete-icon" />
                        </button>
                      )}
                    </div>
                  ))}
                  <div>
                    <button
                      type="button"
                      onClick={() => handleAddTestCase(index)}
                      className="flex items-center justify-start rounded-full bg-[#f39c12] p-2"
                    >
                      <Plus size={16} />
                      Add Test Case
                    </button>
                  </div>
                </div>
              )}

              {/* File Upload for Image */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-semibold">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e)}
                  className="rounded border border-gray-600 bg-[#444] px-3 py-2 text-white focus:border-[#f39c12] focus:outline-none"
                />
                {challenge.imagePreview && (
                  <img
                    src={challenge.imagePreview}
                    alt="Preview"
                    className="mt-2 h-52 rounded object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add New Challenge Button */}
        <div className="flex w-full justify-between">
          <button
            type="button"
            onClick={handleAddChallenge}
            className="add-btn inline-flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Challenge
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="add-btn w-full py-3 text-lg font-bold disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Challenges"}
          </button>
          <button
            type="button"
            onClick={handleSubmitForReview}
            disabled={isSubmitting}
            className="add-btn w-full py-3 text-lg font-bold disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit for review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChallenges;
