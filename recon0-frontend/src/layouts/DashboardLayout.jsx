import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getProfile, logout, getToken } from "../lib/apiService";
import { loginChatUser } from '../lib/chatAuthService';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
       loginChatUser(); // <-- ADD THIS LINE
      const token = getToken();
      if (!token) {
        // If no token, redirect to login page
        navigate("/login");
        return;
      }

      try {
        const result = await getProfile();
        if (result.success) {
          setUserProfile(result.data);
        } else {
          // If token is invalid or expired, server will reject
          throw new Error(result.message);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // Clear bad token and redirect to login
        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    logout(); // This removes the token from localStorage
    navigate("/login");
  };

  const navLinkClasses = ({ isActive }) =>
    `nav-link ${isActive ? "active" : ""}`;

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  const isHacker = userProfile?.role === "hacker";
  const isOrganization = userProfile?.role === "organization";

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <nav className="d-flex flex-column p-3 sidebar">
        <h4 className="mb-4">RECON_0</h4>
        <ul className="nav flex-column mb-auto">
          {/* Common Links */}
          <li className="nav-item">
            <NavLink className={navLinkClasses} to="/dashboard">
              <i className="fas fa-tachometer-alt me-2"></i> Dashboard
            </NavLink>
          </li>

          {/* Role-Specific Links */}
          {isHacker && (
            <>
              <li className="nav-item">
                <NavLink className={navLinkClasses} to="/programs">
                  <i className="fas fa-bug me-2"></i> Programs
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={navLinkClasses} to="/my-reports">
                  <i className="fas fa-file-alt me-2"></i> My Reports
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={navLinkClasses} to="/academy">
                  <i className="fas fa-book-open me-2"></i> Academy
                </NavLink>
              </li>
              {/* ===== ADD ACHIEVEMENTS LINK FOR HACKERS ===== */}
              <li className="nav-item">
                <NavLink className={navLinkClasses} to="/achievements">
                  <i className="fas fa-shield-alt me-2"></i> Achievements
                </NavLink>
              </li>
              {/* ============================================== */}
            </>
          )}

          {isOrganization && (
            <>
              {/* ===== UPDATE THIS LINK ===== */}
              <li className="nav-item">
                <NavLink className={navLinkClasses} to="/my-programs">
                  <i className="fas fa-briefcase me-2"></i> My Programs
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={navLinkClasses} to="/manage-reports">
                  <i className="fas fa-tasks me-2"></i> Manage Reports
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={navLinkClasses} to="/create-program">
                  <i className="fas fa-plus-circle me-2"></i> Create Program
                </NavLink>
              </li>
            </>
          )}

          {/* ===== ADD THE CHAT LINK FOR ALL USERS ===== */}
          <li className="nav-item">
            <NavLink className={navLinkClasses} to="/chat">
              <i className="fas fa-comments me-2"></i> Safe Harbor Chat
            </NavLink>
          </li>
          {/* ============================================= */}

          <li className="nav-item">
            <NavLink className={navLinkClasses} to="/leaderboard">
              <i className="fas fa-trophy me-2"></i> Leaderboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={navLinkClasses} to="/notifications">
              <i className="fas fa-bell me-2"></i> Notifications
            </NavLink>
          </li>
        </ul>
        <hr />
        <div className="dropdown">
          <a
            href="#"
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
            id="dropdownUser1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src={
                userProfile?.avatar_url ||
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjNmI3Mjc5Ii8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMTQiIHI9IjYiIGZpbGw9IiNkMWQ1ZGIiLz4KPHBhdGggZD0iTTYgMjZjMC02IDYtMTIgMTAtMTJzMTAgNiAxMCAxMiIgZmlsbD0iI2QxZDVkYiIvPgo8L3N2Zz4="
              }
              alt="Avatar"
              className="rounded-circle me-2"
              style={{ width: "32px", height: "32px", objectFit: "cover" }}
            />
            <strong>{userProfile?.username || "User"}</strong>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-dark text-small shadow"
            aria-labelledby="dropdownUser1"
          >
            <li>
              <NavLink className="dropdown-item" to="/profile">
                Profile
              </NavLink>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                Sign out
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="flex-grow-1 p-4">
        <Outlet context={{ userProfile }} /> {/* Pass profile down */}
      </main>
    </div>
  );
};

export default DashboardLayout;
