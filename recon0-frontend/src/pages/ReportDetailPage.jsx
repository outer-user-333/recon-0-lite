import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseChatClient';

const ReportDetailPage = () => {
    // This page correctly uses reportId from the URL
  const { reportId } = useParams();
    const [report, setReport] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userProfile, setUserProfile] = useState(null);

    // For Org Triage Actions
    const [newStatus, setNewStatus] = useState('');
    const [isSaving, setIsSaving] = useState(false);


    const fetchReportAndComments = useCallback(async () => {
        if (!reportId) return;
        try {
            setLoading(true);
            setError('');
            // Fetch both report details and comments in parallel
            const [reportResponse, commentsResponse] = await Promise.all([
                fetch(`http://localhost:3001/api/v1/reports/${reportId}`),
                fetch(`http://localhost:3001/api/v1/reports/${reportId}/comments`)
            ]);

            if (!reportResponse.ok) throw new Error(`Failed to fetch report: ${reportResponse.status}`);
            const reportResult = await reportResponse.json();
            if (reportResult.success) {
                setReport(reportResult.data);
                setNewStatus(reportResult.data.status);
            } else {
                throw new Error(reportResult.message || 'Could not fetch report details.');
            }

            if (!commentsResponse.ok) throw new Error(`Failed to fetch comments: ${commentsResponse.status}`);
            const commentsResult = await commentsResponse.json();
            if (commentsResult.success) {
                setComments(commentsResult.data);
            } else {
                throw new Error(commentsResult.message || 'Could not fetch comments.');
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [reportId]);


// old
    // useEffect(() => {
    //     // This function correctly fetches REPORT details
    //     const fetchReportDetails = async () => {
    //         if (!reportId) return;
    //         try {
    //             setLoading(true);
    //             setError('');
    //             const response = await fetch(`http://localhost:3001/api/v1/reports/${reportId}`);
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`);
    //             }
    //             const result = await response.json();
    //             if (result.success) {
    //                 setReport(result.data);
    //                 setNewStatus(result.data.status); // Pre-fill the dropdown
    //             } else {
    //                 throw new Error(result.message || 'Failed to fetch report details.');
    //             }
    //         } catch (err) {
    //             console.error("Fetch Error:", err);
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     const fetchUserProfile = async () => {
    //         const { data: { user } } = await supabase.auth.getUser();
    //         if (user) {
    //             const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    //             setUserProfile(profile);
    //         }
    //     };

    //     fetchUserProfile();
    //     fetchReportDetails();
    // }, [reportId]);

        useEffect(() => {
        const fetchUserProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('role, username').eq('id', user.id).single();
                setUserProfile(profile);
            }
        };
        fetchUserProfile();
        fetchReportAndComments();
    }, [reportId, fetchReportAndComments]);
    
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

    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setIsSaving(true);
        try {
            const response = await fetch(`http://localhost:3001/api/v1/reports/${reportId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newComment,
                    author: userProfile?.username || 'User' // Send the current user's name
                }),
            });
            const result = await response.json();
            if (result.success) {
                setComments(prevComments => [...prevComments, result.data]); // Add new comment to the list
                setNewComment(''); // Clear the textarea
            } else {
                throw new Error(result.message || 'Failed to post comment.');
            }
        } catch (err) {
            console.error(err);
            // Optionally set an error state for the comment form
        } finally {
            setIsSaving(false);
        }
    }

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

              {/* Comments Section */}
            <div className="card shadow-lg">
                <div className="card-header">
                    <h5 className="mb-0">Communication</h5>
                </div>
                <div className="card-body">
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment.id} className="mb-3 d-flex">
                                <div className="avatar me-3 bg-secondary text-white">{comment.author.charAt(0).toUpperCase()}</div>
                                <div className="w-100">
                                    <div className="d-flex justify-content-between">
                                        <span className="fw-bold">{comment.author}</span>
                                        <small className="text-muted">{new Date(comment.created_at).toLocaleString()}</small>
                                    </div>
                                    <p className="mb-0 bg-light p-2 rounded">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted">No comments yet.</p>
                    )}

                    <hr />
                    
                    <form onSubmit={handleCommentSubmit}>
                        <div className="mb-3">
                            <label htmlFor="newComment" className="form-label fw-bold">Add a comment</label>
                            <textarea
                                id="newComment"
                                className="form-control"
                                rows="3"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Type your message here..."
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSaving}>
                            {isSaving ? 'Submitting...' : 'Submit Comment'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportDetailPage;

