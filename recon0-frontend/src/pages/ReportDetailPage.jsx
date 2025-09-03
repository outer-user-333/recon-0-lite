import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {supabase} from '../lib/supabaseClient'; // Assuming this is your Supabase client

const ReportDetailPage = () => {
    const { reportId } = useParams();
    const [report, setReport] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State for the organization's triage actions
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // 1. Fetch the current user's profile to determine their role
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user.id)
                        .single();

                    if (profileError) throw new Error('Could not fetch user profile.');
                    setUserRole(profile.role);
                }

                // 2. Fetch the report details from the mock API
                const response = await fetch(`http://localhost:3001/api/v1/reports/${reportId}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();
                
                if (result.success) {
                    setReport(result.data);
                    setSelectedStatus(result.data.status); // Initialize dropdown with current status
                } else {
                    throw new Error(result.message || 'Failed to fetch report details.');
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [reportId]);

    const handleStatusUpdate = async () => {
        setIsUpdating(true);
        setUpdateMessage('');
        try {
            const response = await fetch(`http://localhost:3001/api/v1/reports/${reportId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: selectedStatus }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to update status.');
            }
            // Update the local state to reflect the change immediately
            setReport(result.data);
            setUpdateMessage('Status updated successfully!');
        } catch (error) {
            setUpdateMessage(`Error: ${error.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const TriageSection = () => (
        <div className="card shadow-sm mt-4 bg-light border-primary">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0"><i className="fas fa-gavel me-2"></i>Triage Actions</h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label htmlFor="status-select" className="form-label"><strong>Change Status</strong></label>
                    <select 
                        id="status-select" 
                        className="form-select" 
                        value={selectedStatus} 
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="New">New</option>
                        <option value="Triaging">Triaging</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Duplicate">Duplicate</option>
                        <option value="Invalid">Invalid</option>
                    </select>
                </div>
                <button 
                    className="btn btn-primary" 
                    onClick={handleStatusUpdate}
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Saving...' : 'Save Status'}
                </button>
                {updateMessage && <div className="mt-3 alert alert-info">{updateMessage}</div>}
            </div>
        </div>
    );

    if (loading) return <div>Loading report details...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;
    if (!report) return <div>Report not found.</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-dark text-white">
                    <h3 className="mb-0">{report.title}</h3>
                    <p className="mb-0 text-muted">from program: {report.program_name}</p>
                </div>
                <div className="card-body">
                    {/* Conditionally render the Triage Section for organizations */}
                    {userRole === 'organization' && <TriageSection />}

                    <div className="row mt-4">
                        <div className="col-md-6">
                            <h5><i className="fas fa-exclamation-triangle me-2 text-danger"></i>Severity</h5>
                            <p>{report.severity}</p>
                        </div>
                        <div className="col-md-6">
                            <h5><i className="fas fa-check-circle me-2 text-success"></i>Status</h5>
                            <p>{report.status}</p>
                        </div>
                    </div>
                    <hr/>
                    <h5><i className="fas fa-book me-2"></i>Description</h5>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{report.description}</p>
                    <hr/>
                    <h5><i className="fas fa-list-ol me-2"></i>Steps to Reproduce</h5>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{report.steps_to_reproduce}</p>
                    <hr/>
                    <h5><i className="fas fa-bolt me-2"></i>Impact</h5>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{report.impact}</p>
                </div>
                <div className="card-footer text-muted">
                    Reported by: {report.reporter_username} on {new Date(report.created_at).toLocaleString()}
                </div>
            </div>
        </div>
    );
};

export default ReportDetailPage;

