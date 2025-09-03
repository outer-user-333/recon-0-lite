import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient"; // <-- Import Supabase client

function Header() {
  // ... Header code remains exactly the same
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top"
      style={{
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="container">
        <Link
          to="/"
          className="navbar-brand fs-4 fw-bold"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          RECON<span style={{ color: "var(--accent-cyan)" }}>_</span>0
        </Link>
        <div className="ms-auto">
          <Link to="/login" className="btn btn-ghost me-2">
            Log In
          </Link>
          <Link to="/signup" className="btn btn-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState("hacker"); // <-- ADD THIS LINE

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // This is where we pass extra data to Supabase Auth
        data: {
          full_name: fullName, // Pass the full name
          role: role, // Pass the selected role
        },
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      // Navigate to the verification page as before
      navigate("/verify", { state: { email } });
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="d-flex align-items-center justify-content-center vh-100 py-5">
        <div
          className="card p-4 my-5"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Create Your Account</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
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
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {/* ===== ADD THIS BLOCK FOR ROLE SELECTION ===== */}
              <div className="mb-3">
                <label className="form-label">Register as</label>
                <div className="d-flex">
                  <div className="form-check me-4">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="role"
                      id="roleHacker"
                      value="hacker"
                      checked={role === "hacker"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="roleHacker">
                      Hacker
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="role"
                      id="roleOrganization"
                      value="organization"
                      checked={role === "organization"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="roleOrganization"
                    >
                      Organization
                    </label>
                  </div>
                </div>
              </div>
              {/* ============================================== */}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
            <div className="text-center mt-3">
              <span className="text-muted">Already have an account? </span>
              <Link to="/login" style={{ color: "var(--accent-cyan)" }}>
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
