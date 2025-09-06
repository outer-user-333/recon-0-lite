import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProgramById } from '../lib/apiService';

const ProgramDetailPage = () => {
    const { programId } = useParams();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProgram = async () => {
            if (!programId) return;
            try {
                const result = await getProgramById(programId);
                if (result.success) {
                    setProgram(result.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProgram();
    }, [programId]);

    if (loading) return <div>Loading program details...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!program) return <div>Program not found.</div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-0">{program.title}</h2>
                    <p className="text-muted">Hosted by {program.org_name}</p>
                </div>
                <Link to={`/programs/${programId}/submit`} className="btn btn-primary">
                    Submit Report
                </Link>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-header">
                    <h5>Bounty Range</h5>
                </div>
                <div className="card-body">
                    <p className="fs-4 text-success fw-bold">
                        ${program.min_bounty?.toLocaleString()} - ${program.max_bounty?.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* In a real app, these would come from the API */}
            <div className="card shadow-sm mb-4">
                 <div className="card-header"><h5>Policy</h5></div>
                 <div className="card-body">
                    <p>Please provide clear, reproducible steps. No DDoS attacks or social engineering.</p>
                 </div>
            </div>

             <div className="card shadow-sm">
                 <div className="card-header"><h5>Scope</h5></div>
                 <div className="card-body">
                    <p><strong>In Scope:</strong> api.example.com, www.example.com</p>
                    <p><strong>Out of Scope:</strong> staging.example.com</p>
                 </div>
            </div>
        </div>
    );
};

export default ProgramDetailPage;