const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware (Optimized for processing large multi-modal photo payloads)
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Google Gen AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Health check route
app.get('/', (req, res) => {
    res.send('Smart Bharat Serverless Backend is running perfectly!');
});

// 2. Core AI Chat Route (Gemini 2.5 Flash)
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
        console.error("AI Chat Error:", error);
        res.status(500).json({ error: 'Failed to communicate with AI Companion.' });
    }
});

// 3. Upgraded: Multimodal Vision Route using Gemini 2.5 Flash
app.post('/api/analyze-image', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) {
            return res.status(400).json({ error: 'No image data provided.' });
        }

        // Clean base64 string prefix schema if present
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

        // Upgraded to gemini-2.5-flash for uniform performance and ultra-fast generation
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Analyze this image of a civic issue. Reply ONLY with a valid JSON object in this exact format: {"category": "(Choose the closest match: Broken Streetlight, Pothole / Road Damage, Water Supply Issue, Garbage Collection)", "description": "(Write a brief 1-2 sentence description of the issue seen in the image)"}`;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ]);

        const text = result.response.text();

        // Safe JSON parsing handling any markdown wrapper syntax returns
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        res.json(JSON.parse(cleanJson));

    } catch (error) {
        console.error("Vision Processing Error:", error);
        res.status(500).json({ error: 'Failed to analyze civic image.' });
    }
});

// Conditional execution setup: Only listen on a port when working on localhost
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`[Local Server] Running smoothly on http://localhost:${port}`);
    });
}

// Export the application layer instance for Vercel Serverless runtime targeting
module.exports = app;