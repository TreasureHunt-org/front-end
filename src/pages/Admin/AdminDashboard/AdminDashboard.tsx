import { NavLink, Outlet } from "react-router-dom";
import { IoMdArrowDropright } from "react-icons/io";
import "../AdminDashboard/AdminDashboard.css";
const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="admin-logo">Admin Dashboard</h2>

        <nav className="menu">
          {[
            { name: "Manage Users", path: "manage-users" },
            { name: "Manage Hunts", path: "manage-hunts" },
            {
              name: "My Hunts",
              path: "/organizer-dashboard/my-hunts",
              absolute: true,
            },
            { name: "Create a Hunt", path: "create-hunt" },
            { name: "Send Announcement", path: "send-announcement" },
            { name: "Create Accounts", path: "create-accounts" },
            { name: "View Submissions", path: "view-submissions" },
            { name: "View Feedback & Reports", path: "view-feedback" },
          ].map((item) => (
            <div className="items" key={item.path}>
              <NavLink
                to={item.absolute ? { pathname: item.path } : item.path}
                className="menu-item"
              >
                {item.name}
                <IoMdArrowDropright className="arrow" />
              </NavLink>
            </div>
          ))}
        </nav>

        {/* <button className="logout-btn">
          <FiLogOut className="logout-icon" />
          Logout
        </button> */}
      </aside>

      <div className="main-content">
        {/* <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users or hunts..."
            className="search-input"
          />
        </div> */}

        {/* content */}
        {/*<div className="content">*/}
        <Outlet />
        {/*</div>*/}
      </div>
    </div>
  );
};

export default AdminDashboard;
