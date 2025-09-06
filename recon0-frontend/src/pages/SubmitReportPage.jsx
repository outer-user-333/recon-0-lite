import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitReport, uploadAttachment } from '../lib/apiService';

const SubmitReportPage = () => {
    const { programId } = useParams();
    const navigate = useNavigate();

    // Form fields state
    const [title, setTitle] = useState('');
    const [severity, setSeverity] = useState('Medium');
    const [description, setDescription] = useState('');
    const [stepsToReproduce, setStepsToReproduce] = useState('');
    const [impact, setImpact] = useState('');

    // Attachment state
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    // General component state
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        setUploadProgress(0);

        try {
            // Step 1: Upload all attachments one by one
            const uploadedAttachments = [];
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append('file', files[i]);
                const result = await uploadAttachment(formData);
                if (result.success) {
                    uploadedAttachments.push({
                        url: result.url,
                        name: result.name,
                        type: result.type
                    });
                    setUploadProgress(((i + 1) / files.length) * 100);
                }
            }

            // Step 2: Submit the report with the attachment URLs
            const reportData = { 
                programId, title, severity, description, 
                steps_to_reproduce: stepsToReproduce, 
                impact, 
                attachments: uploadedAttachments 
            };
            const submitResult = await submitReport(reportData);

            if (submitResult.success) {
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
                        {/* All Form Fields */}
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="severity" className="form-label">Severity</label>
                            <select className="form-select" id="severity" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Vulnerability Description</label>
                            <textarea className="form-control" id="description" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="steps" className="form-label">Steps to Reproduce</label>
                            <textarea className="form-control" id="steps" rows="8" value={stepsToReproduce} onChange={(e) => setStepsToReproduce(e.target.value)} required></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="impact" className="form-label">Impact</label>
                            <textarea className="form-control" id="impact" rows="3" value={impact} onChange={(e) => setImpact(e.target.value)} required></textarea>
                        </div>

                        {/* Attachment Field */}
                        <div className="mb-3">
                            <label htmlFor="attachments" className="form-label">Attachments (Screenshots, Videos, etc.)</label>
                            <input className="form-control" type="file" id="attachments" multiple onChange={handleFileChange} />
                        </div>

                        {submitting && files.length > 0 && (
                            <div className="mb-3">
                                <label>Uploading attachments...</label>
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{ width: `${uploadProgress}%` }} aria-valuenow={uploadProgress} aria-valuemin="0" aria-valuemax="100">
                                        {Math.round(uploadProgress)}%
                                    </div>
                                </div>
                            </div>
                        )}

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