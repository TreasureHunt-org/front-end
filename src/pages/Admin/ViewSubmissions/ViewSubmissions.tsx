import { useState, useEffect } from "react";
import "../ViewSubmissions/ViewSubmissions.css";
import { FiSearch } from "react-icons/fi";
import api from "../../../api/axios.ts";

// Define interfaces for our data types
interface IHunt {
  id: string;
  title: string;
}

interface ISubmission {
  id: string;
  hunterName: string;
  submissionDate: string;
  challengeNumber: number;
  challengeTitle: string;
  score: number;
  status: "APPROVED" | "REJECTED" | "PENDING";
  code: string;
  huntId: string;
  huntName: string;
}

const ViewSubmissions = () => {
  // State for submissions data
  const [submissions, setSubmissions] = useState<ISubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ISubmission[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);

  // State for hunts data
  const [hunts, setHunts] = useState<IHunt[]>([]);
  const [loadingHunts, setLoadingHunts] = useState<boolean>(true);

  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 10;

  // State for filters
  const [selectedHunt, setSelectedHunt] = useState<string>("");
  const [hunterNameFilter, setHunterNameFilter] = useState<string>("");

  const fetchHunts = async () => {
    setLoadingHunts(true);
    try {
      // In a real implementation, this would be:
      const response = await api.get("/hunts?size=100");
      // console.log(response.data.content);
      const hunts = response.data.content;

      setHunts(hunts);
      setLoadingHunts(false);
    } catch (error) {
      console.error("Error fetching hunts:", error);
      setLoadingHunts(false);
      setHunts([]);
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      if (selectedHunt) params.append("huntId", selectedHunt);
      if (hunterNameFilter) params.append("hunterName", hunterNameFilter);

      // In a real implementation, this would be:
      const response = await api.get(`/submissions?${params.toString()}`);
      console.log(`/submissions?${params.toString()}`);
      // console.log(response.data);

      // Check if the response has the expected structure
      if (response.data && response.data.data) {
        const submissionsData = response.data.data;

        // Check if the response has pagination information
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        } else {
          // If no pagination info, assume we got all data in one page
          setTotalPages(1);
        }

        setSubmissions(submissionsData);
        setFilteredSubmissions(submissionsData);
      } else {
        setSubmissions([]);
        setFilteredSubmissions([]);
        setTotalPages(1);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setLoading(false);
      setSubmissions([]);
      setFilteredSubmissions([]);
      setTotalPages(1);
    }
  };

  // Since we're now using server-side filtering and pagination,
  // we don't need to filter submissions client-side anymore.
  // The API will return the filtered and paginated data directly.
  // This useEffect is kept for backward compatibility or future client-side filtering needs.
  useEffect(() => {
    // If we need to do any additional client-side filtering, we can do it here
    setFilteredSubmissions(submissions);
  }, [submissions]);

  // Fetch hunts and submissions when component mounts
  useEffect(() => {
    fetchHunts();
    fetchSubmissions();
  }, []);

  // Fetch submissions when filters or pagination changes
  useEffect(() => {
    fetchSubmissions();
  }, [selectedHunt, hunterNameFilter, currentPage, pageSize]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Handle hunt selection
  const handlePickHunt = (huntId: string) => {
    setSelectedHunt(huntId);
  };

  // Handle hunter name filter
  const handleHunterNameFilter = (name: string) => {
    setHunterNameFilter(name);
    // Reset to first page when filtering
    setCurrentPage(0);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  // Render loading skeleton
  const renderSkeletonLoader = () => {
    return (
      <>
        <table className="manage-users-table">
          <thead>
            <tr>
              <th>Hunter Name</th>
              <th>Submission Date & time</th>
              {/*<th>Challenge Number</th>*/}
              <th>Challenge title</th>
              <th>Score</th>
              <th>Status (Approved/Rejected)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(pageSize)].map((_, index) => (
              <tr key={index} className="skeleton-row">
                <td>
                  <div className="skeleton"></div>
                </td>
                <td>
                  <div className="skeleton"></div>
                </td>
                {/*<td><div className="skeleton"></div></td>*/}
                <td>
                  <div className="skeleton"></div>
                </td>
                <td>
                  <div className="skeleton"></div>
                </td>
                <td>
                  <div className="skeleton"></div>
                </td>
                <td>
                  <div className="control-btns">
                    <div className="skeleton"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="skeleton-pagination">
          <div className="skeleton skeleton-button"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-button"></div>
        </div>
      </>
    );
  };

  return (
    <div className="w-full">
      <h1 className="submissions-title">View Submissions</h1>

      <div className="filters-container">
        <div className="filter-group">
          <label>Filter by Hunt:</label>
          <select
            className="hunt-dropdown"
            value={selectedHunt}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setSelectedHunt(selectedValue);
              handlePickHunt(selectedValue);
            }}
            disabled={loadingHunts}
          >
            <option value="">All Hunts</option>
            {hunts?.map((hunt) => (
              <option key={hunt.id} value={hunt.id}>
                {hunt.title}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Hunter:</label>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by hunter name..."
              value={hunterNameFilter}
              onChange={(e) => {
                const newTerm = e.target.value;
                setHunterNameFilter(newTerm);
                handleHunterNameFilter(newTerm);
              }}
            />
            <button onClick={() => handleHunterNameFilter(hunterNameFilter)}>
              <FiSearch size={16} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        renderSkeletonLoader()
      ) : (
        <div className={"min-h-screen w-full"}>
          <table className="manage-users-table min-h-screen">
            <thead>
              <tr>
                <th>Hunter Name</th>
                <th>Submission Date & time</th>
                {/*<th>Challenge Number</th>*/}
                <th>Challenge title</th>
                <th>Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{submission.hunterName}</td>
                    <td>{formatDate(submission.submissionDate)}</td>
                    {/*<td>{submission.challengeNumber}</td>*/}
                    <td>{submission.challengeTitle}</td>
                    <td>{submission.score}</td>
                    <td>
                      <span
                        className={`status-badge status-${submission.status.toLowerCase()}`}
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td>
                      <div className="control-btns">
                        <button
                          className="edit-btn"
                          onClick={() => {
                            alert(
                              `Viewing code for submission ${submission.id}:\n\n${submission.code}`,
                            );
                          }}
                        >
                          VIEW CODE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    No submissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0 || loading}
            >
              Previous
            </button>
            <span>
              {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1 || loading}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSubmissions;
