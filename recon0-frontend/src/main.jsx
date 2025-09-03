import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import VerifyPage from './pages/VerifyPage.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProgramsPage from './pages/ProgramsPage.jsx';
import ProgramDetailPage from './pages/ProgramDetailPage.jsx';
import SubmitReportPage from './pages/SubmitReportPage.jsx';
import MyReportsPage from './pages/MyReportsPage.jsx';
import ReportDetailPage from './pages/ReportDetailPage.jsx';
import CreateProgramPage from './pages/CreateProgramPage.jsx';
import ManageReportsPage from './pages/ManageReportsPage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import LearningAcademyPage from './pages/LearningAcademyPage.jsx';

import './index.css';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/verify', element: <VerifyPage /> },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/programs', element: <ProgramsPage /> },
      { path: '/programs/:programId', element: <ProgramDetailPage /> },
      { path: '/programs/:programId/submit', element: <SubmitReportPage /> },
      { path: '/my-reports', element: <MyReportsPage /> },
      { path: '/reports/:reportId', element: <ReportDetailPage /> },
      { path: '/create-program', element: <CreateProgramPage /> },
      { path: '/manage-reports', element: <ManageReportsPage /> },
      { path: '/leaderboard', element: <LeaderboardPage /> },
      { path: '/notifications', element: <NotificationsPage /> },
      { path: '/academy', element: <LearningAcademyPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

