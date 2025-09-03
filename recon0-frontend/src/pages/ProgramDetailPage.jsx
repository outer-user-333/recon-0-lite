import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProgramDetailPage = () => {
    // This page correctly uses programId from the URL
    const { programId } = useParams();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // This function correctly fetches PROGRAM details
        const fetchProgramDetails = async () => {
            if (!programId) return;
            try {
                setLoading(true);
                setError('');
                const response = await fetch(`http://localhost:3001/api/v1/programs/${programId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                if (result.success) {
                    setProgram(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch program details.');
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProgramDetails();
    }, [programId]);

    if (loading) return <p>Loading program details...</p>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;
    if (!program) return <div className="alert alert-warning">Program not found.</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-dark text-white">
                    <h2 className="mb-0">{program.title}</h2>
                    <p className="mb-0 text-muted">from {program.organization_name}</p>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <h5 className="mb-3">Description</h5>
                            <p>{program.description}</p>
                            <hr />
                            <h5 className="mb-3">Scope</h5>
                            <pre className="bg-light p-3 rounded"><code>{program.scope}</code></pre>
                             <h5 className="mb-3 mt-4">Out of Scope</h5>
                            <pre className="bg-light p-3 rounded"><code>{program.out_of_scope}</code></pre>
                            <hr />
                            <h5 className="mb-3">Policy</h5>
                            <p>{program.policy}</p>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Bounties</h5>
                                    <p className="card-text">
                                        Minimum: <span className="text-success fw-bold">${program.min_bounty}</span>
                                        <br />
                                        Maximum: <span className="text-success fw-bold">${program.max_bounty}</span>
                                    </p>
                                    <Link to={`/programs/${programId}/submit`} className="btn btn-primary w-100">
                                        Submit Report
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramDetailPage;

