import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProgramDetailPage() {
  const { programId } = useParams(); // Gets the ID from the URL (e.g., 'prog_001')
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data for the specific program from our mock API
    fetch(`http://localhost:3001/api/programs/${programId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Program not found');
        }
        return response.json();
      })
      .then(data => {
        setProgram(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [programId]); // Re-run this effect if the programId changes

  if (loading) {
    return <p>Loading program details...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }
  
  if (!program) {
      return <p>No program data available.</p>
  }

  return (
    <div className="row g-4">
      {/* Main Content Column */}
      <div className="col-lg-8">
        {/* V-- THE FIX IS HERE: added 'text-white' --V */}
        <div className="card text-black">
          <div className="card-body p-4">
            <h1 className="display-6 fw-bolder text-black">{program.title}</h1>
            <p className="text-muted">from {program.organizationName}</p>
            <hr className="my-4" style={{borderColor: 'var(--border-color)'}}/>
            
            <h5 className="fw-bold text-black">Description</h5>
            <p>{program.description}</p>
            
            <h5 className="fw-bold mt-4 text-black">Policy</h5>
            <p style={{whiteSpace: 'pre-wrap'}}>{program.policy}</p>
          </div>
        </div>
      </div>

      {/* Sidebar Column */}
      <div className="col-lg-4">
        <div className="card text-black">
          <div className="card-body p-4">
            <h5 className="fw-bold text-black">Bounties</h5>
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0">Minimum</p>
              <p className="fw-bold mb-0" style={{color: 'var(--accent-green)'}}>${program.bounty.min.toLocaleString()}</p>
            </div>
             <div className="d-flex justify-content-between align-items-center mt-2">
              <p className="mb-0">Maximum</p>
              <p className="fw-bold mb-0" style={{color: 'var(--accent-green)'}}>${program.bounty.max.toLocaleString()}</p>
            </div>
            <hr className="my-4" style={{borderColor: 'var(--border-color)'}}/>
            <h5 className="fw-bold tezt-black">Scope</h5>
            <div>
              {program.targets.map(target => (
                <span key={target} className="badge rounded-pill me-2" style={{ backgroundColor: 'var(--border-color)'}}>
                  {target}
                </span>
              ))}
            </div>
             <div className="d-grid mt-4">
                {/* V-- CHANGE THIS LINE FROM <button> to <Link> --V */}
  <Link to={`/programs/${program.id}/submit`} className="btn btn-primary">Submit Report</Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
