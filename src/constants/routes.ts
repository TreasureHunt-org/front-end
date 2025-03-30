export const ROUTES = {
  // Public routes
  HOME: "/",
  HUNTS: "/hunts",
  LEADERBOARD: "/leaderboard",
  ABOUT: "/about",
  LOGIN: "/login",
  REGISTER: "/register",
  SELECTED_HUNT: "/selected-hunt/:huntId",
  HUNT_RANKING: "/hunt-ranking/:huntId",

  // User routes
  USER_DASHBOARD: "/user-dashboard",
  HUNT_MAP_PIECES: "/hunt-map-pieces/:huntId",

  // Admin routes
  ADMIN_DASHBOARD: "/admin-dashboard",
  MANAGE_USERS: "manage-users",
  MANAGE_HUNTS: "manage-hunts",
  CREATE_HUNT: "create-hunt",
  SEND_ANNOUNCEMENT: "send-announcement",
  CREATE_REVIEWER: "create-reviewer",
  CREATE_HUNTER: "create-hunter",
  VIEW_SUBMISSIONS: "view-submissions/:huntId",
  VIEW_FEEDBACK: "view-feedback",

  // Reviewer routes
  REVIEW_HUNT: "/review-hunt/:submissionId",
};
