import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyReports } from '../lib/apiService';

const MyReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const result = await getMyReports();
                if (result.success) {
                    setReports(result.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const getStatusBadge = (status) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === 'accepted') return 'bg-success';
        if (lowerStatus === 'triaging') return 'bg-warning';
        if (lowerStatus === 'new') return 'bg-primary';
        return 'bg-secondary';
    };

    if (loading) return <div>Loading your reports...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2 className="mb-4">My Reports</h2>
            {reports.length === 0 ? (
                <p>You have not submitted any reports yet.</p>
            ) : (
                <div className="list-group shadow-sm">
                    {reports.map(report => (
                        <Link to={`/reports/${report.id}`} key={report.id} className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">{report.title}</h5>
                                <span className={`badge ${getStatusBadge(report.status)}`}>{report.status}</span>
                            </div>
                            <p className="mb-1">
                                To: <strong>{report.program_name}</strong>
                            </p>
                            <small className="text-muted">Severity: {report.severity}</small>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReportsPage;