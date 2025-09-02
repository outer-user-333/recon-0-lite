const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- MOCK DATABASES ---

const mockPrograms = [
  // ... (the mockPrograms array remains the same)
  { id: 'prog_001', organizationName: 'SecureCorp', title: 'Web Application Pentest', description: 'Comprehensive testing for our main web platform...', policy: 'Please provide clear, reproducible steps...', scope: ['Web', 'API', 'Database'], bounty: { min: 100, max: 5000 }, targets: ['Web', 'API', 'Database'] },
  { id: 'prog_002', organizationName: 'FinTech Innovations', title: 'Mobile Banking App', description: 'Focus on our iOS and Android mobile applications...', policy: 'No physical attacks on our infrastructure...', scope: ['iOS', 'Android'], bounty: { min: 250, max: 10000 }, targets: ['iOS', 'Android'] },
  { id: 'prog_003', organizationName: 'DataWeaver AI', title: 'AI Model & API Endpoints', description: 'We are looking for vulnerabilities in our machine learning APIs...', policy: 'Please do not use any personally identifiable information (PII)...', scope: ['API', 'Cloud'], bounty: { min: 500, max: 7500 }, targets: ['API', 'Cloud'] },
  { id: 'prog_004', organizationName: 'GameSphere', title: 'Online Gaming Platform', description: 'Looking for exploits in our game client...', policy: 'In-game currency rewards for valid reports...', scope: ['Web', 'Game Client'], bounty: { min: 50, max: 2000 }, targets: ['Web', 'Game Client'] },
];

// *** NEW MOCK DATA ***
const mockReports = [
  {
    id: 'rep_001',
    programTitle: 'Web Application Pentest',
    programOrganization: 'SecureCorp',
    title: 'Cross-Site Scripting (XSS) in user profile',
    status: 'Accepted',
    submittedAt: '2025-08-28T10:00:00Z',
  },
  {
    id: 'rep_002',
    programTitle: 'Mobile Banking App',
    programOrganization: 'FinTech Innovations',
    title: 'Insecure Deeplink leading to account takeover',
    status: 'Resolved',
    submittedAt: '2025-08-15T14:30:00Z',
  },
  {
    id: 'rep_003',
    programTitle: 'Web Application Pentest',
    programOrganization: 'SecureCorp',
    title: 'IDOR to view other users\' invoices',
    status: 'Triaged',
    submittedAt: '2025-09-01T09:15:00Z',
  },
];

// *** NEW: We now have two mock profiles and a way to switch between them ***
const mockHackerProfile = {
  fullName: 'Asim',
  username: 'asim_hax',
  email: 'hacker@example.com',
  role: 'hacker', // <-- Role is 'hacker'
  bio: 'A passionate security researcher.',
};

const mockOrgProfile = {
    fullName: 'Sujal from SecureCorp',
    username: 'sujal_sec',
    email: 'org@example.com',
    role: 'organization', // <-- Role is 'organization'
    bio: 'Leading the security team at SecureCorp.',
};

// Change this value to 'hacker' or 'organization' to test different views
let currentUserRole = 'organization'; 


// *** NEW MOCK DATA ***
const mockDashboardStats = {
  reputation: '1,250',
  reportsSubmitted: '28',
  reportsAccepted: '19',
  bountiesEarned: '$4,200',
};


// *** NEW MOCK DATA ***
const mockLeaderboard = [
  { rank: 1, username: 'cyb3r_ninja', reputation: 9850, reports: 120 },
  { rank: 2, username: 'glitch_hunter', reputation: 9500, reports: 110 },
  { rank: 3, username: 'exploit_exp', reputation: 8900, reports: 95 },
  { rank: 4, username: 'pwn_master', reputation: 8200, reports: 88 },
  { rank: 5, username: 'sec_savvy', reputation: 7600, reports: 80 },
  { rank: 6, username: 'null_byte', reputation: 7100, reports: 75 },
  { rank: 7, username: 'root_access', reputation: 6800, reports: 72 },
  { rank: 8, username: 'code_cracker', reputation: 6500, reports: 68 },
  { rank: 9, username: 'logic_bomb', reputation: 6100, reports: 65 },
  { rank: 10, username: 'hex_hacker', reputation: 5800, reports: 60 },
];

// *** NEW MOCK DATA ***
const mockNotifications = [
  {
    id: 'notif_001',
    message: 'Your report #1824 was accepted by SecureCorp.',
    timestamp: '2025-09-01T10:00:00Z',
    read: false,
    type: 'report_accepted',
  },
  {
    id: 'notif_002',
    message: 'A new program "CloudNet Security" has been launched.',
    timestamp: '2025-08-31T15:30:00Z',
    read: false,
    type: 'new_program',
  },
  {
    id: 'notif_003',
    message: 'You have been awarded a $500 bounty for report #1801.',
    timestamp: '2025-08-30T11:00:00Z',
    read: true,
    type: 'bounty_paid',
  },
  {
    id: 'notif_004',
    message: 'SecureCorp left a comment on your report #1824.',
    timestamp: '2025-08-29T18:45:00Z',
    read: true,
    type: 'new_comment',
  },
];

// --- API Endpoints ---

// ... (GET /api/programs, GET /api/programs/:id, POST /api/reports remain the same)

// *** UPDATED ENDPOINT ***
// GET all programs, now with filtering
app.get('/api/programs', (req, res) => {
  console.log('Request received for GET /api/programs');
  let filteredPrograms = [...mockPrograms];
  const { minBounty } = req.query;

  if (minBounty) {
    console.log(`Filtering for minBounty >= ${minBounty}`);
    filteredPrograms = filteredPrograms.filter(p => p.bounty.min >= parseInt(minBounty, 10));
  }
  
  res.json(filteredPrograms);
});


app.get('/api/programs/:id', (req, res) => {
    const program = mockPrograms.find(p => p.id === req.params.id);
    if (program) res.json(program);
    else res.status(404).json({ message: "Program not found" });
});
app.post('/api/reports', (req, res) => {
    console.log('New report submitted:', req.body);
    res.status(201).json({ message: 'Report submitted successfully!', data: req.body });
});


// *** NEW ENDPOINT LOGIC ***
// POST a new program
app.post('/api/programs', (req, res) => {
  const newProgram = req.body;
  // In a real app, we'd generate a real ID. Here, we'll create a simple one.
  newProgram.id = `prog_${Date.now()}`;
  mockPrograms.push(newProgram);
  
  console.log('New program created:');
  console.log(newProgram);
  
  res.status(201).json({ message: 'Program created successfully!', data: newProgram });
});

// *** NEW ENDPOINT ***
app.get('/api/my-reports', (req, res) => {
  console.log('Request received for GET /api/my-reports');
  // In a real app, we'd use an auth token to get the user's specific reports.
  // Here, we just return all mock reports.
  res.json(mockReports);
});

// *** UPDATED PROFILE ENDPOINTS ***
app.get('/api/profile', (req, res) => {
  console.log(`Request received for GET /api/profile (Role: ${currentUserRole})`);
  if (currentUserRole === 'hacker') {
    res.json(mockHackerProfile);
  } else {
    res.json(mockOrgProfile);
  }
});

app.put('/api/profile', (req, res) => {
  const updatedData = req.body;
  console.log('Profile update received:', updatedData);
  
  if (currentUserRole === 'hacker') {
    mockHackerProfile = { ...mockHackerProfile, ...updatedData };
    res.json({ message: 'Profile updated successfully!', data: mockHackerProfile });
  } else {
    mockOrgProfile = { ...mockOrgProfile, ...updatedData };
    res.json({ message: 'Profile updated successfully!', data: mockOrgProfile });
  }
});

// *** NEW ENDPOINT FOR DASHBOARD STATS ***
app.get('/api/dashboard-stats', (req, res) => {
  console.log('Request received for GET /api/dashboard-stats');
  res.json(mockDashboardStats);
});

// *** NEW ENDPOINT FOR ORGANIZATION'S REPORTS ***
app.get('/api/org-reports', (req, res) => {
  console.log('Request received for GET /api/org-reports');
  // In a real app, we'd use an auth token to get reports for the specific organization.
  // Here, we just return the same mock reports for the demo.
  res.json(mockReports); 
});


// *** NEW ENDPOINT FOR LEADERBOARD ***
app.get('/api/leaderboard', (req, res) => {
  console.log('Request received for GET /api/leaderboard');
  res.json(mockLeaderboard);
});

// *** NEW ENDPOINT FOR NOTIFICATIONS ***
app.get('/api/notifications', (req, res) => {
  console.log('Request received for GET /api/notifications');
  res.json(mockNotifications);
});

app.listen(PORT, () => {
  console.log(`Mock API server is running on http://localhost:${PORT}`);
});