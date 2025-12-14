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

// --- UPLOAD CONFIGURATION ---
import multer from 'multer';

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        // Sanitize filename to prevent issues
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, Date.now() + '-' + safeName)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|zip/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (jpg, png, gif) and ZIP files are allowed!'));
        }
    }
}).single('file'); // Define as single here to usage in route

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple JSON DB for Artwork
const DB_FILE = path.join(__dirname, 'artwork.json');
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// --- ROUTES ---

// 0. Artwork Routes
app.get('/api/artwork', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DB_FILE));
        res.json(data);
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch artwork' });
    }
});

app.post('/api/artwork', (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.error('Multer error:', err);
            return res.status(400).json({ error: `Upload error: ${err.message}` });
        } else if (err) {
            // An unknown error occurred when uploading.
            console.error('Unknown upload error:', err);
            return res.status(400).json({ error: err.message });
        }

        // Everything went fine.
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            const { title, description } = req.body;

            const newArtwork = {
                id: Date.now().toString(),
                title: title || 'Untitled',
                description: description || '',
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                uploadedAt: new Date().toISOString(),
                size: req.file.size
            };

            let data = [];
            if (fs.existsSync(DB_FILE)) {
                data = JSON.parse(fs.readFileSync(DB_FILE));
            }
            data.unshift(newArtwork); // Add to top
            fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

            res.json(newArtwork);
        } catch (error) {
            console.error('Upload processing error:', error);
            res.status(500).json({ error: 'Upload failed: ' + error.message });
        }
    });
});

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
