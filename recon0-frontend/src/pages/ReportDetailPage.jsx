import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; // We need supabase for user role

const ReportDetailPage = () => {
    // This page correctly uses reportId from the URL
    const { reportId } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userProfile, setUserProfile] = useState(null);

    // For Org Triage Actions
    const [newStatus, setNewStatus] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // This function correctly fetches REPORT details
        const fetchReportDetails = async () => {
            if (!reportId) return;
            try {
                setLoading(true);
                setError('');
                const response = await fetch(`http://localhost:3001/api/v1/reports/${reportId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                if (result.success) {
                    setReport(result.data);
                    setNewStatus(result.data.status); // Pre-fill the dropdown
                } else {
                    throw new Error(result.message || 'Failed to fetch report details.');
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                setUserProfile(profile);
            }
        };

        fetchUserProfile();
        fetchReportDetails();
    }, [reportId]);
    
    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await fetch(`http://localhost:3001/api/v1/reports/${reportId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            const result = await response.json();
            if (result.success) {
                setReport(result.data); // Update UI with new data from server
            } else {
                throw new Error(result.message || 'Failed to update status.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };


    if (loading) return <p>Loading report details...</p>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;
    if (!report) return <div className="alert alert-warning">Report not found.</div>;

    const isOrganization = userProfile?.role === 'organization';

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="mb-0">{report.title}</h2>
                        <p className="mb-0 text-muted">Submitted by {report.reporter_username} to {report.program_name}</p>
                    </div>
                    <span className="badge bg-primary p-2">{report.status}</span>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className={isOrganization ? "col-md-8" : "col-md-12"}>
                            <h5>Severity: <span className="text-danger">{report.severity}</span></h5>
                            <hr />
                            <h5 className="mt-4">Description</h5>
                            <p>{report.description}</p>
                            <h5 className="mt-4">Steps to Reproduce</h5>
                            <pre className="bg-light p-3 rounded"><code>{report.steps_to_reproduce}</code></pre>
                            <h5 className="mt-4">Impact</h5>
                            <p>{report.impact}</p>
                        </div>
                        {isOrganization && (
                            <div className="col-md-4">
                                <div className="card">
                                    <div className="card-header">Triage Actions</div>
                                    <div className="card-body">
                                        <form onSubmit={handleStatusUpdate}>
                                            <div className="mb-3">
                                                <label htmlFor="status" className="form-label">Change Status</label>
                                                <select id="status" className="form-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                                                    <option value="New">New</option>
                                                    <option value="Triaging">Triaging</option>
                                                    <option value="Accepted">Accepted</option>
                                                    <option value="Resolved">Resolved</option>
                                                    <option value="Duplicate">Duplicate</option>
                                                    <option value="Invalid">Invalid</option>
                                                </select>
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100" disabled={isSaving}>
                                                {isSaving ? 'Saving...' : 'Save Status'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetailPage;

