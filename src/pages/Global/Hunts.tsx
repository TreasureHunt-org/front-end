import React from "react";
import pic from "/src/assets/pic.jpeg";
import pic2 from "/src/assets/pic2.jpeg";
import pic3 from "/src/assets/pic3.jpeg";
import pic4 from "/src/assets/pic4.jpeg";
import pic5 from "/src/assets/pic5.jpeg";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Hunts: React.FC = () => {
  return (
    <div className="container">
      <section className="section">
        <h2 className="sectionTitle">On going Hunts</h2>
        <div className="cardContainer">
          <div
            onClick={() => {
              toast.success("Card clicked!");
            }}
            className="cardLink"
          >
            <div className="card">
              <img src={pic} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </div>
          <div
            onClick={() => {
              toast.success("Card clicked!");
            }}
            className="cardLink"
          >
            <div className="card">
              <img src={pic} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </div>
          <div
            onClick={() => {
              toast.success("Card clicked!");
            }}
            className="cardLink"
          >
            <div className="card">
              <img src={pic} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </div>
          <div
            onClick={() => {
              toast.success("Card clicked!");
            }}
            className="cardLink"
          >
            <div className="card">
              <img src={pic} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </div>
          <div
            onClick={() => {
              toast.success("Card clicked!");
            }}
            className="cardLink"
          >
            <div className="card">
              <img src={pic} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </div>
          <div
            onClick={() => {
              toast.success("Card clicked!");
            }}
            className="cardLink"
          >
            <div className="card">
              <img src={pic} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </div>
          <div
            onClick={() => {
              toast.success("Card clicked!");
            }}
            className="cardLink"
          >
            <div className="card">
              <img src={pic} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </div>
          <div
            onClick={() => {
              toast.success("Card clicked!");
            }}
            className="cardLink"
          >
            <div className="card">
              <img src={pic} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </div>
          <div
            onClick={() => {
              toast.success("Card clicked!");
            }}
            className="cardLink"
          >
            <div className="card">
              <img src={pic} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </div>
          <div
            onClick={() => {
              toast.success("Card clicked!");
            }}
            className="cardLink"
          >
            <div className="card">
              <img src={pic} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </div>

          {/* First Card */}
          <Link to="/selected-hunt" className="cardLink">
            <div className="card">
              <img src={pic} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </Link>

          {/* Second Card */}
          <Link to="/selected-hunt" className="cardLink">
            <div className="card">
              <img src={pic2} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </Link>

          {/* Third Card */}
          <Link to="/selected-hunt" className="cardLink">
            <div className="card">
              <img src={pic3} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </Link>

          {/* Fourth Card */}
          <Link to="/selected-hunt" className="cardLink">
            <div className="card">
              <img src={pic4} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Upcoming Hunts Section */}
      <section className="section">
        <h2 className="sectionTitle">Upcoming Hunts</h2>
        <div className="cardContainer">
          {/* Repeat the same wrapping for Upcoming Hunts */}
          <Link to="/selected-hunt" className="cardLink">
            <div className="card">
              <img src={pic5} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </Link>

          <Link to="/selected-hunt" className="cardLink">
            <div className="card">
              <img src={pic5} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </Link>

          <Link to="/selected-hunt" className="cardLink">
            <div className="card">
              <img src={pic5} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </Link>

          <Link to="/selected-hunt" className="cardLink">
            <div className="card">
              <img src={pic5} alt="Hunt" className="cardImage" />
              <h3 className="cardTitle">Hackathon Hunt</h3>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Hunts;
