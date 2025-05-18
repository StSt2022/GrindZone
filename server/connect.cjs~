const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Підключення до MongoDB Atlas
const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri);
let db;

async function connectToMongo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        db = client.db('grindzone'); // Ім’я твоєї бази
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

connectToMongo();

// API-ендпоінт для реєстрації
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
            collection: [], // Порожня колекція
            createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'Користувач успішно створений', userId: result.insertedId });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Обробка завершення роботи
process.on('SIGTERM', async () => {
    console.log('Shutting down server...');
    await client.close();
    process.exit(0);
});