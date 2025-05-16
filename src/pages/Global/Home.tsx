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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold mb-6 text-yellow-500 leading-tight">
              Set Sail on the Greatest Adventure
            </h1>
            <h2 className="text-3xl mb-8 text-yellow-300">
              Join the Hunters world and become a{" "}
              <span className="text-yellow-400 font-bold italic">LEGEND!</span>
            </h2>
            <p className="text-gray-300 text-xl mb-10">
              Chart your course through treacherous waters, solve ancient mysteries, 
              and claim treasures beyond your wildest dreams. The sea awaits, brave sailor!
            </p>
            <Link to="/register">
              <button className="bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-4 rounded-lg font-bold text-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-yellow-700">
                Become a Hunter!
              </button>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-yellow-500 opacity-20 blur-xl rounded-full"></div>
            <div className="relative transform rotate-12 hover:rotate-0 transition-all duration-1000">
              <img 
                className="w-96 h-96 object-contain drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]" 
                src={pirateMap} 
                alt="Pirate Map" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ocean wave effect at bottom */}
      <div className="w-full h-24 bg-yellow-900 relative overflow-hidden">
        <div className="absolute w-full h-24 bg-yellow-800 opacity-70" 
             style={{
               backgroundImage: "url('data:image/svg+xml;charset=utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1440 320%22%3E%3Cpath fill=%22%23f59e0b%22 fill-opacity=%221%22 d=%22M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,144C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z%22%3E%3C/path%3E%3C/svg%3E')",
               backgroundSize: "cover",
               backgroundPosition: "center",
               animation: "wave 10s ease-in-out infinite alternate"
             }}
        ></div>
      </div>

      {/* <Link to="/admin-dashboard">
        <button className="bt">Admin Dashboard</button>
      </Link>

      <Link to="/review-hunt">
        <button className="bt">Review Hunt</button>
      </Link> */}
      {/* <ProblemSolvingChallenge /> */}
    </div>
  );
};
export default Home;
