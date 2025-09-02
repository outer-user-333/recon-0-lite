import React, { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({ fullName: '', username: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch the current profile data when the page loads
  useEffect(() => {
    fetch('http://localhost:3001/api/profile')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      // eslint-disable-next-line no-unused-vars
      .catch(err => {
        setError('Failed to load profile data.');
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfile(prevProfile => ({ ...prevProfile, [id]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error('Failed to update profile.');
      
      const data = await response.json();
      setSuccess(data.message);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.fullName) return <p>Loading profile...</p>;
  if (error && !success) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="mb-4">
        <h1 className="display-5 fw-bolder">My Profile</h1>
        <p className="text-white">Update your personal information and settings.</p>
      </div>

      <div className="card text-white">
        <div className="card-body p-4">
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label text-black">Full Name</label>
              <input type="text" className="form-control" id="fullName" value={profile.fullName} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label text-black">Username</label>
              <input type="text" className="form-control" id="username" value={profile.username} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-black">Email</label>
              <input type="email" className="form-control" id="email" value={profile.email} disabled />
              <div className="form-text">Your email address cannot be changed.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="bio" className="form-label text-black">Bio</label>
              <textarea className="form-control" id="bio" rows="3" value={profile.bio} onChange={handleInputChange}></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}