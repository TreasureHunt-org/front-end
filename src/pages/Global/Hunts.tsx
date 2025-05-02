import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios.ts";

interface Hunt {
  id: number;
  title: string;
  huntStatus: string;
}

const PAGE_SIZE = 6;

const Hunts: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"LIVE" | "APPROVED">("LIVE");

  const [liveHunts, setLiveHunts] = useState<Hunt[]>([]);
  const [upcomingHunts, setUpcomingHunts] = useState<Hunt[]>([]);
  const [livePage, setLivePage] = useState(0);
  const [upcomingPage, setUpcomingPage] = useState(0);
  const [hasMoreLive, setHasMoreLive] = useState(true);
  const [hasMoreUpcoming, setHasMoreUpcoming] = useState(true);

  const [liveImages, setLiveImages] = useState<{ [id: number]: string }>({});
  const [upcomingImages, setUpcomingImages] = useState<{ [id: number]: string }>({});

  const [loading, setLoading] = useState(false);

  const fetchHunts = async (status: "LIVE" | "APPROVED", page: number) => {
    try {
      setLoading(true);
      const res = await api.get(`/hunts?status=${status}`, {
        params: { size: PAGE_SIZE, page, sort: "id", direction: "ASC" },
      });
      const hunts: Hunt[] = res.data.content || res.data;

      if (status === "LIVE") {
        setLiveHunts(hunts);
        setHasMoreLive(hunts.length === PAGE_SIZE);
        hunts.forEach((hunt) => fetchImage(hunt.id, "LIVE"));
      } else {
        setUpcomingHunts(hunts);
        setHasMoreUpcoming(hunts.length === PAGE_SIZE);
        hunts.forEach((hunt) => fetchImage(hunt.id, "APPROVED"));
      }
    } catch (err) {
      toast.error(`Failed to fetch ${status.toLowerCase()} hunts`);
    } finally {
      setLoading(false);
    }
  };

  const fetchImage = async (id: number, status: "LIVE" | "APPROVED") => {
    try {
      const res = await api.get(`/hunts/${id}/images/bg`, { responseType: "blob" });
      const imageUrl = URL.createObjectURL(res.data);
      if (status === "LIVE") {
        setLiveImages((prev) => ({ ...prev, [id]: imageUrl }));
      } else {
        setUpcomingImages((prev) => ({ ...prev, [id]: imageUrl }));
      }
    } catch {
      console.error(`Failed to load image for hunt ${id}`);
    }
  };

  useEffect(() => {
    if (selectedTab === "LIVE" && livePage === 0) fetchHunts("LIVE", 0);
    if (selectedTab === "APPROVED" && upcomingPage === 0) fetchHunts("APPROVED", 0);
  }, [selectedTab]);

  useEffect(() => {
    if (livePage > 0) fetchHunts("LIVE", livePage);
  }, [livePage]);

  useEffect(() => {
    if (upcomingPage > 0) fetchHunts("APPROVED", upcomingPage);
  }, [upcomingPage]);

  const renderCard = (hunt: Hunt, imageSrc: string) => (
    <Link to={`/selected-hunt/${hunt.id}`} key={hunt.id}>
      <div className="bg-transparent border border-transparent rounded-2xl shadow-md hover:shadow-xl hover:border-[#f39c12] transition duration-300 ease-in-out overflow-hidden group">
        <div className="relative w-full h-48">
          <img
            src={imageSrc}
            alt={hunt.title}
            className="w-full h-full object-contain transform group-hover:scale-105 transition duration-300"
            onError={(e) => ((e.target as HTMLImageElement).src = "/fallback.jpg")}
          />
        </div>
        <div className="px-5 py-4">
          <h3 className="text-xl font-bold text-[#f39c12] group-hover:text-[#f39c12] group-hover:underline">
            {hunt.title}
          </h3>
        </div>
      </div>
    </Link>
  );



  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setSelectedTab("LIVE")}
          className={`px-4 py-2 rounded-md font-medium ${
            selectedTab === "LIVE" ? "bg-[#f39c12] text-white" : "bg-gray-100 text-gray-800"
          }`}
        >
          Live Hunts
        </button>
        <button
          onClick={() => setSelectedTab("APPROVED")}
          className={`px-4 py-2 rounded-md font-medium ${
            selectedTab === "APPROVED" ? "bg-[#f39c12] text-white" : "bg-gray-100 text-gray-800"
          }`}
        >
          Upcoming Hunts
        </button>
      </div>

      {/* Content Section */}
      <div>
        {loading && <p className="text-center text-gray-500 mb-4">Loading...</p>}

        {selectedTab === "LIVE" && (
          <div>
            {liveHunts.length === 0 && !loading ? (
              <p className="text-gray-600 text-center">No ongoing hunts found.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {liveHunts.map((hunt) => renderCard(hunt, liveImages[hunt.id]))}
                </div>
                {hasMoreLive && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setLivePage((prev) => prev + 1)}
                      className="bg-[#f39c12] text-white px-6 py-2 rounded-md "
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {selectedTab === "APPROVED" && (
          <div>
            {upcomingHunts.length === 0 && !loading ? (
              <p className="text-gray-600 text-center">No upcoming hunts found.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {upcomingHunts.map((hunt) => renderCard(hunt, upcomingImages[hunt.id]))}
                </div>
                {hasMoreUpcoming && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setUpcomingPage((prev) => prev + 1)}
                      className="bg- text-white px-6 py-2 rounded-md hover:bg-[#f39c12]"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hunts;
