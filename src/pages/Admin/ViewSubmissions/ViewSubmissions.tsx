import { useState } from "react";
import "../ViewSubmissions/ViewSubmissions.css";

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
  {
    id: "hunt3",
    name: "Hunt 3",
    challenges: ["Challenge 1", "Challenge 2", "Challenge 3"],
  },
];

const ViewSubmissions = () => {
  const [selectedHunt, setSelectedHunt] = useState<string>("");

  const handlePickHunt = (huntName: string) => {
    if (!huntName) {
      return;
    }
    // alert(`${huntName} "picked"`);

    console.log("Hunt selected :", {
      selectedHunt: huntName,
    });
  };

  return (
    <>
      <div className="dropdowns">
        <select
          className="announcement-dropdown"
          value={selectedHunt}
          onChange={(e) => {
            const selectedValue = e.target.value;
            setSelectedHunt(selectedValue);
            handlePickHunt(selectedValue);
          }}
        >
          <option value="">Select Hunt</option>
          {hunts.map((hunt) => (
            <option key={hunt.id} value={hunt.name}>
              {hunt.name}
            </option>
          ))}
        </select>
      </div>

      <table className="manage-users-table">
        <thead>
          <tr>
            <th>Hunter Name</th>
            <th>Submission Date & time</th>
            <th>Challenge Number</th>
            <th>Challenge title</th>
            <th>Score</th>
            <th>Status (Approved/Rejected)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr key="">
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>
              <div className="control-btns">
                <button className="edit-btn">VIEW CODE</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
export default ViewSubmissions;
