import React from "react";

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
  const language = challenge.challengeCodes?.[0]?.language || "java";
  const code = challenge.challengeCodes?.[0]?.code || "// empty";

  return (
    <div className="bugfix-container">
      <div>🐞</div>

      <div className="content">
        <h2>{challenge.title}</h2>
        <p style={{ color: "#f39c12", textAlign: "left" }}>
          <strong>Description:</strong>
        </p>
        <p style={{ textAlign: "left" }}>{challenge.description}</p>

        <div className="language-selector" style={{ textAlign: "left" }}>
          <label htmlFor="language">Select Language: </label>
          <select id="language" name="language">
            <option value={language}>{language}</option>
          </select>
        </div>

        <div className="code-box" style={{ textAlign: "left" }}>
          <pre>{code}</pre>
        </div>

        <hr className="custom-hr" />

        <h3>Test cases</h3>
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
                      onClick={() => navigator.clipboard.writeText(test.input)}
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
  );
};

export default BugFixChallenge;
