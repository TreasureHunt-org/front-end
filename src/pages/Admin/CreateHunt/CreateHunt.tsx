import React, { useState } from "react";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import API_BASE_URL from "../../../constants/apiURL/API_BASE_URL";
import { useNavigate } from "react-router-dom";
import "../CreateHunt/CreateHunt.css";

const CreateHunt: React.FC = () => {
  const [huntTitle, setHuntTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [background, setBackground] = useState<File | null>(null);
  const [mapImage, setMapImage] = useState<File | null>(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    // return <div>Please log in to create a hunt.</div>;
    return;
  }

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setBackground(e.target.files[0]);
  };

  const handleMapImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setMapImage(e.target.files[0]);
  };

  const handleCreateHunt = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) return;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng)) {
      return alert("Invalid latitude or longitude");
    }
    if (!background || !mapImage) {
      return alert("Please select images");
    }
    if (huntTitle.trim() === "") {
      return alert("Please enter a valid title");
    }

    const huntData = {
      title: huntTitle,
      description,
      location: { latitude: lat, longitude: lng },
    };

    const formData = new FormData();
    formData.append("background", background);
    formData.append("map", mapImage);
    formData.append("huntData", JSON.stringify(huntData));

    try {
      const { data } = await api.post(API_BASE_URL + "/hunts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Created:", data);
      navigate("/organizer-dashboard/my-hunts");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      // alert("Bad request: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="create-hunt-container">
      <h2 className="create-hunt-title">Create Hunt</h2>

      <form onSubmit={handleCreateHunt} className="create-hunt-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            className="create-hunt-input"
            type="text"
            value={huntTitle}
            onChange={(e) => setHuntTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="create-hunt-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="latitude">Latitude</label>
          <input
            id="latitude"
            className="create-hunt-input"
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="longitude">Longitude</label>
          <input
            id="longitude"
            className="create-hunt-input"
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="background">Background Image</label>
          <input
            id="background"
            className="create-hunt-input"
            type="file"
            accept="image/*"
            onChange={handleBackgroundChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="map">Map Image</label>
          <input
            id="map"
            className="create-hunt-input"
            type="file"
            accept="image/*"
            onChange={handleMapImageChange}
            required
          />
        </div>

        <div className="form-group">
          <button type="submit" className="create-hunt-button">
            Create Hunt
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateHunt;
