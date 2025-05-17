import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../../../api/axios.ts";
import API_BASE_URL from "../../../constants/apiURL/API_BASE_URL.ts";
import { useAuth } from "../../../context/AuthContext.tsx";
import { PageResponse } from "../../../types.ts";
import "../ManageHunts/ManageHunts.css";
import Modal from "../../../components/Modal/Modal";

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
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortDirection, setSortDirection] = useState<string>("ASC");
  const [status, setStatus] = useState<string>("DRAFT");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedHunt, setSelectedHunt] = useState<Hunt | null>(null);
  const [editedHunt, setEditedHunt] = useState<Hunt | null>(null);

  const { isAuthenticated } = useAuth();

  const toISOStringWithTime = (dateString: string): string => {
    return new Date(dateString).toISOString();
  };

  const fetchMyHunts = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await api.get(API_BASE_URL + `/hunts`, {
        params: {
          page: currentPage,
          size: pageSize,
          direction: sortDirection,
          status: status,
        },
      });
      setPageData(response.data);
      setHunts(response.data.content || []);
    } catch (err) {
      console.error("Error fetching hunts:", err);
    }
  };

  useEffect(() => {
    fetchMyHunts();
  }, [isAuthenticated, currentPage, pageSize, sortDirection, status]);

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
      const updatedHunt = {
        ...editedHunt,
        startDate: toISOStringWithTime(editedHunt.startDate),
        endDate: toISOStringWithTime(editedHunt.endDate),
      };
      await api.put(
        `${API_BASE_URL}/hunts/admin/${editedHunt.id}`,
        updatedHunt,
      );
      closeModal();
      fetchMyHunts();
    } catch (error) {
      console.error("Failed to update hunt:", error);
    }
  };

  return (
    <div className="table-container">
      <table className="manage-users-table">
        <thead className="w-full">
          <tr className="text-left">
            <th>#</th>
            <th>Title</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {hunts.map((item, index) => (
            <tr key={item.id} className="text-left">
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>{item.huntStatus}</td>
              <td>{item.startDate ?? "Undefined"}</td>
              <td>{item.endDate ?? "Undefined"}</td>
              <td className="control-btns">
                <button
                  className="edit-btn"
                  onClick={() => handleEditButtonClick(item)}
                >
                  <FaEdit className="edit-icon" />
                </button>
                <button className="delete-btn">
                  <FaTrash className="delete-icon" />
                </button>
                <button className="manage-button">Submissions</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} closeModal={closeModal} title="Edit Hunt">
        {editedHunt && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveChanges();
            }}
          >
            <div className="flex flex-col gap-3">
              <label className="font-semibold">Title</label>
              <input
                type="text"
                value={editedHunt.title}
                onChange={(e) =>
                  setEditedHunt({ ...editedHunt, title: e.target.value })
                }
                className="rounded border px-2 py-1"
              />

              <label className="font-semibold">Status</label>
              <select
                value={editedHunt.huntStatus}
                onChange={(e) =>
                  setEditedHunt({ ...editedHunt, huntStatus: e.target.value })
                }
                className="rounded border px-2 py-1"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW</option>

                <option value="LIVE">LIVE</option>
                <option value="FINISHED">FINISHED</option>
                <option value="TERMINATED">TERMINATED</option>
                <option value="APPROVED">APPROVED</option>
              </select>

              <label className="font-semibold">Start Date</label>
              <input
                type="date"
                value={editedHunt.startDate?.split("T")[0] || ""}
                onChange={(e) =>
                  setEditedHunt({ ...editedHunt, startDate: e.target.value })
                }
                className="rounded border px-2 py-1"
              />

              <label className="font-semibold">End Date</label>
              <input
                type="date"
                value={editedHunt.endDate?.split("T")[0] || ""}
                onChange={(e) =>
                  setEditedHunt({ ...editedHunt, endDate: e.target.value })
                }
                className="rounded border px-2 py-1"
              />

              <div className="mt-4 flex justify-between gap-4">
                <button type="submit" className="manage-button">
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="manage-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ManageHunts;
