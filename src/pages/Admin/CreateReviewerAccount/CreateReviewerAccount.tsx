import user from "/src/assets/user (1).png";
import "../CreateReviewerAccount/CreateReviewerAccount.css";
const CreateReviewerAccount = () => {
  return (
    <div className="reviewer-account-container">
      <div className="reviewer-header">
        <img className="reviewer-icon" alt="user" src={user} />
        <h3 className="reviewer-title">Create Reviewer Account</h3>
      </div>

      <form className="reviewer-form">
        <label htmlFor="email">Email</label>
        <input className="input-field" type="email" id="email" required />

        <label htmlFor="username">Username</label>
        <input className="input-field" type="text" id="username" required />

        <label htmlFor="password">Password</label>
        <input className="input-field" type="password" id="password" required />

        <button className="create-btn" type="submit">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateReviewerAccount;
