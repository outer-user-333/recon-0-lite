import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getReportById,
  getProfile,
  updateReportStatus,
  getReportAttachments
} from "../lib/apiService";

const ReportDetailPage = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      try {
        // Fetch report, profile, and attachments all at once
        const [reportResult, profileResult, attachmentsResult] =
          await Promise.all([
            getReportById(reportId),
            getProfile(),
            getReportAttachments(reportId),
          ]);

        if (reportResult.success) {
          setReport(reportResult.data);
          setSelectedStatus(reportResult.data.status);
        }
        if (profileResult.success) {
          setUserProfile(profileResult.data);
        }
        if (attachmentsResult.success) {
          setAttachments(attachmentsResult.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reportId]);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    setError("");
    try {
      const result = await updateReportStatus(report.id, selectedStatus);
      if (result.success) {
        setReport(result.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const canTriage = userProfile?.role === "organization";

  const getSeverityClass = (severity) => {
    const lowerSeverity = severity?.toLowerCase();
    if (lowerSeverity === "critical") return "text-danger";
    if (lowerSeverity === "high") return "text-warning";
    return "text-primary";
  };

  const getStatusBadge = (status) => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus === "accepted") return "bg-success";
    if (lowerStatus === "triaging") return "bg-warning text-dark";
    if (lowerStatus === "new") return "bg-primary";
    return "bg-secondary";
  };

  if (loading) return <div>Loading report details...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!report) return <div>Report not found.</div>;

  return (
    <div>
      <h2 className="mb-1">{report.title}</h2>
      <p className="text-muted">Reported to: {report.program_name}</p>
      <hr />
      <div className="row mb-4">
        <div className="col-md-3">
          <strong>Status:</strong>
          <p>
            <span className={`badge ${getStatusBadge(report.status)}`}>
              {report.status}
            </span>
          </p>
        </div>
        <div className="col-md-3">
          <strong>Severity:</strong>
          <p className={`fw-bold ${getSeverityClass(report.severity)}`}>
            {report.severity}
          </p>
        </div>
      </div>

      {canTriage && (
        <div className="card bg-light border-secondary mb-4">
          <div className="card-body">
            <h5 className="card-title">Triage Actions</h5>
            <div className="input-group">
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="New">New</option>
                <option value="Triaging">Triaging</option>
                <option value="Accepted">Accepted</option>
                <option value="Resolved">Resolved</option>
                <option value="Duplicate">Duplicate</option>
                <option value="Invalid">Invalid</option>
              </select>
              <button
                className="btn btn-primary"
                onClick={handleStatusUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card mt-4 shadow-sm">
        <div className="card-header">
          <h5>Vulnerability Description</h5>
        </div>
        <div className="card-body">
          <p style={{ whiteSpace: "pre-wrap" }}>{report.description}</p>
        </div>
      </div>
      <div className="card mt-4 shadow-sm">
        <div className="card-header">
          <h5>Steps to Reproduce</h5>
        </div>
        <div className="card-body">
          <p style={{ whiteSpace: "pre-wrap" }}>{report.steps_to_reproduce}</p>
        </div>
      </div>
      {/* === NEW ATTACHMENTS SECTION === */}
      <div className="card mt-4 shadow-sm">
        <div className="card-header">
          <h5>Attachments</h5>
        </div>
        <div className="card-body">
          {attachments.length > 0 ? (
            <ul className="list-group">
              {attachments.map((att) => (
                <li
                  key={att.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {/* Display a small image preview if it's an image */}
                  {att.file_type.startsWith("image/") && (
                    <img
                      src={att.file_url}
                      alt={att.file_name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        marginRight: "15px",
                      }}
                    />
                  )}
                  <span className="flex-grow-1">{att.file_name}</span>
                  <a
                    href={att.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    View / Download
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">
              No attachments were submitted with this report.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;
