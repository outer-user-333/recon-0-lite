import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { submitReport, uploadAttachment, enhanceReportWithAI, getProgramById } from "/src/lib/apiService.js";
import { ArrowLeft, Sparkles, Send, Paperclip, X, LoaderCircle } from 'lucide-react';

// Reusable Form Components for consistent styling
const FormGroup = ({ label, htmlFor, children }) => (
    <div>
        <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1">
            {label}
        </label>
        {children}
    </div>
);

const TextInput = (props) => (
    <input {...props} className="block w-full px-3 py-2 bg-white rounded-lg border border-slate-300 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
);

const TextArea = (props) => (
    <textarea {...props} className="block w-full px-3 py-2 bg-white rounded-lg border border-slate-300 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
);

const SelectInput = ({ children, ...props }) => (
     <select {...props} className="block w-full px-3 py-2 bg-white rounded-lg border border-slate-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
        {children}
    </select>
);


const SubmitReportPage = () => {
    const { programId } = useParams();
    const navigate = useNavigate();

    const [program, setProgram] = useState(null);
    const [title, setTitle] = useState("");
    const [severity, setSeverity] = useState("Medium");
    const [description, setDescription] = useState("");
    const [stepsToReproduce, setStepsToReproduce] = useState("");
    const [impact, setImpact] = useState("");
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);

    useEffect(() => {
        // Fetch program details to display in the header
        const fetchProgram = async () => {
            if (!programId) return;
            try {
                const result = await getProgramById(programId);
                if (result.success) setProgram(result.data);
            } catch (err) {
                console.error("Failed to fetch program title:", err);
            }
        };
        fetchProgram();
    }, [programId]);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };
    
    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleEnhanceReport = async () => {
        setError("");
        setIsEnhancing(true);
        try {
            const reportText = { description, steps_to_reproduce: stepsToReproduce, impact };
            const result = await enhanceReportWithAI(reportText);
            if (result.success) {
                setDescription(result.data.description);
                setStepsToReproduce(result.data.steps_to_reproduce);
                setImpact(result.data.impact);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        setUploadProgress(0);

        try {
            const uploadedAttachments = [];
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append("file", files[i]);
                const result = await uploadAttachment(formData);
                if (result.success) {
                    uploadedAttachments.push({ url: result.url, name: result.name, type: result.type });
                    setUploadProgress(((i + 1) / files.length) * 100);
                }
            }
            const reportData = { programId, title, severity, description, steps_to_reproduce: stepsToReproduce, impact, attachments: uploadedAttachments };
            const submitResult = await submitReport(reportData);
            if (submitResult.success) {
                navigate("/my-reports");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Link to={`/programs/${programId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
                <ArrowLeft size={16} />
                Back to program details
            </Link>
            
            <div>
                 <h1 className="text-3xl font-bold text-slate-800">Submit Report</h1>
                 <p className="text-slate-500">For program: <span className="font-semibold">{program?.title || 'Loading...'}</span></p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormGroup label="Title" htmlFor="title">
                            <TextInput id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Cross-Site Scripting in User Profile"/>
                        </FormGroup>
                        <FormGroup label="Severity" htmlFor="severity">
                            <SelectInput id="severity" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Critical</option>
                            </SelectInput>
                        </FormGroup>
                    </div>

                    <FormGroup label="Vulnerability Description" htmlFor="description">
                        <TextArea id="description" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="A clear and concise description of the vulnerability."/>
                    </FormGroup>
                    <FormGroup label="Steps to Reproduce" htmlFor="steps">
                        <TextArea id="steps" rows="8" value={stepsToReproduce} onChange={(e) => setStepsToReproduce(e.target.value)} required placeholder="Provide detailed, step-by-step instructions to reproduce the vulnerability."/>
                    </FormGroup>
                    <FormGroup label="Impact" htmlFor="impact">
                        <TextArea id="impact" rows="3" value={impact} onChange={(e) => setImpact(e.target.value)} required placeholder="Describe the potential impact of this vulnerability."/>
                    </FormGroup>

                    {/* Attachment Section */}
                    <FormGroup label="Attachments (Screenshots, Videos, etc.)" htmlFor="attachments">
                         <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg">
                            <div className="space-y-1 text-center">
                                <Paperclip className="mx-auto h-12 w-12 text-slate-400" />
                                <div className="flex text-sm text-slate-600">
                                <label htmlFor="attachments" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                    <span>Upload files</span>
                                    <input id="attachments" name="attachments" type="file" className="sr-only" multiple onChange={handleFileChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        {files.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-sm">
                                    <span className="text-slate-700 truncate">{file.name}</span>
                                    <button type="button" onClick={() => removeFile(index)} className="text-slate-400 hover:text-rose-500">
                                        <X size={16} />
                                    </button>
                                </div>
                                ))}
                            </div>
                        )}
                    </FormGroup>

                    {submitting && files.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-slate-700">Uploading attachments...</p>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        </div>
                    )}
                    
                    <div className="border-t border-slate-200 pt-5 flex flex-col sm:flex-row items-center justify-end gap-3">
                         <button
                            type="button"
                            onClick={handleEnhanceReport}
                            disabled={isEnhancing || submitting}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors disabled:opacity-50"
                        >
                            {isEnhancing ? <LoaderCircle size={18} className="animate-spin" /> : <Sparkles size={18} />}
                            {isEnhancing ? "Enhancing..." : "Enhance with AI"}
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || isEnhancing}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {submitting ? <LoaderCircle size={18} className="animate-spin" /> : <Send size={18} />}
                            {submitting ? "Submitting..." : "Submit Report"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitReportPage;

