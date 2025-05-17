import React, { useState } from "react";
import { Link } from "react-router-dom";
import CodeEditor from "../../../components/CodeEditor/CodeEditor";
import api from "../../../api/axios";
import API_BASE_URL from "../../../constants/apiURL/API_BASE_URL";

import "../BugFixChallenge/BugFixChallenge.css";

interface Challenge {
  challengeId: number;
  title: string;
  description: string;
  points: number;
  challengeType: string;
  externalGameUri: string;
  testCases: { input: string; expectedOutput: string }[];
  optimalSolutions: any[];
  challengeCodes: { language: string; code: string }[];
  createdAt: string;
  solved?: boolean;
}

const BugFixChallenge = ({ challenge }: { challenge: Challenge }) => {
  const defaultLanguage = challenge.challengeCodes?.[0]?.language || "JAVA";

  const getBuggyCode = (lang: string): string => {
    const match = challenge.challengeCodes.find((c) => c.language === lang);
    return match ? match.code : "// No buggy code available";
  };

  const [language, setLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState(getBuggyCode(defaultLanguage));
  const buggyCode = challenge.challengeCodes?.[0]?.code || "// Buggy code";
  // const handleLanguageChange = (lang: string) => {
  //   setLanguage(lang);
  //   setCode(getBuggyCode(lang));
  // };

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("Please write some code before submitting.");
      return;
    }

    try {
      const response = await api.post(
        `${API_BASE_URL}/challenges/${challenge.challengeId}/submissions`,
        {
          code,
          language,
        },
      );
      alert("Submission successful!");
      console.log("Response:", response.data);
    } catch (error: any) {
      console.error("Submission error:", error);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <>
      <div className="top-bar">
        <Link to="/Challenges">Back to challenges</Link>
        <Link to="/LastSubmissions">Last Submissions</Link>
      </div>

      <div className="main-content">
        <div className="code-editor-container">
          <CodeEditor
            language={language}
            height="100%"
            readonly={false}
            value={code}
            onChange={setCode}
          />
        </div>

        <div className="question-panel">
          <div className="flex">
            <h2>🐞 {challenge.title}</h2>

            {/* <div className="language-select-container">
            <label htmlFor="language-select">Language: </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {challenge.challengeCodes.map((item, idx) => (
                <option key={idx} value={item.language}>
                  {item.language}
                </option>
              ))}
            </select> */}

            <div className="fixed-button-container">
              <button
                className="fixed-button"
                type="button"
                onClick={handleSubmit}
              >
                Submit Fixed Code
              </button>
            </div>
          </div>
          {/* </div> */}

          <p style={{ color: "#f39c12", textAlign: "left" }}>
            <strong>Description:</strong>
          </p>
          <p style={{ textAlign: "left" }}>{challenge.description}</p>

          <p style={{ color: "#f39c12", textAlign: "left" }}>
            <strong>Code To Fix:</strong>
          </p>
          <p style={{ textAlign: "left" }}>{buggyCode}</p>

          <hr className="custom-hr" />
          <h3>Test Cases</h3>

          {challenge.testCases?.length > 0 ? (
            <table className="test-cases">
              <thead>
                <tr>
                  <th>Input</th>
                  <th>Expected Output</th>
                </tr>
              </thead>
              <tbody>
                {challenge.testCases.map((test, idx) => (
                  <tr key={idx}>
                    <td>
                      {test.input}
                      <button
                        className="copy-button"
                        onClick={() =>
                          navigator.clipboard.writeText(test.input)
                        }
                      >
                        📋
                      </button>
                    </td>
                    <td>{test.expectedOutput}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No test cases found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default BugFixChallenge;
