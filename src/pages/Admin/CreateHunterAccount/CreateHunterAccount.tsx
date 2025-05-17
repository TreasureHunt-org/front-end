import user from "/src/assets/user (1).png";
import "../CreateHunterAccount/CreateHunterAccount.css";
const CreateHunterAccount = () => {
  return (
    <div className="reviewer-account-container">
      <div className="reviewer-header">
        <img className="reviewer-icon" alt="user" src={user} />
        <h3 className="reviewer-title">Add Hunter/Organizer Account</h3>
      </div>

      <form className="reviewer-form">
        <label htmlFor="email">Email</label>
        <input className="input-field" type="email" id="email" required />
        <label htmlFor="username">Username</label>
        <input className="input-field" type="text" id="username" required />
        <label htmlFor="password">Password</label>
        <input className="input-field" type="password" id="password" required />

        <div className="is-organizer-container">
          <input
            className="is-organizer-checkbox"
            type="checkbox"
            id="is-organizer-checkbox"
          />
          <label
            htmlFor="is-organizer-checkbox"
            // className="is-organizer-checkbox"
          >
            Is an Organizer?
          </label>
        </div>

        <button className="create-btn" type="submit">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateHunterAccount;
