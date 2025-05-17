import pirateMap from "/src/assets/map.png";

import "/src/App.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import { useEffect } from "react";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the user's dashboard
      navigate("/user-dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <div className="welcome-map">
        <h2 className="welcome">
          Join the Hunters world and become a{" "}
          <span className="span">LEGEND!</span>
        </h2>

        <div className="relative rotate-12 transform transition-all duration-1000 hover:rotate-0">
          <img
            className="h-96 w-96 object-contain drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]"
            src={pirateMap}
            alt="Pirate Map"
          />
        </div>
      </div>
      <Link to="/register">
        <button className="bt">Become a Hunter!</button>
      </Link>
    </>
  );
};
export default Home;
