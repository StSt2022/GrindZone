const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const TextToSpeech = require('@google-cloud/text-to-speech');

// --- Firebase Admin SDK та Multer ---
const admin = require('firebase-admin');
const multer = require('multer');
// --- КІНЕЦЬ Firebase Admin SDK та Multer ---

dotenv.config({ path: './server/config.env' });

const app = express();
const port = process.env.PORT || 3000;

// --- Ініціалізація Firebase Admin ---
let bucket;
try {
    const firebaseKeyPath = process.env.FIREBASE_ADMIN_KEY_PATH || path.join(__dirname, 'FIREBASE_ADMIN_SDK_KEY.json');
    const firebaseAdminConfig = {
        credential: admin.credential.cert(firebaseKeyPath),
        storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET
    };
    if (!firebaseAdminConfig.storageBucket) {
        console.error("ERROR: VITE_FIREBASE_STORAGE_BUCKET is not defined in server environment variables! Avatar upload will not work.");
    } else {
        admin.initializeApp(firebaseAdminConfig);
        bucket = admin.storage().bucket();
        console.log('Firebase Admin SDK initialized successfully. Storage bucket:', bucket.name);
        console.log('Using Firebase service account:', admin.credential.cert().clientEmail);
    }
} catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
}
// --- КІНЕЦЬ Ініціалізації Firebase Admin ---


// --- Налаштування Multer для завантаження файлів в пам'ять ---
const multerUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB ліміт
    },
    fileFilter: (req, file, cb) => {
        // Дозволяємо зображення та відео
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Дозволені тільки файли зображень або відео!'), false);
        }
    }
});
// --- КІНЕЦЬ Налаштування Multer ---

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
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/food-images', express.static(path.join(__dirname, '../src/images')));

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

let ttsClient;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
        ttsClient = new TextToSpeech.TextToSpeechClient();
        console.log('Google Cloud Text-to-Speech client initialized.');
    } catch (e) {
        console.error('Failed to initialize Google Cloud Text-to-Speech client:', e);
        // ... (твій код обробки помилки)
    }
} else {
    console.warn('WARN: GOOGLE_APPLICATION_CREDENTIALS is not set. Voice generation will be disabled.');
}

// --- AUTH ROUTES ---
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
            name, email, password: hashedPassword, googleId: null,
            allowExtraEmails: allowExtraEmails || false,
            joinDate: new Date(),
            profile: {
                avatarUrl: null, // За замовчуванням аватарки немає
                birthDate: null, height: null, weight: null, goal: "", goalKeywords: [],
                dietType: "Збалансована", activityLevel: "Помірний", profileUpdatesCount: 0, lastGoalUpdate: new Date(),
                dailySchedule: { wakeUpTime: "07:00", firstMealTime: "08:00", hydrationReminderTime: "10:00", trainingTime: "18:00", lastMealTime: "20:00", personalTime: "21:00", sleepTime: "23:00" }
            },
            gamification: { level: 1, experiencePoints: 0, trainingsCompleted: 0, totalTimeSpentMinutes: 0, consecutiveActivityDays: 0, lastActivityDay: null },
            unlockedAchievementIds: [],
            createdAt: new Date()
        };
        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'Користувач успішно створений', userId: result.insertedId, name: newUser.name, email: newUser.email, avatarUrl: newUser.profile.avatarUrl });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Помилка сервера під час реєстрації' });
    }
});

// Функція для завантаження URL зображення на Firebase Storage
async function uploadImageToFirebase(imageUrl, userIdForPath, fileNamePrefix = 'google') {
    if (!imageUrl || !bucket) return null; // bucket перевіряється тут

    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            console.warn(`Failed to fetch image from ${imageUrl}. Status: ${response.status}`);
            return null;
        }
        const imageBuffer = Buffer.from(await response.arrayBuffer());
        const fileExtension = imageUrl.split('.').pop().split('?')[0] || 'jpg'; // Отримуємо розширення
        const imageName = `avatars/${userIdForPath}/${fileNamePrefix}-${Date.now()}.${fileExtension}`;
        const file = bucket.file(imageName);

        await file.save(imageBuffer, {
            metadata: { contentType: response.headers.get('content-type') || `image/${fileExtension}` },
            public: true,
        });
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${imageName}`;
        console.log(`Image uploaded to Firebase: ${publicUrl}`);
        return publicUrl;
    } catch (uploadError) {
        console.error(`Error uploading image from ${imageUrl} to Firebase:`, uploadError);
        return null;
    }
}

async function uploadPostMediaToFirebase(file, userId, postId) {
    if (!file || !bucket) return null;

    try {
        const fileExtension = path.extname(file.originalname) || (file.mimetype.startsWith('image/') ? '.jpg' : '.mp4');
        const baseName = path.basename(file.originalname, fileExtension).replace(/\s+/g, '_');
        const fileName = `post-media/${userId}/${postId}/${baseName}-${Date.now()}${fileExtension}`;
        const fileUpload = bucket.file(fileName);

        await fileUpload.save(file.buffer, {
            metadata: { contentType: file.mimetype },
            public: true,
        });

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        console.log(`Post media uploaded to Firebase: ${publicUrl}`);
        return publicUrl;
    } catch (error) {
        console.error(`Error uploading post media for user ${userId}, post ${postId}:`, error);
        return null;
    }
}

app.post('/signup/google', async (req, res) => {
    try {
        const { name, email, googleId, idToken, avatarUrl: clientAvatarUrl } = req.body;
        if (!name || !email || !googleId || !idToken) return res.status(400).json({ message: 'Усі поля від Google є обов’язковими' });
        if (!clientGoogle) return res.status(500).json({ message: 'Серверна помилка конфігурації Google.' });

        const ticket = await clientGoogle.verifyIdToken({ idToken: idToken, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        if (payload['sub'] !== googleId) return res.status(401).json({ message: 'Невірний Google ID' });

        const usersCollection = db.collection('users');
        let user = await usersCollection.findOne({ email });

        let avatarUrlFromGoogle = payload.picture;
        let finalAvatarUrl = clientAvatarUrl || null; // Починаємо з clientAvatarUrl або null

        if (avatarUrlFromGoogle && avatarUrlFromGoogle.startsWith('https://lh3.googleusercontent.com/')) {
            const uploadedGoogleAvatar = await uploadImageToFirebase(avatarUrlFromGoogle, googleId, 'google');
            if (uploadedGoogleAvatar) {
                finalAvatarUrl = uploadedGoogleAvatar;
            }
        }


        if (user) {
            const updateData = { googleId: googleId, name: user.name || name };
            // Оновлюємо аватарку, якщо вона нова (з Firebase) або якщо користувач ще не мав аватарки
            if (finalAvatarUrl && (!user.profile?.avatarUrl || user.profile?.avatarUrl.startsWith('https://lh3.googleusercontent.com/'))) {
                updateData['profile.avatarUrl'] = finalAvatarUrl;
            } else if (!user.profile?.avatarUrl && finalAvatarUrl) { // Якщо аватарки не було
                updateData['profile.avatarUrl'] = finalAvatarUrl;
            } else if (!finalAvatarUrl && user.profile?.avatarUrl === null) { // Якщо і нова і стара null - нічого не робимо
                // нічого не робимо
            } else if (finalAvatarUrl === null && user.profile?.avatarUrl) { // Якщо нова null, а стара була - оновлюємо
                updateData['profile.avatarUrl'] = null;
            }


            if (!user.googleId || Object.keys(updateData).length > 2) { // >2 бо googleId і name завжди є
                await usersCollection.updateOne({ email }, { $set: updateData });
            }
            user = await usersCollection.findOne({ email }); // Перезавантажуємо користувача
            res.status(200).json({ message: 'Користувач успішно увійшов через Google', userId: user._id, email: user.email, name: user.name, avatarUrl: user.profile?.avatarUrl });
        } else {
            const newUser = {
                name: name || payload.name || email.split('@')[0],
                email, googleId, password: null, allowExtraEmails: payload.email_verified || true, joinDate: new Date(),
                profile: {
                    avatarUrl: finalAvatarUrl,
                    birthDate: null, height: null, weight: null, goal: "", goalKeywords: [],
                    dietType: "Збалансована", activityLevel: "Помірний", profileUpdatesCount: 0, lastGoalUpdate: new Date(),
                    dailySchedule: { wakeUpTime: "07:00", firstMealTime: "08:00", hydrationReminderTime: "10:00", trainingTime: "18:00", lastMealTime: "20:00", personalTime: "21:00", sleepTime: "23:00"}
                },
                gamification: { level: 1, experiencePoints: 0, trainingsCompleted: 0, totalTimeSpentMinutes: 0, consecutiveActivityDays: 0, lastActivityDay: null },
                unlockedAchievementIds: [], createdAt: new Date()
            };
            const result = await usersCollection.insertOne(newUser);
            const createdUser = await usersCollection.findOne({ _id: result.insertedId });
            res.status(201).json({ message: 'Користувач успішно створений через Google', userId: result.insertedId, email: createdUser.email, name: createdUser.name, avatarUrl: createdUser.profile?.avatarUrl });
        }
    } catch (error) {
        console.error('Error during Google signup:', error);
        res.status(500).json({ message: 'Помилка сервера при реєстрації через Google' });
    }
});

app.post('/auth/google/fedcm', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: 'Токен не надано' });
        if (!clientGoogle) return res.status(500).json({ message: 'Серверна помилка конфігурації Google.' });

        const ticket = await clientGoogle.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;
        const googleId = payload.sub;
        let avatarUrlFromGoogle = payload.picture;

        if (!email) return res.status(400).json({ message: 'Не вдалося отримати email від Google.' });

        const usersCollection = db.collection('users');
        let user = await usersCollection.findOne({ email });

        let finalAvatarUrl = null; // Починаємо з null
        if (avatarUrlFromGoogle && avatarUrlFromGoogle.startsWith('https://lh3.googleusercontent.com/')) {
            const uploadedGoogleAvatar = await uploadImageToFirebase(avatarUrlFromGoogle, googleId, 'fedcm');
            if (uploadedGoogleAvatar) {
                finalAvatarUrl = uploadedGoogleAvatar;
            }
        }

        if (user) {
            const updateFields = { googleId: googleId, name: user.name || name };
            if (finalAvatarUrl && (!user.profile?.avatarUrl || user.profile.avatarUrl.startsWith('https://lh3.googleusercontent.com/'))) {
                updateFields['profile.avatarUrl'] = finalAvatarUrl;
            } else if (!user.profile?.avatarUrl && finalAvatarUrl) {
                updateFields['profile.avatarUrl'] = finalAvatarUrl;
            } else if (finalAvatarUrl === null && user.profile?.avatarUrl) {
                updateFields['profile.avatarUrl'] = null;
            }


            if (!user.googleId || Object.keys(updateFields).length > 2) {
                await usersCollection.updateOne({ email }, { $set: updateFields });
            }
            user = await usersCollection.findOne({ email });
            res.status(200).json({ message: 'Користувач успішно увійшов через Google', userId: user._id, email: user.email, name: user.name, avatarUrl: user.profile?.avatarUrl });
        } else {
            const newUser = {
                name: name || email.split('@')[0],
                email, googleId, password: null, allowExtraEmails: payload.email_verified || false, joinDate: new Date(),
                profile: {
                    avatarUrl: finalAvatarUrl || null,
                    birthDate: null, height: null, weight: null, goal: "", goalKeywords: [],
                    dietType: "Збалансована", activityLevel: "Помірний", profileUpdatesCount: 0, lastGoalUpdate: new Date(),
                    dailySchedule: { wakeUpTime: "07:00", firstMealTime: "08:00", hydrationReminderTime: "10:00", trainingTime: "18:00", lastMealTime: "20:00", personalTime: "21:00", sleepTime: "23:00"}
                },
                gamification: { level: 1, experiencePoints: 0, trainingsCompleted: 0, totalTimeSpentMinutes: 0, consecutiveActivityDays: 0, lastActivityDay: null },
                unlockedAchievementIds: [], createdAt: new Date()
            };
            const result = await usersCollection.insertOne(newUser);
            const createdUser = await usersCollection.findOne({ _id: result.insertedId });
            res.status(201).json({ message: 'Користувач успішно створений через Google', userId: result.insertedId, email: createdUser.email, name: createdUser.name, avatarUrl: createdUser.profile?.avatarUrl });
        }
    } catch (error) {
        console.error('Error during Google FedCM/Sign-In auth:', error);
        res.status(500).json({ message: 'Помилка сервера при автентифікації через Google' });
    }
});

app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Електронна пошта і пароль обов’язкові' });

        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Користувач із такою поштою не існує' });
        if (!user.password) return res.status(401).json({ message: 'Цей користувач зареєстрований через Google. Використовуйте вхід через Google.' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Неправильний пароль' });

        res.status(200).json({ message: 'Успішний вхід', userId: user._id, name: user.name, email: user.email, avatarUrl: user.profile?.avatarUrl });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'Помилка сервера під час входу' });
    }
});
// --- END AUTH ROUTES ---

// --- PROFILE ROUTES ---
const ALL_ACHIEVEMENTS_DEFINITIONS = [
    { id: "ach01", name: "Перший Рубіж", description: "Завершено перше тренування.", iconName: "FitnessCenter", color: '#a5d6a7' },
    { id: "ach02", name: "Залізна Воля", description: "30 днів тренувань поспіль.", iconName: "EventNote", color: '#ffcc80' }, // Змінив на 30 днів тренувань
    { id: "ach03", name: "Світанок Воїна", description: "20 тренувань до 7 ранку.", iconName: "WbSunny", color: '#ffd54f' },
    { id: "ach04", name: "Майстер Витривалості", description: "100 тренувань загалом.", iconName: "EmojiEvents", color: '#81d4fa' },
    { id: "ach05", name: "Зональний Турист", description: "Відвідано всі зони спортзалу.", iconName: "Explore", color: '#cf9fff' },
    { id: "ach06", name: "Груповий Боєць", description: "Заброньовано 5 групових занять.", iconName: "Group", color: '#f48fb1' },
    { id: "ach07", name: "Нічна Зміна", description: "10 тренувань після 22:00.", iconName: "NightsStay", color: '#90a4ae' },
    { id: "ach08", name: "Профіль Завершено", description: "Заповнено усі основні поля профілю, включаючи аватарку.", iconName: "CheckCircleOutline", color: '#80cbc4' }, // Оновлено опис
    { id: "ach09", name: "Планувальник PRO", description: "Заплановано 7 тренувань наперед.", iconName: "EventAvailable", color: '#ffab91' },
    { id: "ach10", name: "Ранній Старт", description: "Перше тренування протягом 3 днів після реєстрації.", iconName: "StarBorder", color: '#fff59d' },
    { id: "ach11", name: "Відданий Grind'ер", description: "30 днів активності поспіль.", iconName: "Loyalty", color: '#ef9a9a' }, // Змінив на 30 днів активності
];

// Маршрут для завантаження аватарки
app.post('/api/profile/:userId/avatar', multerUpload.single('avatarFile'), async (req, res) => {
    try {
        if (!db) return res.status(503).json({ message: 'База даних недоступна.' });
        if (!bucket) return res.status(503).json({ message: 'Firebase Storage недоступний. Перевірте конфігурацію сервера.'});

        const { userId } = req.params;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Невірний формат ID користувача.' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Файл аватарки не надано.' });
        }

        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено.' });
        }

        // Видалення старої аватарки, якщо вона є і завантажена користувачем (не Google)
        if (user.profile && user.profile.avatarUrl) {
            const oldAvatarUrl = user.profile.avatarUrl;
            // Перевіряємо, чи URL вказує на наш Firebase Storage та чи містить /avatars/userId/
            // Це запобігає видаленню дефолтних аватарок або тих, що не в цій структурі
            if (oldAvatarUrl.startsWith(`https://storage.googleapis.com/${bucket.name}/avatars/${userId}/`)) {
                try {
                    const oldFileName = decodeURIComponent(oldAvatarUrl.split(`${bucket.name}/`)[1].split('?')[0]);
                    await bucket.file(oldFileName).delete();
                    console.log(`Old avatar ${oldFileName} deleted for user ${userId}`);
                } catch (deleteError) {
                    if (deleteError.code === 404) {
                        console.log(`Old avatar ${oldAvatarUrl} not found in Firebase Storage, nothing to delete.`);
                    } else {
                        console.warn(`Could not delete old avatar ${oldAvatarUrl}:`, deleteError.message);
                    }
                }
            }
        }

        // Створюємо унікальне ім'я файлу
        const originalName = req.file.originalname.replace(/\s+/g, '_');
        const fileExtension = path.extname(originalName) || '.jpg'; // Додаємо .jpg якщо розширення немає
        const baseName = path.basename(originalName, fileExtension);
        const fileName = `avatars/${userId}/${baseName}-${Date.now()}${fileExtension}`;
        const fileUpload = bucket.file(fileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
            public: true,
        });

        blobStream.on('error', (error) => {
            console.error('Error uploading to Firebase Storage:', error);
            res.status(500).json({ message: 'Помилка завантаження файлу на сервер.' });
        });

        blobStream.on('finish', async () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

            const result = await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                {
                    $set: { 'profile.avatarUrl': publicUrl, 'profile.lastGoalUpdate': new Date() },
                    $inc: { 'profile.profileUpdatesCount': 1 }
                }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Користувача не знайдено для оновлення аватарки.' });
            }

            // Перевірка ачівки "Профіль Завершено" після завантаження аватарки
            const updatedUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
            const profileForCompletionCheck = updatedUser.profile || {};
            let finalUnlockedIds = new Set(updatedUser.unlockedAchievementIds || []);
            let achievementsModifiedAfterSave = false;
            if (profileForCompletionCheck.avatarUrl && profileForCompletionCheck.birthDate && profileForCompletionCheck.height && profileForCompletionCheck.weight && profileForCompletionCheck.goal && profileForCompletionCheck.dietType && profileForCompletionCheck.activityLevel) {
                if (!finalUnlockedIds.has("ach08")) {
                    finalUnlockedIds.add("ach08");
                    achievementsModifiedAfterSave = true;
                }
            }
            if (achievementsModifiedAfterSave) {
                await usersCollection.updateOne(
                    { _id: updatedUser._id },
                    { $set: { unlockedAchievementIds: Array.from(finalUnlockedIds) } }
                );
            }

            res.status(200).json({
                message: 'Аватарку успішно оновлено!',
                avatarUrl: publicUrl,
                unlockedAchievements: achievementsModifiedAfterSave ? ["ach08"] : [] // Повертаємо ID нової ачівки, якщо розблоковано
            });
        });

        blobStream.end(req.file.buffer);

    } catch (error) {
        console.error('Error uploading avatar:', error);
        if (error.message === 'Дозволені тільки файли зображень!') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Помилка сервера при завантаженні аватарки.' });
    }
});


app.get('/api/profile/:userId', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ message: 'База даних недоступна.' });
        const { userId } = req.params;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Невірний формат ID користувача.' });
        }

        const usersCollection = db.collection('users');
        let user = await usersCollection.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено.' });
        }

        const today = new Date(new Date().setUTCHours(0, 0, 0, 0));
        let consecutiveDays = user.gamification?.consecutiveActivityDays || 0;
        const lastActivityRaw = user.gamification?.lastActivityDay;
        let lastActivityDate = null;
        if (lastActivityRaw) {
            lastActivityDate = new Date(new Date(lastActivityRaw).setUTCHours(0,0,0,0));
        }

        let needsActivityStreakUpdate = false;

        if (!lastActivityDate || lastActivityDate.getTime() < today.getTime()) {
            if (lastActivityDate) {
                const diffTime = today.getTime() - lastActivityDate.getTime();
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    consecutiveDays++;
                } else if (diffDays > 1) {
                    consecutiveDays = 1;
                }
            } else {
                consecutiveDays = 1;
            }
            needsActivityStreakUpdate = true;
        }
        if (needsActivityStreakUpdate) {
            await usersCollection.updateOne(
                { _id: user._id },
                { $set: {
                        'gamification.consecutiveActivityDays': consecutiveDays,
                        'gamification.lastActivityDay': today
                    }}
            );
            if(!user.gamification) user.gamification = {};
            user.gamification.consecutiveActivityDays = consecutiveDays;
            user.gamification.lastActivityDay = today;
        }

        const bookingsCollection = db.collection('bookings');
        const completedUserBookings = await bookingsCollection.find({ userId: user._id, status: 'completed' }).toArray();

        let newAchievementsUnlockedThisSession = false;
        const currentUnlockedIds = new Set(user.unlockedAchievementIds || []);

        const unlockAchievement = (achievementId) => {
            if (!currentUnlockedIds.has(achievementId)) {
                currentUnlockedIds.add(achievementId);
                newAchievementsUnlockedThisSession = true;
            }
        };

        if (completedUserBookings.length > 0) unlockAchievement("ach01");
        if (completedUserBookings.length >= 100) unlockAchievement("ach04");

        const allUserBookingsForClasses = await bookingsCollection.find({ userId: user._id, type: 'class' }).toArray();
        if (allUserBookingsForClasses.length >= 5) unlockAchievement("ach06");

        if (completedUserBookings.filter(b => b.startTime && parseInt(b.startTime.split(':')[0], 10) < 7).length >= 20) unlockAchievement("ach03");
        if (completedUserBookings.filter(b => b.startTime && parseInt(b.startTime.split(':')[0], 10) >= 22).length >= 10) unlockAchievement("ach07");

        const visitedZoneIds = new Set(completedUserBookings.map(b => b.zoneId));
        let allGymZoneIds = [];
        const zonesCollection = db.collection('zones');
        if (zonesCollection) { // Перевірка, чи існує колекція
            allGymZoneIds = (await zonesCollection.find({}, { projection: { id: 1, _id: 0 } }).toArray()).map(z => z.id);
        }
        if (allGymZoneIds.length > 0 && allGymZoneIds.every(zoneId => visitedZoneIds.has(zoneId))) unlockAchievement("ach05");

        const profile = user.profile || {};
        // Оновлена умова для ачівки "Профіль Завершено"
        if (profile.avatarUrl && profile.birthDate && profile.height && profile.weight && profile.goal && profile.dietType && profile.activityLevel) {
            unlockAchievement("ach08");
        }


        if (completedUserBookings.length > 0 && user.joinDate) {
            const firstCompletedBookingDate = new Date(Math.min(...completedUserBookings.map(b => new Date(b.bookingDate).getTime())));
            const joinDate = new Date(user.joinDate);
            if ((firstCompletedBookingDate.getTime() - joinDate.getTime()) <= (3 * 24 * 60 * 60 * 1000)) unlockAchievement("ach10");
        }

        const futureConfirmedBookingsCount = await bookingsCollection.countDocuments({
            userId: user._id, status: 'confirmed',
            bookingDate: { $gte: new Date(new Date().setUTCHours(0,0,0,0)) }
        });
        if (futureConfirmedBookingsCount >= 7) unlockAchievement("ach09");

        if (user.gamification?.consecutiveActivityDays >= 30) {
            unlockAchievement("ach02"); // За 30 днів тренувань (якщо вважати активність = тренування)
            unlockAchievement("ach11"); // За 30 днів активності
        }


        if (newAchievementsUnlockedThisSession) {
            await usersCollection.updateOne(
                { _id: user._id },
                { $set: { unlockedAchievementIds: Array.from(currentUnlockedIds) } }
            );
            user.unlockedAchievementIds = Array.from(currentUnlockedIds);
        }

        const xpPerLevel = 1000;
        const currentTotalXp = user.gamification?.experiencePoints || 0;
        const progressToNextLevel = Math.floor((currentTotalXp % xpPerLevel) / (xpPerLevel / 100));


        const userProfileData = {
            userId: user._id.toString(), name: user.name, email: user.email,
            joinDate: user.joinDate || user.createdAt,
            avatarUrl: user.profile?.avatarUrl || null,
            birthDate: user.profile?.birthDate || null,
            height: user.profile?.height || null,
            weight: user.profile?.weight || null,
            goal: user.profile?.goal || "",
            goalKeywords: user.profile?.goalKeywords || [],
            dietType: user.profile?.dietType || "Збалансована",
            activityLevel: user.profile?.activityLevel || "Помірний",
            profileUpdatesCount: user.profile?.profileUpdatesCount || 0,
            lastGoalUpdate: user.profile?.lastGoalUpdate || user.createdAt,
            wakeUpTime: user.profile?.dailySchedule?.wakeUpTime || "07:00",
            firstMealTime: user.profile?.dailySchedule?.firstMealTime || "08:00",
            hydrationReminderTime: user.profile?.dailySchedule?.hydrationReminderTime || "10:00",
            trainingTime: user.profile?.dailySchedule?.trainingTime || "18:00",
            lastMealTime: user.profile?.dailySchedule?.lastMealTime || "20:00",
            personalTime: user.profile?.dailySchedule?.personalTime || "21:00",
            sleepTime: user.profile?.dailySchedule?.sleepTime || "23:00",
            level: user.gamification?.level || 1,
            experiencePoints: currentTotalXp,
            progressToNextLevel: progressToNextLevel,
            trainingsCompleted: user.gamification?.trainingsCompleted || 0,
            totalTimeSpentMinutes: user.gamification?.totalTimeSpentMinutes || 0,
            totalTimeSpent: user.gamification?.totalTimeSpentMinutes ? `${Math.floor(user.gamification.totalTimeSpentMinutes / 60)} год ${user.gamification.totalTimeSpentMinutes % 60} хв` : "0 год",
            consecutiveActivityDays: user.gamification?.consecutiveActivityDays || 0,
            achievements: ALL_ACHIEVEMENTS_DEFINITIONS.map(def => ({
                ...def,
                unlocked: user.unlockedAchievementIds ? user.unlockedAchievementIds.includes(def.id) : false
            }))
        };

        res.json(userProfileData);

    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Помилка сервера при отриманні профілю.' });
    }
});

app.put('/api/profile/:userId', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ message: 'База даних недоступна.' });
        const { userId } = req.params;
        const updates = req.body;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Невірний формат ID користувача.' });
        }

        const usersCollection = db.collection('users');

        const fieldsToSet = {};
        // Дозволяємо оновлювати avatarUrl, якщо передано (наприклад, для скидання на null)
        // але завантаження файлу йде через окремий ендпоінт.
        if (updates.avatarUrl !== undefined) fieldsToSet['profile.avatarUrl'] = updates.avatarUrl;
        if (updates.birthDate !== undefined) fieldsToSet['profile.birthDate'] = updates.birthDate ? new Date(updates.birthDate) : null;
        if (updates.height !== undefined) fieldsToSet['profile.height'] = updates.height === '' || updates.height === null ? null : parseInt(updates.height, 10);
        if (updates.weight !== undefined) fieldsToSet['profile.weight'] = updates.weight === '' || updates.weight === null ? null : parseInt(updates.weight, 10);
        if (updates.goal !== undefined) fieldsToSet['profile.goal'] = updates.goal;
        if (updates.dietType !== undefined) fieldsToSet['profile.dietType'] = updates.dietType;
        if (updates.activityLevel !== undefined) fieldsToSet['profile.activityLevel'] = updates.activityLevel;

        ['wakeUpTime', 'firstMealTime', 'hydrationReminderTime', 'trainingTime', 'lastMealTime', 'personalTime', 'sleepTime'].forEach(key => {
            if (updates[key] !== undefined) {
                fieldsToSet[`profile.dailySchedule.${key}`] = updates[key];
            }
        });

        const updateOperation = { $inc: { 'profile.profileUpdatesCount': 1 } };
        if (Object.keys(fieldsToSet).length > 0) {
            fieldsToSet['profile.lastGoalUpdate'] = new Date();
            updateOperation.$set = fieldsToSet;
        } else {
            updateOperation.$set = {'profile.lastGoalUpdate': new Date() };
        }

        const result = await usersCollection.updateOne( { _id: new ObjectId(userId) }, updateOperation );
        if (result.matchedCount === 0) return res.status(404).json({ message: 'Користувача не знайдено.' });

        let userAfterUpdate = await usersCollection.findOne({ _id: new ObjectId(userId) });

        let finalUnlockedIds = new Set(userAfterUpdate.unlockedAchievementIds || []);
        let achievementsModifiedAfterSave = false;
        const profileForCompletionCheck = userAfterUpdate.profile || {};
        // Оновлена умова для ачівки "Профіль Завершено"
        if (profileForCompletionCheck.avatarUrl && profileForCompletionCheck.birthDate && profileForCompletionCheck.height && profileForCompletionCheck.weight && profileForCompletionCheck.goal && profileForCompletionCheck.dietType && profileForCompletionCheck.activityLevel) {
            if (!finalUnlockedIds.has("ach08")) {
                finalUnlockedIds.add("ach08");
                achievementsModifiedAfterSave = true;
            }
        }
        if (achievementsModifiedAfterSave) {
            await usersCollection.updateOne(
                { _id: userAfterUpdate._id },
                { $set: { unlockedAchievementIds: Array.from(finalUnlockedIds) } }
            );
            userAfterUpdate.unlockedAchievementIds = Array.from(finalUnlockedIds);
        }

        const xpPerLevel = 1000; // XP потрібні для одного рівня
        const currentTotalXpAfterUpdate = userAfterUpdate.gamification?.experiencePoints || 0;
        const progressToNextLevelAfterUpdate = Math.floor((currentTotalXpAfterUpdate % xpPerLevel) / (xpPerLevel / 100));

        const finalUserProfileData = {
            userId: userAfterUpdate._id.toString(), name: userAfterUpdate.name, email: userAfterUpdate.email,
            joinDate: userAfterUpdate.joinDate || userAfterUpdate.createdAt,
            avatarUrl: userAfterUpdate.profile?.avatarUrl || null,
            birthDate: userAfterUpdate.profile?.birthDate || null,
            height: userAfterUpdate.profile?.height || null,
            weight: userAfterUpdate.profile?.weight || null,
            goal: userAfterUpdate.profile?.goal || "",
            goalKeywords: userAfterUpdate.profile?.goalKeywords || [],
            dietType: userAfterUpdate.profile?.dietType || "Збалансована",
            activityLevel: userAfterUpdate.profile?.activityLevel || "Помірний",
            profileUpdatesCount: userAfterUpdate.profile?.profileUpdatesCount || 0,
            lastGoalUpdate: userAfterUpdate.profile?.lastGoalUpdate || userAfterUpdate.createdAt,
            wakeUpTime: userAfterUpdate.profile?.dailySchedule?.wakeUpTime || "07:00",
            firstMealTime: userAfterUpdate.profile?.dailySchedule?.firstMealTime || "08:00",
            hydrationReminderTime: userAfterUpdate.profile?.dailySchedule?.hydrationReminderTime || "10:00",
            trainingTime: userAfterUpdate.profile?.dailySchedule?.trainingTime || "18:00",
            lastMealTime: userAfterUpdate.profile?.dailySchedule?.lastMealTime || "20:00",
            personalTime: userAfterUpdate.profile?.dailySchedule?.personalTime || "21:00",
            sleepTime: userAfterUpdate.profile?.dailySchedule?.sleepTime || "23:00",
            level: userAfterUpdate.gamification?.level || 1,
            experiencePoints: currentTotalXpAfterUpdate,
            progressToNextLevel: progressToNextLevelAfterUpdate,
            trainingsCompleted: userAfterUpdate.gamification?.trainingsCompleted || 0,
            totalTimeSpentMinutes: userAfterUpdate.gamification?.totalTimeSpentMinutes || 0,
            totalTimeSpent: userAfterUpdate.gamification?.totalTimeSpentMinutes ? `${Math.floor(userAfterUpdate.gamification.totalTimeSpentMinutes / 60)} год ${userAfterUpdate.gamification.totalTimeSpentMinutes % 60} хв` : "0 год",
            consecutiveActivityDays: userAfterUpdate.gamification?.consecutiveActivityDays || 0,
            achievements: ALL_ACHIEVEMENTS_DEFINITIONS.map(def => ({
                ...def,
                unlocked: userAfterUpdate.unlockedAchievementIds ? userAfterUpdate.unlockedAchievementIds.includes(def.id) : false
            }))
        };
        res.status(200).json({ message: 'Профіль успішно оновлено.', user: finalUserProfileData });

    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Помилка сервера при оновленні профілю.' });
    }
});
// --- END PROFILE ROUTES ---

// --- GYM DATA & BOOKING ROUTES ---
app.get('/api/zones', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ message: 'База даних недоступна, спробуйте пізніше.' });
        const zonesCollection = db.collection('zones');
        const zones = await zonesCollection.find({}).toArray();
        res.json(zones);
    } catch (error) {
        console.error('Error fetching zones:', error);
        res.status(500).json({ message: 'Помилка сервера при отриманні зон' });
    }
});

app.get('/api/equipment', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ message: 'База даних недоступна, спробуйте пізніше.' });
        const equipmentCollection = db.collection('equipment');
        const query = {};
        if (req.query.zoneId) {
            query.zoneId = req.query.zoneId;
        }
        const equipment = await equipmentCollection.find(query).toArray();
        res.json(equipment);
    } catch (error) {
        console.error('Error fetching equipment:', error);
        res.status(500).json({ message: 'Помилка сервера при отриманні обладнання' });
    }
});

app.get('/api/group-classes', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ message: 'База даних недоступна, спробуйте пізніше.' });
        const groupClassesCollection = db.collection('group_classes');
        const currentDate = new Date().toISOString().split('T')[0];

        const query = {
            date: { $gte: currentDate }
        };
        if (req.query.date) {
            query.date = req.query.date;
        }

        const groupClasses = await groupClassesCollection
            .find(query)
            .sort({ date: 1, startTime: 1 })
            .toArray();
        res.json(groupClasses);
    } catch (error) {
        console.error('Error fetching group classes:', error);
        res.status(500).json({ message: 'Помилка сервера при отриманні групових занять' });
    }
});

const XP_PER_LEVEL = 1000;
const XP_PER_TRAINING_EVENT = 100;
const XP_PER_MINUTE_OF_TRAINING = 10 / 6;

async function awardExperienceAndLevelUp(userId, bookingType, durationMinutes) {
    if (!db) return;
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) return;

    let gainedXp = XP_PER_TRAINING_EVENT;
    gainedXp += Math.floor(durationMinutes * XP_PER_MINUTE_OF_TRAINING);

    let currentTotalXp = (user.gamification?.experiencePoints || 0) + gainedXp;
    let currentLevel = user.gamification?.level || 1;
    let leveledUp = false;

    const newCalculatedLevel = Math.floor(currentTotalXp / XP_PER_LEVEL) + 1;
    if (newCalculatedLevel > currentLevel) {
        leveledUp = true;
        currentLevel = newCalculatedLevel;
    }

    await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
            $inc: {
                'gamification.trainingsCompleted': 1,
                'gamification.totalTimeSpentMinutes': durationMinutes,
                'gamification.experiencePoints': gainedXp
            },
            $set: {
                'gamification.level': currentLevel
            }
        }
    );

    if (leveledUp) {
        console.log(`User ${userId} leveled up to ${currentLevel}! XP: ${currentTotalXp}`);
    }
}


app.post('/api/bookings', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ message: 'База даних недоступна, спробуйте пізніше.' });

        const bookingsCollection = db.collection('bookings');
        const {
            userId, type, itemId, itemName, zoneId,
            bookingDate, startTime, endTime, duration, bookerPhone
        } = req.body;

        if (!userId) return res.status(401).json({ message: 'Користувач не авторизований.' });
        if (!type || !itemId || !itemName || !bookingDate || !startTime || !endTime || !bookerPhone || !zoneId) {
            return res.status(400).json({ message: 'Не всі обов\'язкові поля для бронювання надані.' });
        }

        let parsedUserId;
        try { parsedUserId = new ObjectId(userId); }
        catch (e) { return res.status(400).json({ message: 'Невірний формат ID користувача.' }); }

        let durationMinutes;
        if (type === 'equipment') {
            durationMinutes = parseInt(duration, 10);
            if (isNaN(durationMinutes) || durationMinutes <= 0) return res.status(400).json({ message: 'Невірна тривалість для тренажера.' });
        } else if (type === 'class') {
            const classDetails = await db.collection('group_classes').findOne({ id: itemId });
            if (!classDetails) return res.status(404).json({ message: 'Групове заняття не знайдено для визначення тривалості.' });
            durationMinutes = classDetails.durationMinutes;
        } else {
            return res.status(400).json({ message: 'Невірний тип бронювання.' });
        }

        const targetBookingDate = new Date(new Date(bookingDate).setUTCHours(0,0,0,0));

        if (type === 'class') {
            const groupClass = await db.collection('group_classes').findOne({ id: itemId });
            if (!groupClass) return res.status(404).json({ message: 'Групове заняття не знайдено.' });
            if (groupClass.bookedUserIds && groupClass.bookedUserIds.length >= groupClass.maxCapacity) {
                return res.status(409).json({ message: 'На жаль, на це заняття вже немає вільних місць.' });
            }
            if (groupClass.bookedUserIds && groupClass.bookedUserIds.includes(parsedUserId.toString())) {
                return res.status(409).json({ message: 'Ви вже записані на це заняття.' });
            }
        } else if (type === 'equipment') {
            const conflictingBooking = await bookingsCollection.findOne({
                itemId: itemId,
                bookingDate: targetBookingDate, // Важливо, щоб дата була саме об'єктом Date
                status: "confirmed",
                $or: [
                    { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
                ]
            });
            if (conflictingBooking) return res.status(409).json({ message: `Тренажер "${itemName}" вже заброньований з ${conflictingBooking.startTime} до ${conflictingBooking.endTime} на цю дату.` });
        }

        const newBooking = {
            userId: parsedUserId, type, itemId, itemName, zoneId,
            bookingDate: targetBookingDate, startTime, endTime,
            durationMinutes, bookerPhone, status: "confirmed", createdAt: new Date()
        };
        const result = await bookingsCollection.insertOne(newBooking);

        if (type === 'class' && result.insertedId) {
            await db.collection('group_classes').updateOne(
                { id: itemId }, { $addToSet: { bookedUserIds: parsedUserId.toString() } }
            );
        }

        // Припускаємо, що "confirmed" бронювання вже є тренуванням для нарахування досвіду.
        // Якщо це не так, і XP нараховуються за "completed", цю логіку треба перемістити.
        if (result.insertedId) {
            await awardExperienceAndLevelUp(userId, type, durationMinutes);
        }

        res.status(201).json({ message: 'Бронювання успішно створено!', bookingId: result.insertedId, bookingDetails: newBooking });

    } catch (error) {
        console.error('Error creating booking:', error);
        if (error.code === 11000) return res.status(409).json({ message: 'Помилка: спроба створити дублікат запису.' });
        res.status(500).json({ message: 'Помилка сервера при створенні бронювання.' });
    }
});
// --- END GYM DATA & BOOKING ROUTES ---


// --- FOOD & CHAT ROUTES ---
app.get('/api/food', async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ message: 'База даних недоступна, спробуйте пізніше.' });
        }
        const foodsCollection = db.collection('food');
        const { name, type, goal, diet, difficulty, isRecommended, diet_special } = req.query;
        const query = {};

        if (name) query.name = { $regex: name, $options: 'i' };
        if (type) query.type = type;
        if (goal) query.goal = goal;

        if (diet_special === 'vegan_or_veganska') {
            query.diet = { $in: ['Веган', 'Веганська'] };
        } else if (diet) {
            query.diet = diet;
        }

        if (difficulty) query.difficulty = difficulty;
        if (isRecommended === 'true') query.isRecommended = true;

        const foodItems = await foodsCollection.find(query).toArray();
        res.json(foodItems);
    } catch (error) {
        console.error('Error fetching food data:', error);
        res.status(500).json({ message: 'Помилка сервера при отриманні даних про їжу' });
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

            const languageCode = 'uk-UA'; // Змінено на українську
            // Голоси для української (перевір список доступних в документації, якщо ці не підійдуть):
            // 'uk-UA-Standard-A' (жіночий, стандартний)
            // 'uk-UA-Wavenet-A' (жіночий, WaveNet)
            // 'uk-UA-Polyglot-1' (чоловічий, може бути експериментальним)
            const voiceName = 'uk-UA-Wavenet-A'; // Спробуємо WaveNet для кращої якості
            const speakingRate = 1.05; // Трохи повільніше для української може бути краще

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
            text: geminiResponseText,
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
// --- END FOOD & CHAT ROUTES ---

// --- COMMUNITY ROUTES ---
const POST_TYPES = ['text', 'question', 'article', 'achievement'];

// Створення нового поста
app.post('/api/posts', multerUpload.single('media'), async (req, res) => {
    try {
        if (!db) return res.status(503).json({ message: 'База даних недоступна.' });

        const { userId, text, type, isAnonymous } = req.body;
        const mediaFile = req.file;

        if (!userId && !isAnonymous) {
            return res.status(401).json({ message: 'Потрібен userId або isAnonymous=true.' });
        }
        if (!text && !mediaFile) {
            return res.status(400).json({ message: 'Текст або медіафайл обов’язкові.' });
        }
        if (type && !POST_TYPES.includes(type)) {
            return res.status(400).json({ message: 'Невірний тип поста.' });
        }

        let parsedUserId = null;
        let author = null;
        if (!isAnonymous && userId) {
            if (!ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'Невірний формат ID користувача.' });
            }
            parsedUserId = new ObjectId(userId);
            const usersCollection = db.collection('users');
            const user = await usersCollection.findOne({ _id: parsedUserId });
            if (!user) {
                return res.status(404).json({ message: 'Користувача не знайдено.' });
            }
            author = {
                id: user._id.toString(),
                name: user.name,
                avatarUrl: user.profile?.avatarUrl || null
            };
        }

        let mediaData = null;
        if (mediaFile) {
            const postId = new ObjectId().toString();
            const mediaUrl = await uploadPostMediaToFirebase(mediaFile, userId || 'anonymous', postId);
            if (mediaUrl) {
                mediaData = {
                    type: mediaFile.mimetype,
                    url: mediaUrl
                };
            }
        }

        const hashtags = (text.match(/#([a-zA-Z0-9_а-яА-ЯіІїЇєЄ]+)/g) || []).map(tag => tag.slice(1));
        const cleanText = text.replace(/#([a-zA-Z0-9_а-яА-ЯіІїЇєЄ]+)/g, '').replace(/\s\s+/g, ' ').trim();

        const newPost = {
            author: isAnonymous ? null : author,
            isAnonymous: !!isAnonymous,
            type: type || 'text',
            text: cleanText,
            media: mediaData,
            likes: 0,
            likedBy: [],
            commentsCount: 0,
            tags: hashtags,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const postsCollection = db.collection('posts');
        const result = await postsCollection.insertOne(newPost);

        res.status(201).json({
            message: 'Пост успішно створено!',
            post: {
                id: result.insertedId.toString(),
                ...newPost,
                author,
                createdAt: newPost.createdAt.toISOString(),
                updatedAt: newPost.updatedAt.toISOString()
            }
        });
    } catch (error) {
        console.error('Error creating post:', error);
        if (error.message === 'Дозволені тільки файли зображень або відео!') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Помилка сервера при створенні поста.' });
    }
});

// Отримання постів із пагінацією та пошуком
app.get('/api/posts', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ message: 'База даних недоступна.' });

        const { searchTerm, page = 1, limit = 10 } = req.query;
        const postsCollection = db.collection('posts');
        const query = {};

        if (searchTerm) {
            query.$or = [
                { text: { $regex: searchTerm, $options: 'i' } },
                { tags: { $regex: searchTerm, $options: 'i' } },
                { 'author.name': { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        const totalPosts = await postsCollection.countDocuments(query);
        const posts = await postsCollection
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .toArray();

        const formattedPosts = posts.map(post => ({
            id: post._id.toString(),
            author: post.isAnonymous ? null : post.author,
            isAnonymous: post.isAnonymous,
            type: post.type,
            timestamp: post.createdAt.toISOString(),
            text: post.text,
            media: post.media,
            likes: post.likes,
            likedByUser: post.likedBy.includes(req.query.userId) || false,
            commentsCount: post.commentsCount,
            tags: post.tags
        }));

        res.json({
            posts: formattedPosts,
            totalPages: Math.ceil(totalPosts / limitNum),
            currentPage: pageNum
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Помилка сервера при отриманні постів.' });
    }
});

// Видалення поста
app.delete('/api/posts/:postId', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ message: 'База даних недоступна.' });

        const { postId } = req.params;
        const { userId } = req.body;

        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Невірний формат ID поста.' });
        }
        if (!userId) {
            return res.status(401).json({ message: 'Потрібен ID користувача.' });
        }

        const postsCollection = db.collection('posts');
        const post = await postsCollection.findOne({ _id: new ObjectId(postId) });

        if (!post) {
            return res.status(404).json({ message: 'Пост не знайдено.' });
        }

        if (!post.isAnonymous && post.author?.id !== userId) {
            return res.status(403).json({ message: 'Ви не можете видалити цей пост.' });
        }

        // Видаляємо медіа з Firebase, якщо є
        if (post.media?.url && post.media.url.startsWith(`https://storage.googleapis.com/${bucket.name}/post-media/`)) {
            try {
                const fileName = decodeURIComponent(post.media.url.split(`${bucket.name}/`)[1].split('?')[0]);
                await bucket.file(fileName).delete();
                console.log(`Post media ${fileName} deleted for post ${postId}`);
            } catch (deleteError) {
                console.warn(`Could not delete post media ${post.media.url}:`, deleteError.message);
            }
        }

        await postsCollection.deleteOne({ _id: new ObjectId(postId) });
        await db.collection('comments').deleteMany({ postId: new ObjectId(postId) });

        res.status(200).json({ message: 'Пост успішно видалено.' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Помилка сервера при видаленні поста.' });
    }
});

// Лайк/дизлайк поста
app.post('/api/posts/:postId/like', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ message: 'База даних недоступна.' });

        const { postId } = req.params;
        const { userId } = req.body;

        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Невірний формат ID поста.' });
        }
        if (!userId || !ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Невірний формат ID користувача.' });
        }

        const postsCollection = db.collection('posts');
        const post = await postsCollection.findOne({ _id: new ObjectId(postId) });

        if (!post) {
            return res.status(404).json({ message: 'Пост не знайдено.' });
        }

        const likedBy = post.likedBy || [];
        const hasLiked = likedBy.includes(userId);

        if (hasLiked) {
            await postsCollection.updateOne(
                { _id: new ObjectId(postId) },
                {
                    $pull: { likedBy: userId },
                    $inc: { likes: -1 }
                }
            );
        } else {
            await postsCollection.updateOne(
                { _id: new ObjectId(postId) },
                {
                    $addToSet: { likedBy: userId },
                    $inc: { likes: 1 }
                }
            );
        }

        const updatedPost = await postsCollection.findOne({ _id: new ObjectId(postId) });
        res.status(200).json({
            message: hasLiked ? 'Лайк знято.' : 'Лайк додано.',
            likes: updatedPost.likes,
            likedByUser: !hasLiked
        });
    } catch (error) {
        console.error('Error liking/unliking post:', error);
        res.status(500).json({ message: 'Помилка сервера при обробці лайка.' });
    }
});

// Скарга на пост
app.post('/api/posts/:postId/report', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ message: 'База даних недоступна.' });

        const { postId } = req.params;
        const { userId } = req.body;

        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Невірний формат ID поста.' });
        }
        if (!userId || !ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Невірний формат ID користувача.' });
        }

        const reportsCollection = db.collection('post_reports');
        const existingReport = await reportsCollection.findOne({ postId: new ObjectId(postId), userId });

        if (existingReport) {
            return res.status(409).json({ message: 'Ви вже поскаржились на цей пост.' });
        }

        await reportsCollection.insertOne({
            postId: new ObjectId(postId),
            userId,
            createdAt: new Date()
        });

        res.status(200).json({ message: 'Скарга на пост успішно надіслана.' });
    } catch (error) {
        console.error('Error reporting post:', error);
        res.status(500).json({ message: 'Помилка сервера при надсиланні скарги.' });
    }
});

// Створення коментаря
app.post('/api/posts/:postId/comments', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ message: 'База даних недоступна.' });

        const { postId } = req.params;
        const { userId, text, isAnonymous } = req.body;

        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Невірний формат ID поста.' });
        }
        if (!text) {
            return res.status(400).json({ message: 'Текст коментаря обов’язковий.' });
        }

        let author = null;
        if (!isAnonymous && userId) {
            if (!ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'Невірний формат ID користувача.' });
            }
            const usersCollection = db.collection('users');
            const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
            if (!user) {
                return res.status(404).json({ message: 'Користувача не знайдено.' });
            }
            author = {
                id: user._id.toString(),
                name: user.name,
                avatarUrl: user.profile?.avatarUrl || null
            };
        }

        const newComment = {
            postId: new ObjectId(postId),
            author: isAnonymous ? null : author,
            isAnonymous: !!isAnonymous,
            text,
            createdAt: new Date()
        };

        const commentsCollection = db.collection('comments');
        const result = await commentsCollection.insertOne(newComment);

        await db.collection('posts').updateOne(
            { _id: new ObjectId(postId) },
            { $inc: { commentsCount: 1 } }
        );

        res.status(201).json({
            message: 'Коментар успішно створено!',
            comment: {
                id: result.insertedId.toString(),
                postId: postId,
                author,
                isAnonymous: newComment.isAnonymous,
                text: newComment.text,
                timestamp: newComment.createdAt.toISOString()
            }
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Помилка сервера при створенні коментаря.' });
    }
});

// Отримання коментарів до поста
app.get('/api/posts/:postId/comments', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ message: 'База даних недоступна.' });

        const { postId } = req.params;

        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Невірний формат ID поста.' });
        }

        const commentsCollection = db.collection('comments');
        const comments = await commentsCollection
            .find({ postId: new ObjectId(postId) })
            .sort({ createdAt: -1 })
            .toArray();

        const formattedComments = comments.map(comment => ({
            id: comment._id.toString(),
            postId: comment.postId.toString(),
            author: comment.isAnonymous ? null : comment.author,
            isAnonymous: comment.isAnonymous,
            text: comment.text,
            timestamp: comment.createdAt.toISOString()
        }));

        res.json(formattedComments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Помилка сервера при отриманні коментарів.' });
    }
});

// Видалення коментаря
app.delete('/api/posts/:postId/comments/:commentId', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ message: 'База даних недоступна.' });

        const { postId, commentId } = req.params;
        const { userId } = req.body;

        if (!ObjectId.isValid(postId) || !ObjectId.isValid(commentId)) {
            return res.status(400).json({ message: 'Невірний формат ID поста або коментаря.' });
        }
        if (!userId || !ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Невірний формат ID користувача.' });
        }

        const commentsCollection = db.collection('comments');
        const comment = await commentsCollection.findOne({ _id: new ObjectId(commentId), postId: new ObjectId(postId) });

        if (!comment) {
            return res.status(404).json({ message: 'Коментар не знайдено.' });
        }

        if (!comment.isAnonymous && comment.author?.id !== userId) {
            return res.status(403).json({ message: 'Ви не можете видалити цей коментар.' });
        }

        await commentsCollection.deleteOne({ _id: new ObjectId(commentId) });
        await db.collection('posts').updateOne(
            { _id: new ObjectId(postId) },
            { $inc: { commentsCount: -1 } }
        );

        res.status(200).json({ message: 'Коментар успішно видалено.' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Помилка сервера при видаленні коментаря.' });
    }
});
// --- END COMMUNITY ROUTES ---

// Catch-all for frontend
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