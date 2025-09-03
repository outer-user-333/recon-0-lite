import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- MOCK DATABASE ---
let mockPrograms = [ { id: 'prog-1', organization_name: 'CyberCorp', title: 'Web App Pentest' } ];
let mockReports = [ { id: 'report-1', program_name: 'Web App Pentest', reporter_username: 'glitch_hunter', title: 'XSS in Profile Page', severity: 'Medium', status: 'New', created_at: '2025-09-01T10:00:00Z', description: 'Detailed description here.', steps_to_reproduce: '1. Go here...', impact: 'Steal cookies.'} ];

// --- API ENDPOINTS ---

app.get('/api/v1/programs', (req, res) => res.json({ success: true, data: mockPrograms }));
app.get('/api/v1/programs/:id', (req, res) => {
  const program = mockPrograms.find(p => p.id === req.params.id);
  program ? res.json({ success: true, data: program }) : res.status(404).json({ success: false, message: 'Program not found' });
});

app.get('/api/v1/reports/my-reports', (req, res) => res.json({ success: true, data: mockReports }));
app.get('/api/v1/reports/organization', (req, res) => res.json({ success: true, data: mockReports }));

app.get('/api/v1/reports/:id', (req, res) => {
    const report = mockReports.find(r => r.id === req.params.id);
    report ? res.json({ success: true, data: report }) : res.status(404).json({ success: false, message: 'Report not found' });
});

// ===== THIS IS THE NEW ENDPOINT FOR UPDATING STATUS =====
app.patch('/api/v1/reports/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`PATCH /api/v1/reports/${id}/status with new status: ${status}`);

    const reportIndex = mockReports.findIndex(r => r.id === id);

    if (reportIndex === -1) {
        return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
    }

    // Update the status in our mock database
    mockReports[reportIndex].status = status;

    // Return the updated report
    res.json({ success: true, data: mockReports[reportIndex] });
});
// =======================================================


app.listen(PORT, () => {
  console.log(`Mock API server is running on http://localhost:${PORT}`);
});

