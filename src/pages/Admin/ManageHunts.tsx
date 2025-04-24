import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import api from "../../api/axios.ts";
import API_BASE_URL from "../../constants/API_BASE_URL.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import { Hunt, PageResponse } from "../../types.ts";

const ManageHunts = () => {
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const [pageData, setPageData] = useState<PageResponse | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortDirection, setSortDirection] = useState<string>("ASC");
  const [status, setStatus] = useState<string>("DRAFT");

  const { isAuthenticated } = useAuth();

  const fetchMyHunts = async () => {
    if (!isAuthenticated) return;

    try {
      // api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
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
  }, [isAuthenticated, currentPage, pageSize, sortDirection, status]);

  return (
    <div className="table-container">
      <table className="manage-users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Status</th>
            <th>Participants</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hunts.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td >
                {item.huntStatus}
              </td>
              <td>{item.startDate}</td>
              <td>{item.endDate}</td>
              <td className="control-btns">
                <button className="edit-btn">
                  <FaEdit className="edit-icon" />
                </button>
                {/* <button className="delete-btn">
                  <FaTrash className="delete-icon" />
                </button> */}
                <button className="manage-button">Submissions</button>
                <button className="manage-button">Terminate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageHunts;
