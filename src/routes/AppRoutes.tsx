import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoutes/ProtectedRoute";
import { ROUTES } from "../constants/app routes/routes.ts";
// import CreateChallenges from "../pages/Admin/CreateChallenges";
import ViewMyHunts from "../pages/Organizer/ViewMyHunts/ViewMyHunts.tsx";
import ProtectedAdminRoute from "../components/ProtectedRoutes/ProtectedAdminRoute.tsx";
import ProtectedOrganizerRoute from "../components/ProtectedRoutes/ProtectedOrganizerRoute.tsx";
import Challenge from "../pages/Organizer/Challenge.tsx";
import UserProfile from "../pages/User/UserProfile";
import CreateAccounts from "../pages/Admin/CreateAccounts/CreateAccounts.tsx";

// Lazy-loaded components
const Home = React.lazy(() => import("../pages/Global/Home/Home.tsx"));
const Hunts = React.lazy(() => import("../pages/Global/Hunts/Hunts.tsx"));
const GlobalLeaderboard = React.lazy(
  () => import("../pages/Global/GlobalLeaderboard/GlobalLeaderboard.tsx"),
);
const ContactUs = React.lazy(
  () => import("../pages/Global/ContactUs/ContactUs.tsx"),
);
const Login = React.lazy(() => import("../pages/Global/Login/Login.tsx"));
const Register = React.lazy(
  () => import("../pages/Global/Register/Register.tsx"),
);
const NotFound = React.lazy(
  () => import("../components/NotFound/NotFound.tsx"),
);
const SelectedHunt = React.lazy(
  () => import("../pages/Global/SelectedHunt/SelectedHunt.tsx"),
);
const HuntLeaderboard = React.lazy(
  () => import("../pages/Global/HuntLeaderboard/HuntLeaderboard.tsx"),
);
const UserDashboard = React.lazy(() => import("../pages/Hunter/UserDashboard"));
const HuntMapPieces = React.lazy(
  () => import("../pages/Hunter/HuntMapPieces/HuntMapPieces.tsx"),
);
const AdminDashboard = React.lazy(
  () => import("../pages/Admin/AdminDashboard/AdminDashboard.tsx"),
);
const ManageUsers = React.lazy(
  () => import("../pages/Admin/ManageUsers/ManageUsers.tsx"),
);
const ManageHunts = React.lazy(
  () => import("../pages/Admin/ManageHunts/ManageHunts.tsx"),
);
const CreateHunt = React.lazy(
  () => import("../pages/Admin/CreateHunt/CreateHunt.tsx"),
);
const CreateChallenges = React.lazy(
  () =>
    import(
      "../pages/Organizer/ViewMyHunts/CreateChallenges/CreateChallenges.tsx"
    ),
);

const SendAnnouncement = React.lazy(
  () => import("../pages/Admin/SendAnnouncement/SendAnnouncement.tsx"),
);
// const CreateReviewerAccount = React.lazy(
//   () =>
//     // import("../pages/Admin/CreateReviewerAccount/CreateReviewerAccount.tsx"),
// );
// const CreateHunterAccount = React.lazy(
//   () => import("../pages/Admin/CreateAccounts/CreateAccounts.tsx"),
// );
const ViewSubmissions = React.lazy(
  () => import("../pages/Admin/ViewSubmissions/ViewSubmissions.tsx"),
);
const ViewFeedback = React.lazy(
  () => import("../pages/Admin/ViewFeedback/ViewFeedback.tsx"),
);
const OrganizerDashboard = React.lazy(
  () => import("../pages/Organizer/OrganizerDashboard"),
);

const HunterDashboard = React.lazy(
  () => import("../pages/Hunter/HunterDashboard"),
);
// const OrganizerViewMyHunts = React.lazy(
//   () => import("../pages/Organizer/ViewMyHunts"),
// );
// const ReviewHunt = React.lazy(() => import("../pages/Reviewer/ReviewHunt"));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.HUNTS} element={<Hunts />} />
      <Route path={ROUTES.LEADERBOARD} element={<GlobalLeaderboard />} />
      <Route path={ROUTES.ABOUT} element={<ContactUs />} />
      <Route
        path={ROUTES.LOGIN}
        element={
          <ProtectedRoute inverted>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <ProtectedRoute inverted>
            <Register />
          </ProtectedRoute>
        }
      />
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
        path={ROUTES.USER_PROFILE}
        element={
          <ProtectedRoute>
            <UserProfile />
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
      <Route
        path={ROUTES.CHALLENGE}
        element={
          <ProtectedRoute>
            <Challenge />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path={ROUTES.ADMIN_DASHBOARD}
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<ManageHunts />} />
        <Route path={ROUTES.MANAGE_USERS} element={<ManageUsers />} />
        <Route path={ROUTES.MANAGE_HUNTS} element={<ManageHunts />} />

        <Route path={ROUTES.CREATE_HUNT} element={<CreateHunt />} />
        <Route path={ROUTES.SEND_ANNOUNCEMENT} element={<SendAnnouncement />} />
        <Route path={ROUTES.VIEW_MY_HUNTS} element={<ViewMyHunts />} />

        {/* <Route
          path={ROUTES.CREATE_REVIEWER}
          element={<CreateReviewerAccount />}
        /> */}

        <Route path={ROUTES.CREATE_ACCOUNTS} element={<CreateAccounts />} />
        <Route path={ROUTES.VIEW_SUBMISSIONS} element={<ViewSubmissions />} />
        <Route path={ROUTES.VIEW_FEEDBACK} element={<ViewFeedback />} />
      </Route>

      {/* Protected Organizer Routes */}
      <Route
        path={ROUTES.ORGANIZER_DASHBOARD}
        element={
          <ProtectedOrganizerRoute>
            <OrganizerDashboard />
          </ProtectedOrganizerRoute>
        }
      >
        {/*<Route index element={<OrganizerCreateHunt />} />*/}
        <Route
          index
          path={ROUTES.ORGANIZER_CREATE_HUNT}
          element={<CreateHunt />}
        />
        <Route path={ROUTES.VIEW_MY_HUNTS} element={<ViewMyHunts />} />
        <Route path={ROUTES.CREATE_CHALLENGES} element={<CreateChallenges />} />
      </Route>

      <Route
        path={ROUTES.HUNTER_DASHBOARD}
        element={
          <ProtectedRoute>
            <HunterDashboard />
          </ProtectedRoute>
        }
      ></Route>
      {/* Protected Reviewer Route */}
      {/*<Route*/}
      {/*  path={ROUTES.REVIEW_HUNT}*/}
      {/*  element={*/}
      {/*    <ProtectedRoute >*/}
      {/*      <ReviewHunt />*/}
      {/*    </ProtectedRoute>*/}
      {/*  }*/}
      {/*/>*/}

      {/* Catch-all Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
