import { useState } from "react";

const hunts = [
  {
    id: "hunt1",
    name: "Hunt 1",
    challenges: ["Challenge 1", "Challenge 2", "Challenge 3"],
  },
  {
    id: "hunt2",
    name: "Hunt 2",
    challenges: ["Challenge 1", "Challenge 2", "Challenge 3"],
  },
];

const SendAnnouncement = () => {
  const [selectedHunt, setSelectedHunt] = useState<string>("");
  const [selectedChallenge, setSelectedChallenge] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSendNotification = () => {
    if (!selectedHunt || !selectedChallenge || !message) {
      alert("Please fill all fields before sending!");
      return;
    }
    console.log("Notification Sent!", {
      selectedHunt,
      selectedChallenge,
      message,
    });
    alert(
      `Notification sent for ${selectedChallenge} in ${selectedHunt} : ${message}`,
    );
  };

  return (
    <div className="announcement-form">
      <h3 className="announcement-header">Send Announcement</h3>

      <div className="announcement-inputs">
        <div className="dropdowns">
          {/* <label>Select Hunt:</label> */}
          <select
            className="announcement-dropdown"
            value={selectedHunt}
            onChange={(e) => {
              setSelectedHunt(e.target.value);
              setSelectedChallenge(""); // eeset challenge when hunt changes
            }}
          >
            <option value="">Select Hunt</option>
            {hunts.map((hunt) => (
              <option key={hunt.id} value={hunt.name}>
                {hunt.name}
              </option>
            ))}
          </select>

          {/* <label>Select Challenge:</label> */}
          <select
            className="announcement-dropdown"
            value={selectedChallenge}
            onChange={(e) => setSelectedChallenge(e.target.value)}
            disabled={!selectedHunt}
          >
            <option value="">Select Challenge</option>
            {selectedHunt &&
              hunts
                .find((hunt) => hunt.name === selectedHunt)
                ?.challenges.map((challenge) => (
                  <option key={challenge} value={challenge}>
                    {challenge}
                  </option>
                ))}
          </select>
        </div>
        <label>Write your Announcement Message:</label>
        <textarea
          className="announcement-textarea"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your announcement here..."
        />
      </div>

      <button onClick={handleSendNotification} className="send-btn">
        Send & Notify
      </button>
    </div>
  );
};

export default SendAnnouncement;
