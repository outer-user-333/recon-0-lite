import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// =================================================================
// --- MOCK DATABASE ---
// This section simulates our database for all features.
// =================================================================

let mockPrograms = [
    { id: 'prog-1', organization_name: 'CyberCorp', title: 'Web App Pentest', description: 'Comprehensive penetration test for our main web application.', policy: 'Please provide clear, reproducible steps. No DDoS attacks.', scope: '*.cybercorp.com and its subdomains', out_of_scope: 'staging.cybercorp.com', min_bounty: 500, max_bounty: 5000, tags: ['web', 'pentest', 'critical'] },
    { id: 'prog-2', organization_name: 'SecureNet', title: 'API Security Assessment', description: 'Identify vulnerabilities in our public-facing REST APIs.', policy: 'Responsible disclosure is key.', scope: 'api.securenet.com/v1', out_of_scope: 'Internal APIs', min_bounty: 250, max_bounty: 3000, tags: ['api', 'security', 'auth'] },
];

let mockReports = [
    { id: 'report-1', program_id: 'prog-1', program_name: 'Web App Pentest', reporter_username: 'glitch_hunter', title: 'XSS in Profile Page', severity: 'Medium', status: 'Accepted', created_at: '2025-09-01T10:00:00Z', description: 'A stored Cross-Site Scripting vulnerability exists on the user profile page, allowing an attacker to inject arbitrary scripts.', steps_to_reproduce: '1. Go to your profile page.\n2. In the bio field, enter `<script>alert("XSS")</script>`.\n3. Save the profile.\n4. Visit the public profile page to see the alert.', impact: 'An attacker can steal session cookies or perform actions on behalf of the user.'},
    { id: 'report-2', program_id: 'prog-1', program_name: 'Web App Pentest', reporter_username: 'cyb3r_ninja', title: 'IDOR to view other users\' invoices', severity: 'Critical', status: 'New', created_at: '2025-09-03T14:30:00Z', description: 'An Insecure Direct Object Reference vulnerability allows viewing invoices of any user by changing the ID in the URL.', steps_to_reproduce: '1. Navigate to `/invoices/123`.\n2. Change the ID in the URL to `124`.\n3. The invoice for user 124 is displayed.', impact: 'Sensitive financial information of all users can be exposed.'},
    { id: 'report-3', program_id: 'prog-2', program_name: 'API Security Test', reporter_username: 'pwn_master', title: 'Authentication Bypass via JWT Flaw', severity: 'High', status: 'Triaging', created_at: '2025-09-02T11:00:00Z', description: 'The API does not properly validate the signature of the JWT, allowing for token forgery.', steps_to_reproduce: '1. Capture a valid JWT.\n2. Decode the payload and change the user ID.\n3. Use an online tool to re-sign the token with a `none` algorithm.\n4. Send the forged token to a protected endpoint.', impact: 'Complete account takeover of any user is possible.'},
];

const mockLeaderboard = [
    { rank: 1, hacker: { username: 'cyb5r_ninja' }, reports_resolved: 128, reputation_points: 9850 },
    { rank: 2, hacker: { username: 'glitch_hunter' }, reports_resolved: 118, reputation_points: 9500 },
    { rank: 3, hacker: { username: 'exploit_exp' }, reports_resolved: 95, reputation_points: 8900 },
];

const mockNotifications = [
    { id: 1, type: 'report_update', message: 'Your report #1824 was accepted by SecureCorp.', created_at: '2025/08/09 15:30:00', is_read: false },
    { id: 2, type: 'new_program', message: 'A new program "CloudNet Security" has been launched.', created_at: '2025/08/31 21:00:00', is_read: false },
    { id: 3, type: 'payout', message: 'You have been awarded a $500 bounty for report #1801.', created_at: '2025/08/30 16:30:00', is_read: true },
    { id: 4, type: 'comment', message: 'SecureCorp left a comment on your report #1824.', created_at: '2025/09/01 08:15:00', is_read: false },
];

// =================================================================
// --- API ENDPOINTS ---
// This section contains ALL endpoints for the application.
// =================================================================

// --- Hacker Workflow Endpoints ---
app.get('/api/v1/programs', (req, res) => {
    console.log('SUCCESS: GET /api/v1/programs');
    res.json({ success: true, data: mockPrograms });
});

app.get('/api/v1/reports/my-reports', (req, res) => {
    console.log('SUCCESS: GET /api/v1/reports/my-reports');
    res.json({ success: true, data: mockReports });
});

// --- Organization Workflow Endpoints ---
app.post('/api/v1/programs', (req, res) => {
    const newProgram = { id: `prog-${Date.now()}`, ...req.body };
    mockPrograms.push(newProgram);
    console.log('SUCCESS: POST /api/v1/programs (Program Created)', newProgram);
    res.status(201).json({ success: true, data: newProgram });
});

app.get('/api/v1/reports/organization', (req, res) => {
    console.log('SUCCESS: GET /api/v1/reports/organization');
    res.json({ success: true, data: mockReports });
});

// --- Shared Workflow Endpoints ---
app.get('/api/v1/programs/:id', (req, res) => {
    const program = mockPrograms.find(p => p.id === req.params.id);
    if (program) {
        console.log(`SUCCESS: GET /api/v1/programs/${req.params.id}`);
        res.json({ success: true, data: program });
    } else {
        console.error(`ERROR: GET /api/v1/programs/${req.params.id} - Not Found`);
        res.status(404).json({ success: false, message: 'Program not found' });
    }
});

app.post('/api/v1/reports', (req, res) => {
    const newReport = { id: `report-${Date.now()}`, ...req.body, created_at: new Date().toISOString() };
    mockReports.push(newReport);
    console.log('SUCCESS: POST /api/v1/reports (Report Submitted)', newReport);
    res.status(201).json({ success: true, data: newReport });
});

app.get('/api/v1/reports/:id', (req, res) => {
    const report = mockReports.find(r => r.id === req.params.id);
    if (report) {
        console.log(`SUCCESS: GET /api/v1/reports/${req.params.id}`);
        res.json({ success: true, data: report });
    } else {
        console.error(`ERROR: GET /api/v1/reports/${req.params.id} - Not Found`);
        res.status(404).json({ success: false, message: 'Report not found' });
    }
});

app.patch('/api/v1/reports/:id/status', (req, res) => {
    const reportIndex = mockReports.findIndex(r => r.id === req.params.id);
    const { status } = req.body;
    if (reportIndex !== -1 && status) {
        mockReports[reportIndex].status = status;
        console.log(`SUCCESS: PATCH /api/v1/reports/${req.params.id}/status - New status: ${status}`);
        res.json({ success: true, data: mockReports[reportIndex] });
    } else {
        console.error(`ERROR: PATCH /api/v1/reports/${req.params.id}/status - Report not found or status missing`);
        res.status(404).json({ success: false, message: 'Report not found or status not provided' });
    }
});

app.get('/api/v1/leaderboard', (req, res) => {
    console.log('SUCCESS: GET /api/v1/leaderboard');
    res.json({ success: true, data: mockLeaderboard });
});

app.get('/api/v1/notifications', (req, res) => {
    console.log('SUCCESS: GET /api/v1/notifications');
    res.json({ success: true, data: mockNotifications });
});


// CATCH-ALL ROUTE FOR DEBUGGING 404 ERRORS
app.use((req, res, next) => {
    console.error(`ERROR: Route not found - ${req.method} ${req.originalUrl}`);
    res.status(404).json({ success: false, message: `Endpoint ${req.originalUrl} not found on the mock server.` });
});

app.listen(PORT, () => {
  console.log(`Mock API server is running on http://localhost:${PORT}`);
});

