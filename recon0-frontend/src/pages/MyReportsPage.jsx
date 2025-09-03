import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyReports = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await fetch('http://localhost:3001/api/v1/reports/my-reports');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                if (result.success) {
                    // --- DEBUGGING STEP ---
                    // Log the data we received from the API to the browser console.
                    console.log("Data received for My Reports:", result.data);
                    // --------------------
                    setReports(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch reports.');
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyReports();
    }, []);

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted': return 'bg-success';
            case 'resolved': return 'bg-primary';
            case 'triaging': return 'bg-warning text-dark';
            case 'new': return 'bg-info text-dark';
            default: return 'bg-secondary';
        }
    };
    
    if (loading) return <p>Loading your reports...</p>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">My Reports</h2>
            <p className="text-muted mb-4">A list of all the vulnerabilities you have submitted.</p>
            
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Report Title</th>
                                    <th scope="col">Program</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.length > 0 ? reports.map((report) => (
                                    <tr key={report.id || Math.random()}>
                                        <td>{report.title || 'No Title'}</td>
                                        <td>{report.program_name || 'N/A'}</td>
                                        <td><span className={`badge ${getStatusBadge(report.status)}`}>{report.status}</span></td>
                                        <td>
                                            {/* This button will only render if report.id exists */}
                                            {report.id ? (
                                                <Link to={`/reports/${report.id}`} className="btn btn-outline-primary btn-sm">
                                                    View
                                                </Link>
                                            ) : (
                                                <button className="btn btn-outline-secondary btn-sm" disabled>Invalid</button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">You haven't submitted any reports yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyReportsPage;

