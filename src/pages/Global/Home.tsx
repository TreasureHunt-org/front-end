import pirateMap from "/src/assets/map.png";

import "/src/App.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="welcome-map">
        <h2 className="welcome">
          Join the Hunters world and become a{" "}
          <span className="span">LEGEND!</span>
        </h2>
        <img className="map-img" src={pirateMap} alt="Pirate Map" />
      </div>
      <Link to="/register">
        <button className="bt">Become a Hunter!</button>
      </Link>

      <Link to="/selected-hunt">
        <button className="bt">Selected Hunt</button>
      </Link>
    </>
  );
};
export default Home;
