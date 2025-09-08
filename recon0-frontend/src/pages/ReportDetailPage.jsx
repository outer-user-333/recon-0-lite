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
    ArrowLeft, Send, Paperclip, Download, User, Calendar, Tag, Check, LoaderCircle, Image as ImageIcon, File, PlusCircle 
} from "lucide-react";

// --- Reusable UI Components from other pages for consistency ---

const StatusBadge = ({ status }) => {
    const lowerStatus = status.toLowerCase();
    let colorClasses = 'bg-slate-100 text-slate-800';
    switch (lowerStatus) {
        case 'accepted': case 'resolved': colorClasses = 'bg-emerald-100 text-emerald-800'; break;
        case 'triaging': colorClasses = 'bg-amber-100 text-amber-800'; break;
        case 'new': colorClasses = 'bg-blue-100 text-blue-800'; break;
        case 'closed': case 'duplicate': case 'invalid': colorClasses = 'bg-rose-100 text-rose-800'; break;
    }
    return <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colorClasses}`}>{status}</span>;
};

const SeverityIndicator = ({ severity }) => {
    const lowerSeverity = severity.toLowerCase();
    let colorClass = 'text-slate-600';
    switch (lowerSeverity) {
        case 'critical': colorClass = 'text-rose-600 font-bold'; break;
        case 'high': colorClass = 'text-orange-600 font-semibold'; break;
        case 'medium': colorClass = 'text-amber-600 font-medium'; break;
        case 'low': colorClass = 'text-blue-600'; break;
    }
    return <span className={colorClass}>{severity}</span>;
}

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

    return (
        <div className="bg-slate-50 p-4 rounded-b-2xl border-t border-slate-200">
             {error && <div className="mb-3 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}
            <form onSubmit={handleSubmit}>
                <textarea
                    className="block w-full px-3 py-2 bg-white rounded-lg border border-slate-300 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    rows="4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your formal reply..."
                    required
                ></textarea>
                <div className="flex justify-between items-center mt-3">
                    <input
                        type="file"
                        id="reply-attachment"
                        multiple
                        className="hidden"
                        onChange={(e) => setFiles([...e.target.files])}
                    />
                     <label htmlFor="reply-attachment" className="cursor-pointer text-slate-500 hover:text-blue-600">
                        <Paperclip size={20} />
                    </label>
                    <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 transition-opacity disabled:opacity-50">
                        {isSubmitting ? <LoaderCircle size={18} className="animate-spin" /> : <Send size={18} />}
                        {isSubmitting ? "Sending..." : "Send Reply"}
                    </button>
                </div>
                 {files.length > 0 && <div className="text-xs text-slate-500 mt-2">{files.length} file(s) selected.</div>}
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

    // FIX: Wrapped fetchData in useCallback to satisfy exhaustive-deps lint rule.
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
                setSelectedStatus(reportResult.data.status); // Initialize dropdown
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
    }, [fetchData]); // FIX: Added fetchData to the dependency array.

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
            <Link to={canTriage ? "/manage-reports" : "/my-reports"} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
                <ArrowLeft size={16} />
                Back to all reports
            </Link>
            
            <div>
                <h1 className="text-3xl font-bold text-slate-800">{report.title}</h1>
                <p className="text-slate-500">Reported to: <span className="font-semibold">{report.program_name}</span></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                     {/* Original Report Details */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Original Report</h3>
                            <div className="prose prose-sm max-w-none text-slate-600 space-y-4">
                                <div><strong>Description:</strong><p className="mt-1">{report.description}</p></div>
                                <div><strong>Steps to Reproduce:</strong><p className="mt-1 whitespace-pre-wrap font-mono bg-slate-50 p-2 rounded-md">{report.steps_to_reproduce}</p></div>
                                <div><strong>Impact:</strong><p className="mt-1">{report.impact}</p></div>
                            </div>
                        </div>
                        {report.attachments?.length > 0 && (
                            <div className="border-t border-slate-200 p-6">
                                <h4 className="text-sm font-semibold text-slate-700 mb-3">Attachments</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {report.attachments.map(att => (
                                        <a key={att.id} href={att.file_url} target="_blank" rel="noopener noreferrer" className="bg-slate-50 p-3 rounded-lg hover:bg-slate-100 transition-colors text-sm flex items-center gap-2">
                                            {att.file_type.startsWith("image/") ? <ImageIcon size={20} className="text-slate-500"/> : <File size={20} className="text-slate-500"/>}
                                            <span className="truncate text-slate-700 font-medium">{att.file_name}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Communication Log */}
                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                        <div className="p-6 border-b border-slate-200">
                             <h3 className="text-lg font-semibold text-slate-800">Communication Log</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {messages.length > 0 ? messages.map(msg => (
                                <div key={msg.id} className="flex gap-4">
                                     <img src={msg.sender_avatar_url || `https://placehold.co/40x40/E2E8F0/475569?text=${msg.sender_username.charAt(0)}`} alt="avatar" className="w-10 h-10 rounded-full" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline">
                                            <p className="font-semibold text-slate-800">{msg.sender_username}</p>
                                            <p className="text-xs text-slate-400">{new Date(msg.created_at).toLocaleString()}</p>
                                        </div>
                                        <div className="prose prose-sm max-w-none text-slate-600 mt-1"><p>{msg.content}</p></div>
                                    </div>
                                </div>
                            )) : <p className="text-sm text-slate-500 text-center py-4">No replies yet.</p>}
                        </div>
                        {canTriage && <ReplyForm reportId={report.id} onMessageSent={fetchData} />}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                        <div className="flex items-center gap-3">
                            <Tag size={16} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-500">Status:</span>
                            <StatusBadge status={report.status} />
                        </div>
                         <div className="flex items-center gap-3">
                            <span className="w-4 h-4 text-slate-400">🚨</span>
                            <span className="text-sm font-medium text-slate-500">Severity:</span>
                            <SeverityIndicator severity={report.severity} />
                        </div>
                         <div className="flex items-center gap-3">
                            <User size={16} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-500">Reporter:</span>
                            <span className="font-semibold text-slate-800">{report.reporter_username}</span>
                        </div>
                         <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-500">Reported on:</span>
                            <span className="font-semibold text-slate-800">{new Date(report.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {canTriage && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                             <h3 className="text-lg font-semibold text-slate-800 mb-4">Triage Actions</h3>
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
                                    className="w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                                >
                                    {isUpdating ? <LoaderCircle size={18} className="animate-spin"/> : <Check size={18}/>}
                                    Update Status
                                </button>
                             </div>
                        </div>
                    )}
                    
                    {/* FIX: Using the 'isReporter' variable to conditionally render this block */}
                    {isReporter && (
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                             <h3 className="text-lg font-semibold text-slate-800 mb-4">Your Actions</h3>
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


