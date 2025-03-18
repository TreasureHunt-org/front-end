import React from "react";

const ReviewHunt: React.FC = () => {
  return (
    <div className="review-hunt-container">
      <section className="review-hunts-section">
        <h2>Review Hunts Section</h2>

        <div className="hunt-info">
          <div className="hunts-selector">
            <label htmlFor="Hunts">Select Hunts: </label>
            <select id="hunt" name="hunt" className="hunt-select">
              <option value="Hackathon Hunt">Hackathon Hunt</option>
            </select>
          </div>

          <h3>Hackathon Hunt</h3>
          <div className="hunt-details">
            <p>
              <strong>Hunt title:</strong> Hackathon Hunt
            </p>
            <p>
              <strong>of challenges:</strong> #6
            </p>
            <p>
              <strong>Start Date:</strong> 22/9/2025
            </p>
            <p>
              <strong>Description:</strong> Some Description about the Treasure
              Hunt like a backstory
              <br />
              or something of that kind etc...
            </p>
            <p>
              <strong>Hunt location:</strong>{" "}
              <a href="#" className="link-button">
                [Open in Maps]
              </a>
            </p>
            <p>
              <strong>Hunt Background:</strong>{" "}
              <a href="#" className="link-button">
                [Open in a new tab]
              </a>
            </p>
            <p>
              <strong>Hunt map image:</strong>{" "}
              <a href="#" className="link-button">
                [Open in a new tab]
              </a>
            </p>
          </div>
        </div>

        <hr></hr>
        <div className="challenges-section">
          <h3>Challenges</h3>
          <select id="challenge" name="challenge" className="challenge-select">
            <option value="Something is bugging me">
              Something is bugging me
            </option>
          </select>
          <div className="content">
            <h2>Something is bugging me</h2>
            <p style={{ color: "#f39c12", textAlign: "left" }}>
              <strong>Description:</strong>
            </p>
            <p style={{ textAlign: "left" }}>
              A junior developer wrote a function to calculate the sum of an
              array of integers. However, the function returns incorrect results
              in some cases. Your task is to identify the bug, fix the function,
              and ensure it works as expected.
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

            <h3 style={{ textAlign: "left" }}>Constraints:</h3>
            <ol>
              <li>The input array will contain at least one element.</li>
              <li>
                The elements of the array are integers, both positive and
                negative.
              </li>
              <li>The function must work for arrays of any length.</li>
            </ol>

            <div className="limits" style={{ textAlign: "left" }}>
              <p>
                <strong>Time Limit:</strong> 1 second
              </p>
              <p>
                <strong>Memory Limit:</strong> 64 MB
              </p>
            </div>
            <button className="button">Download Test case</button>
          </div>
        </div>

        <div className="review-notes-section">
          <h3>Review Notes</h3>
          <textarea
            className="notes-textarea"
            placeholder="Here goes notes about the Hunt for the Organizer to fix..."
          ></textarea>
          <div className="review-buttons">
            <button className="accept-button">Accept</button>
            <button className="reject-button">Reject</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReviewHunt;
