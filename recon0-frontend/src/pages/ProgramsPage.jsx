import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPrograms } from '../lib/apiService';

const ProgramsPage = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const result = await getPrograms();
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

    if (loading) return <div>Loading programs...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2 className="mb-4">Bug Bounty Programs</h2>
            <div className="list-group shadow-sm">
                {programs.map(program => (
                  <Link to={`/programs/${program.id}`} key={program.id} className="list-group-item list-group-item-action">
    <div className="d-flex align-items-center">
        <img 
            src={program.org_logo_url || 'data:image/svg+xml;base64,...'} 
            alt={`${program.org_name} logo`}
            className="rounded-circle me-3"
            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
        />
        <div className="flex-grow-1">
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{program.title}</h5>
                <small className="text-success">${program.min_bounty} - ${program.max_bounty}</small>
            </div>
            <p className="mb-1">Hosted by: <strong>{program.org_name}</strong></p>
        </div>
    </div>
</Link>
                ))}
            </div>
        </div>
    );
};

export default ProgramsPage;