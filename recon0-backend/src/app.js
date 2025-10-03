import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Ensures .env variables are loaded


// Import routes
import authRoutes from './routes/authRoutes.js'; // <-- ADD THIS LINE
import userRoutes from './routes/userRoutes.js'; // <-- ADD THIS
import programRoutes from './routes/programRoutes.js'; // <-- ADD THIS

// Create the Express app
const app = express();
const PORT = process.env.PORT || 3001;

// --- MIDDLEWARE ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON in request bodies

// --- ROUTES ---
// A simple test route to make sure the server is running
app.get('/', (req, res) => {
  res.send('Recon-0 Backend is running! 🚀');
});

// Use auth routes
app.use('/api/v1/auth', authRoutes); // <-- ADD THIS LINE

// Use user routes
app.use('/api/v1', userRoutes); // <-- ADD THIS

app.use('/api/v1/programs', programRoutes); // <-- ADD THIS

// --- SERVER START ---
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});