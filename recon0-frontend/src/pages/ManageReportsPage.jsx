import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ManageReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrgReports = async () => {
      try {
        setLoading(true);
        setError('');
        // This endpoint will fetch all reports for the organization's programs
        const response = await fetch('http://localhost:3001/api/v1/reports/organization');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          setReports(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch organization reports.');
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgReports();
  }, []);

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

  const renderContent = () => {
    if (loading) {
      return <p>Loading reports...</p>;
    }
    if (error) {
      return <div className="alert alert-danger">Error: {error}</div>;
    }
    if (reports.length === 0) {
      return (
        <div className="card shadow-sm">
          <div className="card-body text-center">
            <p className="mb-0">No reports have been submitted to your programs yet.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Report Title</th>
                  <th scope="col">Program</th>
                  <th scope="col">Status</th>
                  <th scope="col">Reporter</th>
                  <th scope="col">Submitted On</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.title}</td>
                    <td>{report.program_name}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>{report.reporter_username}</td>
                    <td>{new Date(report.created_at).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/reports/${report.id}`} className="btn btn-outline-primary btn-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Manage Reports</h2>
      <p className="text-muted mb-4">Review, triage, and respond to submitted vulnerabilities.</p>
      {renderContent()}
    </div>
  );
};

export default ManageReportsPage;

