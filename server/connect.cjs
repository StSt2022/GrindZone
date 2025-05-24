const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'config.env') });

const app = express();
const port = process.env.PORT || 3000;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

if (!GOOGLE_CLIENT_ID) {
    console.error('Error: GOOGLE_CLIENT_ID is not defined in environment variables');
    process.exit(1);
}
if (!GOOGLE_CLIENT_SECRET) {
    console.error('Error: GOOGLE_CLIENT_SECRET is not defined in environment variables');
    process.exit(1);
}

const oAuth2Client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
);

const allowedOrigins = [
    'http://localhost:5173',
    'https://grindzone.onrender.com'
];

app.use(
    cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});

app.options('*', cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

if (!process.env.ATLAS_URI) {
    console.error('Error: ATLAS_URI is not defined in environment variables');
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
        const newUser = {
            name,
            email,
            password: hashedPassword,
            googleId: null,
            allowExtraEmails: allowExtraEmails || false,
            collection: [],
            createdAt: new Date(),
        };
        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({
            message: 'Користувач успішно створений',
            userId: result.insertedId,
            name: newUser.name,
            email: newUser.email,
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Помилка сервера під час реєстрації' });
    }
});

app.post('/auth/google/code', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'Authorization code не надано' });
    }

    try {
        const { tokens } = await oAuth2Client.getToken(code);

        if (!tokens.id_token) {
            console.error('Failed to retrieve ID token from Google with the provided code.');
            return res.status(500).json({ message: 'Не вдалося отримати ID token від Google' });
        }

        const ticket = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        const email = payload.email;
        const name = payload.name || payload.given_name || email.split('@')[0];
        const googleId = payload.sub;
        const emailVerified = payload.email_verified || false;

        if (!email || !googleId) {
            return res.status(400).json({ message: 'Не вдалося отримати необхідні дані користувача від Google' });
        }

        const usersCollection = db.collection('users');
        let user = await usersCollection.findOne({ email });

        if (user) {
            if (!user.googleId || user.googleId !== googleId) {
                await usersCollection.updateOne(
                    { email },
                    { $set: { googleId: googleId, name: user.name || name } }
                );
                user = await usersCollection.findOne({ email });
            }
            res.status(200).json({
                message: 'Користувач успішно увійшов через Google',
                userId: user._id,
                email: user.email,
                name: user.name,
            });
        } else {
            const newUser = {
                name: name,
                email,
                googleId,
                password: null,
                allowExtraEmails: emailVerified,
                collection: [],
                createdAt: new Date(),
            };
            const result = await usersCollection.insertOne(newUser);
            const createdUser = await usersCollection.findOne({ _id: result.insertedId });

            res.status(201).json({
                message: 'Користувач успішно створений через Google',
                userId: result.insertedId,
                email: createdUser.email,
                name: createdUser.name,
            });
        }
    } catch (error) {
        console.error('Error during Google Auth Code exchange or user processing:', error);
        if (error.response && error.response.data) {
            const googleError = error.response.data.error;
            const errorDescription = error.response.data.error_description;
            if (googleError === 'invalid_grant' || googleError === 'redirect_uri_mismatch') {
                return res.status(400).json({ message: `Помилка авторизації Google: ${errorDescription || googleError}` });
            }
            return res.status(500).json({ message: `Помилка Google API: ${googleError} - ${errorDescription || 'невідома помилка'}` });
        }
        res.status(500).json({ message: 'Помилка сервера при автентифікації через Google Authorization Code' });
    }
});


/* Закоментовуємо старі ендпоінти, які приймали ID токен напряму
app.post('/signup/google', async (req, res) => { ... });
app.post('/auth/google/fedcm', async (req, res) => { ... });
*/

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
        if (user.googleId && !user.password) { // Якщо зареєстрований через Google і не має пароля
            return res.status(401).json({
                message: 'Цей обліковий запис пов’язаний з Google. Будь ласка, увійдіть через Google.',
            });
        }
        if (!user.password && !user.googleId) { // Незрозумілий стан, але обробимо
            return res.status(401).json({ message: 'Неможливо увійти. Зверніться до підтримки.' });
        }
        if(!user.password && user.googleId) { // Специфічно для тих, хто тільки через Google
            return res.status(401).json({ message: 'Цей користувач зареєстрований через Google. Використовуйте вхід через Google.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неправильний пароль' });
        }
        res.status(200).json({
            message: 'Успішний вхід',
            userId: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'Помилка сервера під час входу' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'), (err) => {
        if (err) {
            console.error(`Error sending file: ${path.join(__dirname, '../dist/index.html')}`, err);
            if (!res.headersSent) {
                res.status(500).send("Error serving the application's main page.");
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received. Shutting down gracefully...');
    if (clientMongo) await clientMongo.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    if (clientMongo) await clientMongo.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
});