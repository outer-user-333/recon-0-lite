import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Ensures .env variables are loaded

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

// --- SERVER START ---
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});