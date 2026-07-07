const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load the secret variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware (Upgraded to handle large image files up to 50mb)
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. A simple test route
app.get('/', (req, res) => {
    res.send('Smart Bharat Backend is running perfectly!');
});

// 2. The Core AI Chat Route
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.prompt;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "You are Smart Bharat, an AI-powered civic companion for Indian citizens. You help them understand government services, simplify legal jargon, track schemes, and guide them on how to report public issues. Be polite, clear, concise, and helpful."
        });

        const result = await model.generateContent(userMessage);
        const response = await result.response;
        res.json({ reply: response.text() });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: 'Failed to communicate with AI Companion.' });
    }
});

// 3. NEW: Multimodal Vision Route for Auto-Filling Reports
app.post('/api/analyze-image', async (req, res) => {
    try {
        const { imageBase64 } = req.body;

        // Strip the metadata prefix from the base64 string
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // We instruct Gemini to return strict JSON so our frontend can read it perfectly
        const prompt = `Analyze this image of a civic issue. Reply ONLY with a valid JSON object in this exact format: {"category": "(Choose the closest match: Broken Streetlight, Pothole / Road Damage, Water Supply Issue, Garbage Collection)", "description": "(Write a brief 1-2 sentence description of the issue seen in the image)"}`;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ]);

        const text = result.response.text();

        // Clean up the response to ensure it's pure JSON
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        res.json(JSON.parse(cleanJson));

    } catch (error) {
        console.error("Vision Error:", error);
        res.status(500).json({ error: 'Failed to analyze image.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running live on http://localhost:${port}`);
});