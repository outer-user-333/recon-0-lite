import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProgram } from '../lib/apiService';

const CreateProgramPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        policy: '',
        scope: '',
        out_of_scope: '',
        min_bounty: 0,
        max_bounty: 0,
        tags: '' // We'll handle this as a comma-separated string in the UI
    });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            // Convert tags from a comma-separated string to an array
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
            const programData = { ...formData, tags: tagsArray };

            const result = await createProgram(programData);
            if (result.success) {
                navigate('/my-programs');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="mb-4">Create New Program</h2>
            <div className="card shadow-sm">
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        {/* Text Fields */}
                        <div className="mb-3">
                            <label className="form-label">Program Title</label>
                            <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleChange}></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Policy</label>
                            <textarea name="policy" className="form-control" rows="5" value={formData.policy} onChange={handleChange}></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Scope</label>
                            <textarea name="scope" className="form-control" rows="3" value={formData.scope} onChange={handleChange}></textarea>
                        </div>
                         <div className="mb-3">
                            <label className="form-label">Out of Scope</label>
                            <textarea name="out_of_scope" className="form-control" rows="3" value={formData.out_of_scope} onChange={handleChange}></textarea>
                        </div>

                        {/* Bounty Fields */}
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Minimum Bounty ($)</label>
                                <input type="number" name="min_bounty" className="form-control" value={formData.min_bounty} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Maximum Bounty ($)</label>
                                <input type="number" name="max_bounty" className="form-control" value={formData.max_bounty} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Tags Field */}
                         <div className="mb-3">
                            <label className="form-label">Tags</label>
                            <input type="text" name="tags" className="form-control" value={formData.tags} onChange={handleChange} />
                            <div className="form-text">Enter tags separated by commas (e.g., web, api, security).</div>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create Program'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProgramPage;