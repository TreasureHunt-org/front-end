import React, { useState } from "react";

interface IProps {}

const CreateHunt = ({}: IProps) => {
  const [huntTitle, setHuntTitle] = useState("");
  // const [challenges, setChallenges] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [challengesArray, setChallengesArray] = useState<[]>([]);
  const [background, setBackground] = useState<any>(null);
  const [location, setLocation] = useState("");
  const [mapImage, setMapImage] = useState<any>(null);

  const handleCreateHunt = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      huntTitle,
      challengesArray,
      startDate,
      endDate,
      description,
      background,
      location,
      mapImage,
    });
  };

  const handleChallengeTypeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const updatedChallenges = [...challengesArray];
    updatedChallenges[index].type = e.target.value;
    setChallengesArray(updatedChallenges);
  };

  const handleChallengeFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const updatedChallenges = [...challengesArray];
    if (e.target.files) {
      updatedChallenges[index].file = e.target.files[0];
    }
    setChallengesArray(updatedChallenges);
  };

  const handleAddChallenge = () => {
    setChallengesArray([...challengesArray, { type: "", file: null }]);
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBackground(e.target.files[0]);
    }
  };

  const handleMapImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMapImage(e.target.files[0]);
    }
  };

  return (
    <div className="create-hunt-container">
      <h2 className="create-hunt-title">Create Hunt</h2>
      <form onSubmit={handleCreateHunt} className="create-hunt-form">
        <div className="form-group">
          <label htmlFor="huntTitle">Hunt Title</label>
          <input
            type="text"
            id="huntTitle"
            className="create-hunt-input"
            placeholder="Enter hunt title"
            value={huntTitle}
            onChange={(e) => setHuntTitle(e.target.value)}
          />
        </div>

        {/* <div className="form-group">
          <label htmlFor="challenges">Challenges</label>
          <input
            type="text"
            id="challenges"
            className="create-hunt-input"
            placeholder="Enter challenges (comma separated)"
            value={challenges}
            onChange={(e) => setChallenges(e.target.value)}
          />
        </div> */}

        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            className="create-hunt-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            className="create-hunt-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="create-hunt-textarea"
            placeholder="Enter hunt description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {challengesArray.map((challenge, index) => (
          <div key={index} className="create-hunt-challenge">
            <div className="form-group">
              <label htmlFor={`challengeType-${index}`}>Challenge Type</label>
              <input
                type="text"
                id={`challengeType-${index}`}
                className="create-hunt-input"
                placeholder="Challenge Type"
                value={challenge.type}
                onChange={(e) => handleChallengeTypeChange(e, index)}
              />
            </div>

            <div className="form-group">
              <label htmlFor={`challengeFile-${index}`}>Challenge File</label>
              <input
                type="file"
                id={`challengeFile-${index}`}
                className="create-hunt-input"
                onChange={(e) => handleChallengeFileChange(e, index)}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddChallenge}
          className="create-hunt-button"
        >
          Add Challenge
        </button>

        <div className="form-group">
          <label htmlFor="background">Background Image</label>
          <input
            type="file"
            id="background"
            accept="image/*"
            className="create-hunt-input"
            onChange={handleBackgroundChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            className="create-hunt-input"
            placeholder="Enter hunt location (from google maps)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="mapImage">Map Image</label>
          <input
            type="file"
            id="mapImage"
            accept="image/*"
            className="create-hunt-input"
            onChange={handleMapImageChange}
          />
        </div>

        <button type="submit" className="create-hunt-button">
          Create Hunt
        </button>
      </form>
    </div>
  );
};

export default CreateHunt;
