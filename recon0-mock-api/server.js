// --- STEP 1: LOAD ENVIRONMENT VARIABLES ---
// This line must be at the very top of the file.
// It loads the variables from your .env file into process.env
import 'dotenv/config';
// ------------------------------------------

import express from 'express';
import cors from 'cors';
// Import the Supabase client library
import { createClient } from '@supabase/supabase-js';

// variables


// ================= ACTION REQUIRED ===================================
//
// PASTE YOUR SUPABASE URL AND ANON KEY HERE
// You can find these in your src/lib/supabaseClient.js file
//
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
//
// =====================================================================


// Initialize the Supabase client for the server
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);




const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// =================================================================
// --- MOCK DATABASE ---
// This section simulates our database for all features.
// =================================================================

// This will now be our in-memory "database" for hacker stats.
// It starts empty and will be populated as real users interact with the app.
let mockHackers = {};

let mockPrograms = [
    { id: 'prog-1', organization_name: 'CyberCorp', title: 'Web App Pentest', description: 'Comprehensive penetration test for our main web application.', policy: 'Please provide clear, reproducible steps. No DDoS attacks.', scope: '*.cybercorp.com and its subdomains', out_of_scope: 'staging.cybercorp.com', min_bounty: 500, max_bounty: 5000, tags: ['web', 'pentest', 'critical'] },
    { id: 'prog-2', organization_name: 'SecureNet', title: 'API Security Assessment', description: 'Identify vulnerabilities in our public-facing REST APIs.', policy: 'Responsible disclosure is key.', scope: 'api.securenet.com/v1', out_of_scope: 'Internal APIs', min_bounty: 250, max_bounty: 3000, tags: ['api', 'security', 'auth'] },
];

let mockReports = [
    { id: 'report-1', program_id: 'prog-1', program_name: 'Web App Pentest', reporter_username: 'asim_hax', title: 'XSS in Profile Page', severity: 'Medium', status: 'New', created_at: '2025-09-01T10:00:00Z', description: 'A stored Cross-Site Scripting vulnerability exists on the user profile page, allowing an attacker to inject arbitrary scripts.', steps_to_reproduce: '1. Go to your profile page.\n2. In the bio field, enter `<script>alert("XSS")</script>`.\n3. Save the profile.\n4. Visit the public profile page to see the alert.', impact: 'An attacker can steal session cookies or perform actions on behalf of the user.'},
    { id: 'report-2', program_id: 'prog-1', program_name: 'Web App Pentest', reporter_username: 'cyb3r_ninja', title: 'IDOR to view other users\' invoices', severity: 'Critical', status: 'New', created_at: '2025-09-03T14:30:00Z', description: 'An Insecure Direct Object Reference vulnerability allows viewing invoices of any user by changing the ID in the URL.', steps_to_reproduce: '1. Navigate to `/invoices/123`.\n2. Change the ID in the URL to `124`.\n3. The invoice for user 124 is displayed.', impact: 'Sensitive financial information of all users can be exposed.'},
    { id: 'report-3', program_id: 'prog-2', program_name: 'API Security Test', reporter_username: 'asim_hax', title: 'Authentication Bypass via JWT Flaw', severity: 'High', status: 'Triaging', created_at: '2025-09-02T11:00:00Z', description: 'The API does not properly validate the signature of the JWT, allowing for token forgery.', steps_to_reproduce: '1. Capture a valid JWT.\n2. Decode the payload and change the user ID.\n3. Use an online tool to re-sign the token with a `none` algorithm.\n4. Send the forged token to a protected endpoint.', impact: 'Complete account takeover of any user is possible.'},
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

let mockComments = [
    { id: 'comment-1', report_id: 'report-1', author: 'Sujal (SecureCorp)', content: 'Great find! We are working on a fix.', created_at: '2025-09-04T10:00:00Z' },
    { id: 'comment-2', report_id: 'report-1', author: 'glitch_hunter', content: 'Thanks! Let me know if you need more details.', created_at: '2025-09-04T10:05:00Z' },
];


// --- UTILITY FUNCTIONS ---
const getPointsForSeverity = (severity) => {
    switch (severity?.toLowerCase()) {
        case 'critical': return 50;
        case 'high': return 30;
        case 'medium': return 15;
        case 'low': return 5;
        default: return 0;
    }
};

// =================================================================
// --- API ENDPOINTS ---
// This section contains ALL endpoints for the application.
// =================================================================

// Function to get or create a hacker profile on-the-fly
const getOrCreateHacker = (username) => {
    if (!mockHackers[username]) {
        console.log(`Creating new profile for hacker: ${username}`);
        mockHackers[username] = {
            username: username,
            reputation_points: 0,
            reports_submitted: 0,
            reports_accepted: 0,
            bounties_earned: 0,
        };
    }
    return mockHackers[username];
};


// --- API ENDPOINTS ---

// GET Hacker's Dashboard Stats (Dynamic)
app.get('/api/v1/hackers/:username/stats', (req, res) => {
    const { username } = req.params;
    console.log(`GET /api/v1/hackers/${username}/stats`);
    const hacker = getOrCreateHacker(username);
    res.json({ success: true, data: hacker });
});

// PATCH Report Status (with Dynamic Reputation Logic)
app.patch('/api/v1/reports/:id/status', async(req, res) => {
    const { status } = req.body;
    const reportId = req.params.id;
    console.log(`PATCH /api/v1/reports/${reportId}/status - New status: ${status}`);

    const report = mockReports.find(r => r.id === reportId);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    const oldStatus = report.status;
    report.status = status;

    if (status.toLowerCase() === 'accepted' && oldStatus.toLowerCase() !== 'accepted') {
        const pointsToAdd = getPointsForSeverity(report.severity);
        const hacker = getOrCreateHacker(report.reporter_username);
        
        const newTotalPoints = hacker.reputation_points + pointsToAdd;
        hacker.reputation_points = newTotalPoints;
        hacker.reports_accepted += 1;
        
        console.log(`AWARDED: ${pointsToAdd} points to ${hacker.username}. New total: ${newTotalPoints}`);

        // --- NEW: UPDATE SUPABASE DATABASE ---
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ reputation_points: newTotalPoints })
                .eq('username', hacker.username);

            if (error) throw error;
            console.log(`SUCCESS: Synced reputation for ${hacker.username} to Supabase.`);
        } catch (error) {
            console.error(`ERROR: Failed to sync reputation to Supabase for ${hacker.username}:`, error.message);
        }
    }

    res.json({ success: true, data: report });
});


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

// ===== ADD NEW ENDPOINT TO GET COMMENTS FOR A REPORT =====
app.get('/api/v1/reports/:id/comments', (req, res) => {
    console.log(`GET /api/v1/reports/${req.params.id}/comments`);
    const reportComments = mockComments.filter(c => c.report_id === req.params.id);
    res.json({ success: true, data: reportComments });
});
// =========================================================

// ===== ADD NEW ENDPOINT TO POST A NEW COMMENT =====
app.post('/api/v1/reports/:id/comments', (req, res) => {
    console.log(`POST /api/v1/reports/${req.params.id}/comments`);
    const newComment = {
        id: `comment-${Date.now()}`,
        report_id: req.params.id,
        author: req.body.author,
        content: req.body.content,
        created_at: new Date().toISOString()
    };
    mockComments.push(newComment);
    res.status(201).json({ success: true, data: newComment });
});
// ================================================

// CATCH-ALL ROUTE FOR DEBUGGING 404 ERRORS
app.use((req, res, next) => {
    console.error(`ERROR: Route not found - ${req.method} ${req.originalUrl}`);
    res.status(404).json({ success: false, message: `Endpoint ${req.originalUrl} not found on the mock server.` });
});

app.listen(PORT, () => {
  console.log(`Mock API server is running on http://localhost:${PORT}`);
});

