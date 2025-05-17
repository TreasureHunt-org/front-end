import huntdate from "/src/assets/date.png";
import skull from "/src/assets/skull2.png";
import user from "/src/assets/user (1).png";

import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios.ts";
import API_BASE_URL from "../../constants/apiURL/API_BASE_URL.ts";

interface HuntDetails {
  id: number;
  title: string;
  description: string;
  startDate: string;
}

interface HuntStats {
  numberOfChallenges: number;
  numberOfParticipants: number;
}

const SelectedHunt = () => {
  const { huntId } = useParams<{ huntId: string }>();
  const [hunt, setHunt] = useState<HuntDetails | null>(null);
  const [image, setImage] = useState<string>("");
  const [huntStats, setHuntStats] = useState<HuntStats>();
  const [numberOfChallenges, setnumberOfChallenges] = useState<number | null>(
    null,
  );
  const [numberOfParticipants, setNumberOfParticipants] = useState<
    number | null
  >(null);

  const handleJoin = async () => {
    try {
      const res = await api.post(`${API_BASE_URL}/hunts/${huntId}/join`);
      if (res.status !== 200) {
        alert("error");
      } else {
        alert("done");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(
          `${API_BASE_URL}/hunts/${huntId}/statistics`,
        );
        setHuntStats(response.data);
        setNumberOfParticipants(huntStats?.numberOfParticipants ?? 0);
        setnumberOfChallenges(huntStats?.numberOfChallenges ?? 0);
      } catch (e) {
        console.log("failed to fetch hunt stats", e);
      }
    };

    const fetchHunt = async () => {
      try {
        const res = await api.get(`${API_BASE_URL}/hunts/${huntId}`);
        setHunt(res.data);
      } catch (err) {
        console.error("Failed to fetch hunt details", err);
      }
    };
    const fetchImage = async () => {
      try {
        const res = await api.get(`${API_BASE_URL}/hunts/${huntId}/images/bg`, {
          responseType: "blob",
        });
        const imageUrl = URL.createObjectURL(res.data);
        setImage(imageUrl);
      } catch (err) {
        console.error("Failed to fetch hunt image", err);
      }
    };

    if (huntId) {
      fetchHunt();
      fetchImage();
      fetchStats();
    }
  }, [huntId, huntStats?.numberOfChallenges, huntStats?.numberOfParticipants]);

  if (!hunt) {
    return (
      <div className="mt-8 text-center text-gray-500">Loading hunt...</div>
    );
  }
  return (
    <>
      <div className="selected-hunt-container">
        <div className="horizontal">
          <div className="hunt-image">
            <img className="logo" src={image} alt="hunt image" />
          </div>

          <div className="vertical">
            <h1>{hunt.title}</h1>
            <div className="hunt-date">
              <img className="logo" src={huntdate} alt="hunt-date" />
              <h3>starts in : {hunt.startDate}</h3>
            </div>

            <div className="hunt-challenges">
              <img className="logo" src={skull} alt="skull" />
              <h3># of challenges : {numberOfChallenges}</h3>
            </div>

            <div className="hunt-participants">
              <img className="logo" src={user} alt="participants" />
              <h3># of Hunters :{numberOfParticipants}</h3>
            </div>
          </div>
        </div>

        <div className="hunt-description">{hunt.description}</div>
        <Link to={`/hunt-map-pieces/${hunt.id}`} key={hunt.id}>
          <button className="join" onClick={handleJoin}>
            Join Hunt
          </button>
        </Link>
      </div>
    </>
  );
};
export default SelectedHunt;
