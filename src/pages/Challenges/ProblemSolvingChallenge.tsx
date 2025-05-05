import React from "react";
import { Link } from "react-router-dom";
import CodeEditor from "../../components/CodeEditor";
import AceEditor from "react-ace";

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

const ProblemSolvingChallenge = ({ challenge }: { challenge: Challenge }) => {
  return (
    <div className="problem-solving-container">
      <div className="top-bar">
        <Link to="/Challenges">Back to challenges</Link>
        <Link to="/submit">Submit</Link>
        <Link to="/LastSubmissions">Last Submissions</Link>
      </div>

      <div className="content">
        <h2>{challenge?.title || "Problem Solving Challenge"}</h2>

        <p style={{ color: "#f39c12", textAlign: "left" }}>
          <strong>Description:</strong>
        </p>
        <p style={{ textAlign: "left" }}>{challenge?.description}</p>
      </div>

      <div className="bottom-section">
        <hr className="custom-hr" />
        <h3>Test cases</h3>
        {challenge?.testCases?.map((test, index) => (
          <table key={index} className="test-cases">
            <thead>
              <tr>
                <th>Input</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
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
            </tbody>
          </table>
        ))}
      </div>
      <div>
        <CodeEditor language="java" height="1000px" readonly={false} />
      </div>
    </div>
  );
};

export default ProblemSolvingChallenge;
