// src/routes/AppRoutes.tsx
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Global/Home";
import Hunts from "../pages/Global/Hunts";
import GlobalLeaderboard from "../pages/Global/GlobalLeaderboard";
import ContactUs from "../pages/Global/ContactUs";
import Login from "../pages/Global/Login";
import Register from "../pages/Global/Register";
import NotFound from "../pages/Global/NotFound";
import SelectedHunt from "../pages/Global/SelectedHunt";
import HuntMapPieces from "../pages/Hunter/HuntMapPieces";
import HuntLeaderboard from "../pages/Global/HuntLeaderboard";
import CreateHunt from "../pages/Admin/CreateHunt";
import CreateHunterAccount from "../pages/Admin/CreateHunterAccount";
import ManageHunts from "../pages/Admin/ManageHunts";
import CreateReviewerAccount from "../pages/Admin/CreateReviewerAccount";
import ManageUsers from "../pages/Admin/ManageUsers";
import SendAnnouncement from "../pages/Admin/SendAnnouncement";
import ViewSubmissions from "../pages/Admin/ViewSubmissions";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ViewFeedback from "../pages/Admin/ViewFeedback";
import ReviewHunt from "../pages/Reviewer/ReviewHunt";
const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/hunts" element={<Hunts />} />
        <Route path="/leaderboard" element={<GlobalLeaderboard />} />
        <Route path="/about" element={<ContactUs />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/selected-hunt" element={<SelectedHunt />}></Route>
        <Route path="/hunt-map-pieces" element={<HuntMapPieces />}></Route>
        <Route path="/hunt-ranking" element={<HuntLeaderboard />}></Route>

        {/* Admin Routes */}
        <Route path="admin-dashboard" element={<AdminDashboard />}>
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-hunts" element={<ManageHunts />} />
          <Route path="create-hunt" element={<CreateHunt />} />
          <Route path="send-announcement" element={<SendAnnouncement />} />
          <Route path="create-reviewer" element={<CreateReviewerAccount />} />
          <Route path="create-hunter" element={<CreateHunterAccount />} />
          <Route path="view-submissions" element={<ViewSubmissions />} />
          <Route path="view-feedback" element={<ViewFeedback />} />
        </Route>

        {/* <Route path="reviewer-dashboard" element={<ReviewerDashboard />}> */}

        {/* </Route> */}
        <Route path="review-hunt" element={<ReviewHunt />}></Route>

        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
