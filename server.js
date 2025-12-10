import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// --- ENV LOADING ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPathLocal = path.resolve(__dirname, '.env.local');

// Try loading .env.local explicitly
if (fs.existsSync(envPathLocal)) {
    console.log('Loading .env.local from:', envPathLocal);
    dotenv.config({ path: envPathLocal });
} else {
    console.log('.env.local not found, trying default .env');
    dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3005;
const STEAM_API_KEY = process.env.STEAM_API_KEY;

// Debug Log (Safety: masking key)
console.log('STEAM_API_KEY Loaded:', STEAM_API_KEY ? `Yes (starts with ${STEAM_API_KEY.substring(0, 4)}...)` : 'NO');


app.use(cors());
app.use(express.json());

// --- ROUTES ---

// 1. Get Player Summaries (Avatar, Name, Status)
app.get('/api/steam/player/:steamid', async (req, res) => {
    const { steamid } = req.params;

    if (!STEAM_API_KEY) {
        return res.status(500).json({ error: 'Server missing STEAM_API_KEY' });
    }

    try {
        const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/`, {
            params: {
                key: STEAM_API_KEY,
                steamids: steamid
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Steam API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch player data' });
    }
});

// 2. Get Player Achievements (Schema + User Progress)
// Note: This requires two calls usually - one for schema (images), one for user stats.
app.get('/api/steam/achievements/:appid', async (req, res) => {
    const { appid } = req.params;

    if (!STEAM_API_KEY) {
        return res.status(500).json({ error: 'Server missing STEAM_API_KEY' });
    }

    try {
        // Get Schema (Images, Titles)
        const schemaResponse = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/`, {
            params: {
                key: STEAM_API_KEY,
                appid: appid
            }
        });

        res.json(schemaResponse.data);
    } catch (error) {
        // Some games don't have stats or stats are hidden
        console.error('Steam API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch achievement schema' });
    }
});

// 3. Get Player Badges
app.get('/api/steam/badges/:steamid', async (req, res) => {
    const { steamid } = req.params;

    if (!STEAM_API_KEY) {
        return res.status(500).json({ error: 'Server missing STEAM_API_KEY' });
    }

    try {
        const response = await axios.get(`https://api.steampowered.com/IPlayerService/GetBadges/v1/`, {
            params: {
                key: STEAM_API_KEY,
                steamid: steamid
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Steam API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch badges' });
    }
});


// Basic Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', steam_key_configured: !!STEAM_API_KEY });
});

app.listen(PORT, () => {
    console.log(`✅ Backend server running on http://localhost:${PORT}`);
});
