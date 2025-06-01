const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
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

// ... (CORS, static, MongoDB connection, AI clients - все залишається як було) ...
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
                avatarUrl: null, birthDate: null, height: null, weight: null, goal: "", goalKeywords: [],
                dietType: "Збалансована", activityLevel: "Помірний", profileUpdatesCount: 0, lastGoalUpdate: new Date(),
                dailySchedule: { wakeUpTime: "07:00", firstMealTime: "08:00", hydrationReminderTime: "10:00", trainingTime: "18:00", lastMealTime: "20:00", personalTime: "21:00", sleepTime: "23:00" }
            },
            gamification: { level: 1, experiencePoints: 0, trainingsCompleted: 0, totalTimeSpentMinutes: 0, consecutiveActivityDays: 0, lastActivityDay: null },
            unlockedAchievementIds: [],
            createdAt: new Date()
        };
        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'Користувач успішно створений', userId: result.insertedId, name: newUser.name, email: newUser.email });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Помилка сервера під час реєстрації' });
    }
});

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

        if (user) {
            if (!user.googleId) {
                await usersCollection.updateOne({ email }, { $set: { googleId: googleId, name: user.name || name, 'profile.avatarUrl': user.profile?.avatarUrl || payload.picture || clientAvatarUrl || null } });
                user = await usersCollection.findOne({ email });
            }
            res.status(200).json({ message: 'Користувач успішно увійшов через Google', userId: user._id, email: user.email, name: user.name });
        } else {
            const newUser = {
                name: name || payload.name || email.split('@')[0],
                email, googleId, password: null, allowExtraEmails: payload.email_verified || true, joinDate: new Date(),
                profile: {
                    avatarUrl: payload.picture || clientAvatarUrl || null,
                    birthDate: null, height: null, weight: null, goal: "", goalKeywords: [],
                    dietType: "Збалансована", activityLevel: "Помірний", profileUpdatesCount: 0, lastGoalUpdate: new Date(),
                    dailySchedule: { wakeUpTime: "07:00", firstMealTime: "08:00", hydrationReminderTime: "10:00", trainingTime: "18:00", lastMealTime: "20:00", personalTime: "21:00", sleepTime: "23:00"}
                },
                gamification: { level: 1, experiencePoints: 0, trainingsCompleted: 0, totalTimeSpentMinutes: 0, consecutiveActivityDays: 0, lastActivityDay: null },
                unlockedAchievementIds: [], createdAt: new Date()
            };
            const result = await usersCollection.insertOne(newUser);
            const createdUser = await usersCollection.findOne({ _id: result.insertedId });
            res.status(201).json({ message: 'Користувач успішно створений через Google', userId: result.insertedId, email: createdUser.email, name: createdUser.name });
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
        const avatarUrl = payload.picture;

        if (!email) return res.status(400).json({ message: 'Не вдалося отримати email від Google.' });

        const usersCollection = db.collection('users');
        let user = await usersCollection.findOne({ email });

        if (user) {
            if (!user.googleId) {
                await usersCollection.updateOne({ email }, { $set: { googleId: googleId, name: user.name || name, 'profile.avatarUrl': user.profile?.avatarUrl || avatarUrl || null } });
                user = await usersCollection.findOne({ email });
            }
            res.status(200).json({ message: 'Користувач успішно увійшов через Google', userId: user._id, email: user.email, name: user.name });
        } else {
            const newUser = {
                name: name || email.split('@')[0],
                email, googleId, password: null, allowExtraEmails: payload.email_verified || false, joinDate: new Date(),
                profile: {
                    avatarUrl: avatarUrl || null,
                    birthDate: null, height: null, weight: null, goal: "", goalKeywords: [],
                    dietType: "Збалансована", activityLevel: "Помірний", profileUpdatesCount: 0, lastGoalUpdate: new Date(),
                    dailySchedule: { wakeUpTime: "07:00", firstMealTime: "08:00", hydrationReminderTime: "10:00", trainingTime: "18:00", lastMealTime: "20:00", personalTime: "21:00", sleepTime: "23:00"}
                },
                gamification: { level: 1, experiencePoints: 0, trainingsCompleted: 0, totalTimeSpentMinutes: 0, consecutiveActivityDays: 0, lastActivityDay: null },
                unlockedAchievementIds: [], createdAt: new Date()
            };
            const result = await usersCollection.insertOne(newUser);
            const createdUser = await usersCollection.findOne({ _id: result.insertedId });
            res.status(201).json({ message: 'Користувач успішно створений через Google', userId: result.insertedId, email: createdUser.email, name: createdUser.name });
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

        res.status(200).json({ message: 'Успішний вхід', userId: user._id, name: user.name, email: user.email });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'Помилка сервера під час входу' });
    }
});
// --- END AUTH ROUTES ---

// --- PROFILE ROUTES ---
const ALL_ACHIEVEMENTS_DEFINITIONS = [
    { id: "ach01", name: "Перший Рубіж", description: "Завершено перше тренування.", iconName: "FitnessCenter", color: '#a5d6a7' },
    { id: "ach02", name: "Залізна Воля", description: "30 днів тренувань поспіль.", iconName: "EventNote", color: '#ffcc80' },
    { id: "ach03", name: "Світанок Воїна", description: "20 тренувань до 7 ранку.", iconName: "WbSunny", color: '#ffd54f' },
    { id: "ach04", name: "Майстер Витривалості", description: "100 тренувань загалом.", iconName: "EmojiEvents", color: '#81d4fa' },
    { id: "ach05", name: "Зональний Турист", description: "Відвідано всі зони спортзалу.", iconName: "Explore", color: '#cf9fff' },
    { id: "ach06", name: "Груповий Боєць", description: "Заброньовано 5 групових занять.", iconName: "Group", color: '#f48fb1' },
    { id: "ach07", name: "Нічна Зміна", description: "10 тренувань після 22:00.", iconName: "NightsStay", color: '#90a4ae' },
    { id: "ach08", name: "Профіль Завершено", description: "Заповнено усі основні поля профілю.", iconName: "CheckCircleOutline", color: '#80cbc4' },
    { id: "ach09", name: "Планувальник PRO", description: "Заплановано 7 тренувань наперед.", iconName: "EventAvailable", color: '#ffab91' },
    { id: "ach10", name: "Ранній Старт", description: "Перше тренування протягом 3 днів після реєстрації.", iconName: "StarBorder", color: '#fff59d' },
    { id: "ach11", name: "Відданий Grind'ер", description: "30 днів активності поспіль.", iconName: "Loyalty", color: '#ef9a9a' },
];

app.get('/api/profile/:userId', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ message: 'База даних недоступна.' });
        const { userId } = req.params;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Невірний формат ID користувача.' });
        }

        const usersCollection = db.collection('users');
        let user = await usersCollection.findOne({ _id: new ObjectId(userId) }); // Змінено на let

        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено.' });
        }

        // ОНОВЛЕННЯ СТРІКУ ЩОДЕННОЇ АКТИВНОСТІ
        const today = new Date(new Date().setUTCHours(0, 0, 0, 0));
        let consecutiveDays = user.gamification?.consecutiveActivityDays || 0;
        const lastActivityRaw = user.gamification?.lastActivityDay;
        let lastActivityDate = null;
        if (lastActivityRaw) {
            lastActivityDate = new Date(new Date(lastActivityRaw).setUTCHours(0,0,0,0));
        }

        let needsActivityStreakUpdate = false; // Чи потрібно оновлювати дані стріка в БД

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
            needsActivityStreakUpdate = true; // Потрібно оновити, бо це новий день активності або перший
        }
        // Якщо needsActivityStreakUpdate true, оновимо в БД і в локальному об'єкті user
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

        // ЛОГІКА ПЕРЕВІРКИ ТА ОНОВЛЕННЯ ІНШИХ АЧІВОК
        const bookingsCollection = db.collection('bookings');
        // Враховуємо бронювання зі статусом 'completed' для більшості ачівок
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

        // Для "Груповий Боєць" можна враховувати і 'confirmed', бо це про факт бронювання
        const allUserBookingsForClasses = await bookingsCollection.find({ userId: user._id, type: 'class' }).toArray();
        if (allUserBookingsForClasses.length >= 5) unlockAchievement("ach06");

        if (completedUserBookings.filter(b => b.startTime && parseInt(b.startTime.split(':')[0], 10) < 7).length >= 20) unlockAchievement("ach03");
        if (completedUserBookings.filter(b => b.startTime && parseInt(b.startTime.split(':')[0], 10) >= 22).length >= 10) unlockAchievement("ach07");

        const visitedZoneIds = new Set(completedUserBookings.map(b => b.zoneId));
        const allGymZoneIds = (await db.collection('zones').find({}, { projection: { id: 1, _id: 0 } }).toArray()).map(z => z.id);
        if (allGymZoneIds.length > 0 && allGymZoneIds.every(zoneId => visitedZoneIds.has(zoneId))) unlockAchievement("ach05");

        const profile = user.profile || {};
        if (profile.birthDate && profile.height && profile.weight && profile.goal && profile.dietType && profile.activityLevel) unlockAchievement("ach08");

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
            unlockAchievement("ach02");
            unlockAchievement("ach11");
        }

        if (newAchievementsUnlockedThisSession) {
            await usersCollection.updateOne(
                { _id: user._id },
                { $set: { unlockedAchievementIds: Array.from(currentUnlockedIds) } }
            );
            user.unlockedAchievementIds = Array.from(currentUnlockedIds);
        }

        const xpPerLevel = 1000; // XP потрібні для одного рівня
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
        if (profileForCompletionCheck.birthDate && profileForCompletionCheck.height && profileForCompletionCheck.weight && profileForCompletionCheck.goal && profileForCompletionCheck.dietType && profileForCompletionCheck.activityLevel) {
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
            experiencePoints: userAfterUpdate.gamification?.experiencePoints || 0,
            progressToNextLevel: userAfterUpdate.gamification?.experiencePoints ? (userAfterUpdate.gamification.experiencePoints % 1000) / 10 : 0, // 1000 XP per level
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
app.get('/api/zones', async (req, res) => { /* ... */ });
app.get('/api/equipment', async (req, res) => { /* ... */ });
app.get('/api/group-classes', async (req, res) => { /* ... */ });

// Функція для нарахування досвіду
const XP_PER_LEVEL = 1000;
const XP_PER_TRAINING_EVENT = 100; // XP за факт тренування
const XP_PER_MINUTE_OF_TRAINING = 10 / 6; // 100 XP за 60 хв = 10/6 XP за хвилину

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

    // Перевірка на підвищення рівня
    // Кожен рівень вимагає XP_PER_LEVEL (1000) очок
    while (currentTotalXp >= (currentLevel * XP_PER_LEVEL)) { // Це не зовсім правильно для простої системи "1000 ХР на рівень"
        // Правильніше було б:
        // while (currentTotalXp >= XP_PER_LEVEL) {
        //    currentTotalXp -= XP_PER_LEVEL;
        //    currentLevel++;
        //    leveledUp = true;
        // }
        // АБО, якщо XP_PER_LEVEL - це поріг для наступного рівня відносно поточного:
        if (currentTotalXp >= currentLevel * XP_PER_LEVEL) { // Це якщо кожен наступний рівень складніший
            // Ця логіка потребує перегляду. Простіша:
            // newLevel = Math.floor(currentTotalXp / XP_PER_LEVEL) + 1;
            // if (newLevel > currentLevel) { leveledUp = true; currentLevel = newLevel; }
            // Або якщо кожен рівень = 1000XP:
            let newLevel = currentLevel;
            let xpForNextLevels = 0;
            for(let i=1; i<=currentLevel; i++) xpForNextLevels += i*XP_PER_LEVEL; // Неправильно для простої системи.
            // Повинно бути просто:

            // Спрощена логіка для "кожен рівень = 1000 ХР"
            const newCalculatedLevel = Math.floor(currentTotalXp / XP_PER_LEVEL) + 1; // +1 бо рівні з 1
            if (newCalculatedLevel > currentLevel) {
                leveledUp = true;
                currentLevel = newCalculatedLevel;
            }
        }
    }
    // Зберігаємо загальну кількість XP, а прогрес до наступного рівня буде розраховуватися на льоту
    // `experiencePoints` тут має бути загальна кількість накопичених очок.
    // Рівень визначається на основі цієї загальної кількості.

    await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
            $inc: {
                'gamification.trainingsCompleted': 1,
                'gamification.totalTimeSpentMinutes': durationMinutes,
                'gamification.experiencePoints': gainedXp // Додаємо зароблені XP до загальних
            },
            $set: {
                'gamification.level': currentLevel // Оновлюємо рівень, якщо він змінився
            }
        }
    );

    if (leveledUp) {
        console.log(`User ${userId} leveled up to ${currentLevel}! XP: ${currentTotalXp}`);
        // Тут можна додати логіку для ачівок за досягнення певних рівнів
        // наприклад, якщо currentLevel === 10, 25, 50 і т.д.
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
                itemId: itemId, bookingDate: targetBookingDate, status: "confirmed",
                $or: [ /* ... умови перетину ... */ ]
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

        // ОНОВЛЕННЯ: Нарахування досвіду та оновлення статистики після бронювання
        // (якщо вважаємо бронювання = тренування)
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
// ... (твій код для /api/food та /api/chat) ...
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

// ... (SIGINT, SIGTERM handlers)
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