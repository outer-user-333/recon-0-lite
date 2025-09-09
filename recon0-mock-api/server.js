// .env configuration
import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";





// --- AI HELPER FUNCTION ---
const callLocalLLM = async (prompt) => {
    const LLM_API_URL = 'http://localhost:1234/v1/chat/completions';

    try {
        const response = await fetch(LLM_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'local-model', // This can be anything when using LM Studio
                messages: [
                    { role: 'system', content: 'You are an expert cybersecurity analyst. Your task is to enhance vulnerability reports to be clear, professional, and precise.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`LM Studio server responded with status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error('Error calling local LLM:', error);
        // Return a fallback error message if the LLM server is down
        return 'Error: AI service is currently unavailable.';
    }
};








const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

// --- FILE UPLOAD CONFIGURATION ---
// Make the 'uploads' directory publicly accessible
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
        );
    },
});
const upload = multer({ storage: storage });

// --- IN-MEMORY DATABASE ---
let mockUsers = [
    {
        id: "user-1",
        email: "asdf@g.i",
        password: "12345",
        username: "CyberCorpAdmin",
        full_name: "CyberCorp",
        role: "hacker",
         status: 'Active', // <-- ADD THIS
        reputation_points: 0,
        avatar_url: null,
        bio: "Securing the future.",
        created_at: new Date().toISOString(),
    },
    {
        id: "user-2",
        email: "qwer@g.i",
        password: "12345",
        username: "CyberCorORG",
        full_name: "CyberCorp",
        role: "organization",
         status: 'Active', // <-- ADD THIS
        reputation_points: 0,
        avatar_url: null,
        bio: "Securing the future.",
        created_at: new Date().toISOString(),
    },
    {
        id: "user-admin",
        email: "admin@recon0.com",
        password: "pass123",
        username: "PlatformAdmin",
        full_name: "Admin User",
        role: "admin",
         status: 'Active', // <-- ADD THIS
        reputation_points: 0,
        avatar_url: null,
        bio: "Platform Administrator",
        created_at: new Date().toISOString(),
    },
];
let userIdCounter = 3;

let mockPrograms = [
    {
        id: "prog-1",
        organization_id: "user-2",
        org_name: "CyberCorp",
        title: "Web App Pentest",
        min_bounty: 500,
        max_bounty: 5000,
        tags: ["web", "pentest"],
    },
    {
        id: "prog-2",
        organization_id: "user-2",
        org_name: "CyberCorp",
        title: "API Security Assessment",
        min_bounty: 250,
        max_bounty: 3000,
        tags: ["api", "security"],
    },
];

let mockReports = [
    {
        id: "report-1",
        program_id: "prog-1",
        program_name: "Web App Pentest",
        reporter_id: "user-1",
        title: "XSS in Profile Page",
        severity: "Medium",
        status: "New",
    },
    {
        id: "report-3",
        program_id: "prog-2",
        program_name: "API Security Assessment",
        reporter_id: "user-1",
        title: "Auth Bypass via JWT Flaw",
        severity: "High",
        status: "Accepted",
    },
];

// ... (keep mockLeaderboard from before)
let mockLeaderboard = [
    { rank: 1, username: "cyb3r_ninja", reputation_points: 9850 },
    { rank: 2, username: "glitch_hunter", reputation_points: 9500 },
    { rank: 3, username: "exploit_exp", reputation_points: 8900 },
    { rank: 4, username: "asim_hax", reputation_points: 150 }, // Added our test user
];

let mockNotifications = [
    {
        id: 1,
        user_id: "user-1",
        type: "report_update",
        message: "Your report 'XSS in Profile Page' was accepted.",
        is_read: false,
        created_at: "2025-09-06T15:30:00Z",
    },
    {
        id: 2,
        user_id: "user-1",
        type: "new_program",
        message: 'A new program "CloudNet Security" has been launched.',
        is_read: false,
        created_at: "2025-09-05T21:00:00Z",
    },
    {
        id: 3,
        user_id: "user-1",
        type: "payout",
        message: "You have been awarded a $500 bounty for a previous report.",
        is_read: true,
        created_at: "2025-09-04T16:30:00Z",
    },
    {
        id: 4,
        user_id: "user-2",
        type: "comment",
        message: "A hacker left a comment on your report #1824.",
        is_read: false,
        created_at: "2025-09-06T08:15:00Z",
    },
];

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
];

// Maps a user ID to an array of earned achievement IDs
let userAchievements = {
    "user-1": ["ach-1", "ach-3"],
};

let mockAttachments = [];

let mockReportMessages = [];
let mockMessageAttachments = [];

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

    if (token == null) {
        console.error("Auth Error: No token provided!");
        return res
            .status(401)
            .json({ success: false, message: "Error: No token provided." });
    }

    // We aren't verifying a real signature, just decoding our fake payload.
    try {
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(
            Buffer.from(payloadBase64, "base64").toString("utf8")
        );
        req.user = decodedPayload; // Add user info (id, role, email) to the request object
        next(); // The user is "authenticated", proceed to the route handler
    } catch (e) {
        console.error("Auth Error: Token is malformed!");
        return res
            .status(403)
            .json({ success: false, message: "Error: Token is invalid." });
    }
};


const authenticateAdmin = (req, res, next) => {
    // This middleware runs AFTER authenticateToken, so req.user is already available.
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed.
    } else {
        res.status(403).json({ success: false, message: 'Forbidden: Administrator access required.' });
    }
};

// --- AUTH ENDPOINTS ---
app.post("/api/v1/auth/register", (req, res) => {
    const { email, password, username, fullName, role } = req.body;

    if (mockUsers.find((u) => u.email === email)) {
        return res
            .status(400)
            .json({ success: false, message: "Email already in use." });
    }
    if (mockUsers.find((u) => u.username === username)) {
        return res
            .status(400)
            .json({ success: false, message: "Username already taken." });
    }

    const newUser = {
        id: `user-${userIdCounter++}`,
        email,
        password,
        username,
        full_name: fullName,
        role,
        reputation_points: 0,
        avatar_url: null,
        bio: "",
        created_at: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    console.log("New user registered:", newUser);

    // --- NEW: Auto-login the user by returning a token ---
    const fakeJwtPayload = Buffer.from(
        JSON.stringify({
            id: newUser.id,
            role: newUser.role,
            email: newUser.email,
        })
    ).toString("base64");
    const fakeToken = `fake-header.${fakeJwtPayload}.fake-signature`;

    res.status(201).json({
        success: true,
        message: "User registered successfully!",
        token: fakeToken, // Send the token back
        user: { id: newUser.id, username: newUser.username, role: newUser.role },
    });
});

app.post('/api/v1/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = mockUsers.find(u => u.email === email);

    if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    console.log('User logged in:', user.username);

    const fakeJwtPayload = Buffer.from(JSON.stringify({ 
        id: user.id, 
        role: user.role, 
        email: user.email 
    })).toString('base64');
    const fakeToken = `fake-header.${fakeJwtPayload}.fake-signature`;

    res.json({ 
        success: true, 
        message: 'Login successful!', 
        token: fakeToken,
        // --- THIS IS THE KEY CHANGE ---
        // Send back the user object so the frontend knows the role
        user: { 
            id: user.id,
            username: user.username,
            role: user.role // Include the role here
        }
    });
});
// --- PROTECTED API ENDPOINTS ---
// All routes below this require a valid token

// Get the profile of the currently logged-in user
app.get("/api/v1/profile", authenticateToken, (req, res) => {
    // The authenticateToken middleware has already verified the token
    // and attached the user's info to req.user.
    const loggedInUserId = req.user.id;

    const profile = mockUsers.find((u) => u.id === loggedInUserId);

    if (!profile) {
        return res
            .status(404)
            .json({ success: false, message: "Profile not found." });
    }

    console.log(`Fetched profile for user: ${profile.username}`);
    res.json({ success: true, data: profile });
});

// Update the profile of the currently logged-in user
app.put("/api/v1/profile", authenticateToken, (req, res) => {
    const loggedInUserId = req.user.id;
    const { fullName, username, bio } = req.body;

    const userIndex = mockUsers.findIndex((u) => u.id === loggedInUserId);

    if (userIndex === -1) {
        return res
            .status(404)
            .json({ success: false, message: "Profile not found." });
    }

    // Check if the new username is already taken by another user
    const usernameTaken = mockUsers.some(
        (u) => u.username === username && u.id !== loggedInUserId
    );
    if (usernameTaken) {
        return res
            .status(400)
            .json({ success: false, message: "Username is already taken." });
    }

    // Update the user's profile data
    mockUsers[userIndex].full_name = fullName;
    mockUsers[userIndex].username = username;
    mockUsers[userIndex].bio = bio;

    console.log(`Updated profile for user: ${mockUsers[userIndex].username}`);
    res.json({ success: true, data: mockUsers[userIndex] });
});

// Upload an avatar for the currently logged-in user
app.post(
    "/api/v1/upload/avatar",
    authenticateToken,
    upload.single("file"),
    (req, res) => {
        const loggedInUserId = req.user.id;

        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: "No file uploaded." });
        }

        const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

        const userIndex = mockUsers.findIndex((u) => u.id === loggedInUserId);
        if (userIndex === -1) {
            return res
                .status(404)
                .json({ success: false, message: "Profile not found." });
        }

        // Update the user's avatar_url
        mockUsers[userIndex].avatar_url = fileUrl;

        console.log(
            `Uploaded new avatar for ${mockUsers[userIndex].username}: ${fileUrl}`
        );
        res.json({
            success: true,
            message: "Avatar uploaded successfully!",
            secure_url: fileUrl,
        });
    }
);

// Get all programs and include their organization's logo
app.get("/api/v1/programs", authenticateToken, (req, res) => {
    const programsWithLogos = mockPrograms.map((program) => {
        const organization = mockUsers.find(
            (u) => u.id === program.organization_id
        );
        return {
            ...program,
            // Add the org logo URL to the program object
            org_logo_url: organization ? organization.avatar_url : null,
        };
    });
    console.log("Fetched all programs with logos");
    res.json({ success: true, data: programsWithLogos });
});

// Get a single program by its ID, including the org logo
app.get("/api/v1/programs/:id", authenticateToken, (req, res) => {
    const program = mockPrograms.find((p) => p.id === req.params.id);
    if (!program) {
        return res
            .status(404)
            .json({ success: false, message: "Program not found." });
    }

    // Find the organization and add their logo URL
    const organization = mockUsers.find((u) => u.id === program.organization_id);
    const programWithLogo = {
        ...program,
        org_logo_url: organization ? organization.avatar_url : null,
    };

    console.log(`Fetched program: ${program.title}`);
    res.json({ success: true, data: programWithLogo });
});

// Get all reports submitted by the currently logged-in user
app.get("/api/v1/my-reports", authenticateToken, (req, res) => {
    const loggedInUserId = req.user.id;
    const userReports = mockReports.filter(
        (r) => r.reporter_id === loggedInUserId
    );

    console.log(
        `Fetched ${userReports.length} reports for user ID: ${loggedInUserId}`
    );
    res.json({ success: true, data: userReports });
});

// Get a single report by its ID, now including its attachments
app.get("/api/v1/reports/:id", authenticateToken, (req, res) => {
    const report = mockReports.find((r) => r.id === req.params.id);
    if (!report) {
        return res
            .status(404)
            .json({ success: false, message: "Report not found." });
    }

    // Find all attachments associated with this report
    const attachments = mockAttachments.filter(
        (att) => att.report_id === report.id
    );
    const reportWithAttachments = { ...report, attachments };

    console.log(`Fetched report: ${report.title}`);
    res.json({ success: true, data: reportWithAttachments });
});

// Generic file upload endpoint for report attachments
app.post(
    "/api/v1/upload/attachment",
    authenticateToken,
    upload.single("file"),
    (req, res) => {
        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: "No file uploaded." });
        }

        const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

        console.log(`Attachment uploaded: ${fileUrl}`);
        // Respond with the URL and original file details
        res.json({
            success: true,
            message: "File uploaded successfully!",
            url: fileUrl,
            name: req.file.originalname,
            type: req.file.mimetype,
        });
    }
);

// Get all attachments for a specific report
app.get(
    "/api/v1/reports/:reportId/attachments",
    authenticateToken,
    (req, res) => {
        const { reportId } = req.params;
        const reportAttachments = mockAttachments.filter(
            (att) => att.report_id === reportId
        );

        console.log(
            `Fetched ${reportAttachments.length} attachments for report ID: ${reportId}`
        );
        res.json({ success: true, data: reportAttachments });
    }
);

// --- REPORT MESSAGING ENDPOINTS ---


// --- REPORT MESSAGING ENDPOINTS ---

// Get all messages for a specific report
app.get("/api/v1/reports/:reportId/messages", authenticateToken, (req, res) => {
    const { reportId } = req.params;
    const messages = mockReportMessages
        .filter((m) => m.report_id === reportId)
        .map((message) => {
            // *** FIX STARTS HERE ***
            // Find the sender's profile to enrich the message data
            const sender = mockUsers.find(u => u.id === message.sender_id);

            // For each message, find its attachments
            const attachments = mockMessageAttachments.filter(
                (att) => att.message_id === message.id
            );

            // Return the message combined with sender info and attachments
            return { 
                ...message, 
                sender_username: sender ? sender.username : 'Unknown User',
                sender_avatar_url: sender ? sender.avatar_url : null,
                attachments 
            };
            // *** FIX ENDS HERE ***
        });

    console.log(`Fetched ${messages.length} messages for report ID: ${reportId}`);
    res.json({ success: true, data: messages });
});

// Send a new message/reply from an organization
app.post(
    "/api/v1/reports/:reportId/messages",
    authenticateToken,
    (req, res) => {
        if (req.user.role !== "organization") {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Forbidden: Only organizations can send replies.",
                });
        }

        const { reportId } = req.params;
        const { content, attachments } = req.body;
        const senderId = req.user.id;

        const newMessageId = `msg-${Date.now()}`;
        const newMessage = {
            id: newMessageId,
            report_id: reportId,
            sender_id: senderId,
            content,
            created_at: new Date().toISOString(),
        };
        mockReportMessages.push(newMessage);

        if (attachments && attachments.length > 0) {
            attachments.forEach((att) => {
                mockMessageAttachments.push({
                    id: `msg-attach-${Date.now()}-${Math.random()}`,
                    message_id: newMessageId,
                    file_url: att.url,
                    file_name: att.name,
                    file_type: att.type,
                });
            });
        }

        console.log("New report message sent:", newMessage);
        res.status(201).json({ success: true, data: newMessage });
    }
);

// Get leaderboard data
app.get("/api/v1/leaderboard", authenticateToken, (req, res) => {
    console.log("Fetched leaderboard data");
    res.json({ success: true, data: mockLeaderboard });
});

// Get stats for the currently logged-in user
app.get("/api/v1/stats", authenticateToken, (req, res) => {
    const loggedInUserId = req.user.id;
    const user = mockUsers.find((u) => u.id === loggedInUserId);

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    // In a real backend, you'd calculate these stats. Here, we'll derive them from our mock data.
    const stats = {
        reputation_points: user.reputation_points,
        reports_submitted: mockReports.filter((r) => r.reporter_id === user.id)
            .length,
        reports_accepted: mockReports.filter(
            (r) => r.reporter_id === user.id && r.status === "Accepted"
        ).length,
        bounties_earned: 0, // We can hardcode this for now
    };

    console.log(`Fetched stats for user: ${user.username}`);
    res.json({ success: true, data: stats });
});

// Submit a new report
// Submit a new report (now with attachments)
app.post("/api/v1/reports", authenticateToken, (req, res) => {
    const {
        programId,
        title,
        severity,
        description,
        steps_to_reproduce,
        impact,
        attachments,
    } = req.body;
    const reporter = mockUsers.find((u) => u.id === req.user.id);
    const program = mockPrograms.find((p) => p.id === programId);

    if (!reporter || !program) {
        return res
            .status(404)
            .json({ success: false, message: "User or Program not found." });
    }

    const newReportId = `report-${Date.now()}`;
    const newReport = {
        id: newReportId,
        program_id: program.id,
        program_name: program.title,
        reporter_id: reporter.id,
        title,
        severity,
        description,
        steps_to_reproduce,
        impact,
        status: "New",
        created_at: new Date().toISOString(),
    };
    mockReports.push(newReport);

    // If there are attachments, add them to our mock attachments array
    if (attachments && attachments.length > 0) {
        attachments.forEach((att) => {
            mockAttachments.push({
                id: `attach-${Date.now()}-${Math.random()}`,
                report_id: newReportId,
                file_url: att.url,
                file_name: att.name,
                file_type: att.type,
            });
        });
    }

    console.log("New report submitted with attachments:", newReport);
    res.status(201).json({ success: true, data: newReport });
});

// --- ORGANIZATION ENDPOINTS ---





// Get dashboard data for the currently logged-in organization
app.get('/api/v1/organization/dashboard', authenticateToken, (req, res) => {
    if (req.user.role !== 'organization') {
        return res.status(403).json({ success: false, message: 'Forbidden: Access denied.' });
    }
    const loggedInOrgId = req.user.id;

    // Find programs and reports for this org
    const orgPrograms = mockPrograms.filter(p => p.organization_id === loggedInOrgId);
    const orgProgramIds = orgPrograms.map(p => p.id);
    const incomingReports = mockReports.filter(r => orgProgramIds.includes(r.program_id));

    // Get the 5 most recent reports
    const recentReports = incomingReports
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

    const dashboardData = {
        kpis: {
            programCount: orgPrograms.length,
            totalReports: incomingReports.length,
            newReports: incomingReports.filter(r => r.status === 'New').length,
        },
        recentReports
    };

    console.log(`Fetched dashboard data for organization ID: ${loggedInOrgId}`);
    res.json({ success: true, data: dashboardData });
});












// Get all programs for the currently logged-in organization, including logos
app.get("/api/v1/organization/my-programs", authenticateToken, (req, res) => {
    if (req.user.role !== "organization") {
        return res
            .status(403)
            .json({ success: false, message: "Forbidden: Access denied." });
    }

    // For our mock environment, we will always return all mock programs
    // and simply add the logo URL to each. This is the simplest and most robust
    // way to ensure any org user can see the list for testing.
    const programsWithLogos = mockPrograms.map((program) => ({
        ...program,
        org_logo_url:
            mockUsers.find((u) => u.id === program.organization_id)?.avatar_url ||
            null,
    }));

    console.log(`Fetched all mock programs for organization ID: ${req.user.id}`);
    res.json({ success: true, data: programsWithLogos });
});

// Create a new program
app.post("/api/v1/organization/my-programs", authenticateToken, (req, res) => {
    if (req.user.role !== "organization") {
        return res
            .status(403)
            .json({ success: false, message: "Forbidden: Access denied." });
    }

    const organization = mockUsers.find((u) => u.id === req.user.id);
    if (!organization) {
        return res
            .status(404)
            .json({ success: false, message: "Organization user not found." });
    }

    const newProgram = {
        id: `prog-${Date.now()}`,
        organization_id: organization.id,
        org_name: organization.full_name,
        // Destructure all fields from the request body based on the schema
        title: req.body.title,
        description: req.body.description,
        policy: req.body.policy,
        scope: req.body.scope,
        out_of_scope: req.body.out_of_scope,
        min_bounty: parseInt(req.body.min_bounty, 10),
        max_bounty: parseInt(req.body.max_bounty, 10),
        tags: req.body.tags, // Expecting an array of strings
    };

    mockPrograms.push(newProgram);
    console.log("New program created:", newProgram);
    res.status(201).json({ success: true, data: newProgram });
});

// Get all reports submitted to the logged-in organization's programs
app.get("/api/v1/organization/reports", authenticateToken, (req, res) => {
    if (req.user.role !== "organization") {
        return res
            .status(403)
            .json({ success: false, message: "Forbidden: Access denied." });
    }

    const loggedInOrgId = req.user.id;

    // Step 1: Find all program IDs belonging to this organization
    const orgProgramIds = mockPrograms
        .filter((p) => p.organization_id === loggedInOrgId)
        .map((p) => p.id);

    // Step 2: Find all reports submitted to those programs
    const incomingReports = mockReports.filter((r) =>
        orgProgramIds.includes(r.program_id)
    );

    console.log(
        `Fetched ${incomingReports.length} incoming reports for organization ID: ${loggedInOrgId}`
    );
    res.json({ success: true, data: incomingReports });
});



// Triage a report (update its status)
app.patch(
    "/api/v1/organization/reports/:reportId",
    authenticateToken,
    (req, res) => {
        if (req.user.role !== "organization") {
            return res
                .status(403)
                .json({ success: false, message: "Forbidden: Access denied." });
        }

        const loggedInOrgId = req.user.id;
        const { reportId } = req.params;
        const { status } = req.body;

        const reportIndex = mockReports.findIndex((r) => r.id === reportId);
        if (reportIndex === -1) {
            return res
                .status(404)
                .json({ success: false, message: "Report not found." });
        }

        // Security Check: Verify this organization owns the program the report was submitted to.
        const program = mockPrograms.find(
            (p) => p.id === mockReports[reportIndex].program_id
        );
        if (!program || program.organization_id !== loggedInOrgId) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Forbidden: You do not own this program.",
                });
        }

        // Update the status in our in-memory array
        mockReports[reportIndex].status = status;

        console.log(`Updated status of report ${reportId} to ${status}`);
        // Return the updated report object
        res.json({ success: true, data: mockReports[reportIndex] });
    }
);

// Get analytics data for a specific program
app.get(
    "/api/v1/organization/programs/:programId/analytics",
    authenticateToken,
    (req, res) => {
        if (req.user.role !== "organization") {
            return res
                .status(403)
                .json({ success: false, message: "Forbidden: Access denied." });
        }

        const loggedInOrgId = req.user.id;
        const { programId } = req.params;
        const program = mockPrograms.find((p) => p.id === programId);

        // Security Check: Verify this organization owns the program.
        if (!program || program.organization_id !== loggedInOrgId) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Forbidden: You do not own this program.",
                });
        }

        // For the mock API, we'll return a hardcoded but realistic analytics object.
        const analyticsData = {
            programTitle: program.title,
            kpis: {
                totalReports: 132,
                resolvedReports: 98,
                avgTimeToBountyDays: 14,
                totalPaidOut: 25400,
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
                { date: "Sep 5", count: 22 },
            ],
        };

        console.log(`Fetched analytics for program: ${program.title}`);
        res.json({ success: true, data: analyticsData });
    }
);

// Upload a logo for the currently logged-in organization
app.post(
    "/api/v1/organization/upload/logo",
    authenticateToken,
    upload.single("file"),
    (req, res) => {
        if (req.user.role !== "organization") {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Forbidden: Only organizations can upload logos.",
                });
        }

        const loggedInOrgId = req.user.id;
        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: "No file uploaded." });
        }

        const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

        const userIndex = mockUsers.findIndex((u) => u.id === loggedInOrgId);
        if (userIndex === -1) {
            return res
                .status(404)
                .json({ success: false, message: "Organization profile not found." });
        }

        // We will use the 'avatar_url' field on the user's profile to store their org logo
        mockUsers[userIndex].avatar_url = fileUrl;

        console.log(
            `Uploaded new logo for ${mockUsers[userIndex].username}: ${fileUrl}`
        );
        res.json({
            success: true,
            message: "Logo uploaded successfully!",
            secure_url: fileUrl,
        });
    }
);



// Get notifications for the currently logged-in user
app.get("/api/v1/notifications", authenticateToken, (req, res) => {
    const loggedInUserId = req.user.id;
    const userNotifications = mockNotifications.filter(
        (n) => n.user_id === loggedInUserId
    );

    console.log(
        `Fetched ${userNotifications.length} notifications for user ID: ${loggedInUserId}`
    );
    res.json({ success: true, data: userNotifications });
});

// --- ACHIEVEMENT ENDPOINTS ---

// Get the list of ALL possible achievements
app.get("/api/v1/achievements", authenticateToken, (req, res) => {
    console.log("Fetched all achievements");
    res.json({ success: true, data: allAchievements });
});

// Get the achievements earned by the currently logged-in user
app.get("/api/v1/achievements/my", authenticateToken, (req, res) => {
    const loggedInUserId = req.user.id;
    const earnedIds = userAchievements[loggedInUserId] || [];

    console.log(`Fetched earned achievements for user ID: ${loggedInUserId}`);
    res.json({ success: true, data: earnedIds });
});


// --- AI ENDPOINTS (FUNCTIONAL) ---
app.post('/api/v1/ai/enhance-report', authenticateToken, async (req, res) => {
    const { description, steps_to_reproduce, impact } = req.body;

    try {
        console.log('Sending request to local LLM for enhancement...');

        // We make parallel calls to the LLM for each section to speed things up
        const [enhancedDescription, enhancedSteps, enhancedImpact] = await Promise.all([
            callLocalLLM(`Rewrite the following vulnerability description for a professional security report. Be clear and concise:\n\n"${description}"`),
            callLocalLLM(`Rewrite the following steps-to-reproduce. Number them clearly and ensure they are easy for a developer to follow:\n\n"${steps_to_reproduce}"`),
            callLocalLLM(`Rewrite the following impact assessment. Focus on the potential business and security risks:\n\n"${impact}"`)
        ]);

        console.log('Successfully received enhancement from LLM.');

        res.json({
            success: true,
            data: {
                description: enhancedDescription,
                steps_to_reproduce: enhancedSteps,
                impact: enhancedImpact,
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to process AI enhancement.' });
    }
});

// Handle a conversation turn for the general Q&A chatbot
app.post('/api/v1/ai/chat', authenticateToken, async (req, res) => {
    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ success: false, message: 'Question is required.' });
    }

    try {
        console.log(`Sending question to LLM: "${question}"`);

        // We use a different system prompt for the chatbot to give it a personality
        const prompt = `You are a helpful assistant for the Recon-0 bug bounty platform. Answer the user's question clearly and concisely.\n\nUser's Question: "${question}"`;

        const answer = await callLocalLLM(prompt);

        console.log(`Received answer from LLM: "${answer}"`);

        res.json({
            success: true,
            data: {
                answer: answer
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get a response from the AI assistant.' });
    }
});


// --- ADMIN ENDPOINTS ---
// All routes below require both a valid token AND an admin role.

// Get a list of all users on the platform
app.get('/api/v1/admin/users', authenticateToken, authenticateAdmin, (req, res) => {
    // We don't want to send passwords to the frontend, even in a mock API.
    const safeUsers = mockUsers.map(({ password, ...user }) => user);
    console.log('Admin fetched all users.');
    res.json({ success: true, data: safeUsers });
});


// Get platform-wide analytics data
app.get('/api/v1/admin/analytics', authenticateToken, authenticateAdmin, (req, res) => {
    // In a real backend, you'd query the database to calculate these.
    // Here, we derive them from our in-memory mock data.
    const totalUsers = mockUsers.length;
    const totalHackers = mockUsers.filter(u => u.role === 'hacker').length;
    const totalOrgs = mockUsers.filter(u => u.role === 'organization').length;
    const totalReports = mockReports.length;

    const platformAnalytics = {
        kpis: {
            totalUsers,
            totalHackers,
            totalOrgs,
            totalReports,
            totalPrograms: mockPrograms.length,
        },
        // You could add chart data here as well, similar to the org analytics
        reportsByStatus: [
            { status: "New", count: mockReports.filter(r => r.status === 'New').length },
            { status: "Accepted", count: mockReports.filter(r => r.status === 'Accepted').length },
            { status: "Triaging", count: mockReports.filter(r => r.status === 'Triaging').length },
        ]
    };

    console.log('Admin fetched platform analytics.');
    res.json({ success: true, data: platformAnalytics });
});


// Update a user's status (e.g., suspend)
app.patch('/api/v1/admin/users/:userId/status', authenticateToken, authenticateAdmin, (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    const userIndex = mockUsers.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Prevent admin from suspending themselves
    if (mockUsers[userIndex].id === req.user.id) {
        return res.status(400).json({ success: false, message: 'Cannot change your own status.' });
    }

    mockUsers[userIndex].status = status;

    console.log(`Admin updated status for user ${userId} to ${status}`);

    // Return the updated user object (without the password)
    const { password, ...safeUser } = mockUsers[userIndex];
    res.json({ success: true, data: safeUser });
});




// --- SERVER LISTENING ---
app.listen(PORT, () =>
    console.log(`Mock API server is running on http://localhost:${PORT}`)
);
