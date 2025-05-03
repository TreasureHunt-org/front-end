import React, { useEffect, useState } from "react";
import api from "../../api/axios.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import API_BASE_URL from "../../constants/API_BASE_URL.ts";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { Hunt, PageResponse } from "../../types.ts";


const ViewMyHunts: React.FC = () => {
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const [pageData, setPageData] = useState<PageResponse | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortDirection, setSortDirection] = useState<string>("ASC");
  const [status, setStatus] = useState<string>("DRAFT");

  const { isAuthenticated } = useAuth();

  const accessToken = localStorage.getItem("accessToken");

  const fetchMyHunts = async () => {
    if (!isAuthenticated || !accessToken) return;

    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const response = await api.get(API_BASE_URL + "/hunts/me", {
        params: {
          page: currentPage,
          size: pageSize,
          direction: sortDirection,
          status: status
        }
      });

      setPageData(response.data);
      setHunts(response.data.content || []);
    } catch (err) {
      console.error("Error fetching hunts:", err);
    }
  };

  useEffect(() => {
    fetchMyHunts();
  }, [isAuthenticated, accessToken, currentPage, pageSize, sortDirection, status]);

  if (!isAuthenticated) {
    return <div>Please log in to view your hunts</div>;
  }
  const calculateDuration = (start: string, end: string): string => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffInMs = endTime.getTime() - startTime.getTime();

    const totalMinutes = Math.floor(diffInMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);

    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setCurrentPage(0); // Reset to first page when changing status
  };

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortDirection(e.target.value);
    setCurrentPage(0); // Reset to first page when changing sort direction
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && (!pageData || newPage < pageData.totalPages)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="table-container">
      {/*<h2 className="view-hunts-title">My Hunts</h2>*/}

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select 
            id="status-filter" 
            value={status} 
            onChange={handleStatusChange}
            className="filter-select"
          >
            <option value="DRAFT">Draft</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="LIVE">Live</option>
            <option value="FINISHED">Finished</option>
            <option value="TERMINATED">Terminated</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-direction">Sort Direction:</label>
          <select 
            id="sort-direction" 
            value={sortDirection} 
            onChange={handleDirectionChange}
            className="filter-select"
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <Link to="/organizer-dashboard/create-hunt">
            <button className="add-btn">Create New Hunt</button>
          </Link>
        </div>
      </div>

      {hunts.length === 0 ? (
        <p>No hunts found with the selected filters.</p>
      ) : (
        <table className="manage-users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hunts.map((hunt, index) => (
              <tr key={hunt.id}>
                <td>{index + 1}</td>
                <td>{hunt.title}</td>
                <td>{hunt.description.length > 20 ?
                  `${hunt.description.substring(0, 20)}...` :
                  hunt.description}
                </td>
                <td>{hunt.startDate ? new Date(hunt.startDate).toLocaleString(): 'N/A'}</td>
                <td>{hunt.endDate ? new Date(hunt.endDate).toLocaleString(): 'N/A'}</td>
                <td>{calculateDuration(hunt.startDate, hunt.endDate)}</td>
                <td >
                  {hunt.huntStatus.replace('_', ' ')}
                </td>
                <td className="control-btns">
                  <button className="edit-btn">
                    <FaEdit className="edit-icon" />
                  </button>
                  <Link to={`/organizer-dashboard/create-challenges/${hunt.id}`}>
                    <button className="manage-button">Add Challenges</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pageData && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 0}
          >
            Prev
          </button>
          <span>
            Page {currentPage + 1} of {pageData.totalPages || 1}
          </span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={pageData.last}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewMyHunts;
