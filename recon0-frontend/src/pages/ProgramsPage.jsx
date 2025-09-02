import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- NEW STATE FOR FILTERS ---
  const [minBounty, setMinBounty] = useState(0);

  // This function will be called when the component loads or when a filter changes
  const fetchPrograms = () => {
    setLoading(true);
    // We build the query string for the API call
    const query = new URLSearchParams({
        ...(minBounty > 0 && { minBounty }),
    }).toString();
    
    fetch(`http://localhost:3001/api/programs?${query}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setPrograms(data);
        setLoading(false);
      })
      // eslint-disable-next-line no-unused-vars
      .catch(error => {
        setError("Could not load programs.");
        setLoading(false);
      });
  };

  // This effect runs only once when the page loads for the first time
  useEffect(() => {
    fetchPrograms();
  },[]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchPrograms(); // Re-fetch data with the new filters
  };

  return (
    <div className="row g-4">
      {/* --- FILTER SIDEBAR --- */}
      <div className="col-lg-3">
        <div className="card text-white">
          <div className="card-header fw-bold text-black">
            Filter Programs
          </div>
          <div className="card-body">
            <form onSubmit={handleFilterSubmit}>
              <div className="mb-3">
                <label htmlFor="min_bounty" className="form-label text-black">Minimum Bounty ($)</label>
                <input 
                    type="number" 
                    className="form-control" 
                    id="min_bounty" 
                    value={minBounty}
                    onChange={(e) => setMinBounty(e.target.value)}
                    placeholder="e.g., 500"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Apply Filters</button>
            </form>
          </div>
        </div>
      </div>

      {/* --- PROGRAMS LIST --- */}
      <div className="col-lg-9">
        <div className="mb-4">
          <h1 className="display-5 fw-bolder">Program Discovery</h1>
          <p className="text-muted">Find the best opportunities for your skills and interests.</p>
        </div>

        {loading && <p>Loading programs...</p>}
        {error && <div className="alert alert-danger">Error: {error}</div>}

        {!loading && !error && (
          <div className="row g-4">
            {Array.isArray(programs) && programs.length > 0 ? (
                programs.map(program => (
                <div key={program.id} className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold">{program.title}</h5>
                      <p className="card-subtitle mb-2 text-muted">{program.organizationName}</p>
                      <div className="my-3">
                        {program.targets.map(target => (
                          <span key={target} className="badge rounded-pill me-2" style={{ backgroundColor: 'var(--border-color)'}}>
                            {target}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <p className="fw-bold fs-5 mb-0" style={{ color: 'var(--accent-green)' }}>
                          ${program.bounty.min} - ${program.bounty.max}
                        </p>
                        <Link to={`/programs/${program.id}`} className="btn btn-secondary btn-sm">View Program</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
                <p className="text-muted">No programs match your current filters.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}