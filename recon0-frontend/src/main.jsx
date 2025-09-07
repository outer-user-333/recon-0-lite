import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import all layouts
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

// Import all pages
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import VerifyPage from "./pages/VerifyPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProgramsPage from "./pages/ProgramsPage.jsx";
import ProgramDetailPage from "./pages/ProgramDetailPage.jsx";
import SubmitReportPage from "./pages/SubmitReportPage.jsx";
import MyReportsPage from "./pages/MyReportsPage.jsx";
import ReportDetailPage from "./pages/ReportDetailPage.jsx";
import CreateProgramPage from "./pages/CreateProgramPage.jsx";
import ManageReportsPage from "./pages/ManageReportsPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import LearningAcademyPage from "./pages/LearningAcademyPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import AchievementsPage from "./pages/AchievementsPage.jsx"; // <-- IMPORT THE NEW PAGE
import MyProgramsPage from "./pages/MyProgramsPage.jsx"; // <-- IMPORT THE NEW PAGE
import ProgramAnalyticsPage from "./pages/ProgramAnalyticsPage.jsx"; // <-- IMPORT THE NEW PAGE
// We will create these pages next
import UserManagementPage from "./pages/admin/UserManagementPage.jsx";
import PlatformAnalyticsPage from "./pages/admin/PlatformAnalyticsPage.jsx";

import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/verify", element: <VerifyPage /> },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "profile", element: <ProfilePage /> },
      // Hacker Routes
      { path: "programs", element: <ProgramsPage /> },
      { path: "programs/:programId", element: <ProgramDetailPage /> },
      { path: "programs/:programId/submit", element: <SubmitReportPage /> },
      { path: "my-reports", element: <MyReportsPage /> },
      { path: "reports/:reportId", element: <ReportDetailPage /> },
      { path: "academy", element: <LearningAcademyPage /> },
      // ===== ADD THE ROUTE FOR THE ACHIEVEMENTS PAGE =====
      { path: "achievements", element: <AchievementsPage /> },
      // ==================================================
      // Organization Routes
      // ===== ADD THE ROUTE FOR THE MY PROGRAMS PAGE =====
      { path: "my-programs", element: <MyProgramsPage /> },
      // ===== ADD THE ROUTE FOR THE ANALYTICS PAGE =====
      {
        path: "programs/:programId/analytics",
        element: <ProgramAnalyticsPage />,
      },
      { path: "create-program", element: <CreateProgramPage /> },
      { path: "manage-reports", element: <ManageReportsPage /> },
      // Common Routes
      { path: "leaderboard", element: <LeaderboardPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "chat", element: <ChatPage /> },
    ],
  },
  // --- ADMIN ROUTES ---
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "users", element: <UserManagementPage /> },
      { path: "analytics", element: <PlatformAnalyticsPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
