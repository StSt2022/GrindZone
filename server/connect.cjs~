const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');

dotenv.config({ path: './server/config.env' });

const app = express();
const port = process.env.PORT || 3000;

const clientGoogle = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors({
    origin: ['http://localhost:5173', 'https://your-app.netlify.app'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}));

app.use(express.json());

app.options('*', cors({
    origin: ['http://localhost:5173', 'https://your-app.netlify.app'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}));

if (!process.env.ATLAS_URI) {
    console.error('Error: ATLAS_URI is not defined in config.env');
    process.exit(1);
}

const client = new MongoClient(process.env.ATLAS_URI);
let db;

async function connectToMongo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        db = client.db('grindzone');
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
            allowExtraEmails: allowExtraEmails || false,
            collection: [],
            createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'Користувач успішно створений', userId: result.insertedId });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Помилка сервера' });
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
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач із такою поштою вже існує' });
        }

        const newUser = {
            name,
            email,
            googleId,
            allowExtraEmails: false,
            collection: [],
            createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'Користувач успішно створений через Google', userId: result.insertedId });
    } catch (error) {
        console.error('Error during Google signup:', error);
        res.status(500).json({ message: 'Помилка сервера при реєстрації через Google' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down server...');
    await client.close();
    process.exit(0);
});