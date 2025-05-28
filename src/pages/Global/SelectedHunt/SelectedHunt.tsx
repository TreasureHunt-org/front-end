import huntdate from "/src/assets/date.png";
import skull from "/src/assets/skull2.png";
import user from "/src/assets/user (1).png";

import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../api/axios.ts";
import API_BASE_URL from "../../../constants/apiURL/API_BASE_URL.ts";

import "../SelectedHunt/SelectedHunt.css";

interface HuntDetails {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface HuntStats {
  numberOfChallenges: number;
  numberOfParticipants: number;
}

const SelectedHunt = () => {
  const { huntId } = useParams<{ huntId: string }>();
  const [hunt, setHunt] = useState<HuntDetails | null>(null);
  const [image, setImage] = useState<string>("");
  // const [huntStats, setHuntStats] = useState<HuntStats>();
  const [huntStats, setHuntStats] = useState<HuntStats>({
    numberOfChallenges: 0,
    numberOfParticipants: 0,
  });
  const [loading, setLoading] = useState({
    hunt: true,
    image: true,
    stats: true,
  });
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  // const [numberOfChallenges, setnumberOfChallenges] = useState<number | null>(
  //   null,
  // );
  // const [numberOfParticipants, setNumberOfParticipants] = useState<
  //   number | null
  // >(null);

  const handleJoin = async () => {
    try {
      // const res = await api.post(`${API_BASE_URL}/hunts/${huntId}/join`, {
      const res = await api.post(`/hunts/${huntId}/join`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // const res = await api.post(
      //   `${API_BASE_URL}/hunts/${huntId}/join`,
      //   {},
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      //     },
      //   },
      // );
      if (res.status === 200) {
        alert("Successfully joined the hunt!");
        navigate(`/hunt-map-pieces/${huntId}`);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to join hunt";
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading((prev) => ({ ...prev, hunt: true }));
        const [huntRes, imageRes, statsRes] = await Promise.all([
          api.get(`${API_BASE_URL}/hunts/${huntId}`),
          api
            .get(`${API_BASE_URL}/hunts/${huntId}/images/bg`, {
              responseType: "blob",
            })
            .catch(() => null),
          api.get(`${API_BASE_URL}/hunts/${huntId}/statistics`),
        ]);

        setHunt(huntRes.data);
        if (imageRes) {
          const imageUrl = URL.createObjectURL(imageRes.data);
          setImage(imageUrl);
        }

        setHuntStats(statsRes.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch hunt data");
        console.error("API Error:", err);
      } finally {
        setLoading({ hunt: false, image: false, stats: false });
      }
    };

    if (huntId) {
      fetchData();
    }
  }, [huntId]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  if (loading.hunt) {
    return (
      <div className="mt-8 text-center text-gray-500">
        Loading hunt details...
      </div>
    );
  }

  if (error) {
    return <div className="mt-8 text-center text-red-500">{error}</div>;
  }

  if (!hunt) {
    return <div className="mt-8 text-center text-gray-500">Hunt not found</div>;
  }

  // const fetchStats = async () => {
  //   try {
  //     const response = await api.get(
  //       `${API_BASE_URL}/hunts/${huntId}/statistics`,
  //     );
  //     setHuntStats(response.data);
  //     setNumberOfParticipants(huntStats?.numberOfParticipants ?? 0);
  //     setnumberOfChallenges(huntStats?.numberOfChallenges ?? 0);
  //   } catch (e) {
  //     console.log("failed to fetch hunt stats", e);
  //   }
  // };

  // const fetchHunt = async () => {
  //   try {
  //     const res = await api.get(`${API_BASE_URL}/hunts/${huntId}`);
  //     setHunt(res.data);
  //   } catch (err) {
  //     console.error("Failed to fetch hunt details", err);
  //   }
  // };
  // const fetchImage = async () => {
  //   try {
  //     const res = await api.get(`${API_BASE_URL}/hunts/${huntId}/images/bg`, {
  //       responseType: "blob",
  //     });
  //     const imageUrl = URL.createObjectURL(res.data);
  //     setImage(imageUrl);
  //   } catch (err) {
  //     console.error("Failed to fetch hunt image", err);
  //   }
  // };

  //   if (huntId) {
  //     fetchHunt();
  //     fetchImage();
  //     fetchStats();
  //   }
  // }, [huntId, huntStats?.numberOfChallenges, huntStats?.numberOfParticipants]);

  // if (!hunt) {
  //   return (
  //     <div className="mt-8 text-center text-gray-500">Loading hunt...</div>
  //   );
  // }
  return (
    <>
      <div className="selected-hunt-container">
        <div className="horizontal">
          <div className="hunt-image">
            <img
              className="logo"
              src={image}
              alt={hunt.title || "Hunt image"}
              onError={(e) => {
                e.currentTarget.src = skull;
              }}
            />
          </div>

          <div className="vertical">
            <h1>{hunt.title}</h1>

            <div className="hunt-date">
              <img className="logo" src={huntdate} alt="hunt-date" />
              {/* <h3>starts in : {hunt.startDate}</h3> */}
              <h3>Starts: {formatDate(hunt.startDate)}</h3>
            </div>

            <div className="hunt-challenges">
              <img className="logo" src={skull} alt="skull" />
              {/* <h3># of challenges : {numberOfChallenges}</h3> */}
              <h3># of challenges : {huntStats.numberOfChallenges}</h3>
            </div>

            <div className="hunt-participants">
              <img className="logo" src={user} alt="participants" />
              {/* <h3># of Hunters :{numberOfParticipants}</h3> */}
              <h3># of Hunters :{huntStats.numberOfParticipants}</h3>
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
