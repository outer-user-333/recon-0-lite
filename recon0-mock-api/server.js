// .env configuration
import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from 'multer';
import path from 'path';

const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());


// --- FILE UPLOAD CONFIGURATION ---
// Make the 'uploads' directory publicly accessible
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


// --- IN-MEMORY DATABASE ---
// In-memory array to simulate a user database
let mockUsers = [];
let userIdCounter = 1;
let mockPrograms = [
  { id: 'prog-1', org_name: 'CyberCorp', title: 'Web App Pentest', min_bounty: 500, max_bounty: 5000, tags: ['web', 'pentest'] },
  { id: 'prog-2', org_name: 'SecureNet', title: 'API Security Assessment', min_bounty: 250, max_bounty: 3000, tags: ['api', 'security'] },
];

let mockReports = [
  { id: 'report-1', program_id: 'prog-1', program_name: 'Web App Pentest', reporter_id: 'user-1', title: 'XSS in Profile Page', severity: 'Medium', status: 'New' },
  { id: 'report-2', program_id: 'prog-1', program_name: 'Web App Pentest', reporter_id: 'user-2', title: 'IDOR to view invoices', severity: 'Critical', status: 'Triaging' },
  { id: 'report-3', program_id: 'prog-2', program_name: 'API Security Assessment', reporter_id: 'user-1', title: 'Auth Bypass via JWT Flaw', severity: 'High', status: 'Accepted' },
];

let mockLeaderboard = [
  { rank: 1, username: 'cyb3r_ninja', reputation_points: 9850 },
  { rank: 2, username: 'glitch_hunter', reputation_points: 9500 },
  { rank: 3, username: 'exploit_exp', reputation_points: 8900 },
];

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (token == null) {
        console.error('Auth Error: No token provided!');
        return res.status(401).json({ success: false, message: 'Error: No token provided.' });
    }

    // We aren't verifying a real signature, just decoding our fake payload.
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
        req.user = decodedPayload; // Add user info (id, role, email) to the request object
        next(); // The user is "authenticated", proceed to the route handler
    } catch (e) {
        console.error('Auth Error: Token is malformed!');
        return res.status(403).json({ success: false, message: 'Error: Token is invalid.' });
    }
};


// --- AUTH ENDPOINTS ---
app.post('/api/v1/auth/register', (req, res) => {
    const { email, password, username, fullName, role } = req.body;

    if (mockUsers.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: "Email already in use." });
    }
    if (mockUsers.find(u => u.username === username)) {
        return res.status(400).json({ success: false, message: "Username already taken." });
    }

    const newUser = {
        id: `user-${userIdCounter++}`,
        email,
        password, // In a real backend, this MUST be hashed!
        username,
        full_name: fullName,
        role,
        reputation_points: 0,
        avatar_url: null,
        bio: '',
        created_at: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    console.log('New user registered:', newUser);

    res.status(201).json({ success: true, message: 'User registered successfully!' });
});

app.post('/api/v1/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = mockUsers.find(u => u.email === email);

    if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    console.log('User logged in:', user.username);

    // This is our FAKE JWT. It's just a base64 encoded JSON object.
    // A real JWT has a cryptographic signature, but we don't need that for a mock API.
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
        user: { // Send back some user info, which is common
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});

// --- PROTECTED API ENDPOINTS ---
// All routes below this require a valid token

// Get the profile of the currently logged-in user
app.get('/api/v1/profile', authenticateToken, (req, res) => {
    // The authenticateToken middleware has already verified the token
    // and attached the user's info to req.user.
    const loggedInUserId = req.user.id;

    const profile = mockUsers.find(u => u.id === loggedInUserId);

    if (!profile) {
        return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    console.log(`Fetched profile for user: ${profile.username}`);
    res.json({ success: true, data: profile });
});


// Update the profile of the currently logged-in user
app.put('/api/v1/profile', authenticateToken, (req, res) => {
    const loggedInUserId = req.user.id;
    const { fullName, username, bio } = req.body;

    const userIndex = mockUsers.findIndex(u => u.id === loggedInUserId);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    // Check if the new username is already taken by another user
    const usernameTaken = mockUsers.some(u => u.username === username && u.id !== loggedInUserId);
    if (usernameTaken) {
        return res.status(400).json({ success: false, message: 'Username is already taken.' });
    }

    // Update the user's profile data
    mockUsers[userIndex].full_name = fullName;
    mockUsers[userIndex].username = username;
    mockUsers[userIndex].bio = bio;

    console.log(`Updated profile for user: ${mockUsers[userIndex].username}`);
    res.json({ success: true, data: mockUsers[userIndex] });
});


// Upload an avatar for the currently logged-in user
app.post('/api/v1/upload/avatar', authenticateToken, upload.single('file'), (req, res) => {
    const loggedInUserId = req.user.id;

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

    const userIndex = mockUsers.findIndex(u => u.id === loggedInUserId);
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    // Update the user's avatar_url
    mockUsers[userIndex].avatar_url = fileUrl;

    console.log(`Uploaded new avatar for ${mockUsers[userIndex].username}: ${fileUrl}`);
    res.json({
        success: true,
        message: 'Avatar uploaded successfully!',
        secure_url: fileUrl 
    });
});


// Get all programs
app.get('/api/v1/programs', authenticateToken, (req, res) => {
    console.log('Fetched all programs');
    res.json({ success: true, data: mockPrograms });
});

// Get a single program by its ID
app.get('/api/v1/programs/:id', authenticateToken, (req, res) => {
    const program = mockPrograms.find(p => p.id === req.params.id);
    if (!program) {
        return res.status(404).json({ success: false, message: 'Program not found.' });
    }
    console.log(`Fetched program: ${program.title}`);
    res.json({ success: true, data: program });
});


// Get all reports submitted by the currently logged-in user
app.get('/api/v1/my-reports', authenticateToken, (req, res) => {
    const loggedInUserId = req.user.id;
    const userReports = mockReports.filter(r => r.reporter_id === loggedInUserId);

    console.log(`Fetched ${userReports.length} reports for user ID: ${loggedInUserId}`);
    res.json({ success: true, data: userReports });
});

// Get a single report by its ID
app.get('/api/v1/reports/:id', authenticateToken, (req, res) => {
    const report = mockReports.find(r => r.id === req.params.id);
    if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found.' });
    }
    console.log(`Fetched report: ${report.title}`);
    res.json({ success: true, data: report });
});


// Get leaderboard data
app.get('/api/v1/leaderboard', authenticateToken, (req, res) => {
    console.log('Fetched leaderboard data');
    res.json({ success: true, data: mockLeaderboard });
});

// Get stats for the currently logged-in user
app.get('/api/v1/stats', authenticateToken, (req, res) => {
    const loggedInUserId = req.user.id;
    const user = mockUsers.find(u => u.id === loggedInUserId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // In a real backend, you'd calculate these stats. Here, we'll derive them from our mock data.
    const stats = {
        reputation_points: user.reputation_points,
        reports_submitted: mockReports.filter(r => r.reporter_id === user.id).length,
        reports_accepted: mockReports.filter(r => r.reporter_id === user.id && r.status === 'Accepted').length,
        bounties_earned: 0 // We can hardcode this for now
    };

    console.log(`Fetched stats for user: ${user.username}`);
    res.json({ success: true, data: stats });
});


// Submit a new report
app.post('/api/v1/reports', authenticateToken, (req, res) => {
    // Destructure the new fields from the request body
    const { programId, title, severity, description, steps_to_reproduce, impact } = req.body;
    const reporter = mockUsers.find(u => u.id === req.user.id);
    const program = mockPrograms.find(p => p.id === programId);

    if (!reporter || !program) {
        return res.status(404).json({ success: false, message: 'User or Program not found.' });
    }

    const newReport = {
        id: `report-${Date.now()}`,
        program_id: program.id,
        program_name: program.title,
        reporter_id: reporter.id,
        title,
        severity,
        description,
        steps_to_reproduce, // Add new field
        impact,              // Add new field
        status: 'New',
        created_at: new Date().toISOString(),
    };

    mockReports.push(newReport);
    console.log('New report submitted:', newReport);
    res.status(201).json({ success: true, data: newReport });
});





// --- SERVER LISTENING ---
app.listen(PORT, () =>
  console.log(`Mock API server is running on http://localhost:${PORT}`)
);