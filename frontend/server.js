const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL || 'http://localhost:5001';

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get API URL for frontend
app.get('/config', (req, res) => {
    res.json({ apiUrl: API_URL });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend server running on http://localhost:${PORT}`);
    console.log(`API URL configured as: ${API_URL}`);
});
