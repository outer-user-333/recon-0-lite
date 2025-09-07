import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getReportById,
  getProfile,
  updateReportStatus,
  getReportMessages,
  sendReportMessage,
  uploadAttachment,
} from "../lib/apiService";

// A new component for the reply form
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
      // Step 1: Upload attachments
      const uploadedAttachments = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadAttachment(formData);
        if (result.success) {
          uploadedAttachments.push({
            url: result.url,
            name: result.name,
            type: result.type,
          });
        }
      }

      // Step 2: Send the message content with attachment URLs
      const messageData = { content, attachments: uploadedAttachments };
      await sendReportMessage(reportId, messageData);

      // Clear form and notify parent component
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
    <div className="card mt-4">
      <div className="card-header">
        <h5>Send Reply</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your formal reply..."
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Attach Files</label>
            <input
              type="file"
              className="form-control"
              multiple
              onChange={(e) => setFiles([...e.target.files])}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reply"}
          </button>
        </form>
      </div>
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

  const fetchData = async () => {
    if (!reportId) return;
    // Reset loading state for refetches
    setLoading(true);
    try {
      const [reportResult, profileResult, messagesResult] = await Promise.all([
        getReportById(reportId),
        getProfile(),
        getReportMessages(reportId),
      ]);

      if (reportResult.success) setReport(reportResult.data);
      if (profileResult.success) setUserProfile(profileResult.data);
      if (messagesResult.success) setMessages(messagesResult.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      // Reset loading state for refetches
      setLoading(true);
      try {
        const [reportResult, profileResult, messagesResult] = await Promise.all(
          [getReportById(reportId), getProfile(), getReportMessages(reportId)]
        );

        if (reportResult.success) setReport(reportResult.data);
        if (profileResult.success) setUserProfile(profileResult.data);
        if (messagesResult.success) setMessages(messagesResult.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reportId]); // The only dependency is reportId, which is correct.

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    setError("");
    try {
      const result = await updateReportStatus(report.id, selectedStatus);
      if (result.success) {
        setReport(result.data); // Update UI with the new report data
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const canTriage = userProfile?.role === "organization";
  const getSeverityClass = (s) =>
    ({ critical: "text-danger", high: "text-warning" }[s?.toLowerCase()] ||
    "text-primary");
  const getStatusBadge = (s) =>
    ({
      accepted: "bg-success",
      triaging: "bg-warning text-dark",
      new: "bg-primary",
    }[s?.toLowerCase()] || "bg-secondary");

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

      {/* === ORIGINAL REPORT DETAILS & ATTACHMENTS === */}
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
      <div className="card mt-4 shadow-sm">
        <div className="card-header">
          <h5>Impact</h5>
        </div>
        <div className="card-body">
          <p style={{ whiteSpace: "pre-wrap" }}>{report.impact}</p>
        </div>
      </div>

      {/* This section will show the attachments submitted by the HACKER */}
      <div className="card mt-4 shadow-sm">
        <div className="card-header">
          <h5>Original Attachments</h5>
        </div>
        <div className="card-body">
          {/* Note: This assumes attachments are fetched with the report. We will add this logic. */}
          {report.attachments && report.attachments.length > 0 ? (
            <ul className="list-group">
              {report.attachments.map((att) => (
                <li
                  key={att.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
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

      {/* === NEW MESSAGING/REPLY SECTION === */}
      <div className="mt-4">
        <h4 className="mb-3">Communication Log</h4>
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className="card mb-3">
              <div className="card-header d-flex justify-content-between">
                <strong>Reply from Organization</strong>
                <small className="text-muted">
                  {new Date(message.created_at).toLocaleString()}
                </small>
              </div>
              <div className="card-body">
                <p style={{ whiteSpace: "pre-wrap" }}>{message.content}</p>
                {message.attachments && message.attachments.length > 0 && (
                  <div>
                    <hr />
                    <strong>Attachments:</strong>
                    <ul className="list-unstyled mt-2">
                      {message.attachments.map((att) => (
                        <li key={att.id}>
                          <a
                            href={att.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fas fa-paperclip me-2"></i>
                            {att.file_name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">
            No replies have been sent for this report yet.
          </p>
        )}
      </div>

      {/* The Reply Form is only visible to the organization */}
      {canTriage && (
        <ReplyForm reportId={report.id} onMessageSent={fetchData} />
      )}

      {/* --- NEW: "Submit New Report" button for the hacker who owns the report --- */}
      {userProfile?.id === report.reporter_id && (
        <div className="text-center mt-4">
          <Link
            to={`/programs/${report.program_id}/submit`}
            className="btn btn-outline-primary"
          >
            <i className="fas fa-plus me-2"></i>Submit a new, related report
          </Link>
        </div>
      )}

      {/* {canTriage && (
        <ReplyForm reportId={report.id} onMessageSent={fetchData} />
      )} */}
    </div>
  );
};

export default ReportDetailPage;
