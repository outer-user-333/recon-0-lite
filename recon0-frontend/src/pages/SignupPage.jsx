import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  register,
  uploadAvatar,
  uploadOrgLogo,
  removeToken,
} from "../lib/apiService";

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("hacker"); // Default role
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // Step 1: Register the user. Our service now auto-logs them in.
      const result = await register({
        email,
        password,
        username,
        fullName,
        role,
      });

      // Step 2: If registration is successful AND a file was selected, upload it.
      if (result.success && avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);

        // Determine which upload function to call based on role
        const uploadFunction =
          role === "organization" ? uploadOrgLogo : uploadAvatar;
        await uploadFunction(formData);
      }

      // Step 3: Redirect to the dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      removeToken(); // Clear token if any part of the process fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg" style={{ width: "450px" }}>
        <div className="card-body p-5">
          <h3 className="card-title text-center mb-4">Create Account</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="avatarFile" className="form-label">
                Profile Picture / Logo (Optional)
              </label>
              <input
                className="form-control"
                type="file"
                id="avatarFile"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files[0])}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Sign up as:</label>
              <div className="form-check">
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
                  id="roleOrg"
                  value="organization"
                  checked={role === "organization"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <label className="form-check-label" htmlFor="roleOrg">
                  Organization
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
