import user from "/src/assets/user (1).png";
import "../CreateAccounts/CreateAccounts.css";
import { useState } from "react";
import API_BASE_URL from "../../../constants/apiURL/API_BASE_URL";
import api from "../../../api/axios";

const CreateAccounts = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    roles: ["HUNTER"],
  });

  const [error, setError] = useState("");

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, roles: [e.target.value] });
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedFormData = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      roles: [formData.roles[0].trim()],
    };

    if (
      !trimmedFormData.username ||
      !trimmedFormData.email ||
      !trimmedFormData.password ||
      !trimmedFormData.roles[0]
    ) {
      setError("please fill all fields");
      return;
    } else if (trimmedFormData.password.length < 8) {
      setError("password must be at least 8 characters");
      return;
    } else {
      setError("");
      try {
        console.log(formData);
        const response = await api.post(
          API_BASE_URL + `/users/admin/create`,
          formData,
        );

        console.log(response.data);
      } catch (error) {
        console.error(error);

        setError(error.response.data.errors[0]);
      }
    }
  };

  return (
    <div className="reviewer-account-container">
      <div className="reviewer-header">
        <img className="reviewer-icon" alt="user" src={user} />
        <h3 className="reviewer-title">Add Account</h3>
      </div>

      <form className="reviewer-form" onSubmit={handleFormSubmission}>
        <label htmlFor="email">Email</label>
        <input
          className="input-field"
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={handleFormChange}
        />
        <label htmlFor="username">Username</label>
        <input
          className="input-field"
          type="text"
          id="username"
          required
          value={formData.username}
          onChange={handleFormChange}
        />
        <label htmlFor="password">Password</label>
        <input
          className="input-field"
          type="password"
          id="password"
          required
          value={formData.password}
          onChange={handleFormChange}
        />

        <label className="input-field">User Role:</label>

        <div>
          <input
            type="radio"
            name="user"
            id="hunter"
            value="HUNTER"
            checked={formData.roles[0] === "HUNTER"}
            onChange={handleRoleChange}
          />
          <label htmlFor="hunter">Hunter</label>
        </div>

        <div>
          <input
            type="radio"
            name="user"
            id="organizer"
            value="ORGANIZER"
            checked={formData.roles[0] === "ORGANIZER"}
            onChange={handleRoleChange}
          />
          <label htmlFor="organizer">Organizer</label>
        </div>

        <div>
          <input
            type="radio"
            name="user"
            id="reviewer"
            value="REVIEWER"
            checked={formData.roles[0] === "REVIEWER"}
            onChange={handleRoleChange}
          />
          <label htmlFor="reviewer">Reviewer</label>
        </div>

        <button className="create-btn" type="submit">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateAccounts;
