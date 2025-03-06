// src/routes/AppRoutes.tsx
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Global/Home";
import Hunts from "../pages/Global/Hunts";
import GlobalLeaderboard from "../pages/Global/GlobalLeaderboard";
import ContactUs from "../pages/Global/ContactUs";
import Login from "../pages/Global/Login";
import Register from "../pages/Global/Register";
import NotFound from "../pages/Global/NotFound";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hunts" element={<Hunts />} />
        <Route path="/leaderboard" element={<GlobalLeaderboard />} />
        <Route path="/about" element={<ContactUs />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
