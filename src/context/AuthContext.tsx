import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  login: (accessToken: string, refreshToken: string, userData: any) => string;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type userRoles = "ADMIN" | "HUNTER" | "ORGANIZER" | "REVIEWER" | "";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const value = window.localStorage.getItem("user");
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem("user", "");
        return null;
      }
    } catch {
      return null;
    }
  });
  const [role, setRole] = useState<userRoles>("");

  const setUserState = (user: User | null) => {
    setUser(user);
    window.localStorage.setItem("user", !user ? "" : JSON.stringify(user));
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        try {
          api.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;

          const response = await api.get("/auth/me");
          const userData = response.data.data?.[0] || response.data;

          if (userData) {
            setUserState({
              id: userData.id,
              username: userData.username,
              email: userData.email,
              roles: userData.roles || ["HUNTER"],
            });
            setRole(userData.roles?.[0] || "HUNTER");
          }
        } catch (error) {
          console.error("Failed to validate token:", error);
          logout();
        }
      }
    };

    initializeAuth();
  }, []);

  const login = (
    accessToken: string,
    refreshToken: string,
    userData: any,
  ): string => {
    // Store tokens directly in localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Set default auth header
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    // Extract user info
    const userInfo = userData.data?.[0] || userData;
    const roles = userInfo.roles;
    // const primaryRole = roles[0] || "HUNTER";

    // Update state
    setUserState({
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      roles: roles,
    });
    setRole(roles);

    return roles;
  };

  const logout = () => {
    // Clear tokens directly
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete api.defaults.headers.common["Authorization"];
    setUserState(null);
    setRole("");
    window.location.href = "/login";
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    role,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
