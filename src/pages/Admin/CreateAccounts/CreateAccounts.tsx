import "../CreateAccounts/CreateAccounts.css";
import { useState } from "react";
import api from "../../../api/axios";
import { AxiosError } from "axios";
import { PersonIcon } from "@radix-ui/react-icons";

const rolesList = ["HUNTER", "ORGANIZER", "REVIEWER", "ADMIN"];

const CreateAccounts = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    roles: ["HUNTER"],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const updatedRoles = checked
        ? [...prev.roles, value] // ✅ Add role if checked
        : prev.roles.filter(role => role !== value); // ❌ Remove role if unchecked
      return { ...prev, roles: updatedRoles };
    });
  };


  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const trimmedFormData = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      roles: formData.roles.map(role => role.trim()),
    };

    if (
      !trimmedFormData.username ||
      !trimmedFormData.email ||
      !trimmedFormData.password ||
      trimmedFormData.roles.length === 0
    ) {
      setError("Please fill all fields and select at least one role.");
      setLoading(false);
      return;
    }

    if (trimmedFormData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(`/users/admin/create`, trimmedFormData);
      console.log(response.data);
    } catch (err) {
      const axiosError = err as AxiosError<{ errors: string[] }>;
      setError(axiosError.response?.data?.errors?.[0] || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="account-container">
      <div className="header">
        <PersonIcon width={50} height={50} color={"#f39c12"}/>
        {/*<img src={userIcon} alt="user" className="icon" />*/}
        <h3 className="title">Add Account</h3>
      </div>

      {error && <p className="error-text">{error}</p>}

      <form className="form" onSubmit={handleFormSubmission}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleFormChange}
          required
        />

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={formData.username}
          onChange={handleFormChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={handleFormChange}
          required
        />

        <div className="checkbox-group">
          {rolesList.map(role => (
            <div key={role} className="checkbox-wrapper">
              <input
                type="checkbox"
                id={role.toLowerCase()}
                value={role}
                checked={formData.roles.includes(role)}
                onChange={handleRoleChange}
              />
              <label htmlFor={role.toLowerCase()}>{role.charAt(0) + role.slice(1).toLowerCase()}</label>
            </div>
          ))}
        </div>

        <button className="create-btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreateAccounts;


// import user from "/src/assets/user (1).png";
// import "../CreateAccounts/CreateAccounts.css";
// import { useState } from "react";
// import api from "../../../api/axios";
// import { AxiosError } from "axios";
//
// const CreateAccounts = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     roles: ["HUNTER"],
//   });
//
//   const [error, setError] = useState("");
//
//     const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
//   };
//
//   const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, roles: [e.target.value] });
//   };
//
//   const handleFormSubmission = async (e: React.FormEvent) => {
//     e.preventDefault();
//
//     const trimmedFormData = {
//       username: formData.username.trim(),
//       email: formData.email.trim(),
//       password: formData.password.trim(),
//       roles: [formData.roles[0].trim()],
//     };
//
//     if (
//       !trimmedFormData.username ||
//       !trimmedFormData.email ||
//       !trimmedFormData.password ||
//       !trimmedFormData.roles[0]
//     ) {
//       setError("please fill all fields");
//       return;
//     } else if (trimmedFormData.password.length < 8) {
//       setError("password must be at least 8 characters");
//       return;
//     } else {
//       setError("");
//       try {
//         console.log(formData);
//         const response = await api.post(`/users/admin/create`, formData);
//
//         console.log(response.data);
//       } catch (err) {
//         const axiosError = err as AxiosError<{ errors: string[] }>;
//         setError(axiosError.response?.data?.errors?.[0] || "Unknown error occurred");
//       }
//     }
//   };
//
//   return (
//     <div className="reviewer-account-container">
//       <div className="reviewer-header">
//         <img className="reviewer-icon" alt="user" src={user} />
//         <h3 className="reviewer-title">Add Account</h3>
//       </div>
//
//       {error && <p style={{ color: "red" }}>{error}</p>}
//
//       <form className="reviewer-form" onSubmit={handleFormSubmission}>
//         <label htmlFor="email">Email</label>
//         <input
//           className="input-field"
//           type="email"
//           id="email"
//           required
//           value={formData.email}
//           onChange={handleFormChange}
//         />
//         <label htmlFor="username">Username</label>
//         <input
//           className="input-field"
//           type="text"
//           id="username"
//           required
//           value={formData.username}
//           onChange={handleFormChange}
//         />
//         <label htmlFor="password">Password</label>
//         <input
//           className="input-field"
//           type="password"
//           id="password"
//           required
//           value={formData.password}
//           onChange={handleFormChange}
//         />
//
//         <label className="input-field">User Role:</label>
//
//         <div>
//           <input
//             type="radio"
//             name="user"
//             id="hunter"
//             value="HUNTER"
//             checked={formData.roles[0] === "HUNTER"}
//             onChange={handleRoleChange}
//           />
//           <label htmlFor="hunter">Hunter</label>
//         </div>
//
//         <div>
//           <input
//             type="radio"
//             name="user"
//             id="organizer"
//             value="ORGANIZER"
//             checked={formData.roles[0] === "ORGANIZER"}
//             onChange={handleRoleChange}
//           />
//           <label htmlFor="organizer">Organizer</label>
//         </div>
//
//         <div>
//           <input
//             type="radio"
//             name="user"
//             id="reviewer"
//             value="REVIEWER"
//             checked={formData.roles[0] === "REVIEWER"}
//             onChange={handleRoleChange}
//           />
//           <label htmlFor="reviewer">Reviewer</label>
//         </div>
//
//         <button className="create-btn" type="submit">
//           Create
//         </button>
//       </form>
//     </div>
//   );
// };
//
// export default CreateAccounts;
