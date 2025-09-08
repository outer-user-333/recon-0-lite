import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyReports } from '../lib/apiService.js';
import { ChevronRight, FileText } from 'lucide-react';

// A dedicated component for rendering the status badge with appropriate colors
const StatusBadge = ({ status }) => {
    const lowerStatus = status.toLowerCase();
    let colorClasses = 'bg-slate-100 text-slate-800'; // Default

    switch (lowerStatus) {
        case 'accepted':
            colorClasses = 'bg-emerald-100 text-emerald-800';
            break;
        case 'triaging':
            colorClasses = 'bg-amber-100 text-amber-800';
            break;
        case 'new':
            colorClasses = 'bg-blue-100 text-blue-800';
            break;
        case 'closed':
        case 'duplicate':
        case 'invalid':
            colorClasses = 'bg-rose-100 text-rose-800';
            break;
    }

    return (
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colorClasses}`}>
            {status}
        </span>
    );
};

// A component for rendering severity with appropriate colors
const SeverityIndicator = ({ severity }) => {
    const lowerSeverity = severity.toLowerCase();
    let colorClass = 'text-slate-600';

    switch (lowerSeverity) {
        case 'critical':
            colorClass = 'text-rose-600 font-bold';
            break;
        case 'high':
            colorClass = 'text-orange-600 font-semibold';
            break;
        case 'medium':
            colorClass = 'text-amber-600 font-medium';
            break;
        case 'low':
            colorClass = 'text-blue-600';
            break;
    }
     return <span className={colorClass}>{severity}</span>;
}


const MyReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const result = await getMyReports();
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

    if (loading) return <div className="text-center text-slate-500">Loading your reports...</div>;
    if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">My Reports</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {reports.length === 0 ? (
                    <div className="text-center py-16 px-6">
                        <FileText size={48} className="mx-auto text-slate-300" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-800">No Reports Yet</h3>
                        <p className="mt-1 text-sm text-slate-500">You haven't submitted any reports. Start hunting to see them here!</p>
                        <Link to="/programs" className="mt-4 inline-block font-semibold py-2 px-4 rounded-lg text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 transition-opacity">
                            Find Programs
                        </Link>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Program</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Severity</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {reports.map(report => (
                                <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link to={`/reports/${report.id}`} className="text-sm font-medium text-slate-800 group-hover:text-blue-600">{report.title}</Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{report.program_name}</td>
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

export default MyReportsPage;

