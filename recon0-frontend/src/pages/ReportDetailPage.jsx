import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getReportById } from '../lib/apiService';

const ReportDetailPage = () => {
    const { reportId } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            if (!reportId) return;
            try {
                const result = await getReportById(reportId);
                if (result.success) {
                    setReport(result.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [reportId]);

    const getSeverityClass = (severity) => {
        const lowerSeverity = severity?.toLowerCase();
        if (lowerSeverity === 'critical') return 'text-danger';
        if (lowerSeverity === 'high') return 'text-warning';
        if (lowerSeverity === 'medium') return 'text-primary';
        return 'text-info';
    };

    if (loading) return <div>Loading report details...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!report) return <div>Report not found.</div>;

    return (
        <div>
            <h2 className="mb-1">{report.title}</h2>
            <p className="text-muted">Reported to: {report.program_name}</p>
            <hr />
            <div className="row">
                <div className="col-md-3">
                    <strong>Status:</strong>
                    <p>{report.status}</p>
                </div>
                <div className="col-md-3">
                    <strong>Severity:</strong>
                    <p className={getSeverityClass(report.severity)}>{report.severity}</p>
                </div>
            </div>

            {/* In a real app, these sections would be more detailed */}
           <>
    <div className="card mt-4 shadow-sm">
        <div className="card-header">
            <h5>Vulnerability Description</h5>
        </div>
        <div className="card-body">
            <p style={{ whiteSpace: 'pre-wrap' }}>{report.description}</p>
        </div>
    </div>

    <div className="card mt-4 shadow-sm">
        <div className="card-header">
            <h5>Steps to Reproduce</h5>
        </div>
        <div className="card-body">
            <p style={{ whiteSpace: 'pre-wrap' }}>{report.steps_to_reproduce}</p>
        </div>
    </div>

    <div className="card mt-4 shadow-sm">
        <div className="card-header">
            <h5>Impact</h5>
        </div>
        <div className="card-body">
            <p style={{ whiteSpace: 'pre-wrap' }}>{report.impact}</p>
        </div>
    </div>
</>
        </div>
    );
};

export default ReportDetailPage;