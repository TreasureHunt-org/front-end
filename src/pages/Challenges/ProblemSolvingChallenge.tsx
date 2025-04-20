import React from "react";
import { Link } from "react-router-dom";

const ProblemSolvingChallenge = () => {
  return (
    <div className="problem-solving-container">
      <div className="top-bar">
        <Link to="/Challenges">Back to challenges</Link>
        <Link to="/submit">Submit</Link>
        <Link to="/LastSubmissions">Last Submissions</Link>
      </div>

      <div className="content">
        <h2> Reverse the Numbers</h2>
        <p style={{ color: "#f39c12", textAlign: "left" }}>
          <strong>Description:</strong>
        </p>
        <p style={{ textAlign: "left" }}>
          Write a function that takes an integer N (1 ≤ N ≤ 10,000) and reverses
          the digits of the number. If reversing the number leads to leading
          zeros, ignore them in the output.
          <br />
          For example:
        </p>
        <ul style={{ textAlign: "left" }}>
          <li>Reversing 123 becomes 321.</li>
          <li>Reversing 1000 becomes 1.</li>
        </ul>
        <p style={{ textAlign: "left" }}>
          Your task is to write a program that takes the input N, reverses its
          digits, and outputs the reversed number
        </p>

        <h3 style={{ textAlign: "left" }}>Constraints:</h3>
        <ol style={{ textAlign: "left" }}>
          <li>1 ≤ N ≤ 10,000.</li>
          <li>
            Your solution must handle both small and large values of N
            efficiently.
          </li>
          <li>
            Do not use built-in string functions to reverse the number (e.g., no
            converting to a string and using slicing).
          </li>
        </ol>

        <div className="limits" style={{ textAlign: "left" }}>
          <h3>Time Limit:</h3>
          <p>Your solution must execute within 1 second for any valid input.</p>
          <h3>Memory Limit:</h3>
          <p>Your solution must use no more than 256 MB of memory.</p>
        </div>
      </div>

      <div className="bottom-section">
        <hr className="custom-hr" />
        <h3>Test cases</h3>
        <table className="test-cases">
          <thead>
            <tr>
              <th>Input</th>
              <th> Output</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                123
                <button
                  className="copy-button"
                  onClick={() => navigator.clipboard.writeText("123")}
                >
                  📋
                </button>
              </td>
              <td>321</td>
            </tr>
          </tbody>
        </table>
        <table className="test-cases">
          <thead>
            <tr>
              <th>Input</th>
              <th> Output</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                123
                <button
                  className="copy-button"
                  onClick={() => navigator.clipboard.writeText("1000")}
                >
                  📋
                </button>
              </td>
              <td>321</td>
            </tr>
          </tbody>
        </table>
        <table className="test-cases">
          <thead>
            <tr>
              <th>Input</th>
              <th> Output</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                123
                <button
                  className="copy-button"
                  onClick={() => navigator.clipboard.writeText("1000")}
                >
                  📋
                </button>
              </td>
              <td>321</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemSolvingChallenge;
