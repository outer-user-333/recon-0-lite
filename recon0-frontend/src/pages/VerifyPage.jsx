import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function Header() {
  // This is the same Header component from our other pages
  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark fixed-top" 
      style={{ 
        backgroundColor: 'rgba(17, 24, 39, 0.8)', 
        backdropFilter: 'blur(10px)' 
      }}
    >
      <div className="container">
        <Link to="/" className="navbar-brand fs-4 fw-bold" style={{ fontFamily: 'var(--font-mono)' }}>
          RECON<span style={{ color: 'var(--accent-cyan)' }}>_</span>0
        </Link>
        <div className="ms-auto">
          <Link to="/login" className="btn btn-ghost me-2">Log In</Link>
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

export default function VerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get the email from the URL so we know who to verify
  const email = searchParams.get('email');

  const handleVerify = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!email) {
      setError("Email not found. Please try signing up again.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: 'signup',
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      alert('Verification successful! You can now log in.');
      navigate('/login');
    } else {
        setError('Verification failed. Please check the code and try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
          <div className="card-body">
            <h2 className="card-title text-center mb-2">Check your email</h2>
            <p className="text-center text-muted mb-4">We've sent a 6-digit code to {email}.</p>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleVerify}>
              <div className="mb-3">
                <label htmlFor="otp" className="form-label">Verification Code</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="otp" 
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}