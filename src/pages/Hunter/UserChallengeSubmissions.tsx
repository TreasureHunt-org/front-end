import { Link } from "react-router-dom";
import UserChallengeCode from "./UserChallengeCode";
import { useState } from "react";

const UserChallengeSubmissions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="submissions-container">
      <div className="top-bar">
        <Link to="/Challenges">Back to challenges</Link>
        <Link to="/submit">Submit</Link>
        <Link to="/LastSubmissions">Last Submissions</Link>
      </div>

      <div className="content">
        <h2>Last Submissions</h2>
        <table className="submissions-table">
          <thead>
            <tr>
              <th>Challenge Title</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Reverse the numbers</td>
              <td>Accepted</td>
              <td>12/30/2025 06:30 AM</td>
              <td>
                <button className="view-code-button" onClick={openModal}>
                  View code
                </button>
              </td>
            </tr>
            <tr>
              <td>Reverse the numbers</td>
              <td>Failed at test case 132</td>
              <td>12/30/2025 06:05 AM</td>
              <td>
                <button className="view-code-button">View code</button>
              </td>
            </tr>
            <tr>
              <td>Reverse the numbers</td>
              <td>Failed at test case 4</td>
              <td>12/30/2025 12:50 AM</td>
              <td>
                <button className="view-code-button">View code</button>
              </td>
            </tr>
            <tr>
              <td>Reverse the numbers</td>
              <td>Failed at test case 2</td>
              <td>12/30/2025 12:35 AM</td>
              <td>
                <button className="view-code-button">View code</button>
              </td>
            </tr>
            <tr>
              <td>Reverse the numbers</td>
              <td>Failed at test case 2</td>
              <td>12/30/2025 12:35 AM</td>
              <td>
                <button className="view-code-button">View code</button>
              </td>
            </tr>
            <tr>
              <td>Reverse the numbers</td>
              <td>Compilation Error</td>
              <td>12/30/2025 12:30 AM</td>
              <td>
                <button className="view-code-button">View code</button>
              </td>
            </tr>
            <tr>
              <td>Something is bugging me</td>
              <td>Accepted</td>
              <td>12/30/2025 11:02 AM</td>
              <td>
                <button className="view-code-button">View code</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <UserChallengeCode isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default UserChallengeSubmissions;
