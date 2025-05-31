import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import "../../App.css";

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // User data state
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  // Profile image state
  const [userImage, setUserImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Delete account confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch user image on component mount
  useEffect(() => {
    const fetchUserImage = async () => {
      if (!user?.id) return;

      try {
        const response = await api.get(`/users/${user.id}/image`, {
          responseType: "blob",
        });
        const imageUrl = URL.createObjectURL(response.data);
        setUserImage(imageUrl);
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };

    fetchUserImage();

    // Cleanup function to revoke object URLs
    return () => {
      if (userImage) URL.revokeObjectURL(userImage);
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [user?.id]);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(file);

      // Create preview
      if (previewImage) URL.revokeObjectURL(previewImage);
      const preview = URL.createObjectURL(file);
      setPreviewImage(preview);
    }
  };

  // Handle form submission to update user info
  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update user info
      const response = await api.put(`/users/${user?.id}`, {
        username,
        email,
      });

      if (response.status === 200) {
        setSuccess("User information updated successfully!");
        // Force refresh of user data by reloading the page
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Error updating user info:", error);
      setError(
        error.response?.data?.message || "Failed to update user information",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile image update
  const handleUpdateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("image", newImage);

      const response = await api.post(`/users/${user?.id}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        // Update displayed image
        if (userImage) URL.revokeObjectURL(userImage);
        setUserImage(previewImage);
        setPreviewImage(null);
        setNewImage(null);
        setSuccess("Profile image updated successfully!");
      }
    } catch (error: any) {
      console.error("Error updating profile image:", error);
      setError(
        error.response?.data?.message || "Failed to update profile image",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.delete(`/users/${user?.id}`);

      if (response.status === 200) {
        // Log out the user after successful deletion
        logout();
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error deleting account:", error);
      setError(error.response?.data?.message || "Failed to delete account");
      setShowDeleteConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto min-h-screen w-full bg-[#1c1c1c] p-4 text-white">
      <h1 className="mb-8 pt-6 text-left text-4xl font-bold text-[#f39c12]">
        Edit Profile
      </h1>

      {error && (
        <div className="mb-6 rounded-lg border-2 border-red-600 bg-red-950 px-4 py-3 text-red-200 shadow-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg border-2 border-green-600 bg-green-950 px-4 py-3 text-green-200 shadow-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Profile Image Section */}
        <div className="rounded-lg border-2 border-[#f39c12] bg-[#2c2c2c] p-6 shadow-lg">
          <h2 className="mb-6 border-b-2 border-[#e67e22] pb-2 text-2xl font-semibold text-[#f1c40f]">
            Profile Image
          </h2>

          <div className="flex flex-col items-center">
            <div className="mb-6 h-40 w-40 overflow-hidden rounded-full border-4 border-[#e67e22] bg-[#3a3a3a] shadow-lg">
              <img
                src={previewImage || userImage || "/src/assets/user (1).png"}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>

            <form onSubmit={handleUpdateImage} className="w-full">
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-[#f1c40f]">
                  Select new image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-white file:mr-4 file:rounded-full file:border-2 file:border-[#e67e22] file:bg-[#444] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#f39c12] hover:file:bg-[#555]"
                />
              </div>

              <button
                type="submit"
                disabled={!newImage || isLoading}
                className={`w-full rounded-lg px-4 py-3 ${
                  !newImage || isLoading
                    ? "cursor-not-allowed bg-[#555]"
                    : "transform bg-[#f39c12] font-bold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-[#e67e22]"
                }`}
              >
                {isLoading ? "Updating..." : "Update Profile Image"}
              </button>
            </form>
          </div>
        </div>

        {/* User Info Section */}
        <div className="rounded-lg border-2 border-[#f39c12] bg-[#2c2c2c] p-6 shadow-lg">
          <h2 className="mb-6 border-b-2 border-[#e67e22] pb-2 text-2xl font-semibold text-[#f1c40f]">
            Hunter Information
          </h2>

          <form onSubmit={handleUpdateInfo}>
            <div className="mb-5">
              <label className="mb-2 block text-left text-sm font-medium text-[#f1c40f]">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border-2 border-[#e67e22] bg-[#3a3a3a] px-4 py-3 text-white focus:ring-2 focus:ring-[#f39c12] focus:outline-none"
                required
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-left text-sm font-medium text-[#f1c40f]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-2 border-[#e67e22] bg-[#3a3a3a] px-4 py-3 text-white focus:ring-2 focus:ring-[#f39c12] focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-lg px-4 py-3 ${
                isLoading
                  ? "cursor-not-allowed bg-[#555]"
                  : "transform bg-[#f39c12] font-bold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-[#e67e22]"
              }`}
            >
              {isLoading ? "Updating..." : "Update Information"}
            </button>
          </form>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="mt-8 rounded-lg border-2 border-red-800 bg-[#2c2c2c] p-6 shadow-lg">
        {/* <h2 className="mb-6 border-b-2 border-red-700 pb-2 text-2xl font-semibold text-red-400">
          Abandon Ship
        </h2> */}

        {!showDeleteConfirm ? (
          <div>
            <p className="mb-6 text-lg text-red-300">Delete my account</p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-1/2 transform rounded-lg bg-red-700 px-4 py-3 font-bold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-red-800"
            >
              Delete Account
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-6 text-lg text-red-300">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex space-x-6">
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className={`w-1/2 flex-1 rounded-lg px-4 py-3 ${
                  isLoading
                    ? "cursor-not-allowed bg-[#555]"
                    : "transform bg-red-700 font-bold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-red-800"
                }`}
              >
                {isLoading ? "Processing..." : "Yes, Delete My Account"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-1/2 flex-1 transform rounded-lg bg-[#555] px-4 py-3 font-bold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-[#666]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
