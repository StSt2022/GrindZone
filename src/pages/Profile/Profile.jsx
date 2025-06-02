// src/pages/Profile/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Додано імпорт Link
import {
    Box, Typography, Container, Button, CssBaseline, Card, CardContent,
    Grid, Avatar, Paper, IconButton, Divider, Tooltip, LinearProgress,
    TextField, Alert, Tabs, Tab, CircularProgress, Chip, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import { format, formatDistanceToNow, parseISO, differenceInYears, isValid as isValidDateFn } from 'date-fns';
import { uk } from 'date-fns/locale';

import AppTheme from '../../shared-theme/AppTheme';
import Footer from "../../components/Footer";
import { useAuth } from '../../context/AuthContext';

// Firebase (розкоментуй та налаштуй, коли будеш інтегрувати)
// import { storage } from '../../firebase-config';
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Icons (всі іконки залишаються)
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PersonIcon from '@mui/icons-material/Person';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import FlagIcon from '@mui/icons-material/Flag';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CakeIcon from '@mui/icons-material/Cake';
import HeightIcon from '@mui/icons-material/Height';
import ScaleIcon from '@mui/icons-material/Scale';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import UpdateIcon from '@mui/icons-material/Update';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InfoIcon from '@mui/icons-material/Info';
import EventNoteIcon from '@mui/icons-material/EventNote';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import HotelIcon from '@mui/icons-material/Hotel';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import GroupIcon from '@mui/icons-material/Group';
import ExploreIcon from '@mui/icons-material/Explore';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import AssessmentIcon from '@mui/icons-material/Assessment';


// ... (keyframes, styled компоненти, iconMap, motivationalMessages, activityLevelDescriptions залишаються без змін)
const gridLineGlow = keyframes`0% { opacity: 0.03; } 50% { opacity: 0.07; } 100% { opacity: 0.03; }`;
const textFadeInUp = keyframes`from {opacity: 0; transform: translateY(15px) translateZ(0);} to {opacity: 1; transform: translateY(0) translateZ(0);}`;
const pulseEffect = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(169, 108, 255, 0.4); }
    70% { box-shadow: 0 0 0 8px rgba(169, 108, 255, 0); }
    100% { box-shadow: 0 0 0 0 rgba(169, 108, 255, 0); }
`;

const gridBackgroundStyles = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, backgroundSize: '50px 50px',
    backgroundImage: `linear-gradient(to right, rgba(138, 43, 226, 0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(138, 43, 226, 0.025) 1px, transparent 1px)`,
    '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 20% 20%, rgba(138, 43, 226, 0.05), transparent 50%), radial-gradient(circle at 80% 70%, rgba(100, 100, 255, 0.05), transparent 50%)', animation: `${gridLineGlow} 7s infinite ease-in-out`},
    '&::after': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, rgba(10, 5, 18, 0.98) 0%, rgba(6, 3, 10, 1) 100%)', zIndex: -2},
};

const StyledTabs = styled(Tabs)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    borderBottom: `1px solid rgba(138, 43, 226, 0.3)`,
    '& .MuiTabs-indicator': {
        backgroundColor: '#a96cff',
        height: '3px',
        borderRadius: '3px 3px 0 0',
    },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(16),
    marginRight: theme.spacing(1),
    color: 'rgba(230, 220, 255, 0.7)',
    minWidth: 'auto',
    padding: theme.spacing(1.5, 2.5),
    '&:hover': {
        color: '#e0c7ff',
        opacity: 1,
    },
    '&.Mui-selected': {
        color: '#f0eaff',
        fontWeight: theme.typography.fontWeightMedium,
    },
    '&.Mui-focusVisible': {
        backgroundColor: 'rgba(169, 108, 255, 0.15)',
    },
}));

const ProfileSectionCard = styled(Card)(({ theme }) => ({
    background: 'rgba(25, 18, 40, 0.85)',
    backdropFilter: 'blur(15px)',
    borderRadius: '18px',
    border: '1px solid rgba(138, 43, 226, 0.25)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    animation: `${textFadeInUp} 0.7s ease-out backwards`,
}));

const EditableTextField = styled(TextField)(({theme}) => ({
    '& label.Mui-focused': {
        color: '#a96cff',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#a96cff',
    },
    '& .MuiOutlinedInput-root': {
        color: 'rgba(230, 220, 255, 0.9)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        '& fieldset': {
            borderColor: 'rgba(138, 43, 226, 0.4)',
            borderRadius: '10px',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(169, 108, 255, 0.7)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#a96cff',
            boxShadow: `0 0 0 2px ${alpha('#a96cff', 0.2)}`
        },
        '&.MuiInputBase-multiline': {
            padding: '12.5px 14px',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(230, 220, 255, 0.6)',
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: 'translate(14px, -9px) scale(0.75)',
    },
}));

const AvatarUploader = styled(Box)({
    position: 'relative',
    width: 160,
    height: 160,
    margin: '0 auto',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
    },
});

const AvatarOverlay = styled(Box)({
    position: 'absolute',
    inset: 0,
    backgroundColor: alpha('#12091D', 0.6),
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    '&:hover': { opacity: 1 },
});

const PrimaryButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #c67eff 0%, #a96cff 100%)',
    color: 'white',
    fontWeight: 'bold',
    padding: theme.spacing(1.2, 3.5),
    borderRadius: '30px',
    boxShadow: '0 5px 15px rgba(138, 43, 226, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(45deg, #b065f0 0%, #904de0 100%)',
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 20px rgba(138, 43, 226, 0.4)',
    },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
    borderColor: 'rgba(169, 108, 255, 0.7)',
    color: '#e0c7ff',
    fontWeight: 'bold',
    padding: theme.spacing(1.2, 3.5),
    borderRadius: '30px',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(169, 108, 255, 0.1)',
        borderColor: '#a96cff',
        transform: 'translateY(-2px)',
    },
}));

const iconMap = {
    FitnessCenter: FitnessCenterIcon, EmojiEvents: EmojiEventsIcon, QueryStats: QueryStatsIcon,
    EventNote: EventNoteIcon, DirectionsRun: DirectionsRunIcon, WbSunny: WbSunnyIcon,
    Bedtime: BedtimeIcon, InfoIcon: InfoIcon, Explore: ExploreIcon, Group: GroupIcon,
    NightsStay: NightsStayIcon, CheckCircleOutline: CheckCircleOutlineIcon, EventAvailable: EventAvailableIcon,
    StarBorder: StarBorderIcon, Loyalty: LoyaltyIcon,
    LocalDrink: LocalDrinkIcon, Fastfood: FastfoodIcon, Hotel: HotelIcon, SelfImprovement: SelfImprovementIcon,
    Assessment: AssessmentIcon
};

const motivationalMessages = {
    default: "Твій шлях унікальний. Продовжуй рухатись до своєї версії кращого себе!",
    схуднення: "Твоя ціль — поруч. Кожен день має значення! Пам'ятай про дефіцит калорій та активність.",
    "втрата ваги": "Кожен кілограм – це перемога над собою. Ти зможеш!",
    маса: "М’язи не ростуть за один день, але кожне тренування та правильне харчування їх наближає.",
    "набір ваги": "Будуй своє тіло цеглина за цеглиною. Більше калорій, більше сили!",
    витривалість: "З кожним кроком, з кожним подихом ти стаєш сильнішим. Не зупиняйся на досягнутому!",
    сила: "Відчуй, як сталь підкоряється тобі. Кожен підхід робить тебе непереможним!",
    гнучкість: "Тіло – твій храм. Розвивай гнучкість, щоб відчувати гармонію та свободу рухів.",
    "здоров'я": "Турбота про здоров'я – найкраща інвестиція. Продовжуй в тому ж дусі!",
};
const getMotivationalMessage = (goal, keywords = []) => {
    if (!goal) return motivationalMessages.default;
    const goalLower = goal.toLowerCase();
    for (const keyword in motivationalMessages) {
        if (goalLower.includes(keyword) || (keywords && keywords.some(kw => goalLower.includes(kw.toLowerCase())))) {
            if (motivationalMessages[keyword]) return motivationalMessages[keyword];
        }
    }
    const specificKeywords = ["схуднення", "маса", "витривалість", "сила", "гнучкість", "здоров'я"];
    for (const kw of specificKeywords) {
        if (goalLower.includes(kw)) return motivationalMessages[kw] || motivationalMessages.default;
    }
    return motivationalMessages.default;
};

const activityLevelDescriptions = {
    "Сидячий": "Мінімум або відсутність фізичної активності.",
    "Легкий": "Легкі вправи / активність 1-3 дні/тиждень.",
    "Помірний": "Помірні вправи / активність 3-5 днів/тиждень.",
    "Високий": "Інтенсивні вправи / активність 6-7 днів/тиждень.",
    "Дуже високий": "Дуже інтенсивні вправи, фізична робота або тренування двічі на день."
};


function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>{children}</Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `profile-tab-${index}`,
        'aria-controls': `profile-tabpanel-${index}`,
    };
}


function ProfilePage(props) {
    const navigate = useNavigate();
    const { currentUser: authenticatedUser, logout, isLoadingAuth } = useAuth();

    const [userProfile, setUserProfile] = useState(null);
    const [editableProfile, setEditableProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const fileInputRef = useRef(null);
    const [age, setAge] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isLoadingAuth) {
            return;
        }
        if (!authenticatedUser || !authenticatedUser.userId) {
            setIsLoadingData(false);
            return;
        }

        const fetchUserProfile = async () => {
            setIsLoadingData(true);
            setError(null);
            try {
                const response = await fetch(`/api/profile/${authenticatedUser.userId}`);
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || `Помилка завантаження профілю: ${response.statusText}`);
                }
                const data = await response.json();
                setUserProfile(data);
                setEditableProfile(JSON.parse(JSON.stringify(data)));

                if (data.birthDate) {
                    const userBirthDate = parseISO(data.birthDate);
                    if (isValidDateFn(userBirthDate)) {
                        setAge(differenceInYears(new Date(), userBirthDate));
                    } else {
                        setAge(null);
                    }
                } else {
                    setAge(null);
                }

            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError(err.message);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchUserProfile();
    }, [authenticatedUser, isLoadingAuth]); // Видалив navigate з залежностей, він стабільний

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleEditToggle = () => {
        if (isEditing && userProfile) { // Додав перевірку на userProfile
            setEditableProfile(JSON.parse(JSON.stringify(userProfile)));
        }
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        if (!authenticatedUser || !authenticatedUser.userId || !editableProfile) { // Додав перевірку на editableProfile
            setError("Дані для збереження не готові або користувач не авторизований.");
            return;
        }
        setIsSaving(true);
        setError(null);

        const profileUpdates = {
            avatarUrl: editableProfile.avatarUrl,
            birthDate: editableProfile.birthDate,
            height: editableProfile.height,
            weight: editableProfile.weight,
            goal: editableProfile.goal,
            dietType: editableProfile.dietType,
            activityLevel: editableProfile.activityLevel,
            wakeUpTime: editableProfile.wakeUpTime,
            firstMealTime: editableProfile.firstMealTime,
            hydrationReminderTime: editableProfile.hydrationReminderTime,
            trainingTime: editableProfile.trainingTime,
            lastMealTime: editableProfile.lastMealTime,
            personalTime: editableProfile.personalTime,
            sleepTime: editableProfile.sleepTime,
        };

        try {
            const response = await fetch(`/api/profile/${authenticatedUser.userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileUpdates),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `Помилка збереження профілю: ${response.statusText}`);
            }

            // Оновлюємо userProfile даними з відповіді сервера, якщо вони є
            // Або оновлюємо тим, що відправили + лічильник
            const updatedProfileData = data.user || {
                ...userProfile, // Беремо поточний userProfile за основу
                ...profileUpdates, // Накладаємо зміни, що були відправлені
                // Сервер має оновити profileUpdatesCount та lastGoalUpdate,
                // тому краще покладатися на дані з data.user
                profileUpdatesCount: data.user?.profile?.profileUpdatesCount || (userProfile?.profileUpdatesCount || 0) + 1,
                lastGoalUpdate: data.user?.profile?.lastGoalUpdate || new Date().toISOString()
            };

            setUserProfile(updatedProfileData);
            setEditableProfile(JSON.parse(JSON.stringify(updatedProfileData)));
            setIsEditing(false);

            if (updatedProfileData.birthDate) {
                const userBirthDate = parseISO(updatedProfileData.birthDate);
                if (isValidDateFn(userBirthDate)) {
                    setAge(differenceInYears(new Date(), userBirthDate));
                }
            }
            // Можна показати Snackbar з повідомленням про успіх
            // showSnackbar("Профіль успішно оновлено!", "success"); // Якщо є функція showSnackbar
        } catch (err) {
            console.error("Failed to save profile:", err);
            setError(err.message);
            // showSnackbar(`Помилка збереження: ${err.message}`, "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleNumericInputChange = (e) => {
        const { name, value } = e.target;
        const numValue = value === '' ? '' : parseInt(value, 10);
        if (value === '' || (!isNaN(numValue) && numValue >= 0 && numValue <= 300)) {
            setEditableProfile(prev => ({ ...prev, [name]: numValue }));
        }
    };

    const handleAvatarFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setIsLoadingData(true);
            setError(null);
            try {
                const formData = new FormData();
                formData.append('avatarFile', file);
                const response = await fetch(`/api/profile/${authenticatedUser.userId}/avatar`, {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Помилка завантаження аватарки');
                }
                const data = await response.json();
                setEditableProfile(prev => ({ ...prev, avatarUrl: data.avatarUrl }));
                setUserProfile(prev => ({ ...prev, avatarUrl: data.avatarUrl }));
                if (data.unlockedAchievements && data.unlockedAchievements.length > 0) {
                    setUserProfile(prev => ({
                        ...prev,
                        achievements: prev.achievements.map(ach =>
                            data.unlockedAchievements.includes(ach.id) ? { ...ach, unlocked: true } : ach
                        ),
                    }));
                }
            } catch (error) {
                console.error("Помилка завантаження аватара:", error);
                setError(error.message || "Помилка завантаження зображення.");
            } finally {
                setIsLoadingData(false);
            }
        }
    };

    const handleLogoutClick = () => {
        logout();
        navigate('/');
    };

    if (isLoadingAuth || isLoadingData) {
        return (
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', alignItems: 'center', justifyContent: 'center', background: 'rgba(10, 5, 18, 0.98)' }}>
                    <Box sx={gridBackgroundStyles} />
                    <CircularProgress sx={{color: '#a96cff', mb: 2}} size={60} thickness={4}/>
                    <Typography variant="h5" sx={{color: 'rgba(230, 220, 255, 0.8)', animation: `${textFadeInUp} 1s ease-out`}}>
                        {isLoadingAuth ? "Автентифікація..." : "Завантаження профілю..."}
                    </Typography>
                </Box>
            </AppTheme>
        );
    }

    if (error) {
        return (
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', alignItems: 'center', justifyContent: 'center', p:3 }}>
                    <Box sx={gridBackgroundStyles} />
                    <Alert severity="error" sx={{mb: 2, width: '100%', maxWidth: '600px'}}>Помилка: {error}</Alert>
                    <Button variant="contained" onClick={() => window.location.reload()}>Перезавантажити сторінку</Button>
                </Box>
            </AppTheme>
        );
    }

    if (!authenticatedUser || !userProfile) {
        return (
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', alignItems: 'center', justifyContent: 'center', p:3 }}>
                    <Box sx={gridBackgroundStyles} />
                    <Typography variant="h6" sx={{color: 'rgba(230,220,255,0.7)'}}>
                        Профіль недоступний. Будь ласка, спробуйте <Button component={Link} to="/signin">увійти</Button> знову.
                    </Typography>
                </Box>
            </AppTheme>
        );
    }

    const displayName = userProfile.name || 'Користувач'; // Беремо з userProfile
    const displayEmail = userProfile.email || 'Не вказано'; // Беремо з userProfile
    const displayJoinDate = userProfile.joinDate ? format(parseISO(userProfile.joinDate), 'd MMMM yyyy', { locale: uk }) : 'Невідомо';

    // Деструктуризація для полів, що відображаються та редагуються
    const {
        avatarUrl, birthDate, height, weight, goal, dietType, activityLevel,
        wakeUpTime, trainingTime, sleepTime, firstMealTime, hydrationReminderTime, lastMealTime, personalTime
        // profileUpdatesCount та lastGoalUpdate тепер будуть братися з userProfile для відображення
    } = isEditing ? editableProfile : userProfile;

    // Ці поля завжди беремо з userProfile для відображення, бо вони оновлюються сервером або розраховуються
    const displayProfileUpdatesCount = userProfile.profileUpdatesCount || 0;
    const displayLastGoalUpdate = userProfile.lastGoalUpdate ? formatDistanceToNow(parseISO(userProfile.lastGoalUpdate), { addSuffix: true, locale: uk }) : 'Не оновлювалось';


    const currentMotivationalMessage = getMotivationalMessage(userProfile.goal, userProfile.goalKeywords);


    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', background: 'rgba(10, 5, 18, 1)' }}>
                <Box sx={gridBackgroundStyles} />

                <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, mt: {xs:1, md:3}, position: 'relative', zIndex: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, justifyContent: 'space-between', alignItems: 'center', mb: {xs: 2, md: 3}, animation: `${textFadeInUp} 0.5s ease-out` }}>
                        <Box sx={{display: 'flex', alignItems: 'center', mb: {xs: 2, sm: 0}}}>
                            <AvatarUploader onClick={() => isEditing && fileInputRef.current.click()}>
                                <Avatar
                                    alt={displayName}
                                    src={avatarUrl || '/default-avatar.png'}
                                    sx={{ width: '100%', height: '100%', border: `4px solid ${isEditing ? '#ffc107' : 'rgba(138, 43, 226, 0.7)'}`, animation: isEditing ? 'none' : `${pulseEffect} 2.5s infinite` }}
                                />
                                {isEditing && (
                                    <AvatarOverlay>
                                        <PhotoCameraIcon sx={{fontSize: '2.5rem', mb: 0.5}}/>
                                        <Typography variant="caption">Змінити</Typography>
                                    </AvatarOverlay>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleAvatarFileChange} accept="image/*" style={{ display: 'none' }}/>
                            </AvatarUploader>
                            <Box sx={{ml: 3}}>
                                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white', fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' } }}>
                                    {displayName}
                                </Typography>
                                <Chip icon={<EmailIcon />} label={displayEmail} size="small" sx={{ color: 'rgba(230, 220, 255, 0.7)', borderColor: 'rgba(138, 43, 226, 0.3)', mt: 0.5, background: 'rgba(255,255,255,0.05)' }}/>
                            </Box>
                        </Box>
                        <Box sx={{display: 'flex', gap: 1.5, mt: {xs: 2, sm: 0}}}>
                            {isEditing ? (
                                <>
                                    <PrimaryButton startIcon={isSaving ? <CircularProgress size={20} color="inherit"/> : <SaveIcon />} onClick={handleSave} disabled={isSaving}>
                                        {isSaving ? "Збереження..." : "Зберегти"}
                                    </PrimaryButton>
                                    <SecondaryButton startIcon={<CancelIcon />} onClick={handleEditToggle} variant="outlined" disabled={isSaving}>
                                        Скасувати
                                    </SecondaryButton>
                                </>
                            ) : (
                                <PrimaryButton startIcon={<EditIcon />} onClick={handleEditToggle}>Редагувати профіль</PrimaryButton>
                            )}
                        </Box>
                    </Box>

                    {currentMotivationalMessage && !isEditing && (
                        <Alert icon={<LightbulbIcon fontSize="inherit" />} severity="info" sx={{ mb: 3, backgroundColor: 'rgba(138, 43, 226, 0.1)', color: '#e0c7ff', border: '1px solid rgba(138, 43, 226, 0.3)', '.MuiAlert-icon': { color: '#c67eff' }, animation: `${textFadeInUp} 0.7s ease-out 0.2s backwards`, fontSize: '1rem' }}>
                            {currentMotivationalMessage}
                        </Alert>
                    )}

                    <ProfileSectionCard sx={{animationDelay: '0.1s'}}>
                        <StyledTabs value={tabValue} onChange={handleTabChange} aria-label="профільні вкладки" variant="scrollable" scrollButtons="auto">
                            <StyledTab label="Загальне" icon={<PersonIcon />} iconPosition="start" {...a11yProps(0)} />
                            <StyledTab label="Фізичні дані" icon={<FitnessCenterIcon />} iconPosition="start" {...a11yProps(1)} />
                            <StyledTab label="Прогрес та Статистика" icon={<AssessmentIcon />} iconPosition="start" {...a11yProps(2)} />
                            <StyledTab label="Режим дня" icon={<WatchLaterIcon />} iconPosition="start" {...a11yProps(3)} />
                        </StyledTabs>

                        <TabPanel value={tabValue} index={0}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={7}>
                                    <Typography variant="h6" gutterBottom sx={{color: '#e0c7ff', mb: 2}}>Основна інформація</Typography>
                                    <InfoDisplay label="В GrindЗоні з" value={displayJoinDate} icon={<CalendarMonthIcon />}/>
                                    {/* Тепер використовуємо displayProfileUpdatesCount та displayLastGoalUpdate */}
                                    <InfoDisplay label="Оновлень профілю" value={displayProfileUpdatesCount.toString()} icon={<UpdateIcon />}/>
                                    <InfoDisplay label="Останнє оновлення цілей" value={displayLastGoalUpdate} icon={<TrendingUpIcon />}/>
                                    <Box mt={2.5}>
                                        <EditableItem label="Моя головна ціль" name="goal" value={goal} onChange={handleInputChange} isEditing={isEditing} icon={<FlagIcon />} InputProps={{ sx: { overflowY: 'auto', maxHeight: '30px' } }}/>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <Typography variant="h6" gutterBottom sx={{color: '#e0c7ff', mb: 2}}>Мої досягнення ({userProfile.achievements.filter(a=>a.unlocked).length}/{userProfile.achievements.length})</Typography>
                                    <AchievementsList achievements={userProfile.achievements}/>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        {/* ... (решта TabPanel залишається такою ж, як у твоєму коді,
                                але переконайся, що використовуєш змінні `birthDate`, `height` і т.д.
                                з деструктуризації, а не напряму з userProfile/editableProfile, якщо ти їх вже витягнув) ... */}
                        <TabPanel value={tabValue} index={1}>
                            <Typography variant="h6" gutterBottom sx={{color: '#e0c7ff', mb: 2}}>Мої параметри</Typography>
                            <Grid container spacing={isEditing ? 2 : 3} direction="column">
                                <Grid item xs={12} md={isEditing ? 12 : 6} lg={isEditing ? 6 : 4}>
                                    <EditableItem label="Дата народження" name="birthDate" value={birthDate ? format(parseISO(birthDate), 'yyyy-MM-dd') : ''} onChange={handleInputChange} isEditing={isEditing} icon={<CakeIcon />} type="date" />
                                    {!isEditing && age !== null && <Typography variant="caption" sx={{color: 'rgba(230,220,255,0.6)', display: 'block', mt: -1.5, ml: '40px' }}>Повних років: {age}</Typography>}
                                </Grid>
                                <Grid item xs={12} md={isEditing ? 12 : 6} lg={isEditing ? 6 : 4}>
                                    <EditableItem label="Зріст (см)" name="height" value={height || ''} onChange={handleNumericInputChange} isEditing={isEditing} icon={<HeightIcon />} unit="см" type="number"/>
                                </Grid>
                                <Grid item xs={12} md={isEditing ? 12 : 6} lg={isEditing ? 6 : 4}>
                                    <EditableItem label="Вага (кг)" name="weight" value={weight || ''} onChange={handleNumericInputChange} isEditing={isEditing} icon={<ScaleIcon />} unit="кг" type="number"/>
                                </Grid>
                                <Grid item xs={12} md={isEditing ? 12 : 6} lg={isEditing ? 6 : 6}>
                                    <EditableItemSelect label="Тип дієти" name="dietType" value={dietType} onChange={handleInputChange} isEditing={isEditing} icon={<RestaurantMenuIcon />}
                                                        options={["Збалансована", "Високобілкова", "Низьковуглеводна", "Вегетаріанська", "Веганська", "Кето", "Інша"]} />
                                </Grid>
                                <Grid item xs={12} md={isEditing ? 12 : 6} lg={isEditing ? 12 : 6}>
                                    <EditableItemSelect
                                        label="Рівень активності"
                                        name="activityLevel"
                                        value={activityLevel}
                                        onChange={handleInputChange}
                                        isEditing={isEditing}
                                        icon={<DirectionsRunIcon />}
                                        options={Object.keys(activityLevelDescriptions)}
                                    />
                                    {!isEditing && activityLevelDescriptions[activityLevel] && (
                                        <Typography variant="caption" sx={{color: 'rgba(230,220,255,0.6)', display: 'block', mt: -1.5, ml: '40px' }}>
                                            {activityLevelDescriptions[activityLevel]}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                            <Grid container spacing={3} alignItems="stretch">
                                <Grid item xs={12} md={6}>
                                    <Card sx={{background: alpha('#82eefd', 0.05), p:2.5, borderRadius: '12px', border: `1px solid ${alpha('#82eefd', 0.2)}`, height: '100%'}}>
                                        <Typography variant="h6" gutterBottom sx={{color: '#c0f5ff', fontWeight: 500, mb:2}}>Прогрес Рівня ({userProfile.level || 1})</Typography>
                                        <LinearProgress variant="determinate" value={userProfile.progressToNextLevel || 0} sx={{height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.1)', mb: 0.5, '& .MuiLinearProgress-bar': {backgroundColor: '#82eefd'}}} />
                                        <Typography variant="caption" sx={{color: 'rgba(192, 245, 255, 0.8)', display: 'block', textAlign: 'right'}}>{userProfile.progressToNextLevel || 0}% до рівня {(userProfile.level || 1) + 1}</Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{background: alpha('#ffab91', 0.05), p:2.5, borderRadius: '12px', border: `1px solid ${alpha('#ffab91', 0.2)}`, height: '100%'}}>
                                        <Typography variant="h6" gutterBottom sx={{color: '#ffe0d3', fontWeight: 500, mb:2}}>Статистика Тренувань</Typography>
                                        <InfoDisplay label="Завершено тренувань" value={(userProfile.trainingsCompleted || 0).toString()} icon={<FitnessCenterIcon sx={{color: '#ffab91 !important'}} />}/>
                                        <InfoDisplay label="Загальний час в Grind" value={userProfile.totalTimeSpent || '0 год'} icon={<WatchLaterIcon sx={{color: '#ffab91 !important'}} />}/>
                                    </Card>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        <TabPanel value={tabValue} index={3}>
                            <Typography variant="h6" gutterBottom sx={{color: '#e0c7ff', mb: 2}}>Мій типовий розклад</Typography>
                            <Grid container spacing={isEditing ? 2 : 3} direction="column" alignItems="center">
                                <Grid item xs={12} sm={10} md={8} sx={{width: '100%'}}><EditableItem label="Час підйому" name="wakeUpTime" value={wakeUpTime} onChange={handleInputChange} isEditing={isEditing} icon={<WbSunnyIcon />} type="time" /></Grid>
                                <Grid item xs={12} sm={10} md={8} sx={{width: '100%'}}><EditableItem label="Перший прийом їжі" name="firstMealTime" value={firstMealTime} onChange={handleInputChange} isEditing={isEditing} icon={<FastfoodIcon />} type="time" /></Grid>
                                <Grid item xs={12} sm={10} md={8} sx={{width: '100%'}}><EditableItem label="Нагадування пити воду" name="hydrationReminderTime" value={hydrationReminderTime} onChange={handleInputChange} isEditing={isEditing} icon={<LocalDrinkIcon />} type="time" /></Grid>
                                <Grid item xs={12} sm={10} md={8} sx={{width: '100%'}}><EditableItem label="Час тренування" name="trainingTime" value={trainingTime} onChange={handleInputChange} isEditing={isEditing} icon={<FitnessCenterIcon />} type="time" /></Grid>
                                <Grid item xs={12} sm={10} md={8} sx={{width: '100%'}}><EditableItem label="Останній прийом їжі" name="lastMealTime" value={lastMealTime} onChange={handleInputChange} isEditing={isEditing} icon={<FastfoodIcon sx={{transform: 'scaleX(-1)'}} />} type="time" /></Grid>
                                <Grid item xs={12} sm={10} md={8} sx={{width: '100%'}}><EditableItem label="Особистий час / Релакс" name="personalTime" value={personalTime} onChange={handleInputChange} isEditing={isEditing} icon={<SelfImprovementIcon />} type="time" /></Grid>
                                <Grid item xs={12} sm={10} md={8} sx={{width: '100%'}}><EditableItem label="Час сну" name="sleepTime" value={sleepTime} onChange={handleInputChange} isEditing={isEditing} icon={<BedtimeIcon />} type="time" /></Grid>
                            </Grid>
                        </TabPanel>

                    </ProfileSectionCard>

                    <Box sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>
                        <SecondaryButton startIcon={<ExitToAppIcon />} onClick={handleLogoutClick} variant="outlined">
                            Вийти з GrindZone
                        </SecondaryButton>
                    </Box>

                </Container>
                <Footer />
            </Box>
        </AppTheme>
    );
}

const InfoDisplay = ({ label, value, icon, sx }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.8, '&:last-child': {mb: 0}, ...sx }}>
        {React.cloneElement(icon, { sx: { mr: 1.5, color: '#a96cff', fontSize: '1.3rem' } })}
        <Typography variant="body2" sx={{ color: 'rgba(230, 220, 255, 0.7)' }}>{label}:</Typography>
        <Typography variant="body1" sx={{ fontWeight: '500', color: 'white', ml: 1, wordBreak: 'break-word' }}>{value || 'Не вказано'}</Typography>
    </Box>
);

const EditableItem = ({ label, name, value, onChange, isEditing, icon, unit = '', multiline = false, rows = 1, type = "text", InputProps, sx }) => {
    if (isEditing) {
        return (
            <EditableTextField
                fullWidth
                label={label}
                name={name}
                value={value === null || value === undefined ? '' : value}
                onChange={onChange}
                variant="outlined"
                size="small"
                multiline={multiline}
                rows={rows}
                type={type}
                InputLabelProps={type === 'date' || type === 'time' || (multiline && value) ? { shrink: true } : {}}
                InputProps={{
                    ...InputProps,
                    startAdornment: type !== 'date' && type !== 'time' ? React.cloneElement(icon, { sx: { mr: 1, color: 'rgba(230,220,255,0.5)' } }) : null,
                }}
                sx={{mb: 2, ...sx}}
            />
        );
    }
    return <InfoDisplay label={label} value={value ? `${value}${unit}`: 'Не вказано'} icon={icon} sx={sx}/>;
};

const EditableItemSelect = ({ label, name, value, onChange, isEditing, icon, options = [], sx }) => {
    if (isEditing) {
        return (
            <FormControl fullWidth variant="outlined" size="small" sx={{mb: 2, ...sx}}>
                <InputLabel id={`${name}-select-label`} sx={{color: 'rgba(230,220,255,0.6)'}}>{label}</InputLabel>
                <Select
                    labelId={`${name}-select-label`}
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    label={label}
                    startAdornment={React.cloneElement(icon, { sx: { mr: 1, ml:1, color: 'rgba(230,220,255,0.5)' } })}
                    sx={{
                        color: 'rgba(230,220,255,0.9)',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderRadius: '10px',
                        '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(138, 43, 226, 0.4)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(169, 108, 255, 0.7)' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#a96cff', boxShadow: `0 0 0 2px ${alpha('#a96cff', 0.2)}`},
                        '.MuiSelect-icon': { color: 'rgba(230,220,255,0.7)'},
                        '.MuiSelect-select': { paddingLeft: '14px' }
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                backgroundColor: 'rgba(30,23,45,0.95)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(138,43,226,0.3)',
                                color: 'white',
                            }
                        }
                    }}
                >
                    {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </Select>
            </FormControl>
        );
    }
    return <InfoDisplay label={label} value={value || 'Не вказано'} icon={icon} sx={sx}/>;
};

const AchievementsList = ({ achievements }) => (
    <Grid container spacing={1.5}>
        {achievements.map(ach => {
            const AchievementIcon = iconMap[ach.iconName] || InfoIcon;
            return (
                <Grid item xs={6} sm={4} md={6} lg={4} key={ach.id}>
                    <Tooltip title={`${ach.name}: ${ach.description}`} placement="top" arrow
                             componentsProps={{ tooltip: { sx: { backgroundColor: 'rgba(20,10,35,0.95)', backdropFilter: 'blur(5px)', border: '1px solid #a96cff', color: 'white', fontSize: '0.8rem', padding: '6px 10px', textAlign: 'center' }}, arrow: { sx: { color: '#a96cff' }} }}
                    >
                        <Paper sx={{ p: 1.5, textAlign: 'center', background: ach.unlocked ? alpha(ach.color, 0.2) : 'rgba(255,255,255,0.04)', border: `1px solid ${ach.unlocked ? ach.color : 'rgba(138,43,226,0.15)'}`, borderRadius: '12px', opacity: ach.unlocked ? 1 : 0.6, filter: ach.unlocked ? 'none' : 'grayscale(30%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 90, transition: 'all 0.2s ease-in-out', '&:hover': {transform: ach.unlocked ? 'scale(1.05)' : 'none', boxShadow: ach.unlocked ? `0 0 10px ${alpha(ach.color, 0.3)}`: 'none' }}}>
                            <AchievementIcon sx={{ fontSize: '2rem', mb: 0.5, color: ach.unlocked ? ach.color : 'rgba(255,255,255,0.5)' }} />
                            <Typography variant="caption" sx={{ color: ach.unlocked ? 'white' : 'rgba(255,255,255,0.6)', lineHeight: 1.2, fontSize: '0.75rem', fontWeight: ach.unlocked ? 500 : 400 }}>{ach.name}</Typography>
                        </Paper>
                    </Tooltip>
                </Grid>
            );
        })}
    </Grid>
);

export default ProfilePage;