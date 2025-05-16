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
      setError(error.response?.data?.message || "Failed to update user information");
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
      setError(error.response?.data?.message || "Failed to update profile image");
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
    <div className="container mx-auto p-4 w-full bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-left text-yellow-500 pt-6">Captain's Profile</h1>

      {error && (
        <div className="bg-red-900 border-2 border-red-600 text-red-200 px-4 py-3 rounded-lg mb-6 shadow-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900 border-2 border-green-600 text-green-200 px-4 py-3 rounded-lg mb-6 shadow-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Image Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-yellow-900">
          <h2 className="text-2xl font-semibold mb-6 text-yellow-400 border-b-2 border-yellow-700 pb-2">Profile Image</h2>

          <div className="flex flex-col items-center">
            <div className="w-40 h-40 rounded-full overflow-hidden mb-6 bg-gray-700 border-4 border-yellow-600 shadow-lg">
              <img 
                src={previewImage || userImage || "/src/assets/user (1).png"} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>

            <form onSubmit={handleUpdateImage} className="w-full">
              <div className="mb-5">
                <label className="block text-sm font-medium text-yellow-300 mb-2">
                  Select new image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-yellow-600 file:text-sm file:font-semibold file:bg-yellow-900 file:text-yellow-300 hover:file:bg-yellow-800"
                />
              </div>

              <button
                type="submit"
                disabled={!newImage || isLoading}
                className={`w-full py-3 px-4 rounded-lg ${
                  !newImage || isLoading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-yellow-600 hover:bg-yellow-700 text-white font-bold shadow-md transform hover:scale-105 transition-all duration-200"
                }`}
              >
                {isLoading ? "Updating..." : "Update Profile Image"}
              </button>
            </form>
          </div>
        </div>

        {/* User Info Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-yellow-900">
          <h2 className="text-2xl font-semibold mb-6 text-yellow-400 border-b-2 border-yellow-700 pb-2">Sailor Information</h2>

          <form onSubmit={handleUpdateInfo}>
            <div className="mb-5">
              <label className="block text-sm text-left font-medium text-yellow-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-left font-medium text-yellow-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700 text-white font-bold shadow-md transform hover:scale-105 transition-all duration-200"
              }`}
            >
              {isLoading ? "Updating..." : "Update Information"}
            </button>
          </form>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8 border-2 border-red-900">
        <h2 className="text-2xl font-semibold mb-6 text-red-400 border-b-2 border-red-700 pb-2">Abandon Ship</h2>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-3 px-4 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold shadow-md transform hover:scale-105 transition-all duration-200"
          >
            Delete Account
          </button>
        ) : (
          <div>
            <p className="mb-6 text-red-300 text-lg">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex space-x-6">
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-lg ${
                  isLoading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-red-700 hover:bg-red-800 text-white font-bold shadow-md transform hover:scale-105 transition-all duration-200"
                }`}
              >
                {isLoading ? "Processing..." : "Yes, Delete My Account"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold shadow-md transform hover:scale-105 transition-all duration-200"
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
