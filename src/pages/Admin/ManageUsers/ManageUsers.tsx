import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import api from "../../../api/axios";
import "../ManageUsers/ManageUsers.css";

interface IUser {
  id: number;
  username: string;
  role: string[];
  email: string;
  currentHunt: string;
}

const ManageUsers = () => {
  // State for users data
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // State for sorting
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<string>("ASC");

  // State for filtering
  const [usernameFilter, setUsernameFilter] = useState<string>("");
  const [emailFilter, setEmailFilter] = useState<string>("");

  // State for search
  const [searchTerm, setSearchTerm] = useState<string>("");

  // State for modals
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  // Fetch users data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        sortDirection,
        sortBy,
      });

      // Add filters if they exist
      if (usernameFilter) params.append("username", usernameFilter);
      if (emailFilter) params.append("email", emailFilter);

      const response = await api.get(`/users?${params.toString()}`);
      const responseData = response.data;
      // console.log("responseData" + JSON.stringify());

      if (responseData.success && Array.isArray(responseData.data)) {
        // Map the data to match our IUser interface
        const users = responseData.data[0].content.map((user: any) => ({
          id: user.id,
          username: user.username || "Unknown", // API returns 'name' instead of 'username'
          role: user.roles || ["HUNTER"],
          email: user.email || "",
          currentHunt: user.currentHunt || "",
        }));
        console.log(users);
        setUsers(users);
        // Since the API response doesn't include pagination info, we'll handle it differently
        // For now, assume we got all users in one page
        setTotalPages(1);
        setCurrentPage(0);
      } else {
        // Handle case where data is not as expected
        setUsers([]);
        setTotalPages(1);
        setCurrentPage(0);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
      // Fallback to empty array if API call fails
      setUsers([]);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle search
  const handleSearch = (term: string) => {
    // Apply search term to username filter
    setUsernameFilter(term);
    // Reset to first page when searching
    setCurrentPage(0);
  };

  // Handle edit user
  const handleEditUser = (user: IUser) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = (user: IUser) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  // Handle save edited user
  const handleSaveUser = async (updatedUser: IUser) => {
    try {
      // Convert our IUser to the format expected by the API
      const apiUser = {
        id: updatedUser.id,
        name: updatedUser.username,
        role: updatedUser.role,
        email: updatedUser.email,
        currentHunt: updatedUser.currentHunt,
      };

      const response = await api.put(`/users/${updatedUser.id}`, apiUser);

      if (response.data.success) {
        // Refresh the user list
        fetchUsers();
        // Close the modal
        setEditModalOpen(false);
      } else {
        console.error("Error updating user:", response.data.message);
        // Could show an error message to the user
      }
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle error (could show an error message)
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      const response = await api.delete(`/users/${selectedUser.id}`);

      if (response.data.success) {
        // Refresh the user list
        fetchUsers();
        // Close the modal
        setDeleteModalOpen(false);
      } else {
        console.error("Error deleting user:", response.data.message);
        // Could show an error message to the user
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      // Handle error (could show an error message)
    }
  };

  // Fetch users when component mounts or when filters/pagination changes
  useEffect(() => {
    fetchUsers();
  }, [
    currentPage,
    pageSize,
    sortBy,
    sortDirection,
    usernameFilter,
    emailFilter,
  ]);

  // Render skeleton loader
  const renderSkeletonLoader = () => {
    return (
      <>
        {/*<div className="search-container skeleton-search">*/}
        {/*  <div className="skeleton skeleton-input"></div>*/}
        {/*  <div className="skeleton skeleton-button"></div>*/}
        {/*</div>*/}
        <table className="manage-users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Role</th>
              <th>Email</th>
              <th>Current Hunt</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(pageSize)].map((_, index) => (
              <tr key={index} className="skeleton-row">
                <td>
                  <div className="skeleton skeleton-id"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-username"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-role"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-email"></div>
                </td>
                <td>
                  <div className="skeleton skeleton-hunt"></div>
                </td>
                <td>
                  <td>
                    <div className="control-btns">
                      <div
                        className="skeleton"
                      />
                      <div className="skeleton"/>
                    </div>
                  </td>
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

  // Render edit modal
  const renderEditModal = () => {
    if (!editModalOpen || !selectedUser) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Edit User</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveUser(selectedUser);
            }}
          >
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={selectedUser.username}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, username: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={selectedUser.role}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, role: e.target.value })
                }
                required
              >
                <option value="ADMIN">ADMIN</option>
                <option value="HUNTER">HUNTER</option>
                <option value="REVIEWER">REVIEWER</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="currentHunt">Current Hunt</label>
              <input
                type="text"
                id="currentHunt"
                value={selectedUser.currentHunt}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    currentHunt: e.target.value,
                  })
                }
              />
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setEditModalOpen(false)}>
                Cancel
              </button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Render delete confirmation modal
  const renderDeleteModal = () => {
    if (!deleteModalOpen || !selectedUser) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete user {selectedUser.username}?</p>
          <div className="modal-actions">
            <button onClick={() => setDeleteModalOpen(false)}>Cancel</button>
            <button onClick={handleConfirmDelete} className="delete-btn">
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={"w-full"}>
      <div className="flex justify-center items-center mb-4">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => {
              const newTerm = e.target.value;
              setSearchTerm(newTerm);
              handleSearch(newTerm);
            }}
          />
          <button onClick={() => handleSearch(searchTerm)}>
            <FiSearch size={16} />
          </button>
        </div>
        <div>
          <button className="add-btn">Add new user</button>
        </div>
      </div>

      {loading ? (
        renderSkeletonLoader()
      ) : (
        <div className={"w-full min-h-screen"}>
          <table className="manage-users-table min-h-screen">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Role</th>
                <th>Email</th>
                <th>Current Hunt</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.role.join(" | ")}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.currentHunt ? (
                        <a href={user.currentHunt} target="_blank" rel="noopener noreferrer">
                          {user.currentHunt}
                        </a>
                      ) : (
                        <a href="#" className="default-hunt">No active hunt</a>
                      )}
                    </td>
                    <td>
                      <div className="control-btns">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditUser(user)}
                        >
                          <FiEdit size={16} className="edit-icon" />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <FiTrash2 size={16} className="delete-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    No users found
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
              Page {currentPage + 1} of {totalPages}
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

      {renderEditModal()}
      {renderDeleteModal()}
    </div>
  );
};

export default ManageUsers;
