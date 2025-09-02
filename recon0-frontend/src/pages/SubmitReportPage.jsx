import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function SubmitReportPage() {
  const { programId } = useParams();
  const navigate = useNavigate();

  const [programTitle, setProgramTitle] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the program title to display on the page
  useEffect(() => {
    fetch(`http://localhost:3001/api/programs/${programId}`)
      .then(res => res.json())
      .then(data => setProgramTitle(data.title))
      .catch(err => console.error("Failed to fetch program title", err));
  }, [programId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const reportData = {
      programId,
      title,
      description,
    };

    try {
      const response = await fetch('http://localhost:3001/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report.');
      }

      alert('Report submitted successfully!');
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="display-5 fw-bolder">Submit Report</h1>
        <p className="text-white">You are submitting a report for the program: <strong>{programTitle || 'Loading...'}</strong></p>
      </div>

      <div className="card text-white">
        <div className="card-body p-4">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label text-black">Report Title</label>
              <input 
                type="text" 
                className="form-control" 
                id="title" 
                placeholder="e.g., Cross-Site Scripting (XSS) in user profile page"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label text-black">Vulnerability Details</label>
              <textarea 
                className="form-control" 
                id="description" 
                rows="10"
                placeholder="Provide a detailed description of the vulnerability, including steps to reproduce it and its potential impact."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}