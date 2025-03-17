import { FiEdit, FiTrash2 } from "react-icons/fi";

interface IUser {
  id: number;
  username: string;
  role: string;
  email: string;
  currentHunt: string;
}

const users: IUser[] = [
  {
    id: 1,
    username: "Ahmed Al-Tayeb",
    role: "Admin",
    email: "ahmed@example.com",
    currentHunt: "just hunt",
  },
  {
    id: 2,
    username: "Sarah Khalid",
    role: "User",
    email: "sarah@example.com",
    currentHunt: "scary time",
  },
  {
    id: 3,
    username: "Khaled Dosari",
    role: "Moderator",
    email: "khaled@example.com",
    currentHunt: "ghost",
  },
];

const ManageUsers = () => {
  return (
    <>
      <button className="add-btn">Add new user</button>
      <table className="manage-users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Role</th>
            <th>Email</th>
            <th>Current Hunt</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>
              <td>{user.currentHunt}</td>
              <td>
                <div className="control-btns">
                  <button className="edit-btn">
                    <FiEdit size={16} className="edit-icon" />
                  </button>
                  <button className="delete-btn">
                    <FiTrash2 size={16} className="delete-icon" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ManageUsers;
