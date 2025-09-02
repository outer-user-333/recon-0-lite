import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Helper function to format the status with a Bootstrap badge
const StatusBadge = ({ status }) => {
  const statusClasses = {
    'Accepted': 'bg-success',
    'Resolved': 'bg-primary',
    'Triaged': 'bg-info',
    'New': 'bg-secondary',
  };
  const badgeClass = statusClasses[status] || 'bg-secondary';
  return <span className={`badge ${badgeClass}`}>{status}</span>;
};

export default function MyReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/my-reports')
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
        setError("Could not load your reports.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading your reports...</p>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
            <h1 className="display-5 fw-bolder">My Reports</h1>
            <p className="text-muted">A list of all the vulnerabilities you have submitted.</p>
        </div>
      </div>

      <div className="card text-white">
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Program</th>
                <th scope="col">Status</th>
                <th scope="col">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td>{report.title}</td>
                  <td>{report.programOrganization}</td>
                  <td><StatusBadge status={report.status} /></td>
                  <td>{new Date(report.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}