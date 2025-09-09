import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProgram } from '/src/lib/apiService.js';
import { ArrowLeft, PlusCircle, LoaderCircle } from 'lucide-react';

// Reusable Form Components from previous pages
const FormGroup = ({ label, htmlFor, children, helpText }) => (
    <div>
        <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1">
            {label}
        </label>
        {children}
        {helpText && <p className="mt-2 text-xs text-slate-500">{helpText}</p>}
    </div>
);

const TextInput = (props) => (
    <input {...props} className="block w-full px-3 py-2 bg-white rounded-lg border border-slate-300 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
);

const TextArea = (props) => (
    <textarea {...props} className="block w-full px-3 py-2 bg-white rounded-lg border border-slate-300 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
);


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
        tags: ''
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
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
            const programData = { ...formData, tags: tagsArray };
            const result = await createProgram(programData);
            if (result.success) {
                navigate('/my-programs');
            } else {
                 throw new Error(result.message || "Failed to create program.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
             <Link to="/my-programs" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
                <ArrowLeft size={16} />
                Back to my programs
            </Link>

            <h1 className="text-3xl font-bold text-slate-800">Create New Program</h1>

            <form onSubmit={handleSubmit}>
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                    {error && <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Main Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <FormGroup label="Program Title" htmlFor="title">
                                <TextInput id="title" name="title" type="text" value={formData.title} onChange={handleChange} required placeholder="e.g., Acme Corporation Web Security"/>
                            </FormGroup>
                            <FormGroup label="Description" htmlFor="description">
                                <TextArea id="description" name="description" rows="5" value={formData.description} onChange={handleChange} placeholder="A brief, public-facing description of your program."/>
                            </FormGroup>
                            <FormGroup label="Policy" htmlFor="policy">
                                <TextArea id="policy" name="policy" rows="8" value={formData.policy} onChange={handleChange} placeholder="Detail the rules of engagement, what hackers should and should not do."/>
                            </FormGroup>
                        </div>

                        {/* Right Column: Bounties & Scope */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                                <FormGroup label="Minimum Bounty ($)" htmlFor="min_bounty">
                                    <TextInput id="min_bounty" name="min_bounty" type="number" value={formData.min_bounty} onChange={handleChange} />
                                </FormGroup>
                                <FormGroup label="Maximum Bounty ($)" htmlFor="max_bounty">
                                    <TextInput id="max_bounty" name="max_bounty" type="number" value={formData.max_bounty} onChange={handleChange} />
                                </FormGroup>
                            </div>
                             <FormGroup label="In-Scope Assets" htmlFor="scope">
                                <TextArea id="scope" name="scope" rows="4" value={formData.scope} onChange={handleChange} placeholder="e.g., *.example.com"/>
                            </FormGroup>
                            <FormGroup label="Out-of-Scope Assets" htmlFor="out_of_scope">
                                <TextArea id="out_of_scope" name="out_of_scope" rows="4" value={formData.out_of_scope} onChange={handleChange} placeholder="e.g., staging.example.com"/>
                            </FormGroup>
                            <FormGroup label="Tags" htmlFor="tags" helpText="Enter tags separated by commas (e.g., web, api, security).">
                                <TextInput id="tags" name="tags" type="text" value={formData.tags} onChange={handleChange} />
                            </FormGroup>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 mt-8 pt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold py-2 px-5 rounded-lg text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {submitting ? <LoaderCircle size={18} className="animate-spin" /> : <PlusCircle size={18} />}
                            {submitting ? 'Creating Program...' : 'Create Program'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateProgramPage;

