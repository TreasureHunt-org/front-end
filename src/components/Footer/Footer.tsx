import React from "react";
import pirateFlag from "../../assets/pirate-flag_2.png";
import "../Footer/Footer.css";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        background: "#1e1e1e",
      }}
    >
      <p style={{ marginRight: "10px" }}>
        © 2024 Treasure Hunt. All Rights Reserved.
      </p>
      <img
        src={pirateFlag}
        alt="Pirate Flag"
        style={{ width: "30px", height: "30px" }}
      />
    </footer>
  );
};

export default Footer;
