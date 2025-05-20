import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import api from "../../../api/axios.ts";
import API_BASE_URL from "../../../constants/apiURL/API_BASE_URL.ts";
import { useAuth } from "../../../context/AuthContext.tsx";
import { PageResponse } from "../../../types.ts";
import Modal from "../../../components/Modal/Modal";
import "../ManageHunts/ManageHunts.css";

interface Hunt {
  id: number;
  title: string;
  huntStatus: string;
  startDate: string;
  endDate: string;
}

const ManageHunts = () => {
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const [pageData, setPageData] = useState<PageResponse | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(7);
  const [sortDirection, setSortDirection] = useState<string>("ASC");
  const [status, setStatus] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedHunt, setSelectedHunt] = useState<Hunt | null>(null);
  const [editedHunt, setEditedHunt] = useState<Hunt | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState("");

  const { isAuthenticated } = useAuth();

  const toISOStringWithTime = (dateString: string): string => {
    return new Date(dateString).toISOString();
  };

  const formatDisplayDate = (isoDate: string | null): string => {
    if (!isoDate) return "Undefined";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchMyHunts = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await api.get(API_BASE_URL + `/hunts`, {
        params: {
          page: 0,
          size: 1000, // fetch all for client-side filtering and pagination
          direction: sortDirection,
          ...(status ? { status } : {}),
        },
      });
      const fullList = response.data.content || [];
      setHunts(fullList);
      setTotalPages(Math.ceil(fullList.length / pageSize));
    } catch (err) {
      console.error("Error fetching hunts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyHunts();
  }, [isAuthenticated, sortDirection, status]);

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEditButtonClick = (hunt: Hunt) => {
    setSelectedHunt(hunt);
    setEditedHunt({ ...hunt });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHunt(null);
    setEditedHunt(null);
  };

  const handleSaveChanges = async () => {
    if (!editedHunt) return;
    try {
      const { id, title, startDate, endDate, huntStatus } = editedHunt;
      const updatedHunt = {
        title,
        startDate: toISOStringWithTime(startDate),
        endDate: toISOStringWithTime(endDate),
      };

      await api.put(`${API_BASE_URL}/hunts/admin/${id}`, updatedHunt);
      await api.put(`${API_BASE_URL}/hunts/admin/${id}/status`, null, {
        params: { status: huntStatus },
      });

      await fetchMyHunts();
      closeModal();
    } catch (error) {
      console.error("Failed to update hunt:", error);
    }
  };

  const handleDeleteHunt = async (huntId: number) => {
    if (!window.confirm("Are you sure you want to delete this hunt?")) return;
    try {
      await api.delete(`${API_BASE_URL}/hunts/admin/${huntId}`);
      fetchMyHunts();
    } catch (error) {
      console.error("Failed to delete hunt:", error);
    }
  };

  const renderSkeletonLoader = () => {
    return (
      <>
        <table className="manage-hunts-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(pageSize)].map((_, index) => (
              <tr key={index} className="skeleton-row">
                <td>
                  <div className="skeleton skeleton-id"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-title"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-status"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-date"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-date"></div>
                </td>
                <td>
                  <div className="control-btns">
                    <div className="skeleton" />
                    <div className="skeleton" />
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

  // Filter and paginate client-side
  const filteredHunts = hunts.filter(
    (hunt) =>
      hunt.title.toLowerCase().includes(search.toLowerCase()) ||
      hunt.huntStatus.toLowerCase().includes(search.toLowerCase()),
  );

  const paginatedHunts = filteredHunts.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize,
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredHunts.length / pageSize));
    if (currentPage >= Math.ceil(filteredHunts.length / pageSize)) {
      setCurrentPage(0); // Reset to first page if out of bounds
    }
  }, [filteredHunts.length, pageSize]);

  return (
    <div className={"w-full"}>
      <div className="mb-.1 flex items-center justify-center">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title or status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button>
            <FiSearch size={16} />
          </button>
        </div>
        {!loading && (
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
              disabled={currentPage >= totalPages - 1}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {loading ? (
        renderSkeletonLoader()
      ) : (
        <div className={"min-h-screen w-full"}>
          <table className="manage-hunts-table min-h-screen">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHunts.map((item, index) => (
                <tr key={item.id}>
                  <td>{currentPage * pageSize + index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.huntStatus}</td>
                  <td>{formatDisplayDate(item.startDate)}</td>
                  <td>{formatDisplayDate(item.endDate)}</td>
                  <td>
                    <div className="control-btns">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditButtonClick(item)}
                      >
                        <FaEdit size={16} className="edit-icon" />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteHunt(item.id)}
                      >
                        <FaTrash size={16} className="delete-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} closeModal={closeModal} title="Edit Hunt">
        {editedHunt && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveChanges();
            }}
          >
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={editedHunt.title}
                onChange={(e) =>
                  setEditedHunt({ ...editedHunt, title: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={editedHunt.huntStatus}
                onChange={(e) =>
                  setEditedHunt({
                    ...editedHunt,
                    huntStatus: e.target.value,
                  })
                }
              >
                <option value="DRAFT">DRAFT</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                <option value="LIVE">LIVE</option>
                <option value="FINISHED">FINISHED</option>
                <option value="TERMINATED">TERMINATED</option>
                <option value="APPROVED">APPROVED</option>
              </select>
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={editedHunt.startDate?.split("T")[0] || ""}
                onChange={(e) =>
                  setEditedHunt({
                    ...editedHunt,
                    startDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={editedHunt.endDate?.split("T")[0] || ""}
                onChange={(e) =>
                  setEditedHunt({ ...editedHunt, endDate: e.target.value })
                }
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit">Save</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ManageHunts;
