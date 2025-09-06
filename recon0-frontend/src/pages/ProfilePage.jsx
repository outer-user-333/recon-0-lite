import React, { useState, useEffect } from "react";
import { getProfile, updateProfile, uploadAvatar } from '../lib/apiService';
// --- FIX: Import the correct function names ---
import { calculateLevel, calculateProgress } from "../lib/gamificationUtils";

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

useEffect(() => {
    const fetchUserProfile = async () => {
        try {
            const result = await getProfile();
            if (result.success) {
                setUserProfile(result.data);
                setFullName(result.data.full_name || '');
                setUsername(result.data.username || '');
                setBio(result.data.bio || '');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchUserProfile();
}, []);


const handleAvatarUpload = async (event) => {
    try {
        setUploading(true);
        setError('');
        setMessage('');

        const file = event.target.files[0];
        if (!file) throw new Error('You must select an image file to upload.');

        const formData = new FormData();
        formData.append('file', file);

        const uploadResult = await uploadAvatar(formData);
        if (!uploadResult.success) throw new Error(uploadResult.message);

        // Manually update the profile state with the new avatar URL
        setUserProfile(prevProfile => ({
            ...prevProfile,
            avatar_url: uploadResult.secure_url
        }));

        setMessage('Avatar updated successfully!');

    } catch (error) {
        setError(error.message);
    } finally {
        setUploading(false);
    }
};

 const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
        const profileData = { fullName, username, bio };
        const result = await updateProfile(profileData);

        if (result.success) {
            // Manually update state with the fresh data from the server
            setUserProfile(result.data);
            setMessage('Profile updated successfully!');
        }
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};
  if (loading) return <div>Loading profile...</div>;
  if (error && !userProfile)
    return <div className="alert alert-danger">Error: {error}</div>;

  const isHacker = userProfile?.role === "hacker";

  // --- FIX: Use the correct function names here ---
  const levelData = isHacker
    ? calculateLevel(userProfile.reputation_points)
    : null;
  const progressPercentage = isHacker
    ? calculateProgress(
        userProfile.reputation_points,
        levelData.currentLevel,
        levelData.nextLevel
      )
    : 0;
  // -------------------------------------------------

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Profile</h2>
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}

              {/* Avatar Upload Section */}
              <div className="mb-4 text-center">
                <div className="mb-3">
                  <img
                    src={
                      userProfile?.avatar_url ||
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9IiMzNzQxNTEiLz4KPGNpcmNsZSBjeD0iNjAiIGN5PSI1MCIgcj0iMjUiIGZpbGw9IiNkMWQ1ZGIiLz4KPHBhdGggZD0iTTMwIDEwM2MwLTI0LjMyIDEzLjQzLTYwIDMwLTYwczMwIDM1LjY4IDMwIDYwIiBmaWxsPSIjZDFkNW RiIi8+Cjwvc3ZnPg=="
                    }
                    alt="Profile Avatar"
                    className="rounded-circle"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="btn btn-outline-primary btn-sm"
                    style={{ cursor: "pointer" }}
                  >
                    {uploading ? "Uploading..." : "Change Avatar"}
                  </label>
                </div>
                <small className="text-muted d-block mt-2">
                  Max 2MB. JPG, PNG, GIF supported.
                </small>
              </div>

              <hr />

              <form onSubmit={handleProfileUpdate}>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={userProfile?.email || ""}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Bio</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          </div>
        </div>
        {isHacker && levelData && (
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Your Progress</h5>
                <p className="text-muted">
                  Reputation:{" "}
                  <span className="fw-bold text-primary">
                    {userProfile.reputation_points}
                  </span>
                </p>
                <hr />
                <p>
                  <strong>Level: {levelData.currentLevel.name}</strong>
                </p>
                <div className="progress" style={{ height: "20px" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progressPercentage}%` }}
                    aria-valuenow={progressPercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {progressPercentage}%
                  </div>
                </div>
                {levelData.nextLevel ? (
                  <p className="mt-2 text-muted small">
                    {levelData.nextLevel.minPoints -
                      userProfile.reputation_points}{" "}
                    points to {levelData.nextLevel.name}
                  </p>
                ) : (
                  <p className="mt-2 text-muted small">Max level reached!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
