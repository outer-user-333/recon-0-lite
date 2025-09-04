import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyProgramsPage = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrgPrograms = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/v1/organization/programs');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                if (result.success) {
                    setPrograms(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch programs.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrgPrograms();
    }, []);

    const renderContent = () => {
        if (loading) return <p>Loading your programs...</p>;
        if (error) return <div className="alert alert-danger">{error}</div>;
        if (programs.length === 0) {
            return (
                <div className="text-center">
                    <p>You haven't created any programs yet.</p>
                    <Link to="/create-program" className="btn btn-primary">Create Your First Program</Link>
                </div>
            );
        }

        return (
            <div className="list-group">
                {programs.map(program => (
                    <div key={program.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="mb-1">{program.title}</h5>
                            <small className="text-muted">Status: <span className={`badge bg-${program.status === 'active' ? 'success' : 'secondary'}`}>{program.status}</span></small>
                        </div>
                        <div>
                            <Link to={`/manage-reports?programId=${program.id}`} className="btn btn-outline-secondary btn-sm me-2">
                                <i className="fas fa-tasks me-1"></i> Manage Reports
                            </Link>
                            {/* We will build this page in the next step */}
                            <Link to={`/programs/${program.id}/analytics`} className="btn btn-outline-primary btn-sm">
                                <i className="fas fa-chart-line me-1"></i> View Analytics
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-0">My Programs</h2>
                    <p className="text-muted">Manage all your bug bounty programs.</p>
                </div>
                <Link to="/create-program" className="btn btn-primary">
                    <i className="fas fa-plus-circle me-2"></i> Create New Program
                </Link>
            </div>
            {renderContent()}
        </div>
    );
};

export default MyProgramsPage;
