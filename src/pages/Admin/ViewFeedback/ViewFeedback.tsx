import React, { useState } from "react";
import { FaEye, FaTrash, FaFilter } from "react-icons/fa";

import "../ViewFeedback/ViewFeedback.css";

interface Feedback {
  id: string;
  user: string;
  hunt: string;
  challenge: string;
  rating: number;
  comment: string;
  date: string;
}

const mockFeedback: Feedback[] = [
  {
    id: "1",
    user: "راشد معايطه",
    hunt: "Pirate's Gold",
    challenge: "Find the Hidden Chest",
    rating: 4,
    comment: "Great challenge, but a bit too hard!",
    date: "2025-03-18",
  },
  {
    id: "2",
    user: "سلسبيلة",
    hunt: "Jungle Quest",
    challenge: "Solve the Riddle",
    rating: 5,
    comment: "Loved the experience!",
    date: "2025-03-17",
  },
  {
    id: "2",
    user: "احمد_09",
    hunt: "Jungle Quest",
    challenge: "Solve the Riddle",
    rating: 0,
    comment: "سيء جدا",
    date: "2025-03-17",
  },
];

const ViewFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(mockFeedback);
  const [search, setSearch] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null,
  );

  // Handle search
  const filteredFeedbacks = feedbacks.filter(
    (fb) =>
      fb.user.toLowerCase().includes(search.toLowerCase()) ||
      fb.hunt.toLowerCase().includes(search.toLowerCase()) ||
      fb.challenge.toLowerCase().includes(search.toLowerCase()) ||
      fb.comment.toLowerCase().includes(search.toLowerCase()),
  );

  // Handle delete
  const handleDelete = (id: string) => {
    setFeedbacks(feedbacks.filter((fb) => fb.id !== id));
  };

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">View Feedback</h2>

      {/* Search & Filters */}
      <div className="feedback-controls">
        <input
          type="text"
          placeholder="Search feedback..."
          className="feedback-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Feedback Table */}
      <table className="manage-users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Hunt</th>
            <th>Challenge</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFeedbacks.length > 0 ? (
            filteredFeedbacks.map((fb) => (
              <tr key={fb.id}>
                <td>{fb.user}</td>
                <td>{fb.hunt}</td>
                <td>{fb.challenge}</td>
                <td className="center">{fb.rating}⭐</td>
                <td>{fb.comment.substring(0, 30)}...</td>
                <td>{fb.date}</td>
                <td className="control-btns">
                  <button
                    className="edit-btn"
                    onClick={() => setSelectedFeedback(fb)}
                  >
                    <FaEye className="edit-icon" />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(fb.id)}
                  >
                    <FaTrash className="delete-icon" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="no-feedback">
                No feedback found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Feedback Modal */}
      {selectedFeedback && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Feedback Details</h3>
            <p>
              <strong>User:</strong> {selectedFeedback.user}
            </p>
            <p>
              <strong>Hunt:</strong> {selectedFeedback.hunt}
            </p>
            <p>
              <strong>Challenge:</strong> {selectedFeedback.challenge}
            </p>
            <p>
              <strong>Rating:</strong> {selectedFeedback.rating}⭐
            </p>
            <p>
              <strong>Comment:</strong> {selectedFeedback.comment}
            </p>
            <p>
              <strong>Date:</strong> {selectedFeedback.date}
            </p>
            <button
              className="manage-button close-btn"
              onClick={() => setSelectedFeedback(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFeedback;
