import { Link } from "react-router-dom";
import pirateFlag from "../assets/pirate-flag (2).png";
import "../App.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-title">
        <img className="logo" src={pirateFlag} alt="Pirate Flag" />
        <h1 className="title">Treasure Hunt</h1>
      </div>
      <div className="menu">
        <Link to="/">Home</Link>
        <Link to="/hunts">Hunts</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/about">About</Link>

        <Link to="/login">
          <button>LOGIN</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
