const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
const path = require('path'); // Додаємо path

dotenv.config({ path: './server/config.env' });

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.GOOGLE_CLIENT_ID) {
    console.error('Error: GOOGLE_CLIENT_ID is not defined in config.env');
}
const clientGoogle = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const allowedOrigins = [
    'http://localhost:5173',
    'https://your-app.netlify.app', // Замініть на ваш продакшен URL
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

app.options('*', cors());

app.use(express.json());

// Статичні файли (для SPA)
app.use(express.static(path.join(__dirname, '../client/dist'))); // Додаємо статичні файли

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

// Ваші існуючі ендпоінти (/signup, /signup/google, /auth/google/fedcm, /signin)
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

app.post('/signup/google', async (req, res) => {
    try {
        const { name, email, googleId, idToken } = req.body;
        if (!name || !email || !googleId || !idToken) {
            return res.status(400).json({ message: 'Усі поля від Google є обов’язковими' });
        }
        const ticket = await clientGoogle.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (payload['sub'] !== googleId) {
            return res.status(401).json({ message: 'Невірний Google ID' });
        }
        const usersCollection = db.collection('users');
        let user = await usersCollection.findOne({ email });
        if (user) {
            if (!user.googleId) {
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
                name: name || email.split('@')[0],
                email,
                googleId,
                password: null,
                allowExtraEmails: payload.email_verified || false,
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
        console.error('Error during Google signup:', error);
        if (error.message) {
            if (
                error.message.includes('Token used too late') ||
                error.message.includes('Invalid ID token') ||
                error.message.includes('Invalid token signature')
            ) {
                return res.status(401).json({ message: 'Недійсний або прострочений токен Google' });
            }
            if (error.message.includes('Wrong recipient') || error.message.includes('audience')) {
                console.error(
                    'AUDIENCE MISMATCH: Ensure GOOGLE_CLIENT_ID on server matches the one used by the client.'
                );
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
        const ticket = await clientGoogle.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
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
                name: name || email.split('@')[0],
                email,
                googleId,
                password: null,
                allowExtraEmails: payload.email_verified || false,
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
        console.error('Error during Google FedCM/Sign-In auth:', error);
        if (error.message) {
            if (
                error.message.includes('Token used too late') ||
                error.message.includes('Invalid ID token') ||
                error.message.includes('Invalid token signature')
            ) {
                return res.status(401).json({ message: 'Недійсний або прострочений токен Google' });
            }
            if (error.message.includes('Wrong recipient') || error.message.includes('audience')) {
                console.error(
                    'AUDIENCE MISMATCH: Ensure GOOGLE_CLIENT_ID on server matches the one used by the client.'
                );
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
            return res.status(401).json({
                message: 'Цей користувач зареєстрований через Google. Використовуйте вхід через Google.',
            });
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

// Обробка всіх GET-запитів для SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received. Shutting down gracefully...');
    await clientMongo.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    await clientMongo.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
});