import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getReportById,
  getProfile,
  updateReportStatus,
  getReportMessages,
  sendReportMessage,
  uploadAttachment,
} from "../lib/apiService.js";
import { 
    ArrowLeft, Send, Paperclip, Download, User, Calendar, Tag, Check, LoaderCircle, 
    Image as ImageIcon, File, PlusCircle, FileText, Video, FileArchive, Eye, X // BUG FIX: Added 'X' to imports
} from "lucide-react";

// --- Reusable UI Components from other pages for consistency ---

const StatusBadge = ({ status }) => {
    const lowerStatus = (status || '').toLowerCase(); // Defensive check
    let colorClasses = 'bg-slate-100 text-slate-800';
    switch (lowerStatus) {
        case 'accepted': case 'resolved': colorClasses = 'bg-emerald-100 text-emerald-800'; break;
        case 'triaging': colorClasses = 'bg-orange-100 text-orange-800'; break;
        case 'new': colorClasses = 'bg-blue-100 text-blue-800'; break;
        case 'closed': case 'duplicate': case 'invalid': colorClasses = 'bg-rose-100 text-rose-800'; break;
    }
    return <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colorClasses}`}>{status || 'Unknown'}</span>;
};

const SeverityIndicator = ({ severity }) => {
    const lowerSeverity = (severity || '').toLowerCase(); // Defensive check
    let colorClass = 'text-slate-600';
    switch (lowerSeverity) {
        case 'critical': colorClass = 'text-rose-600 font-bold'; break;
        case 'high': colorClass = 'text-orange-600 font-semibold'; break;
        case 'medium': colorClass = 'text-orange-600 font-medium'; break;
        case 'low': colorClass = 'text-blue-600'; break;
    }
    return <span className={colorClass}>{severity || 'N/A'}</span>;
}

// Enhanced Attachment Display Component
const AttachmentCard = ({ attachment, size = "md" }) => {
    const isImage = attachment.file_type?.startsWith("image/");
    const isVideo = attachment.file_type?.startsWith("video/");
    const isPdf = attachment.file_type?.includes("pdf");
    const isArchive = attachment.file_type?.includes("zip") || attachment.file_type?.includes("rar");
    
    const getFileIcon = () => {
        if (isImage) return <ImageIcon size={size === "sm" ? 16 : 20} className="text-blue-500" />;
        if (isVideo) return <Video size={size === "sm" ? 16 : 20} className="text-violet-500" />;
        if (isPdf) return <FileText size={size === "sm" ? 16 : 20} className="text-rose-500" />;
        if (isArchive) return <FileArchive size={size === "sm" ? 16 : 20} className="text-orange-500" />;
        return <File size={size === "sm" ? 16 : 20} className="text-slate-500" />;
    };

    const getFileTypeColor = () => {
        if (isImage) return "from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300";
        if (isVideo) return "from-violet-50 to-violet-100 border-violet-200 hover:border-violet-300";
        if (isPdf) return "from-rose-50 to-rose-100 border-rose-200 hover:border-rose-300";
        if (isArchive) return "from-orange-50 to-orange-100 border-orange-200 hover:border-orange-300";
        return "from-slate-50 to-slate-100 border-slate-200 hover:border-slate-300";
    };

    return (
        <a 
            href={attachment.file_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`block bg-gradient-to-br ${getFileTypeColor()} p-4 rounded-xl border transition-all duration-200 hover:shadow-md group`}
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow">
                    {getFileIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-slate-900 truncate ${size === "sm" ? "text-sm" : ""}`}>
                        {attachment.file_name}
                    </p>
                    <p className={`text-slate-600 ${size === "sm" ? "text-xs" : "text-sm"}`}>
                        {attachment.file_type?.split('/')[1]?.toUpperCase() || 'File'}
                    </p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye size={16} className="text-slate-500" />
                    <Download size={16} className="text-slate-500" />
                </div>
            </div>
        </a>
    );
};

// --- Page-Specific Components ---

const ReplyForm = ({ reportId, onMessageSent }) => {
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        try {
            const uploadedAttachments = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                const result = await uploadAttachment(formData);
                if (result.success) {
                    uploadedAttachments.push({ url: result.url, name: result.name, type: result.type });
                }
            }
            await sendReportMessage(reportId, { content, attachments: uploadedAttachments });
            setContent("");
            setFiles([]);
            onMessageSent();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-slate-50 p-4 rounded-b-2xl border-t border-slate-200">
             {error && <div className="mb-3 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    className="block w-full px-3 py-2 bg-white rounded-lg border border-slate-300 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    rows="4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your formal reply..."
                    required
                ></textarea>
                
                {/* Enhanced file upload section */}
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <input
                            type="file"
                            id="reply-attachment"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <label 
                            htmlFor="reply-attachment" 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                            <Paperclip size={16} className="text-slate-500" />
                            <span className="text-sm font-medium text-slate-700">Attach Files</span>
                        </label>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isSubmitting ? <LoaderCircle size={18} className="animate-spin" /> : <Send size={18} />}
                        {isSubmitting ? "Sending..." : "Send Reply"}
                    </button>
                </div>

                {/* Selected files display */}
                {files.length > 0 && (
                    <div className="bg-white border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Paperclip size={14} className="text-blue-500" />
                            <span className="text-sm font-medium text-slate-900">{files.length} file(s) selected:</span>
                        </div>
                        <div className="space-y-2">
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                                    <span className="text-sm text-slate-700 truncate">{file.name}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => removeFile(index)} 
                                        className="text-slate-400 hover:text-rose-500 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};


const ReportDetailPage = () => {
    const { reportId } = useParams();
    const [report, setReport] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchData = useCallback(async () => {
        if (!reportId) return;
        try {
            const [reportResult, profileResult, messagesResult] = await Promise.all([
                getReportById(reportId),
                getProfile(),
                getReportMessages(reportId),
            ]);

            if (reportResult.success) {
                setReport(reportResult.data);
                setSelectedStatus(reportResult.data.status);
            }
            if (profileResult.success) setUserProfile(profileResult.data);
            if (messagesResult.success) setMessages(messagesResult.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [reportId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleStatusUpdate = async () => {
        setIsUpdating(true);
        setError("");
        try {
            const result = await updateReportStatus(report.id, selectedStatus);
            if (result.success) {
                setReport(result.data);
            } else {
                throw new Error(result.message || "Status update failed.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const canTriage = userProfile?.role === "organization";
    const isReporter = userProfile?.id === report?.reporter_id;

    if (loading) return <div className="text-center text-slate-500">Loading report details...</div>;
    if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>;
    if (!report) return <div className="text-center text-slate-500">Report not found.</div>;

    return (
        <div className="space-y-6">
            <Link to={canTriage ? "/manage-reports" : "/my-reports"} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-violet-500 hover:underline transition-colors">
                <ArrowLeft size={16} />
                Back to all reports
            </Link>
            
            <div>
                <h1 className="text-3xl font-bold text-slate-900">{report.title}</h1>
                <p className="text-slate-500">Reported to: <span className="font-semibold">{report.program_name}</span></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                     {/* Original Report Details */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Original Report</h3>
                            <div className="prose prose-sm max-w-none text-slate-600 space-y-4">
                                <div><strong>Description:</strong><p className="mt-1">{report.description}</p></div>
                                <div><strong>Steps to Reproduce:</strong><p className="mt-1 whitespace-pre-wrap font-mono bg-slate-50 p-2 rounded-md">{report.steps_to_reproduce}</p></div>
                                <div><strong>Impact:</strong><p className="mt-1">{report.impact}</p></div>
                            </div>
                        </div>
                        
                        {/* Enhanced Attachments Section */}
                        {report.attachments?.length > 0 && (
                            <div className="border-t border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-500 rounded-lg">
                                        <Paperclip size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">Report Attachments</h4>
                                        <p className="text-sm text-slate-600">{report.attachments.length} file(s) attached to this report</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {report.attachments.map(att => (
                                        <AttachmentCard key={att.id} attachment={att} size="md" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Communication Log */}
                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                        <div className="p-6 border-b border-slate-200">
                             <h3 className="text-lg font-semibold text-slate-900">Communication Log</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {messages.length > 0 ? messages.map(msg => (
                                <div key={msg.id} className="flex gap-4">
                                     <img src={msg.sender_avatar_url || `https://placehold.co/40x40/E2E8F0/475569?text=${(msg.sender_username || '?').charAt(0)}`} alt="avatar" className="w-10 h-10 rounded-full" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline">
                                            <p className="font-semibold text-slate-900">{msg.sender_username || 'Unknown User'}</p>
                                            <p className="text-xs text-slate-500">{new Date(msg.created_at).toLocaleString()}</p>
                                        </div>
                                        <div className="prose prose-sm max-w-none text-slate-600 mt-1"><p>{msg.content}</p></div>
                                        
                                        {/* Enhanced attachment display for messages */}
                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className="mt-4 bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-lg border border-slate-200">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Paperclip size={14} className="text-blue-500" />
                                                    <span className="text-sm font-medium text-slate-900">
                                                        {msg.attachments.length} attachment(s):
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {msg.attachments.map(att => (
                                                        <AttachmentCard key={att.id} attachment={att} size="sm" />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )) : <p className="text-sm text-slate-500 text-center py-4">No replies yet.</p>}
                        </div>
                        {(canTriage || isReporter) && <ReplyForm reportId={report.id} onMessageSent={fetchData} />}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                        <div className="flex items-center gap-3">
                            <Tag size={16} className="text-slate-500" />
                            <span className="text-sm font-medium text-slate-500">Status:</span>
                            <StatusBadge status={report.status} />
                        </div>
                         <div className="flex items-center gap-3">
                            <span className="w-4 h-4 text-slate-500">🚨</span>
                            <span className="text-sm font-medium text-slate-500">Severity:</span>
                            <SeverityIndicator severity={report.severity} />
                        </div>
                         <div className="flex items-center gap-3">
                            <User size={16} className="text-slate-500" />
                            <span className="text-sm font-medium text-slate-500">Reporter:</span>
                            <span className="font-semibold text-slate-900">{report.reporter_username}</span>
                        </div>
                         <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-slate-500" />
                            <span className="text-sm font-medium text-slate-500">Reported on:</span>
                            <span className="font-semibold text-slate-900">{new Date(report.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {canTriage && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                             <h3 className="text-lg font-semibold text-slate-900 mb-4">Triage Actions</h3>
                             <div className="space-y-3">
                                <select 
                                    className="block w-full px-3 py-2 bg-white rounded-lg border border-slate-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option>New</option><option>Triaging</option><option>Accepted</option>
                                    <option>Resolved</option><option>Duplicate</option><option>Invalid</option>
                                </select>
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={isUpdating}
                                    className="w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                                >
                                    {isUpdating ? <LoaderCircle size={18} className="animate-spin"/> : <Check size={18}/>}
                                    Update Status
                                </button>
                             </div>
                        </div>
                    )}
                    
                    {isReporter && (
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                             <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Actions</h3>
                              <Link 
                                to={`/programs/${report.program_id}/submit`}
                                className="w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                            >
                               <PlusCircle size={18} />
                                Submit Another Report
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ReportDetailPage;

