import React from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const OrganizerDashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Organizer Dashboard</h1>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <ul className="dashboard-menu">
              <li className="dashboard-menu-item">
                <Link to={`${ROUTES.ORGANIZER_DASHBOARD}/${ROUTES.ORGANIZER_CREATE_HUNT}`} className="dashboard-menu-link">
                  Create Hunt
                </Link>
              </li>
              <li className="dashboard-menu-item">
                <Link to={`${ROUTES.ORGANIZER_DASHBOARD}/${ROUTES.ORGANIZER_VIEW_MY_HUNTS}`} className="dashboard-menu-link">
                  My Hunts
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="dashboard-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
