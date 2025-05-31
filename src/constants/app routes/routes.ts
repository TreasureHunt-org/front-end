export const ROUTES = {
  // Public routes
  HOME: "/",
  HUNTS: "/hunts",
  LEADERBOARD: "/leaderboard",
  ABOUT: "/about",
  SELECTED_HUNT: "/selected-hunt/:huntId",
  HUNT_RANKING: "/hunt-ranking/:huntId",

  //Hunter routes
  HUNTER_DASHBOARD: "/hunter-dashboard",

  // User routes
  USER_DASHBOARD: "/user-dashboard",
  USER_PROFILE: "/user-profile",
  HUNT_MAP_PIECES: "/hunt-map-pieces/:huntId",
  CHALLENGE: "/challenge/:challengeId",

  // Admin routes
  ADMIN_DASHBOARD: "/admin-dashboard",
  MANAGE_USERS: "manage-users",
  MANAGE_HUNTS: "manage-hunts",
  CREATE_HUNT: "create-hunt",
  VIEW_MY_HUNTS: "my-hunts",
  SEND_ANNOUNCEMENT: "send-announcement",
  CREATE_REVIEWER: "create-reviewer",
  CREATE_ACCOUNTS: "create-accounts",
  VIEW_SUBMISSIONS: "view-submissions",
  VIEW_FEEDBACK: "view-feedback",

  // Organizer routes
  ORGANIZER_DASHBOARD: "/organizer-dashboard",
  ORGANIZER_CREATE_HUNT: "create-hunt",
  ORGANIZER_VIEW_MY_HUNTS: "my-hunts",
  CREATE_CHALLENGES: "create-challenges/:huntId",

  // Reviewer routes
  REVIEW_HUNT: "/review-hunt/:submissionId",
};
