import { User } from "./types";

// Mock Users with Different Roles
export const mockUsers: User[] = [
  {
    id: "1",
    username: "john_hunter",
    email: "hunter@example.com",
    role: "HUNTER",
    token: "fake-token-hunter",
  },
  {
    id: "2",
    username: "olivia_organizer",
    email: "organizer@example.com",
    role: "ORGANIZER",
    token: "fake-token-organizer",
  },
  {
    id: "3",
    username: "admin_master",
    email: "admin@example.com",
    role: "ADMIN",
    token: "fake-token-admin",
  },
  {
    id: "4",
    username: "reviewer_jack",
    email: "reviewer@example.com",
    role: "REVIEWER",
    token: "fake-token-reviewer",
  },
];

// Mock Hunts
export const mockHunts = [
  {
    id: "hunt-1",
    name: "Lost Treasure of Atlantis",
    organizerId: "2",
    status: "active",
    challenges: ["challenge-1", "challenge-2"],
    leaderboard: ["1", "3"], // User IDs
  },
  {
    id: "hunt-2",
    name: "The Pharaoh’s Secret",
    organizerId: "2",
    status: "pending",
    challenges: ["challenge-3", "challenge-4"],
    leaderboard: [],
  },
];

// Mock Challenges
export const mockChallenges = [
  {
    id: "challenge-1",
    huntId: "hunt-1",
    name: "Solve the Ancient Puzzle",
    type: "puzzle",
    solution: "sphinx",
  },
  {
    id: "challenge-2",
    huntId: "hunt-1",
    name: "Find the Hidden Symbol",
    type: "search",
    solution: "eyeofhorus",
  },
  {
    id: "challenge-3",
    huntId: "hunt-2",
    name: "Decode the Hieroglyphs",
    type: "puzzle",
    solution: "anubis",
  },
];

// Mock Submissions
export const mockSubmissions = [
  {
    userId: "1",
    challengeId: "challenge-1",
    submission: "sphinx",
    status: "correct",
  },
  {
    userId: "1",
    challengeId: "challenge-2",
    submission: "wrong-answer",
    status: "incorrect",
  },
];

// Mock Feedback
export const mockFeedback = [
  {
    userId: "1",
    huntId: "hunt-1",
    message: "Loved this hunt! The puzzles were great.",
  },
  {
    userId: "2",
    huntId: "hunt-2",
    message: "Could be improved with more hints.",
  },
];
