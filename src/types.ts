export type UserRole = "HUNTER" | "ORGANIZER" | "ADMIN" | "REVIEWER";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  token: string;
}
