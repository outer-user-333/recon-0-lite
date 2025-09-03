import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ReportDetailPage = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`http://localhost:3001/api/v1/reports/${reportId}`);
        if (!response.ok) {
          throw new Error('Could not find the specified report.');
        }
        const data = await response.json();
        setReport(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [reportId]);

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-danger';
      case 'high':
        return 'bg-warning text-dark';
      case 'medium':
        return 'bg-info text-dark';
      case 'low':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };
  
    const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'bg-success';
      case 'resolved':
        return 'bg-primary';
      case 'triaging':
        return 'bg-warning text-dark';
      case 'new':
        return 'bg-info text-dark';
      case 'duplicate':
      case 'invalid':
        return 'bg-secondary';
      default:
        return 'bg-light text-dark';
    }
  };


  if (loading) return <div className="container mt-5"><p>Loading report details...</p></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;
  if (!report) return <div className="container mt-5"><p>No report data found.</p></div>;

  return (
    <div className="container mt-5">
       <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Report Details</h2>
          <Link to="/my-reports" className="btn btn-outline-secondary">
            &larr; Back to My Reports
          </Link>
        </div>

      <div className="row">
        {/* Main Report Content */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">{report.title}</h4>
            </div>
            <div className="card-body p-4">
              <div className="mb-4">
                <h5>Severity</h5>
                <p><span className={`badge ${getSeverityBadge(report.severity)}`}>{report.severity}</span></p>
              </div>
              <div className="mb-4">
                <h5>Description</h5>
                <p style={{ whiteSpace: 'pre-wrap' }}>{report.description}</p>
              </div>
              <div className="mb-4">
                <h5>Steps to Reproduce</h5>
                <p style={{ whiteSpace: 'pre-wrap' }}>{report.steps_to_reproduce}</p>
              </div>
              <div>
                <h5>Impact</h5>
                <p style={{ whiteSpace: 'pre-wrap' }}>{report.impact}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h5>Report Info</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  <strong>Status</strong>
                  <span className={`badge ${getStatusBadge(report.status)}`}>{report.status}</span>
                </li>
                 <li className="list-group-item d-flex justify-content-between">
                  <strong>Program</strong>
                  <span>{report.program_name}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <strong>Report ID</strong>
                  <span className="font-monospace">{report.id}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <strong>Submitted</strong>
                  <span>{new Date(report.created_at).toLocaleString()}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;
