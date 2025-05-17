import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import api from "../../../api/axios.ts";
import API_BASE_URL from "../../../constants/apiURL/API_BASE_URL.ts";
import { useAuth } from "../../../context/AuthContext.tsx";
import { Hunt, PageResponse } from "../../../types.ts";
import "../ManageHunts/ManageHunts.css";

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

  const handleEditButtonClick = () => {
    // TODO navigate the edit page with the hunt id
  };

  return (
    <div className="table-container">
      <table className="manage-users-table">
        <thead className={"w-full"}>
          <tr className={"text-left"}>
            <th>#</th>
            <th>Title</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className={"w-full"}>
          {hunts.map((item, index) => (
            <tr key={item.id} className={"text-left"}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>{item.huntStatus}</td>
              <td>{item.startDate ?? "N/A"}</td>
              <td>{item.endDate ?? "N/A"}</td>
              <td className="control-btns">
                <button className="edit-btn" onClick={handleEditButtonClick}>
                  <FaEdit className="edit-icon" />
                </button>
                {/* <button className="delete-btn">
                  <FaTrash className="delete-icon" />
                </button> */}
                {/*<button className="manage-button">Submissions</button>*/}
                {/*<button className="manage-button">Terminate</button>*/}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageHunts;
