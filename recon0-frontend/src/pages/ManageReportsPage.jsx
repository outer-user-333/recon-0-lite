import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrgReports } from '../lib/apiService';

const ManageReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const result = await getOrgReports();
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
        if (lowerStatus === 'triaging') return 'bg-warning text-dark';
        if (lowerStatus === 'new') return 'bg-primary';
        return 'bg-secondary';
    };

    if (loading) return <div>Loading incoming reports...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2 className="mb-4">Manage Reports</h2>
            {reports.length === 0 ? (
                <p>No reports have been submitted to your programs yet.</p>
            ) : (
                <div className="list-group shadow-sm">
                    {reports.map(report => (
                        <Link to={`/reports/${report.id}`} key={report.id} className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">{report.title}</h5>
                                <span className={`badge ${getStatusBadge(report.status)}`}>{report.status}</span>
                            </div>
                            <p className="mb-1">
                                Program: <strong>{report.program_name}</strong>
                            </p>
                            <small className="text-muted">Severity: {report.severity}</small>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageReportsPage;