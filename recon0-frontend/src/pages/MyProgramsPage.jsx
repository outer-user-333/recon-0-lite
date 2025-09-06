import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyPrograms } from '../lib/apiService';

const MyProgramsPage = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const result = await getMyPrograms();
                if (result.success) {
                    setPrograms(result.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    if (loading) return <div>Loading your programs...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">My Programs</h2>
                <Link to="/create-program" className="btn btn-primary">
                    <i className="fas fa-plus-circle me-2"></i>Create New Program
                </Link>
            </div>

            {programs.length === 0 ? (
                <p>You have not created any programs yet.</p>
            ) : (
                <div className="list-group shadow-sm">
                    {programs.map(program => (
                       <div key={program.id} className="list-group-item">
    <div className="d-flex w-100 justify-content-between align-items-center">
        <div>
            <h5 className="mb-1">{program.title}</h5>
            <p className="mb-1 text-muted">
                Bounty Range: ${program.min_bounty} - ${program.max_bounty}
            </p>
        </div>
        <div>
            {/* --- THIS LINK IS NOW FIXED --- */}
            <Link to="/manage-reports" className="btn btn-sm btn-outline-secondary me-2">Manage Reports</Link>
            <Link to={`/programs/${program.id}/analytics`} className="btn btn-sm btn-outline-secondary">Analytics</Link>
        </div>
    </div>
</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProgramsPage;