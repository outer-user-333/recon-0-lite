import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitReport } from '../lib/apiService';

const SubmitReportPage = () => {
    const { programId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [severity, setSeverity] = useState('Medium');
    // Add new state for the new fields
    const [description, setDescription] = useState('');
    const [stepsToReproduce, setStepsToReproduce] = useState('');
    const [impact, setImpact] = useState('');

    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const reportData = { 
                programId, 
                title, 
                severity, 
                description, 
                steps_to_reproduce: stepsToReproduce, 
                impact 
            };
            const result = await submitReport(reportData);
            if (result.success) {
                navigate('/my-reports');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="mb-4">Submit Report</h2>
            <div className="card shadow-sm">
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="severity" className="form-label">Severity</label>
                            <select
                                className="form-select"
                                id="severity"
                                value={severity}
                                onChange={(e) => setSeverity(e.target.value)}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>

                        {/* === NEW FORM FIELDS START HERE === */}
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Vulnerability Description</label>
                            <textarea
                                className="form-control"
                                id="description"
                                rows="5"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="steps" className="form-label">Steps to Reproduce</label>
                            <textarea
                                className="form-control"
                                id="steps"
                                rows="8"
                                value={stepsToReproduce}
                                onChange={(e) => setStepsToReproduce(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="impact" className="form-label">Impact</label>
                            <textarea
                                className="form-control"
                                id="impact"
                                rows="3"
                                value={impact}
                                onChange={(e) => setImpact(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        {/* === NEW FORM FIELDS END HERE === */}

                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubmitReportPage;