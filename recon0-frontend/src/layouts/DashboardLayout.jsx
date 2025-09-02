import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom"; // Changed Link to NavLink
import { supabase } from "../lib/supabaseClient";
import { useUserStore } from "../lib/userStore"; // <-- Import the user store

function Sidebar() {
  const navigate = useNavigate();
  const profile = useUserStore((state) => state.profile); // <-- Get the whole profile

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const userName = profile?.fullName || "User";
  const userRole = profile?.role;

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3"
      style={{
        width: "280px",
        backgroundColor: "var(--dark-card)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      <a
        href="/dashboard"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <span
          className="fs-4 fw-bold"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          RECON<span style={{ color: "var(--accent-cyan)" }}>_</span>0
        </span>
      </a>
      <hr style={{ borderColor: "var(--border-color)" }} />

      <ul className="nav nav-pills flex-column mb-auto">
        {/* === CONDITIONAL NAVIGATION === */}
        {userRole === "hacker" && (
          <>
            {/* Links for Hackers */}
            <li>
              <NavLink to="/dashboard" className="nav-link text-white">
                <i className="fa-solid fa-home me-2"></i>Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/programs" className="nav-link text-white">
                <i className="fa-solid fa-bullseye me-2"></i>Programs
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-reports" className="nav-link text-white">
                <i className="fa-solid fa-file-alt me-2"></i>My Reports
              </NavLink>
            </li>
          </>
        )}

        {userRole === "organization" && (
          <>
            {/* Links for Organizations */}
            <li>
              <NavLink to="/dashboard" className="nav-link text-white">
                <i className="fa-solid fa-tachograph-digital me-2"></i>Org
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/manage-reports" className="nav-link text-white">
                <i className="fa-solid fa-inbox me-2"></i>Manage Reports
              </NavLink>
            </li>
            <li>
              <NavLink to="/create-program" className="nav-link text-white">
                <i className="fa-solid fa-plus-circle me-2"></i>Create Program
              </NavLink>
            </li>
          </>
        )}

        {/* Common Links for all roles */}
        <li>
          <NavLink to="/leaderboard" className="nav-link text-white">
            <i className="fa-solid fa-trophy me-2"></i>Leaderboard
          </NavLink>
        </li>
        {/* V-- MAKE SURE THIS IS A NAVLINK --V */}
        <li>
          <NavLink to="/notifications" className="nav-link text-white">
            <i className="fa-solid fa-bell me-2"></i>Notifications
          </NavLink>
        </li>
      </ul>

      <hr style={{ borderColor: "var(--border-color)" }} />
      <div className="dropdown">
        <a
          href="#"
          className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src={`https://placehold.co/32x32/1F2937/F9FAFB?text=${userName.charAt(
              0
            )}`}
            alt=""
            width="32"
            height="32"
            className="rounded-circle me-2"
          />
          {/* Display the dynamic user name */}
          <strong>{userName}</strong>
        </a>
        <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
          <li>
            <NavLink className="dropdown-item" to="/profile">
              Profile
            </NavLink>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a className="dropdown-item" href="#" onClick={handleLogout}>
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <main className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
