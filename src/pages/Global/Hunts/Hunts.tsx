import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../api/axios.ts";

import "../Hunts/Hunts.css";
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
  const [upcomingImages, setUpcomingImages] = useState<{
    [id: number]: string;
  }>({});

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
      const res = await api.get(`/hunts/${id}/images/bg`, {
        responseType: "blob",
      });
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
    if (selectedTab === "APPROVED" && upcomingPage === 0)
      fetchHunts("APPROVED", 0);
  }, [selectedTab]);

  useEffect(() => {
    if (livePage > 0) fetchHunts("LIVE", livePage);
  }, [livePage]);

  useEffect(() => {
    if (upcomingPage > 0) fetchHunts("APPROVED", upcomingPage);
  }, [upcomingPage]);

  const renderCard = (hunt: Hunt, imageSrc: string) => (
    <Link to={`/selected-hunt/${hunt.id}`} key={hunt.id}>
      <div className="group overflow-hidden rounded-2xl border border-transparent bg-transparent shadow-md transition duration-300 ease-in-out hover:border-[#f39c12] hover:shadow-xl">
        <div className="relative h-48 w-full">
          <img
            src={imageSrc}
            alt={hunt.title}
            className="h-full w-full transform object-contain transition duration-300 group-hover:scale-105"
            onError={(e) =>
              ((e.target as HTMLImageElement).src = "/fallback.jpg")
            }
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
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Tabs */}
      <div className="mb-8 flex space-x-4">
        <button
          onClick={() => setSelectedTab("LIVE")}
          className={`rounded-md px-4 py-2 font-medium ${
            selectedTab === "LIVE"
              ? "bg-[#f39c12] text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          Live Hunts
        </button>
        <button
          onClick={() => setSelectedTab("APPROVED")}
          className={`rounded-md px-4 py-2 font-medium ${
            selectedTab === "APPROVED"
              ? "bg-[#f39c12] text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          Upcoming Hunts
        </button>
      </div>

      {/* Content Section */}
      <div>
        {loading && (
          <p className="mb-4 text-center text-gray-500">Loading...</p>
        )}

        {selectedTab === "LIVE" && (
          <div>
            {liveHunts.length === 0 && !loading ? (
              <p className="text-center text-gray-600">
                No ongoing hunts found.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {liveHunts.map((hunt) =>
                    renderCard(hunt, liveImages[hunt.id]),
                  )}
                </div>
                {hasMoreLive && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setLivePage((prev) => prev + 1)}
                      className="rounded-md bg-[#f39c12] px-6 py-2 text-white"
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
              <p className="text-center text-gray-600">
                No upcoming hunts found.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {upcomingHunts.map((hunt) =>
                    renderCard(hunt, upcomingImages[hunt.id]),
                  )}
                </div>
                {hasMoreUpcoming && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setUpcomingPage((prev) => prev + 1)}
                      className="bg- rounded-md px-6 py-2 text-white hover:bg-[#f39c12]"
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
