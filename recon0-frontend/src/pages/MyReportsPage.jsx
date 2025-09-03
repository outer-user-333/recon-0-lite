import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        setLoading(true);
        setError('');
        // We will assume the API knows who the current user is
        const response = await fetch('http://localhost:3001/api/v1/reports/my-reports');
        if (!response.ok) {
          throw new Error('Failed to fetch your reports.');
        }
        const data = await response.json();
        setReports(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyReports();
  }, []);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
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

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Reports</h2>
      <p className="text-muted mb-4">A list of all the vulnerabilities you have submitted.</p>

      {loading && <p>Loading your reports...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Program</th>
                    <th scope="col">Status</th>
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
                      <td>{new Date(report.created_at).toLocaleDateString()}</td>
                      <td>
                        {/* This link will eventually go to the report detail page */}
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
      )}
    </div>
  );
};

export default MyReportsPage;
