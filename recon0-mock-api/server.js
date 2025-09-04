// .env configuration MUST be the first line
import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

// --- Supabase Client Setup ---
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "FATAL ERROR: Supabase URL and Anon Key must be provided in mock-api/.env file."
  );
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

// --- MOCK DATABASE (STATEFUL) ---
let mockHackers = {};

let mockPrograms = [
  {
    id: "prog-1",
    organization_name: "CyberCorp",
    title: "Web App Pentest",
    description: "Comprehensive penetration test for our main web application.",
    policy: "Please provide clear, reproducible steps. No DDoS attacks.",
    scope: "*.cybercorp.com and its subdomains",
    out_of_scope: "staging.cybercorp.com",
    min_bounty: 500,
    max_bounty: 5000,
    tags: ["web", "pentest", "critical"],
  },
  {
    id: "prog-2",
    organization_name: "SecureNet",
    title: "API Security Assessment",
    description: "Identify vulnerabilities in our public-facing REST APIs.",
    policy: "Responsible disclosure is key.",
    scope: "api.securenet.com/v1",
    out_of_scope: "Internal APIs",
    min_bounty: 250,
    max_bounty: 3000,
    tags: ["api", "security", "auth"],
  },
];

let mockReports = [
  {
    id: "report-1",
    program_id: "prog-1",
    program_name: "Web App Pentest",
    reporter_username: "asim_hax",
    title: "XSS in Profile Page",
    severity: "Medium",
    status: "New",
    created_at: "2025-09-01T10:00:00Z",
    description:
      "A stored Cross-Site Scripting vulnerability exists on the user profile page, allowing an attacker to inject arbitrary scripts.",
    steps_to_reproduce:
      '1. Go to your profile page.\n2. In the bio field, enter `<script>alert("XSS")</script>`.\n3. Save the profile.\n4. Visit the public profile page to see the alert.',
    impact:
      "An attacker can steal session cookies or perform actions on behalf of the user.",
  },
  {
    id: "report-2",
    program_id: "prog-1",
    program_name: "Web App Pentest",
    reporter_username: "cyb3r_ninja",
    title: "IDOR to view other users' invoices",
    severity: "Critical",
    status: "New",
    created_at: "2025-09-03T14:30:00Z",
    description:
      "An Insecure Direct Object Reference vulnerability allows viewing invoices of any user by changing the ID in the URL.",
    steps_to_reproduce:
      "1. Navigate to `/invoices/123`.\n2. Change the ID in the URL to `124`.\n3. The invoice for user 124 is displayed.",
    impact: "Sensitive financial information of all users can be exposed.",
  },
  {
    id: "report-3",
    program_id: "prog-2",
    program_name: "API Security Test",
    reporter_username: "asim_hax",
    title: "Authentication Bypass via JWT Flaw",
    severity: "High",
    status: "Triaging",
    created_at: "2025-09-02T11:00:00Z",
    description:
      "The API does not properly validate the signature of the JWT, allowing for token forgery.",
    steps_to_reproduce:
      "1. Capture a valid JWT.\n2. Decode the payload and change the user ID.\n3. Use an online tool to re-sign the token with a `none` algorithm.\n4. Send the forged token to a protected endpoint.",
    impact: "Complete account takeover of any user is possible.",
  },
];

// ===== NEW MOCK DATA FOR ACHIEVEMENTS =====
const allAchievements = [
  {
    id: "ach-1",
    name: "First Find",
    description: "Submit your first valid report.",
    icon: "fa-flag",
  },
  {
    id: "ach-2",
    name: "Bug Squasher",
    description: "Submit 5 valid reports.",
    icon: "fa-hammer",
  },
  {
    id: "ach-3",
    name: "Critical Thinker",
    description: "Get a critical severity report accepted.",
    icon: "fa-brain",
  },
  {
    id: "ach-4",
    name: "Specialist",
    description: "Reach Specialist Level (250+ RP).",
    icon: "fa-star",
  },
  {
    id: "ach-5",
    name: "Community Helper",
    description: "Leave 10 helpful comments.",
    icon: "fa-hands-helping",
  },
  {
    id: "ach-6",
    name: "Top 10",
    description: "Place in the top 10 on the leaderboard.",
    icon: "fa-trophy",
  },
];

let userAchievements = {
  asim_hax: [allAchievements[0], allAchievements[1], allAchievements[2]],
};

const mockLeaderboard = [
  {
    rank: 1,
    hacker: { username: "cyb5r_ninja" },
    reports_resolved: 128,
    reputation_points: 9850,
  },
  {
    rank: 2,
    hacker: { username: "glitch_hunter" },
    reports_resolved: 118,
    reputation_points: 9500,
  },
  {
    rank: 3,
    hacker: { username: "exploit_exp" },
    reports_resolved: 95,
    reputation_points: 8900,
  },
];

const mockNotifications = [
  {
    id: 1,
    type: "report_update",
    message: "Your report #1824 was accepted by SecureCorp.",
    created_at: "2025/08/09 15:30:00",
    is_read: false,
  },
  {
    id: 2,
    type: "new_program",
    message: 'A new program "CloudNet Security" has been launched.',
    created_at: "2025/08/31 21:00:00",
    is_read: false,
  },
  {
    id: 3,
    type: "payout",
    message: "You have been awarded a $500 bounty for report #1801.",
    created_at: "2025/08/30 16:30:00",
    is_read: true,
  },
  {
    id: 4,
    type: "comment",
    message: "SecureCorp left a comment on your report #1824.",
    created_at: "2025/09/01 08:15:00",
    is_read: false,
  },
];

let mockComments = [
  {
    id: "comment-1",
    report_id: "report-1",
    author: "Sujal (SecureCorp)",
    content: "Great find! We are working on a fix.",
    created_at: "2025-09-04T10:00:00Z",
  },
  {
    id: "comment-2",
    report_id: "report-1",
    author: "glitch_hunter",
    content: "Thanks! Let me know if you need more details.",
    created_at: "2025-09-04T10:05:00Z",
  },
];

//! --- Helper Functions ---
// const getPointsForSeverity = (s) =>
//   ({ critical: 50, high: 30, medium: 15, low: 5 }[s.toLowerCase()] || 0);
//! --- UTILITY FUNCTIONS ---
const getPointsForSeverity = (severity) => {
  switch (severity?.toLowerCase()) {
    case "critical":
      return 50;
    case "high":
      return 30;
    case "medium":
      return 15;
    case "low":
      return 5;
    default:
      return 0;
  }
};

// const getOrCreateHacker = (username) => {
//   if (!mockHackers[username]) {
//     mockHackers[username] = {
//       username,
//       reputation_points: 0,
//       reports_accepted: 0,
//     };
//   }
//   return mockHackers[username];
// };

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
// --- API ENDPOINTS (CORRECT ORDER) ---

//!1
// Specific report routes MUST come before dynamic routes like /:id
app.get("/api/v1/reports/my-reports", (req, res) => {
  console.log("SUCCESS: GET /api/v1/reports/my-reports");
  res.json({ success: true, data: mockReports });
});

//! 13
// --- Organization Workflow Endpoints ---
app.post("/api/v1/programs", (req, res) => {
  const newProgram = { id: `prog-${Date.now()}`, ...req.body };
  mockPrograms.push(newProgram);
  console.log("SUCCESS: POST /api/v1/programs (Program Created)", newProgram);
  res.status(201).json({ success: true, data: newProgram });
});

//!2
app.get("/api/v1/reports/organization", (req, res) => {
  console.log("SUCCESS: GET /api/v1/reports/organization");
  res.json({ success: true, data: mockReports });
});

// --- API ENDPOINTS ---
//! -
app.get("/health", (req, res) => res.json({ status: "ok" }));

// // THIS IS THE OLD ROUTE THAT IS CAUSING PROBLEMS
// app.get("/api/v1/reports/organization", (req, res) => {
//   console.log("SUCCESS: Hit GET /api/v1/reports/organization");
//   res.json({ success: true, data: mockReports });
// });

//!6
// --- Hacker Workflow Endpoints ---
app.get("/api/v1/programs", (req, res) => {
  console.log("SUCCESS: GET /api/v1/programs");
  res.json({ success: true, data: mockPrograms });
});

// // --- REPORT ENDPOINTS ---
// app.get("/api/v1/reports/my-reports", (req, res) =>
//   res.json({ success: true, data: mockReports })
// );

// app.get("/api/v1/reports/:id", (req, res) => {
//   const report = mockReports.find((r) => r.id === req.params.id);
//   report
//     ? res.json({ success: true, data: report })
//     : res.status(404).json({ success: false, message: "Report not found" });
// });

//!8
app.post("/api/v1/reports", (req, res) => {
  const newReport = {
    id: `report-${Date.now()}`,
    ...req.body,
    created_at: new Date().toISOString(),
  };
  mockReports.push(newReport);
  console.log("SUCCESS: POST /api/v1/reports (Report Submitted)", newReport);
  res.status(201).json({ success: true, data: newReport });
});

//! 9
app.get("/api/v1/leaderboard", (req, res) => {
  console.log("SUCCESS: GET /api/v1/leaderboard");
  res.json({ success: true, data: mockLeaderboard });
});

//! 10
app.get("/api/v1/notifications", (req, res) => {
  console.log("SUCCESS: GET /api/v1/notifications");
  res.json({ success: true, data: mockNotifications });
});

//! 11
// ===== NEW ENDPOINTS FOR ACHIEVEMENTS =====
app.get("/api/v1/achievements", (req, res) => {
  console.log("GET /api/v1/achievements");
  res.json({ success: true, data: allAchievements });
});

//! - NEW
// --- ORGANIZATION-SPECIFIC ENDPOINTS ---
app.get("/api/v1/organization/programs", (req, res) => {
  const orgPrograms = mockPrograms.filter(
    (p) => p.organization_name === "CyberCorp"
  ); // Hardcoded for demo
  res.json({ success: true, data: orgPrograms });
});

// --- API ENDPOINTS ---

//! -
// ** THIS IS THE NEW TEST ROUTE **
app.get("/test-org-reports", (req, res) => {
  console.log("SUCCESS: Hit the new GET /test-org-reports endpoint!");
  res.json({ success: true, data: mockReports });
});

//! -NEW
app.get("/api/v1/programs/:id/analytics", (req, res) => {
  const program = mockPrograms.find((p) => p.id === req.params.id);
  if (!program)
    return res
      .status(404)
      .json({ success: false, message: "Program not found" });
  console.log(`SUCCESS: GET /api/v1/programs/${req.params.id}/analytics`);
  const analyticsData = {
    program: { id: program.id, title: program.title },
    kpis: {
      total_reports: 132,
      reports_resolved: 98,
      avg_time_to_bounty_days: 14,
      total_paid_out: 25400,
    },
    reportsBySeverity: [
      { severity: "Critical", count: 12 },
      { severity: "High", count: 35 },
      { severity: "Medium", count: 68 },
      { severity: "Low", count: 17 },
    ],
    submissionTrend: [
      { date: "Aug 1", count: 15 },
      { date: "Aug 8", count: 22 },
      { date: "Aug 15", count: 18 },
      { date: "Aug 22", count: 25 },
      { date: "Aug 29", count: 30 },
      { date: "Sep 4", count: 22 },
    ],
  };
  res.json({ success: true, data: analyticsData });
});

//!3
// Dynamic route for a single report ID comes LAST
app.get("/api/v1/reports/:id", (req, res) => {
  const report = mockReports.find((r) => r.id === req.params.id);
  if (report) {
    console.log(`SUCCESS: GET /api/v1/reports/${req.params.id}`);
    res.json({ success: true, data: report });
  } else {
    console.error(`ERROR: GET /api/v1/reports/${req.params.id} - Not Found`);
    res.status(404).json({ success: false, message: "Report not found" });
  }
});

//!4
// GET Hacker's Dashboard Stats (Dynamic)
app.get("/api/v1/hackers/:username/stats", (req, res) => {
  const { username } = req.params;
  console.log(`GET /api/v1/hackers/${username}/stats`);
  const hacker = getOrCreateHacker(username);
  res.json({ success: true, data: hacker });
});

//!5
// PATCH Report Status (with Dynamic Reputation Logic)
app.patch("/api/v1/reports/:id/status", async (req, res) => {
  const { status } = req.body;
  const reportId = req.params.id;
  console.log(
    `PATCH /api/v1/reports/${reportId}/status - New status: ${status}`
  );

  const report = mockReports.find((r) => r.id === reportId);
  if (!report)
    return res
      .status(404)
      .json({ success: false, message: "Report not found" });

  const oldStatus = report.status;
  report.status = status;

  if (
    status.toLowerCase() === "accepted" &&
    oldStatus.toLowerCase() !== "accepted"
  ) {
    const pointsToAdd = getPointsForSeverity(report.severity);
    const hacker = getOrCreateHacker(report.reporter_username);

    const newTotalPoints = hacker.reputation_points + pointsToAdd;
    hacker.reputation_points = newTotalPoints;
    hacker.reports_accepted += 1;

    console.log(
      `AWARDED: ${pointsToAdd} points to ${hacker.username}. New total: ${newTotalPoints}`
    );

    // --- NEW: UPDATE SUPABASE DATABASE ---
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ reputation_points: newTotalPoints })
        .eq("username", hacker.username);

      if (error) throw error;
      console.log(
        `SUCCESS: Synced reputation for ${hacker.username} to Supabase.`
      );
    } catch (error) {
      console.error(
        `ERROR: Failed to sync reputation to Supabase for ${hacker.username}:`,
        error.message
      );
    }
  }

  res.json({ success: true, data: report });
});

//!7
// --- Shared Workflow Endpoints ---
app.get("/api/v1/programs/:id", (req, res) => {
  const program = mockPrograms.find((p) => p.id === req.params.id);
  if (program) {
    console.log(`SUCCESS: GET /api/v1/programs/${req.params.id}`);
    res.json({ success: true, data: program });
  } else {
    console.error(`ERROR: GET /api/v1/programs/${req.params.id} - Not Found`);
    res.status(404).json({ success: false, message: "Program not found" });
  }
});

//! -Updated 14
// --- COMMENT ENDPOINTS ---
app.get("/api/v1/reports/:reportId/comments", (req, res) => {
  console.log(`GET /api/v1/reports/${req.params.reportId}/comments`);
  const reportComments = mockComments.filter(
    (c) => c.report_id === req.params.reportId
  );
  res.json({ success: true, data: reportComments });
});

//! -Updated 15
app.post("/api/v1/reports/:reportId/comments", (req, res) => {
  console.log(`POST /api/v1/reports/${req.params.reportId}/comments`);
  const newComment = {
    id: `comment-${Date.now()}`,
    report_id: req.params.reportId,
    author: req.body.author,
    content: req.body.content,
    created_at: new Date().toISOString(),
  };
  mockComments.push(newComment);
  res.status(201).json({ success: true, data: newComment });
});

//! 12
app.get("/api/v1/users/:username/achievements", (req, res) => {
  const username = req.params.username;
  console.log(`GET /api/v1/users/${username}/achievements`);
  const earned = userAchievements[username] || [];
  res.json({ success: true, data: earned });
});

// CATCH-ALL FOR DEBUGGING
app.use((req, res, next) => {
  console.error(`ERROR: Route not found - ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found.`,
  });
});

app.listen(PORT, () =>
  console.log(`Mock API server is running on http://localhost:${PORT}`)
);
