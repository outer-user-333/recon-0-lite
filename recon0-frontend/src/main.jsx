import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./layouts/ProtectedRoute"; // <-- IMPORT NEW COMPONENT

// Pages
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import VerifyPage from "./pages/VerifyPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProgramsPage from "./pages/ProgramsPage.jsx"; // <-- IMPORT NEW PAGE
import ProgramDetailPage from "./pages/ProgramDetailPage.jsx"; // <-- IMPORT NEW PAGE
import SubmitReportPage from "./pages/SubmitReportPage.jsx"; // <-- IMPORT NEW PAGE
import MyReportsPage from "./pages/MyReportsPage.jsx"; // <-- IMPORT NEW PAGE
import ProfilePage from "./pages/ProfilePage.jsx"; // <-- IMPORT NEW PAGE
import CreateProgramPage from "./pages/CreateProgramPage.jsx"; // <-- IMPORT NEW PAGE
import ManageReportsPage from "./pages/ManageReportsPage.jsx"; // <-- IMPORT NEW PAGE
import LeaderboardPage from "./pages/LeaderboardPage.jsx"; // <-- IMPORT NEW PAGE
import NotificationsPage from "./pages/NotificationsPage.jsx"; // <-- IMPORT NEW PAGE

// Layouts
import DashboardLayout from "./layouts/DashboardLayout.jsx";

import "./index.css";

const router = createBrowserRouter([
  // ... (/, /login, /signup, /verify routes stay the same)
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/verify",
    element: <VerifyPage />,
  },
  // This is our protected area
  {
    path: "/",
    // V-- WRAP THE LAYOUT WITH THE PROTECTED ROUTE --V
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "programs",
        element: <ProgramsPage />,
      },
      {
        path: "programs/:programId", // <-- ADD THIS NEW DYNAMIC ROUTE
        element: <ProgramDetailPage />,
      },
      {
        path: "programs/:programId/submit", // <-- ADD NEW SUBMIT ROUTE
        element: <SubmitReportPage />,
      },
      {
        path: "my-reports", // <-- ADD NEW REPORTS ROUTE
        element: <MyReportsPage />,
      },
      { path: "profile", element: <ProfilePage /> }, // <-- ADD NEW PROFILE ROUTE
      {
        path: "create-program", // <-- ADD NEW CREATE PROGRAM ROUTE
        element: <CreateProgramPage />,
      },
      {
        path: "manage-reports", // <-- ADD NEW MANAGE REPORTS ROUTE
        element: <ManageReportsPage />,
      },
      {
        path: "leaderboard", // <-- ADD NEW LEADERBOARD ROUTE
        element: <LeaderboardPage />,
      },
      {
        path: "notifications", // <-- ADD NEW NOTIFICATIONS ROUTE
        element: <NotificationsPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
