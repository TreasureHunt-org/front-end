import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import useClickSound from "./hooks/useClickSound";

function App() {
  const { playClickSound } = useClickSound();

  useEffect(() => {
    // Event listener for button clicks to play the click sound
    const handleClick = (event: MouseEvent) => {
      if (event.target instanceof HTMLButtonElement) {
        playClickSound();
      }
    };

    // Attach event listener
    document.addEventListener("click", handleClick);

    // Clean up event listener when the component is unmounted
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [playClickSound]);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
