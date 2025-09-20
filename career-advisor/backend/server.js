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

    if (!userInput || userInput.trim() === "") {
        return res.status(400).json({ error: "Input text is required." });
    }

    // Using a stable model from your ListModels output
    const MODEL = "gemini-1.5-flash"; 
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // Debug logs
    console.log("🔍 Using Gemini Model:", MODEL);
    console.log("🔗 API URL:", GEMINI_API_URL);

    if (!GEMINI_API_KEY) {
        console.error('❌ API Key is missing. Please set GEMINI_API_KEY in your .env file.');
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
                ],
                // ✅ Nesting parameters in generationConfig
                generationConfig: {
                    temperature: 0.7,
                    candidateCount: 1
                }
            },
            {
                headers: {
                    'x-goog-api-key': GEMINI_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        const advice = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No advice returned.";
        res.json({ advice });

    } catch (error) {
        console.error("❌ Gemini API Error:", error.response?.data?.error || error.message);
        res.status(500).json({ error: "Failed to get advice from Gemini API. Check backend logs." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
});