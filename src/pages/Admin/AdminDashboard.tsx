import { NavLink, Outlet } from "react-router-dom";
import { FiLogOut, FiSearch } from "react-icons/fi";
import { IoMdArrowDropright } from "react-icons/io";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="admin-logo">Admin Dashboard</h2>

        <nav className="menu">
          {[
            { name: "Manage Users", path: "manage-users" },
            { name: "Manage Hunts", path: "manage-hunts" },
            { name: "Create a Hunt", path: "create-hunt" },
            { name: "Send Announcement", path: "send-announcement" },
            { name: "Create Reviewer Account", path: "create-reviewer" },
            { name: "Create Hunter/Organizer Account", path: "create-hunter" },
            { name: "View Submissions", path: "view-submissions" },
            { name: "View Feedback & Reports", path: "view-feedback" },
          ].map((item) => (
            <div className="items">
              <NavLink key={item.path} to={item.path} className="menu-item">
                {item.name}
                <IoMdArrowDropright className="arrow" />
              </NavLink>
            </div>
          ))}
        </nav>

        <button className="logout-btn">
          <FiLogOut className="logout-icon" />
          Logout
        </button>
      </aside>

      <div className="main-content">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users or hunts..."
            className="search-input"
          />
        </div>

        {/* content */}
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
