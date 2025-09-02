import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../lib/userStore';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const session = useUserStore((state) => state.session);
  const loading = useUserStore((state) => state.loading);

  useEffect(() => {
    // If loading is finished and there's no user session, redirect to login
    if (!loading && !session) {
      navigate('/login');
    }
  }, [session, loading, navigate]);

  // While loading, show a simple loading message
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If there is a session, render the page content (the dashboard layout)
  if (session) {
    return children;
  }
  
  // If no session after loading, return null (will redirect shortly)
  return null;
}