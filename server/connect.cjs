const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const TextToSpeech = require('@google-cloud/text-to-speech');

dotenv.config({ path: './server/config.env' });

const app = express();
const port = process.env.PORT || 3000;

let clientGoogle;
if (process.env.GOOGLE_CLIENT_ID) {
    clientGoogle = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
} else {
    console.error('Error: GOOGLE_CLIENT_ID is not defined in config.env');
}

const allowedOrigins = [
    'http://localhost:5173',
    'https://grindzone.onrender.com',
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

app.options('*', cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

if (!process.env.ATLAS_URI) {
    console.error('Error: ATLAS_URI is not defined in config.env');
    process.exit(1);
}

const clientMongo = new MongoClient(process.env.ATLAS_URI);
let db;

async function connectToMongo() {
    try {
        await clientMongo.connect();
        console.log('Connected to MongoDB Atlas');
        db = clientMongo.db('grindzone');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

connectToMongo();

let genAI;
let geminiModel;
const GEMINI_MODEL_NAME = process.env.GEMINI_MODEL_NAME || "gemini-1.5-flash-latest";

if (process.env.GOOGLE_GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    geminiModel = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });
    console.log(`Google Gemini AI client initialized with model ${GEMINI_MODEL_NAME}.`);
} else {
    console.warn('WARN: GOOGLE_GEMINI_API_KEY is not defined. Chat assistant functionality will be limited to mock responses.');
}

// Ініціалізація Google Cloud Text-to-Speech клієнта
let ttsClient;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
        ttsClient = new TextToSpeech.TextToSpeechClient();
        console.log('Google Cloud Text-to-Speech client initialized.');
    } catch (e) {
        console.error('Failed to initialize Google Cloud Text-to-Speech client:', e);
        console.warn('WARN: Ensure GOOGLE_APPLICATION_CREDENTIALS environment variable is set correctly and the JSON key file is accessible.');
    }
} else {
    console.warn('WARN: GOOGLE_APPLICATION_CREDENTIALS is not set. Voice generation will be disabled.');
}


// ... (твій код для /signup, /signup/google, /auth/google/fedcm, /signin залишається без змін) ...
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, allowExtraEmails } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Усі поля обов’язкові' });
        }
        const usersCollection = db.collection('users');
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач із такою поштою вже існує' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { name, email, password: hashedPassword, googleId: null, allowExtraEmails: allowExtraEmails || false, collection: [], createdAt: new Date() };
        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'Користувач успішно створений', userId: result.insertedId, name: newUser.name, email: newUser.email });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Помилка сервера під час реєстрації' });
    }
});

app.post('/signup/google', async (req, res) => {
    try {
        const { name, email, googleId, idToken } = req.body;
        if (!name || !email || !googleId || !idToken) {
            return res.status(400).json({ message: 'Усі поля від Google є обов’язковими' });
        }
        if (!clientGoogle) return res.status(500).json({ message: 'Серверна помилка конфігурації Google.' });
        const ticket = await clientGoogle.verifyIdToken({ idToken: idToken, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        if (payload['sub'] !== googleId) {
            return res.status(401).json({ message: 'Невірний Google ID' });
        }
        const usersCollection = db.collection('users');
        let user = await usersCollection.findOne({ email });
        if (user) {
            if (!user.googleId) {
                await usersCollection.updateOne({ email }, { $set: { googleId: googleId, name: user.name || name } });
                user = await usersCollection.findOne({ email });
            }
            res.status(200).json({ message: 'Користувач успішно увійшов через Google', userId: user._id, email: user.email, name: user.name });
        } else {
            const newUser = { name: name || email.split('@')[0], email, googleId, password: null, allowExtraEmails: payload.email_verified || false, collection: [], createdAt: new Date() };
            const result = await usersCollection.insertOne(newUser);
            const createdUser = await usersCollection.findOne({ _id: result.insertedId });
            res.status(201).json({ message: 'Користувач успішно створений через Google', userId: result.insertedId, email: createdUser.email, name: createdUser.name });
        }
    } catch (error) {
        console.error('Error during Google signup:', error);
        if (error.message) {
            if ( error.message.includes('Token used too late') || error.message.includes('Invalid ID token') || error.message.includes('Invalid token signature') ) {
                return res.status(401).json({ message: 'Недійсний або прострочений токен Google' });
            }
            if (error.message.includes('Wrong recipient') || error.message.includes('audience')) {
                console.error('AUDIENCE MISMATCH: Ensure GOOGLE_CLIENT_ID on server matches the one used by the client.');
                return res.status(401).json({ message: 'Помилка конфігурації Google Client ID.' });
            }
        }
        res.status(500).json({ message: 'Помилка сервера при реєстрації через Google' });
    }
});

app.post('/auth/google/fedcm', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Токен не надано' });
        }
        if (!clientGoogle) {
            console.error('Google client not initialized. Check GOOGLE_CLIENT_ID.');
            return res.status(500).json({ message: 'Серверна помилка конфігурації Google.' });
        }
        const ticket = await clientGoogle.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;
        const googleId = payload.sub;
        if (!email) {
            return res.status(400).json({ message: 'Не вдалося отримати email від Google.' });
        }
        const usersCollection = db.collection('users');
        let user = await usersCollection.findOne({ email });
        if (user) {
            if (!user.googleId) {
                await usersCollection.updateOne({ email }, { $set: { googleId: googleId, name: user.name || name } });
                user = await usersCollection.findOne({ email });
            }
            res.status(200).json({ message: 'Користувач успішно увійшов через Google', userId: user._id, email: user.email, name: user.name });
        } else {
            const newUser = { name: name || email.split('@')[0], email, googleId, password: null, allowExtraEmails: payload.email_verified || false, collection: [], createdAt: new Date() };
            const result = await usersCollection.insertOne(newUser);
            const createdUser = await usersCollection.findOne({ _id: result.insertedId });
            res.status(201).json({ message: 'Користувач успішно створений через Google', userId: result.insertedId, email: createdUser.email, name: createdUser.name });
        }
    } catch (error) {
        console.error('Error during Google FedCM/Sign-In auth:', error);
        if (error.message) {
            if (error.message.includes('Token used too late') || error.message.includes('Invalid ID token') || error.message.includes('Invalid token signature')) {
                return res.status(401).json({ message: 'Недійсний або прострочений токен Google' });
            }
            if (error.message.includes('Wrong recipient') || error.message.includes('audience')) {
                console.error('AUDIENCE MISMATCH: Ensure GOOGLE_CLIENT_ID on server matches the one used by the client.');
                return res.status(401).json({ message: 'Помилка конфігурації Google Client ID.' });
            }
        }
        res.status(500).json({ message: 'Помилка сервера при автентифікації через Google' });
    }
});

app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Електронна пошта і пароль обов’язкові' });
        }
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Користувач із такою поштою не існує' });
        }
        if (!user.password) {
            return res.status(401).json({ message: 'Цей користувач зареєстрований через Google. Використовуйте вхід через Google.' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неправильний пароль' });
        }
        res.status(200).json({ message: 'Успішний вхід', userId: user._id, name: user.name, email: user.email });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'Помилка сервера під час входу' });
    }
});


app.post('/api/chat', async (req, res) => {
    console.log(`[${new Date().toISOString()}] POST /api/chat request received`);
    try {
        const { userMessage, chatHistory: originalChatHistory, siteContext } = req.body;
        console.log(`[${new Date().toISOString()}] User Message: ${userMessage}`);

        if (!userMessage || !siteContext) {
            console.error(`[${new Date().toISOString()}] Missing userMessage or siteContext`);
            return res.status(400).json({ error: "Відсутнє повідомлення користувача або контекст сайту." });
        }

        if (!geminiModel) {
            console.log(`[${new Date().toISOString()}] Gemini AI client not initialized. Returning mock response for chat.`);
            const mockBotReply = `Мок-відповідь: отримано "${userMessage}". Налаштуйте Google Gemini API ключ для реальних відповідей.`;
            return res.json({ text: mockBotReply, audioData: null });
        }

        const geminiHistory = [];
        if (originalChatHistory && originalChatHistory.length > 0) {
            let firstUserMessageFound = false;
            for (const msg of originalChatHistory) {
                const role = msg.sender === 'user' ? 'user' : 'model';
                if (role === 'user') {
                    firstUserMessageFound = true;
                }
                if (firstUserMessageFound) {
                    geminiHistory.push({ role, parts: [{ text: msg.text }] });
                }
            }
            if (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
                geminiHistory.shift();
            }
        }

        console.log(`[${new Date().toISOString()}] Processed Gemini History (length: ${geminiHistory.length}):`, geminiHistory.length > 0 ? geminiHistory[0].role : "empty");

        const chat = geminiModel.startChat({
            history: geminiHistory,
            generationConfig: { maxOutputTokens: 800, temperature: 1.0, },
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ],
        });

        const fullUserPrompt = `Context for GRINDZONE Fitness Club:\n${siteContext}\n\nUser question: ${userMessage}\n\nImportant: Provide response as plain text without any markdown formatting for bolding or emphasis (do not use ** or *).`;

        console.log(`[${new Date().toISOString()}] Sending request to Google Gemini AI (Model: ${GEMINI_MODEL_NAME})...`);
        const result = await chat.sendMessage(fullUserPrompt);
        const response = result.response;
        let geminiResponseText = response.text().trim();

        geminiResponseText = geminiResponseText.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');

        console.log(`[${new Date().toISOString()}] Received response from Google Gemini AI.`);
        console.log(`[${new Date().toISOString()}] Gemini Response Text (cleaned): ${geminiResponseText.substring(0, 150)}...`);

        let audioData = null;
        if (geminiResponseText && ttsClient) {
            let textForSpeech = geminiResponseText;
            textForSpeech = textForSpeech.replace(/[-,;:!?()"]/g, ' ');
            textForSpeech = textForSpeech.replace(/\.{2,}/g, '.');
            textForSpeech = textForSpeech.replace(/\s+/g, ' ').trim();
            console.log(`[${new Date().toISOString()}] Text prepared for TTS: ${textForSpeech.substring(0,150)}...`);

            const languageCode = 'ru-RU';
            const voiceName = 'ru-RU-Chirp3-HD-Leda';
            const speakingRate = 1.15;

            console.log(`[${new Date().toISOString()}] Attempting to generate audio with Google Cloud TTS (Voice: ${voiceName}, Lang: ${languageCode}, Rate: ${speakingRate}.`);

            const ttsRequest = {
                input: { text: textForSpeech },
                voice: {
                    languageCode: languageCode,
                    name: voiceName
                },
                audioConfig: {
                    audioEncoding: 'MP3',
                    speakingRate: speakingRate,
                },
            };
            try {
                const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);
                if (ttsResponse.audioContent) {
                    audioData = `data:audio/mp3;base64,${ttsResponse.audioContent.toString('base64')}`;
                    console.log(`[${new Date().toISOString()}] Audio successfully generated by Google Cloud TTS.`);
                } else {
                    console.warn(`[${new Date().toISOString()}] Google Cloud TTS did not return audio content.`);
                }
            } catch (ttsError) {
                console.error(`[${new Date().toISOString()}] Error calling Google Cloud TTS:`, ttsError);
            }
        } else if (geminiResponseText && !ttsClient) {
            console.warn(`[${new Date().toISOString()}] WARN: Google Cloud TTS client not initialized or GOOGLE_APPLICATION_CREDENTIALS not set. Skipping voice generation.`);
        }

        console.log(`[${new Date().toISOString()}] Sending response to client. Text length: ${geminiResponseText.length}, Audio available: ${!!audioData}`);
        res.json({
            text: geminiResponseText, // Повертаємо оригінальний текст від Gemini (без видалення розділових знаків для відображення)
            audioData: audioData
        });

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Помилка в /api/chat:`, error);
        if (error.message && error.message.includes('[GoogleGenerativeAI Error]')) {
            console.error(`[${new Date().toISOString()}] Google Gemini API Error: ${error.message}`);
            return res.status(500).json({ error: `Помилка при зверненні до Gemini AI: ${error.message}` });
        }
        res.status(500).json({ error: "Внутрішня помилка сервера при обробці чат-запиту." });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'), (err) => {
        if (err) {
            console.error(`Error sending file: ${path.join(__dirname, '../dist/index.html')}`, err);
            res.status(500).send("Error serving the application's main page.");
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received. Shutting down gracefully...');
    if (clientMongo && typeof clientMongo.close === 'function') {
        await clientMongo.close();
        console.log('MongoDB connection closed.');
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    if (clientMongo && typeof clientMongo.close === 'function') {
        await clientMongo.close();
        console.log('MongoDB connection closed.');
    }
    process.exit(0);
});