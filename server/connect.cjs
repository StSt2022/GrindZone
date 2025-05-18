// server/connect.cjs
const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './server/config.env' }); // Adjust path if config.env is elsewhere

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Verify ATLAS_URI is loaded
if (!process.env.ATLAS_URI) {
    console.error('Error: ATLAS_URI is not defined in config.env');
    process.exit(1);
}

// Connect to MongoDB Atlas
const client = new MongoClient(process.env.ATLAS_URI);
let db;

async function connectToMongo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        db = client.db('grindzone'); // Your database name
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

connectToMongo();

// Signup endpoint
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
            collection: [], // Empty collection
            createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'Користувач успішно створений', userId: result.insertedId });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Handle shutdown
process.on('SIGTERM', async () => {
    console.log('Shutting down server...');
    await client.close();
    process.exit(0);
});