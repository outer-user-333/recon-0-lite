import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProgramPage = () => {
  const navigate = useNavigate();
  const [program, setProgram] = useState({
    title: '',
    description: '',
    policy: '',
    scope: '',
    outOfScope: '',
    minBounty: 0,
    maxBounty: 0,
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProgram(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/v1/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...program,
          tags: program.tags.split(',').map(tag => tag.trim()), // Convert comma-separated string to array
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create the program. Please try again.');
      }
      
      // On success, navigate to a future "Manage Programs" page, for now, the dashboard.
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create a New Bounty Program</h2>
      <p className="text-muted mb-4">Define the scope and rewards for your new bug bounty program.</p>

      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm">
          <div className="card-body p-4">
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Program Title</label>
              <input type="text" className="form-control" id="title" name="title" value={program.title} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea className="form-control" id="description" name="description" rows="3" value={program.description} onChange={handleChange} required></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="policy" className="form-label">Policy</label>
              <textarea className="form-control" id="policy" name="policy" rows="5" value={program.policy} onChange={handleChange} required placeholder="e.g., Please follow responsible disclosure guidelines. Do not perform any denial of service attacks..."></textarea>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="scope" className="form-label">In-Scope Assets</label>
                <textarea className="form-control" id="scope" name="scope" rows="4" value={program.scope} onChange={handleChange} required placeholder="e.g., *.example.com, api.example.com"></textarea>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="outOfScope" className="form-label">Out-of-Scope Assets</label>
                <textarea className="form-control" id="outOfScope" name="outOfScope" rows="4" value={program.outOfScope} onChange={handleChange} placeholder="e.g., status.example.com, third-party vendors"></textarea>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="minBounty" className="form-label">Minimum Bounty ($)</label>
                <input type="number" className="form-control" id="minBounty" name="minBounty" value={program.minBounty} onChange={handleChange} />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="maxBounty" className="form-label">Maximum Bounty ($)</label>
                <input type="number" className="form-control" id="maxBounty" name="maxBounty" value={program.maxBounty} onChange={handleChange} />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="tags" className="form-label">Tags</label>
              <input type="text" className="form-control" id="tags" name="tags" value={program.tags} onChange={handleChange} placeholder="e.g., web, api, android" />
              <div className="form-text">Enter tags separated by commas.</div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating Program...' : 'Create Program'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProgramPage;
