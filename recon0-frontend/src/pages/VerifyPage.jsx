import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from '../lib/supabaseChatClient';

const VerifyPage = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Get the email from the navigation state passed from the Signup page
  const email = location.state?.email;

  // EFFECT: If the user lands on this page without an email, redirect them.
  useEffect(() => {
    if (!email) {
      console.error("No email provided, redirecting to signup.");
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!email) {
      setError("Email not found. Please try signing up again.");
      setLoading(false);
      return;
    }

    // This is the Supabase function to verify the OTP
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: "signup", // Specify that this is a signup verification
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Verification successful! Redirecting to login...");
      // On success, redirect to the login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }

    setLoading(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg" style={{ width: "25rem" }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-2">Check your email</h2>
          <p className="card-subtitle mb-4 text-center text-muted">
            We've sent a 6-digit code to {email}.
          </p>

          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">
                Verification Code
              </label>
              <input
                type="text"
                className="form-control"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="123456"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
