import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";
import { ROUTES } from "../constants/routes";

// Lazy-loaded components
const Home = React.lazy(() => import("../pages/Global/Home"));
const Hunts = React.lazy(() => import("../pages/Global/Hunts"));
const GlobalLeaderboard = React.lazy(
  () => import("../pages/Global/GlobalLeaderboard"),
);
const ContactUs = React.lazy(() => import("../pages/Global/ContactUs"));
const Login = React.lazy(() => import("../pages/Global/Login"));
const Register = React.lazy(() => import("../pages/Global/Register"));
const NotFound = React.lazy(() => import("../pages/Global/NotFound"));
const SelectedHunt = React.lazy(() => import("../pages/Global/SelectedHunt"));
const HuntLeaderboard = React.lazy(
  () => import("../pages/Global/HuntLeaderboard"),
);
const UserDashboard = React.lazy(() => import("../pages/Hunter/UserDashboard"));
const HuntMapPieces = React.lazy(() => import("../pages/Hunter/HuntMapPieces"));
const AdminDashboard = React.lazy(
  () => import("../pages/Admin/AdminDashboard"),
);
const ManageUsers = React.lazy(() => import("../pages/Admin/ManageUsers"));
const ManageHunts = React.lazy(() => import("../pages/Admin/ManageHunts"));
const CreateHunt = React.lazy(() => import("../pages/Admin/CreateHunt"));
const SendAnnouncement = React.lazy(
  () => import("../pages/Admin/SendAnnouncement"),
);
const CreateReviewerAccount = React.lazy(
  () => import("../pages/Admin/CreateReviewerAccount"),
);
const CreateHunterAccount = React.lazy(
  () => import("../pages/Admin/CreateHunterAccount"),
);
const ViewSubmissions = React.lazy(
  () => import("../pages/Admin/ViewSubmissions"),
);
const ViewFeedback = React.lazy(() => import("../pages/Admin/ViewFeedback"));
const ReviewHunt = React.lazy(() => import("../pages/Reviewer/ReviewHunt"));

const AppRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.HUNTS} element={<Hunts />} />
        <Route path={ROUTES.LEADERBOARD} element={<GlobalLeaderboard />} />
        <Route path={ROUTES.ABOUT} element={<ContactUs />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.SELECTED_HUNT} element={<SelectedHunt />} />
        <Route path={ROUTES.HUNT_RANKING} element={<HuntLeaderboard />} />

        {/* Protected User Routes */}
        <Route
          path={ROUTES.USER_DASHBOARD}
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.HUNT_MAP_PIECES}
          element={
            <ProtectedRoute>
              <HuntMapPieces />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            // <ProtectedAdminRoute>
            <AdminDashboard />
            // </ProtectedAdminRoute>
          }
        >
          <Route index element={<ManageHunts />} />
          <Route path={ROUTES.MANAGE_USERS} element={<ManageUsers />} />
          <Route path={ROUTES.MANAGE_HUNTS} element={<ManageHunts />} />
          <Route path={ROUTES.CREATE_HUNT} element={<CreateHunt />} />
          <Route
            path={ROUTES.SEND_ANNOUNCEMENT}
            element={<SendAnnouncement />}
          />
          <Route
            path={ROUTES.CREATE_REVIEWER}
            element={<CreateReviewerAccount />}
          />
          <Route
            path={ROUTES.CREATE_HUNTER}
            element={<CreateHunterAccount />}
          />
          <Route path={ROUTES.VIEW_SUBMISSIONS} element={<ViewSubmissions />} />
          <Route path={ROUTES.VIEW_FEEDBACK} element={<ViewFeedback />} />
        </Route>

        {/* Protected Reviewer Route */}
        <Route
          path={ROUTES.REVIEW_HUNT}
          element={
            <ProtectedRoute requiredRole="REVIEWER">
              <ReviewHunt />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
