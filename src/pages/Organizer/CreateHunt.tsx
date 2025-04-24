import React, { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../constants/API_BASE_URL";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
// import { Outlet } from "react-router-dom";

const CreateHunt: React.FC = () => {
  const [huntTitle, setHuntTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [background, setBackground] = useState<File | null>(null);
  const [mapImage, setMapImage] = useState<File | null>(null);

  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in to create a hunt.</div>;
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

    if (!accessToken) {
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng)) {
      return alert("Invalid latitude or longitude");
    }
    if (!background || !mapImage) {
      return alert("Please select images");
    }

    const toISOStringWithSeconds = (localDate: string) => {
      const date = new Date(localDate);
      return date.toISOString();
    };

    const huntData = {
      title: huntTitle,
      description,
      startDate: toISOStringWithSeconds(startDate),
      endDate: toISOStringWithSeconds(endDate),
      location: { latitude: lat, longitude: lng },
    };

    const formData = new FormData();
    formData.append("background", background);
    formData.append("map", mapImage);
    formData.append("huntData", JSON.stringify(huntData));

    for (let [key, val] of formData.entries()) {
      console.log(key, val);
    }

    try {
      const { data } = await api.post(API_BASE_URL + "/hunts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Created:", data);
      alert("Hunt created!");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Bad request: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="create-hunt-container">
      <h2 className="create-hunt-title">Create Hunt</h2>
      <Link to={`${ROUTES.ORGANIZER_DASHBOARD}/${ROUTES.ORGANIZER_VIEW_MY_HUNTS}`} className="menu-link">
        <button type="button" className="create-hunt-button">
          view my hunts
        </button>
      </Link>

      <form onSubmit={handleCreateHunt} className="create-hunt-form">
        <div className="form-group">
          <label>Title</label>
          <input
            className="create-hunt-input"
            type="text"
            value={huntTitle}
            onChange={(e) => setHuntTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="create-hunt-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Start Date (UTC)</label>
          <input
            className="create-hunt-input"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>End Date (UTC)</label>
          <input
            className="create-hunt-input"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Latitude</label>
          <input
            className="create-hunt-input"
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Longitude</label>
          <input
            className="create-hunt-input"
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Background Image</label>
          <input
            className="create-hunt-input"
            type="file"
            accept="image/*"
            onChange={handleBackgroundChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Map Image</label>
          <input
            className="create-hunt-input"
            type="file"
            accept="image/*"
            onChange={handleMapImageChange}
            required
          />
        </div>
        <button type="submit" className="create-hunt-button">
          Create Hunt
        </button>
      </form>
      {/* <Outlet /> */}
    </div>
  );
};

export default CreateHunt;
