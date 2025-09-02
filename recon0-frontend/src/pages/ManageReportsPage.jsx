import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// We can re-use the StatusBadge component from MyReportsPage
const StatusBadge = ({ status }) => {
  const statusClasses = {
    'Accepted': 'bg-success',
    'Resolved': 'bg-primary',
    'Triaged': 'bg-info text-dark',
    'New': 'bg-secondary',
  };
  const badgeClass = statusClasses[status] || 'bg-secondary';
  return <span className={`badge ${badgeClass}`}>{status}</span>;
};

export default function ManageReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/org-reports')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setReports(data);
        setLoading(false);
      })
      // eslint-disable-next-line no-unused-vars
      .catch(error => {
        setError("Could not load reports for your organization.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <div className="mb-4">
        <h1 className="display-5 fw-bolder">Manage Reports</h1>
        <p className="text-muted">Review, triage, and respond to submitted vulnerabilities.</p>
      </div>

      <div className="card text-white">
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0">
            <thead>
              <tr>
                <th scope="col">Report Title</th>
                <th scope="col">Program</th>
                <th scope="col">Status</th>
                <th scope="col">Submitted On</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td>{report.title}</td>
                  <td>{report.programTitle}</td>
                  <td><StatusBadge status={report.status} /></td>
                  <td>{new Date(report.submittedAt).toLocaleDateString()}</td>
                  <td>
                    {/* In a real app, these would link to a report detail page */}
                    <button className="btn btn-sm btn-secondary">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}