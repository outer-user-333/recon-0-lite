import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; // <-- Import Supabase client

function Header() {
  // ... Header code remains exactly the same
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

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      // Login successful, navigate to a new dashboard page.
      // We will create the dashboard page in the next step.
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Welcome Back</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            <div className="text-center mt-3">
              <span className="text-muted">Don't have an account? </span>
              <Link to="/signup" style={{ color: 'var(--accent-cyan)' }}>Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}