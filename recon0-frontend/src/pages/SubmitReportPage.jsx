import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { supabase } from '../lib/supabaseChatClient';

// A list of common vulnerability types for the dropdown
const VULNERABILITY_TYPES = [
  "Cross-Site Scripting (XSS)",
  "SQL Injection (SQLi)",
  "Cross-Site Request Forgery (CSRF)",
  "Insecure Direct Object References (IDOR)",
  "Authentication Bypass",
  "Sensitive Data Exposure",
  "Security Misconfiguration",
  "Command Injection",
  "File Inclusion",
  "Other"
];

const SubmitReportPage = () => {
  const { programId } = useParams();
  const navigate = useNavigate();

  // State for the form fields
  const [title, setTitle] = useState('');
  const [vulnerabilityType, setVulnerabilityType] = useState(VULNERABILITY_TYPES[0]);
  const [severity, setSeverity] = useState('medium');
  const [description, setDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [impact, setImpact] = useState('');
  const [proofOfConcept, setProofOfConcept] = useState('');

  // State for loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [programName, setProgramName] = useState('');

  // Fetch program name on component mount (for display)
  useEffect(() => {
    const fetchProgramName = async () => {
      // In a real app, you'd fetch this from your API.
      // For now, we'll use a placeholder.
      // In a later step, we will connect this to the mock API.
      setProgramName("Web Application Pentest"); // Placeholder
    };
    fetchProgramName();
  }, [programId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Construct the report object based on our API design
    const reportData = {
      program_id: programId, // This is a placeholder ID
      title,
      vulnerability_type: vulnerabilityType,
      severity,
      description,
      steps_to_reproduce: stepsToReproduce,
      impact,
      proof_of_concept: proofOfConcept,
    };

    try {
      // Send the report to our mock API
      const response = await fetch('http://localhost:3001/api/v1/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // In the future, we'll add the Supabase Auth token here
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report. Please try again.');
      }

      // On success, navigate to the "My Reports" page
      navigate('/my-reports');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg">
            <div className="card-body p-5">
              <h2 className="card-title mb-2">Submit a Report</h2>
              <p className="card-subtitle mb-4 text-muted">
                You are submitting a report for the program: <strong>{programName}</strong>
              </p>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                {/* Report Title */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Report Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Stored XSS in user profile"
                    required
                  />
                </div>

                <div className="row">
                  {/* Vulnerability Type */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="vulnerabilityType" className="form-label">Vulnerability Type</label>
                    <select
                      className="form-select"
                      id="vulnerabilityType"
                      value={vulnerabilityType}
                      onChange={(e) => setVulnerabilityType(e.target.value)}
                    >
                      {VULNERABILITY_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  {/* Severity */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="severity" className="form-label">Severity</label>
                    <select
                      className="form-select"
                      id="severity"
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed explanation of the vulnerability."
                    required
                  ></textarea>
                </div>

                {/* Steps to Reproduce */}
                <div className="mb-3">
                  <label htmlFor="stepsToReproduce" className="form-label">Steps to Reproduce</label>
                  <textarea
                    className="form-control"
                    id="stepsToReproduce"
                    rows="5"
                    value={stepsToReproduce}
                    onChange={(e) => setStepsToReproduce(e.target.value)}
                    placeholder="1. Go to...\n2. Click on...\n3. Observe the vulnerability..."
                    required
                  ></textarea>
                </div>
                
                {/* Impact */}
                <div className="mb-3">
                  <label htmlFor="impact" className="form-label">Impact</label>
                  <textarea
                    className="form-control"
                    id="impact"
                    rows="3"
                    value={impact}
                    onChange={(e) => setImpact(e.target.value)}
                    placeholder="Describe the potential business or security impact of this vulnerability."
                    required
                  ></textarea>
                </div>
                
                {/* Proof of Concept */}
                <div className="mb-4">
                  <label htmlFor="proofOfConcept" className="form-label">Proof of Concept</label>
                  <textarea
                    className="form-control"
                    id="proofOfConcept"
                    rows="4"
                    value={proofOfConcept}
                    onChange={(e) => setProofOfConcept(e.target.value)}
                    placeholder="Provide code snippets, screenshots (as text descriptions), or any other proof."
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitReportPage;
