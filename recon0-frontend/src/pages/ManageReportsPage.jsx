import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrgReports } from '/src/lib/apiService.js';
import { ChevronRight, Inbox, Search } from 'lucide-react';

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

const ManageReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // Dummy state for search

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const result = await getOrgReports();
                if (result.success) {
                    setReports(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch reports.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) return <div className="text-center text-slate-500">Loading incoming reports...</div>;
    if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                 <h1 className="text-3xl font-bold text-slate-800">Manage Reports</h1>
                 <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search by title or reporter..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                 </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {reports.length === 0 ? (
                    <div className="text-center py-16 px-6">
                        <Inbox size={48} className="mx-auto text-slate-300" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-800">Inbox Zero</h3>
                        <p className="mt-1 text-sm text-slate-500">No reports have been submitted to your programs yet.</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-1/3">Report</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Program</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reporter</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Severity</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {reports.map(report => (
                                <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 w-1/3">
                                        <Link to={`/reports/${report.id}`} className="text-sm font-medium text-slate-800 group-hover:text-blue-600 line-clamp-2">{report.title}</Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{report.program_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{report.reporter_username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <SeverityIndicator severity={report.severity} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <StatusBadge status={report.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {new Date(report.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/reports/${report.id}`} className="text-blue-600 hover:text-blue-800">
                                            <ChevronRight size={20} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageReportsPage;