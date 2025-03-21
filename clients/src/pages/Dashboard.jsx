import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faBars, faTimes, faHome, faPlus, faTable, faSearch, 
    faEdit, faAddressBook, faSignOutAlt 
} from "@fortawesome/free-solid-svg-icons";
import "../css/dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const logout = () => {
        localStorage.clear();
        navigate("/home");
    };

    return (
        <div className={`dashboard-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <div className="sidebar-brand">
                    Attendance System
                    <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <ul className="sidebar-menu">
                    <li><Link to="/dashboard" className="active"><FontAwesomeIcon icon={faHome} /> Dashboard</Link></li>
                    <li><Link to="dashboard/insert"><FontAwesomeIcon icon={faPlus} /> Add Student</Link></li>
                    <li><Link to="dashboard/display"><FontAwesomeIcon icon={faTable} /> Display</Link></li>
                    <li><Link to="dashboard/search"><FontAwesomeIcon icon={faSearch} /> Search</Link></li>
                    <li><Link to="dashboard/update"><FontAwesomeIcon icon={faEdit} /> Update</Link></li>
                    <li><Link to="dashboard/contact"><FontAwesomeIcon icon={faAddressBook} /> Contact</Link></li>
                    <li><Link to="/" className="logout" onClick={logout}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</Link></li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <header>
                    <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <div className="search-bar">
                        <input type="text" placeholder="Search here..." />
                    </div>
                    <div className="user-info">
                        <img src="/path-to-your-user-icon.png" alt="User Icon" className="user-icon" />
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
