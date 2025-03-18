import React from "react";
import Navbar2 from "../../components/Navbar2";
import "./BugFixChallenge.css";
import { Link, useNavigate } from "react-router-dom";

const BugFixChallenge: React.FC = () => {
  const navigate = useNavigate();

  const goToProblemSolvingChallenge = () => {
    navigate("/problemsolvingchallenge");
  };

  return (
    <div className="bugfix-container">
      <Navbar2 />

      <div className="top-bar">
        <Link to="/Challenges">Back to challenges</Link>
        <Link to="/submit">Submit</Link>
        <Link to="/LastSubmissions">Last Submissions</Link>
      </div>

      <div className="content">
        <h2>Something is bugging me</h2>
        <p style={{ color: "#f39c12", textAlign: "left" }}>
          <strong>Description:</strong>
        </p>
        <p style={{ textAlign: "left" }}>
          A junior developer wrote a function to calculate the sum of an array
          of integers. However, the function returns incorrect results in some
          cases. Your task is to identify the bug, fix the function, and ensure
          it works as expected.
        </p>

        <div className="language-selector" style={{ textAlign: "left" }}>
          <label htmlFor="language">Select Language: </label>
          <select id="language" name="language">
            <option value="python">Python</option>
          </select>
        </div>

        <div className="code-box" style={{ textAlign: "left" }}>
          <pre>
            {`
def array_sum(arr):
    total = 0
    for i in range(len(arr) - 1): # Iterate through the array
    total += arr(i)
    return total
            `}
          </pre>
        </div>

        <h3>Constraints:</h3>
        <ul style={{ textAlign: "left" }}>
          <li>The input array will contain at least one element.</li>
          <li>
            The elements of the array are integers, both positive and negative.
          </li>
          <li>The function must work for arrays of any length.</li>
        </ul>

        <div className="limits" style={{ textAlign: "left" }}>
          <p>
            <strong>Time Limit:</strong> 1 second
          </p>
          <p>
            <strong>Memory Limit:</strong> 64 MB
          </p>
        </div>
        <hr className="custom-hr" />

        <h3>Test cases</h3>
        <table className="test-cases">
          <thead>
            <tr>
              <th>Input</th>
              <th>Expected Output</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                [1, 2, 3, 4]
                <button
                  className="copy-button"
                  onClick={() => navigator.clipboard.writeText("[1, 2, 3, 4]")}
                >
                  📋
                </button>
              </td>
              <td>10</td>
            </tr>
          </tbody>
        </table>
        <table className="test-cases">
          <thead>
            <tr>
              <th>Input</th>
              <th>Expected Output</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                [5, -2, 1, 0]
                <button
                  className="copy-button"
                  onClick={() => navigator.clipboard.writeText("[5, -2, 1, 0]")}
                >
                  📋
                </button>
              </td>
              <td>10</td>
            </tr>
          </tbody>
        </table>

        <button className="next-button" onClick={goToProblemSolvingChallenge}>
          Go to Problem Solving Challenge
        </button>
      </div>
    </div>
  );
};

export default BugFixChallenge;
