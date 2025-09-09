import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { submitReport, uploadAttachment, enhanceReportWithAI, getProgramById } from "/src/lib/apiService.js";
import { ArrowLeft, Sparkles, Send, Paperclip, X, LoaderCircle, Wand2, CheckCircle } from 'lucide-react';

// Reusable Form Components for consistent styling
const FormGroup = ({ label, htmlFor, children, isEnhanced = false }) => (
    <div className={`transition-all duration-300 ${isEnhanced ? 'transform scale-[1.02]' : ''}`}>
        <label htmlFor={htmlFor} className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
            isEnhanced ? 'text-violet-700' : 'text-slate-700'
        }`}>
            {label}
            {isEnhanced && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs bg-gradient-to-r from-blue-500 to-violet-500 text-white px-2 py-1 rounded-full animate-pulse">
                    <Sparkles size={10} />
                    AI Enhanced
                </span>
            )}
        </label>
        {children}
    </div>
);

const TextInput = (props) => (
    <input {...props} className="block w-full px-3 py-2 bg-white rounded-lg border border-slate-300 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
);

const TextArea = ({ isEnhanced = false, isAnimating = false, ...props }) => (
    <textarea 
        {...props} 
        className={`block w-full px-3 py-2 rounded-lg border shadow-sm placeholder:text-slate-400 focus:outline-none transition-all duration-500 ${
            isEnhanced 
                ? 'bg-gradient-to-br from-blue-50 to-violet-50 border-blue-300 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 shadow-lg' 
                : 'bg-white border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
        } ${isAnimating ? 'animate-pulse' : ''}`}
    />
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
    
    // New states for enhancement tracking
    const [isEnhanced, setIsEnhanced] = useState(false);
    const [enhancedFields, setEnhancedFields] = useState({
        description: false,
        stepsToReproduce: false,
        impact: false
    });
    const [isAnimating, setIsAnimating] = useState(false);
    const [originalData, setOriginalData] = useState({
        description: '',
        stepsToReproduce: '',
        impact: ''
    });

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
        setIsAnimating(true);
        
        // Store original data
        setOriginalData({
            description,
            stepsToReproduce,
            impact
        });

        try {
            const reportText = { description, steps_to_reproduce: stepsToReproduce, impact };
            const result = await enhanceReportWithAI(reportText);
            
            if (result.success) {
                // Add a small delay for better UX
                setTimeout(() => {
                    setDescription(result.data.description);
                    setStepsToReproduce(result.data.steps_to_reproduce);
                    setImpact(result.data.impact);
                    
                    // Mark fields as enhanced
                    setEnhancedFields({
                        description: result.data.description !== originalData.description,
                        stepsToReproduce: result.data.steps_to_reproduce !== originalData.stepsToReproduce,
                        impact: result.data.impact !== originalData.impact
                    });
                    
                    setIsEnhanced(true);
                    setIsAnimating(false);
                }, 1000);
            }
        } catch (err) {
            setError(err.message);
            setIsAnimating(false);
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

    // Reset enhancement state when user manually edits enhanced content
    const handleTextChange = (field, value, setter) => {
        setter(value);
        if (isEnhanced) {
            setEnhancedFields(prev => ({
                ...prev,
                [field]: false
            }));
            
            // Check if any field is still enhanced
            const stillEnhanced = Object.values({
                ...enhancedFields,
                [field]: false
            }).some(Boolean);
            
            if (!stillEnhanced) {
                setIsEnhanced(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            <Link to={`/programs/${programId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-violet-500 hover:underline transition-colors">
                <ArrowLeft size={16} />
                Back to program details
            </Link>
            
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Submit Report</h1>
                <p className="text-slate-500">For program: <span className="font-semibold">{program?.title || 'Loading...'}</span></p>
            </div>

            {/* Enhancement Status Banner */}
            {isEnhanced && (
                <div className="bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200 rounded-lg p-4 animate-fadeIn">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full">
                            <Wand2 size={16} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900">AI Enhancement Applied</h3>
                            <p className="text-xs text-slate-600">Your report has been enhanced with AI suggestions. Review the changes below.</p>
                        </div>
                        <CheckCircle size={20} className="text-emerald-500 ml-auto" />
                    </div>
                </div>
            )}

            <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-sm border transition-all duration-300 ${
                isEnhanced ? 'border-blue-200 shadow-lg' : 'border-slate-200'
            }`}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormGroup label="Title" htmlFor="title">
                            <TextInput 
                                id="title" 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                required 
                                placeholder="e.g., Cross-Site Scripting in User Profile"
                            />
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

                    <FormGroup 
                        label="Vulnerability Description" 
                        htmlFor="description" 
                        isEnhanced={enhancedFields.description}
                    >
                        <TextArea 
                            id="description" 
                            rows={enhancedFields.description ? "8" : "5"} 
                            value={description} 
                            onChange={(e) => handleTextChange('description', e.target.value, setDescription)} 
                            required 
                            placeholder="A clear and concise description of the vulnerability."
                            isEnhanced={enhancedFields.description}
                            isAnimating={isAnimating}
                        />
                    </FormGroup>

                    <FormGroup 
                        label="Steps to Reproduce" 
                        htmlFor="steps" 
                        isEnhanced={enhancedFields.stepsToReproduce}
                    >
                        <TextArea 
                            id="steps" 
                            rows={enhancedFields.stepsToReproduce ? "12" : "8"} 
                            value={stepsToReproduce} 
                            onChange={(e) => handleTextChange('stepsToReproduce', e.target.value, setStepsToReproduce)} 
                            required 
                            placeholder="Provide detailed, step-by-step instructions to reproduce the vulnerability."
                            isEnhanced={enhancedFields.stepsToReproduce}
                            isAnimating={isAnimating}
                        />
                    </FormGroup>

                    <FormGroup 
                        label="Impact" 
                        htmlFor="impact" 
                        isEnhanced={enhancedFields.impact}
                    >
                        <TextArea 
                            id="impact" 
                            rows={enhancedFields.impact ? "6" : "3"} 
                            value={impact} 
                            onChange={(e) => handleTextChange('impact', e.target.value, setImpact)} 
                            required 
                            placeholder="Describe the potential impact of this vulnerability."
                            isEnhanced={enhancedFields.impact}
                            isAnimating={isAnimating}
                        />
                    </FormGroup>

                    {/* Attachment Section */}
                    <FormGroup label="Attachments (Screenshots, Videos, etc.)" htmlFor="attachments">
                         <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-blue-300 border-dashed rounded-lg hover:border-blue-400 bg-gradient-to-br from-blue-50 to-slate-50 transition-all duration-200">
                            <div className="space-y-1 text-center">
                                <div className="p-3 bg-white rounded-full shadow-sm border border-blue-200 mx-auto w-fit">
                                    <Paperclip className="h-8 w-8 text-blue-500" />
                                </div>
                                <div className="flex text-sm text-slate-700 font-medium">
                                <label htmlFor="attachments" className="relative cursor-pointer bg-gradient-to-r from-blue-500 to-violet-500 text-white px-3 py-1 rounded-full font-semibold hover:opacity-90 focus-within:outline-none transition-all">
                                    <span>Choose Files</span>
                                    <input id="attachments" name="attachments" type="file" className="sr-only" multiple onChange={handleFileChange} />
                                </label>
                                <p className="pl-2 text-slate-600">or drag and drop here</p>
                                </div>
                                <p className="text-xs text-slate-600 font-medium">PNG, JPG, GIF, PDF up to 10MB each</p>
                            </div>
                        </div>
                        {files.length > 0 && (
                            <div className="mt-4 bg-white border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Paperclip size={16} className="text-blue-500" />
                                    <span className="text-sm font-semibold text-slate-900">{files.length} file(s) selected:</span>
                                </div>
                                <div className="space-y-2">
                                    {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-violet-50 p-3 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                {file.type.startsWith('image/') ? 
                                                    <img src={URL.createObjectURL(file)} alt="preview" className="w-8 h-8 object-cover rounded" /> :
                                                    <Paperclip size={16} className="text-blue-500" />
                                                }
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-slate-900 block">{file.name}</span>
                                                <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => removeFile(index)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition-colors">
                                            <X size={16} />
                                        </button>
                                    </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </FormGroup>

                    {submitting && files.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-slate-700">Uploading attachments...</p>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1">
                                <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        </div>
                    )}
                    
                    <div className="border-t border-slate-200 pt-5 flex flex-col sm:flex-row items-center justify-end gap-3">
                         <button
                            type="button"
                            onClick={handleEnhanceReport}
                            disabled={isEnhancing || submitting}
                            className={`w-full sm:w-auto flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 ${
                                isEnhanced 
                                    ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 hover:from-emerald-200 hover:to-emerald-300' 
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            {isEnhancing ? (
                                <>
                                    <LoaderCircle size={18} className="animate-spin" />
                                    Enhancing...
                                </>
                            ) : isEnhanced ? (
                                <>
                                    <CheckCircle size={18} />
                                    Enhanced with AI
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    Enhance with AI
                                </>
                            )}
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

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default SubmitReportPage;