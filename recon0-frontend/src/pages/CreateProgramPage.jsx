import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateProgramPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    policy: '',
    min_bounty: '',
    max_bounty: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const newProgramData = {
      organizationName: "My Organization", // We'll get this dynamically later
      title: formData.title,
      description: formData.description,
      policy: formData.policy,
      bounty: {
        min: parseInt(formData.min_bounty, 10),
        max: parseInt(formData.max_bounty, 10),
      },
      targets: ["Web", "API"], // Hardcoded for now
    };

    try {
      const response = await fetch('http://localhost:3001/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgramData),
      });

      if (!response.ok) throw new Error('Failed to create program.');

      alert('Program created successfully!');
      // After creating, redirect the org to the main programs page to see it
      navigate('/programs'); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='text-black'>
      <div className="mb-4">
        <h1 className="display-5 fw-bolder">Create a New Program</h1>
        <p className="text-white">Define the scope and rewards for your new bug bounty program.</p>
      </div>

      <div className="card text-white">
        <div className="card-body p-4">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label text-black">Program Title</label>
              <input type="text" className="form-control text-black" id="title" value={formData.title} onChange={handleInputChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label text-black">Description</label>
              <textarea className="form-control text-black" id="description" rows="3" value={formData.description} onChange={handleInputChange} required></textarea>
            </div>
            
            <div className="mb-3">
              <label htmlFor="policy" className="form-label text-black">Policy</label>
              <textarea className="form-control text-black" id="policy" rows="5" value={formData.policy} onChange={handleInputChange} required></textarea>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="min_bounty" className="form-label text-black">Minimum Bounty ($)</label>
                <input type="number" className="form-control text-black" id="min_bounty" value={formData.min_bounty} onChange={handleInputChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="max_bounty" className="form-label text-black">Maximum Bounty ($)</label>
                <input type="number" className="form-control text-black" id="max_bounty" value={formData.max_bounty} onChange={handleInputChange} required />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Creating Program...' : 'Create Program'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}