// Import necessary packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint for career advice
app.post('/api/advice', async (req, res) => {
    const { userInput } = req.body;

    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // Check if the API key is missing
    if (!GEMINI_API_KEY) {
        console.error('API Key is missing. Please set the GEMINI_API_KEY in your .env file.');
        return res.status(500).json({ error: 'Server configuration error: API key missing.' });
    }

    try {
        const response = await axios.post(
            GEMINI_API_URL,
            {
                contents: [
                    {
                        parts: [{ text: userInput }]
                    }
                ]
            },
            {
                headers: {
                    // Correct header for Gemini API authentication
                    'x-goog-api-key': GEMINI_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        const advice = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No advice returned.";
        res.json({ advice });

    } catch (error) {
        // Log the full error response from the Gemini API for better debugging
        console.error("Gemini API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to get advice from Gemini API. Check the backend terminal for more details." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
});
