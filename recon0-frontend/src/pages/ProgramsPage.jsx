import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch('http://localhost:3001/api/v1/programs');
        if (!response.ok) {
          throw new Error('Failed to fetch programs. Is the mock API server running?');
        }
        const data = await response.json();
        setPrograms(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Program Discovery</h2>
      <p className="text-muted mb-5">Find the best opportunities to showcase your skills and earn bounties.</p>

      {loading && <p>Loading programs...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="row">
          {programs.map((program) => (
            <div key={program.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm program-card">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src={program.organization_logo_url} 
                      alt={`${program.organization_name} logo`}
                      className="rounded-circle me-3"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    <div>
                      <h5 className="card-title mb-0">{program.name}</h5>
                      <small className="text-muted">by {program.organization_name}</small>
                    </div>
                  </div>
                  
                  <p className="card-text flex-grow-1">{program.description}</p>
                  
                  <div className="mb-3">
                    {program.tags.map(tag => (
                      <span key={tag} className="badge bg-secondary me-2 text-capitalize">{tag}</span>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                     <span className="bounty-range">
                       ${program.min_bounty} - ${program.max_bounty}
                     </span>
                     {/* This link will eventually go to /programs/:programId */}
                     <Link to={`/programs/${program.id}`} className="btn btn-outline-primary btn-sm">
                       View Program
                     </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramsPage;
