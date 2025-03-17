import React from "react";
import { FaEdit } from "react-icons/fa";

const ManageHunts = () => {
  const data = [
    {
      id: 1,
      title: "just hunt",
      status: "Active",
      participants: 5,
      startDate: "2024-03-01",
      endDate: "2024-06-01",
    },
    {
      id: 2,
      title: "scary time",
      status: "Finished",
      participants: 34,
      startDate: "2023-10-01",
      endDate: "2024-02-28",
    },
    {
      id: 3,
      title: "ghost",
      status: "Finished",
      participants: 24,
      startDate: "2023-10-01",
      endDate: "2024-02-28",
    },
  ];

  return (
    <div className="table-container">
      <table className="manage-users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Status</th>
            <th>Participants</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td className={item.status === "Active" ? "active" : "finished"}>
                {item.status}
              </td>
              <td>{item.participants}</td>
              <td>{item.startDate}</td>
              <td>{item.endDate}</td>
              <td className="control-btns">
                <button className="edit-btn">
                  <FaEdit className="edit-icon" />
                </button>
                {/* <button className="delete-btn">
                  <FaTrash className="delete-icon" />
                </button> */}
                <button className="manage-button">Submissions</button>
                <button className="manage-button">Terminate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageHunts;
