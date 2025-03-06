import map from "/src/assets/map (2).png";
import huntdate from "/src/assets/date.png";
import skull from "/src/assets/skull2.png";
import user from "/src/assets/user (1).png";

import "/src/App.css";
import { Link } from "react-router-dom";

interface IProps {}
const SelectedHunt = ({}: IProps) => {
  return (
    <>
      <div className="selected-hunt-container">
        <div className="horizontal">
          <div className="hunt-image">
            <img className="logo" src={map} alt="hunt image" />
          </div>

          <div className="vertical">
            {/* <h1>JUST Hunt</h1> */}
            <h1>The Ultimate Problem-Solving Hunt: The Trials of the Mind</h1>
            <div className="hunt-date">
              <img className="logo" src={huntdate} alt="hunt-date" />
              <h3>starts in : 25/12/2025</h3>
            </div>

            <div className="hunt-challenges">
              <img className="logo" src={skull} alt="skull" />
              <h3># of challenges : 6</h3>
            </div>

            <div className="hunt-participants">
              <img className="logo" src={user} alt="participants" />
              <h3># of Hunters : 56</h3>
            </div>
          </div>
        </div>

        <div className="hunt-description">
          Prepare yourself for the Trials of the Mind, an electrifying
          problem-solving hunt where only the sharpest thinkers and the bravest
          strategists will prevail! This high-stakes challenge will push you to
          the limits of logic, creativity, and teamwork as you race against time
          to conquer a series of mind-bending challenges. Do you have what it
          takes to become the ultimate treasure hunter? The clock is ticking,
          and the treasure is waiting!
        </div>
        <Link to="/hunt-map-pieces">
          <button className="join">Join Hunt</button>
        </Link>
      </div>
    </>
  );
};
export default SelectedHunt;
