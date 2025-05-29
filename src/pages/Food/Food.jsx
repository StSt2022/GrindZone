import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme.jsx';
import { keyframes } from '@emotion/react';
import Footer from "../../components/Footer.jsx";

import RestaurantIcon from '@mui/icons-material/Restaurant';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NoFoodIcon from '@mui/icons-material/NoFood';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EggIcon from '@mui/icons-material/Egg';
import OilBarrelIcon from '@mui/icons-material/OilBarrel';
import GrainIcon from '@mui/icons-material/Grain';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SpaIcon from '@mui/icons-material/Spa';
import SpeedIcon from '@mui/icons-material/Speed';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TagIcon from '@mui/icons-material/Tag';
import BarChartIcon from '@mui/icons-material/BarChart';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';

const gridLineGlow = keyframes`0% { opacity: 0.05; } 50% { opacity: 0.1; } 100% { opacity: 0.05; }`;
const textFadeInUp = keyframes`from {opacity: 0; transform: translateY(30px) translateZ(0);} to {opacity: 1; transform: translateY(0) translateZ(0);}`;

const gridBackgroundStyles = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, backgroundSize: '60px 60px',
    backgroundImage: `linear-gradient(to right, rgba(138, 43, 226, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(138, 43, 226, 0.04) 1px, transparent 1px)`,
    '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 30%, rgba(138, 43, 226, 0.08), transparent 60%)', animation: `${gridLineGlow} 5s infinite ease-in-out`},
    '&::after': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, rgba(18, 9, 29, 0.98) 0%, rgba(10, 5, 18, 1) 100%)', zIndex: -2},
};

const commonCardStyles = {
    height: '100%',
    background: 'rgba(35, 28, 50, 0.75)',
    backdropFilter: 'none',
    borderRadius: '20px',
    border: '1px solid rgba(138, 43, 226, 0.35)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
    transition: 'all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    willChange: 'transform, box-shadow',
    isolation: 'isolate',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    '&:hover': {
        transform: 'translateY(-10px) scale(1.02) translateZ(0)',
        boxShadow: '0 18px 45px rgba(138, 43, 226, 0.35), 0 0 25px rgba(138, 43, 226, 0.2)',
        '&::before': { opacity: 0.9, height: '5px' }
    },
    '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #a96cff, #c67eff, #8a2be2)', opacity: 0.6, transition: 'opacity 0.35s ease, height 0.35s ease' }
};

const StaticCard = styled(Card)(({ theme }) => ({
    height: '100%',
    background: 'rgba(35, 28, 50, 0.92)',
    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(138, 43, 226, 0.35)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
    position: 'relative', display: 'flex', flexDirection: 'column',
    willChange: 'transform, box-shadow', isolation: 'isolate', overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-7px)',
        boxShadow: '0 14px 35px rgba(138, 43, 226, 0.3), 0 0 20px rgba(138, 43, 226, 0.15)',
        '&::before': { opacity: 1, height: '5px' }
    },
    '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #a96cff, #c67eff, #8a2be2)', opacity: 0.7, transition: 'opacity 0.3s ease, height 0.3s ease', zIndex: 1 }
}));

const foodTypes = ['Сніданок', 'Обід', 'Вечеря', 'Перекус'];
const foodGoals = ['Для масонабору', 'Для схуднення', 'Баланс', 'Протеїнова', 'Веган'];
const foodDiets = ['Кето', 'Веганська', 'Низьковуглеводна', 'Безглютенова', 'Стандартна'];
const foodDifficulties = ['Легка', 'Середня', 'Складна'];

const generateClientSideId = () => `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const FilterControlBaseStyles = {
    height: '44px',
    '& .MuiInputLabel-root': {
        color: 'rgba(230, 220, 255, 0.7)',
        transform: 'translate(14px, 12px) scale(1)',
        fontSize: '0.9rem',
        '&.MuiInputLabel-shrink': { transform: 'translate(14px, -7px) scale(0.75)' }
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#d1a9ff' },
    '& .MuiOutlinedInput-root': {
        height: '100%', color: 'white', fontSize: '0.85rem', borderRadius: '10px',
        background: 'rgba(40, 30, 60, 0.85)',
        '& fieldset': { borderColor: 'rgba(138, 43, 226, 0.35)' },
        '&:hover fieldset': { borderColor: 'rgba(138, 43, 226, 0.65)' },
        '&.Mui-focused fieldset': { borderColor: '#c67eff', boxShadow: '0 0 0 1.5px rgba(198, 126, 255, 0.25)' },
    },
};

const FilterSelectControl = styled(FormControl)(({ theme }) => ({
    ...FilterControlBaseStyles,
    minWidth: 130,
    '& .MuiOutlinedInput-root .MuiSelect-icon': { color: 'rgba(230, 220, 255, 0.65)' },
    '& .MuiSelect-select': { paddingRight: theme.spacing(4), height: '100% !important', display: 'flex', alignItems: 'center' },
    '& .MuiInputAdornment-root': { color: 'rgba(230, 220, 255, 0.65)', marginRight: theme.spacing(0.5)}
}));

const FilterTextField = styled(TextField)(({ theme }) => ({
    ...FilterControlBaseStyles,
    '& .MuiOutlinedInput-root': {
        ...FilterControlBaseStyles['& .MuiOutlinedInput-root'],
        '& input::placeholder': { color: 'rgba(230, 220, 255, 0.4)'},
        '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(230,220,255,0.65)'}
    }
}));

const FilterActionButton = styled(Button)(({theme}) => ({
    height: '44px', borderRadius: '10px',
    background: 'linear-gradient(45deg, #8e44ad 0%, #6a1b9a 100%)',
    color: 'white', fontWeight: '500', fontSize: '0.85rem', padding: '0 16px',
    boxShadow: '0 3px 12px rgba(142, 68, 173, 0.35)',
    transition: 'background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(45deg, #7d3c98 0%, #5a1080 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 5px 18px rgba(142, 68, 173, 0.45)'
    },
    '&.Mui-disabled': {
        background: 'rgba(138, 43, 226, 0.2)', color: 'rgba(255,255,255,0.4)',
        boxShadow: 'none', transform: 'none'
    }
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10, borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
    [`& .${linearProgressClasses.bar}`]: { borderRadius: 5 },
}));

function FoodPage(props) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(true);
    const [currentUser, setCurrentUser] = React.useState(
        isAuthenticated ? { name: "Food User", avatarUrl: "/static/images/avatar/1.jpg" } : null
    );
    const navigate = useNavigate();

    const [dailyGoals] = React.useState({ calories: 2200, protein: 150, fat: 70, carbs: 240 });
    const [dailyConsumed, setDailyConsumed] = React.useState({ calories: 0, protein: 0, fat: 0, carbs: 0 });
    const [meals, setMeals] = React.useState([
        { id: 'breakfast', name: "Сніданок", icon: <BreakfastDiningIcon sx={{ fontSize: '2.5rem', color: '#FFD700' }} />, items: [], totalCalories: 0, time: "08:00" },
        { id: 'lunch', name: "Обід", icon: <LunchDiningIcon sx={{ fontSize: '2.5rem', color: '#FFA07A' }} />, items: [], totalCalories: 0, time: "13:30" },
        { id: 'dinner', name: "Вечеря", icon: <DinnerDiningIcon sx={{ fontSize: '2.5rem', color: '#ADD8E6' }} />, items: [], totalCalories: 0, time: "19:00" },
        { id: 'snacks', name: "Перекус", icon: <BakeryDiningIcon sx={{ fontSize: '2.5rem', color: '#98FB98' }} />, items: [], totalCalories: 0, time: "Між прийомами" },
    ]);

    const [searchTerm, setSearchTerm] = React.useState('');
    const [filters, setFilters] = React.useState({ type: '', goal: '', diet: '', difficulty: '' });
    const [searchResults, setSearchResults] = React.useState([]);
    const [isLoadingSearch, setIsLoadingSearch] = React.useState(false);

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const fetchFoodData = React.useCallback(async (currentSearchTerm, currentFilters, isInitialLoad = false) => {
        setIsLoadingSearch(true);
        const params = new URLSearchParams();

        if (!isInitialLoad) {
            if (currentSearchTerm.trim()) {
                params.append('name', currentSearchTerm.trim());
            }

            const activeFilters = { ...currentFilters };
            if (activeFilters.goal === 'Веган') {
                params.append('diet_special', 'vegan_or_veganska');
                delete activeFilters.goal;
            }

            Object.entries(activeFilters).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value);
                }
            });
        }

        try {
            const response = await fetch(`/api/food?${params.toString()}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
                console.error("Server error fetching food:", errorData.message);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Failed to fetch food data:", error.message);
            setSearchResults([]);
        } finally {
            setIsLoadingSearch(false);
        }
    }, []);

    React.useEffect(() => {
        fetchFoodData('', {}, true);
    }, [fetchFoodData]);

    const handleSearch = () => {
        fetchFoodData(searchTerm, filters, false);
    };


    const handleAddFoodToDailyIntake = (foodItem, portionWeightGrams, mealType) => {
        if (!portionWeightGrams || portionWeightGrams <= 0 || !mealType) {
            alert("Будь ласка, вкажіть вагу порції та тип прийому їжі.");
            return;
        }

        const multiplier = portionWeightGrams / 100;
        const calories = Math.round((foodItem.caloriesPer100g || 0) * multiplier);
        const protein = Math.round((foodItem.protein || 0) * multiplier);
        const fats = Math.round((foodItem.fats || 0) * multiplier);
        const carbs = Math.round((foodItem.carbs || 0) * multiplier);

        setDailyConsumed(prev => ({
            calories: prev.calories + calories,
            protein: prev.protein + protein,
            fat: prev.fat + fats,
            carbs: prev.carbs + carbs,
        }));

        setMeals(prevMeals => prevMeals.map(meal => {
            if (meal.name === mealType) {
                return {
                    ...meal,
                    items: [...meal.items, {
                        id: generateClientSideId(),
                        name: `${foodItem.name || 'Невідома страва'} (${portionWeightGrams}г)`,
                        calories, protein, fats, carbs
                    }],
                    totalCalories: meal.totalCalories + calories,
                };
            }
            return meal;
        }));
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
                <Box sx={gridBackgroundStyles} />

                <Box sx={{ flexGrow: 1, py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 5, backgroundColor: 'rgba(18, 9, 29, 0.8)' }}>
                    <Container maxWidth="xl">
                        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }, color: 'white', textAlign: 'center', mb: { xs: 4, md: 6 }, textShadow: '0 0 15px rgba(198, 126, 255, 0.5)', animation: `${textFadeInUp} 1s ease-out 0.2s backwards` }}>
                            Мій Раціон <RestaurantIcon sx={{ verticalAlign: 'middle', fontSize: 'inherit', color: '#c67eff', filter: 'drop-shadow(0 0 8px rgba(198, 126, 255, 0.7))' }} />
                        </Typography>

                        <Box id="daily-summary-section" sx={{ mb: { xs: 4, md: 6 } }}>
                            <StaticCard sx={{ background: 'rgba(45, 38, 65, 0.9)', p: {xs: 2, sm: 3}, '&::before': { background: 'linear-gradient(90deg, #66bb6a, #a96cff, #42a5f5)'} }}>
                                <CardContent>
                                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'white', mb: 3, textAlign: 'center' }}>Сьогоднішній Прогрес</Typography>
                                    <Grid container spacing={{xs: 2, sm: 3}} justifyContent="center" alignItems="center">
                                        {[
                                            { label: 'Калорії', key: 'calories', icon: <LocalFireDepartmentIcon sx={{mr:0.5, color: '#ff7043'}}/>, consumed: dailyConsumed.calories, goal: dailyGoals.calories, unit: 'ккал', color: '#ff7043', gradient: 'linear-gradient(90deg, #ff7043, #f4511e)' },
                                            { label: 'Білки', key: 'protein', icon: <EggIcon sx={{mr:0.5, color: '#66bb6a'}}/>, consumed: dailyConsumed.protein, goal: dailyGoals.protein, unit: 'г', color: '#66bb6a', gradient: 'linear-gradient(90deg, #66bb6a, #388e3c)' },
                                            { label: 'Жири', key: 'fat', icon: <OilBarrelIcon sx={{mr:0.5, color: '#ffc107'}}/>, consumed: dailyConsumed.fat, goal: dailyGoals.fat, unit: 'г', color: '#ffc107', gradient: 'linear-gradient(90deg, #ffc107, #ffa000)' },
                                            { label: 'Вуглеводи', key: 'carbs', icon: <GrainIcon sx={{mr:0.5, color: '#42a5f5'}}/>, consumed: dailyConsumed.carbs, goal: dailyGoals.carbs, unit: 'г', color: '#42a5f5', gradient: 'linear-gradient(90deg, #42a5f5, #1e88e5)' },
                                        ].map(nutrient => {
                                            const progressValue = nutrient.goal > 0 ? (nutrient.consumed / nutrient.goal) * 100 : 0;
                                            return (
                                                <Grid item xs={12} sm={6} md={3} key={nutrient.key} sx={{textAlign: 'center'}}>
                                                    <Typography variant="h6" sx={{color: 'rgba(230, 220, 255, 0.9)', display:'flex', alignItems:'center', justifyContent:'center'}}>{nutrient.icon}{nutrient.label}</Typography>
                                                    <Typography variant="h4" sx={{color: nutrient.color, fontWeight: 'bold'}}>{nutrient.consumed} / {nutrient.goal} <Box component="span" sx={{fontSize: '1rem', color: 'rgba(230, 220, 255, 0.7)'}}>{nutrient.unit}</Box></Typography>
                                                    <StyledLinearProgress variant="determinate" value={Math.min(progressValue, 100)} sx={{ [`& .${linearProgressClasses.bar}`]: { background: nutrient.gradient } }} />
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </CardContent>
                            </StaticCard>
                        </Box>
                        <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: {xs: 3, md: 4}, fontWeight: 'bold', color: 'white', textShadow: '0 0 10px rgba(198, 126, 255, 0.3)' }}>Прийоми їжі сьогодні</Typography>
                        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }} alignItems="stretch" justifyContent="center" sx={{mb: {xs:4, md:6}}}>
                            {meals.map((meal) => (
                                <Grid item xs={12} sm={6} md={3} key={meal.id}>
                                    <StaticCard sx={{ background: 'rgba(35, 28, 50, 0.85)', '&::before': {background: `linear-gradient(90deg, ${meal.icon.props.sx.color}99, ${meal.icon.props.sx.color}FF)`} }}>
                                        <CardContent sx={{ p: {xs: 2, sm: 2.5}, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: meal.icon.props.sx.color }}>
                                                {meal.icon}
                                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'white', ml: 1.5, fontSize: {xs: '1.1rem', sm: '1.25rem'} }}>{meal.name}</Typography>
                                            </Box>
                                            <Box sx={{mb: 1.5}}>
                                                <Typography variant="caption" sx={{color: 'rgba(230, 220, 255, 0.6)'}}>Час: {meal.time}</Typography>
                                            </Box>
                                            <Box sx={{
                                                flexGrow: 1,
                                                mb: 2,
                                                minHeight: '80px',
                                                overflowY: 'auto',
                                                overflowX: 'auto',
                                                maxHeight: '150px',
                                                maxWidth: '250px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                pr: 1,
                                                '&::-webkit-scrollbar': {
                                                    width: '6px',
                                                    height: '6px'
                                                },
                                                '&::-webkit-scrollbar-thumb': {
                                                    backgroundColor: 'rgba(138, 43, 226, 0.5)',
                                                    borderRadius: '3px'
                                                },
                                                '&::-webkit-scrollbar-track': {
                                                    backgroundColor: 'rgba(255,255,255,0.05)'
                                                }
                                            }}>
                                                {meal.items.length > 0 ? meal.items.map((item) => (
                                                    <Box key={item.id} sx={{mb: 0.5, p:0.5, borderRadius: '6px', background: 'rgba(255,255,255,0.03)', padding: '8px'}}>
                                                        <Typography variant="body2" sx={{ color: 'rgba(230, 220, 255, 0.85)', fontSize: {xs: '0.85rem', sm: '0.9rem'}, whiteSpace: 'nowrap' }}>• {item.name}</Typography>
                                                        <Typography variant="caption" sx={{ color: 'rgba(230, 220, 255, 0.6)', display:'block', pl: '14px' }}>{item.calories} ккал, Б:{item.protein} Ж:{item.fats} В:{item.carbs}</Typography>
                                                    </Box>
                                                )) : (
                                                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                                        <NoFoodIcon sx={{color: 'rgba(230, 220, 255, 0.4)', fontSize: '2.5rem', mb: 0.5}}/>
                                                        <Typography variant="body2" sx={{ color: 'rgba(230, 220, 255, 0.6)', fontStyle: 'italic', textAlign:'center' }}>Нічого не додано</Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white', mt: 'auto', textAlign: 'right' }}>{meal.totalCalories} ккал</Typography>
                                        </CardContent>
                                    </StaticCard>
                                </Grid>
                            ))}
                        </Grid>

                        <Paper elevation={12} sx={{
                            mb: { xs: 4, md: 6 }, p: {xs:2.5, sm:3, md: 3.5},
                            background: 'rgba(28, 22, 48, 0.88)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '22px',
                            border: '1px solid rgba(138, 43, 226, 0.2)',
                            boxShadow: '0 8px 25px rgba(0,0,0, 0.25)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3.5, color: 'white', flexShrink: 0}}>
                                <ManageSearchIcon sx={{mr:1.5, fontSize: '2.8rem', color: '#b388ff', filter: 'drop-shadow(0 0 10px #b388ff77)'}}/>
                                <Typography variant="h5" component="h2" sx={{ fontWeight: '600', textShadow: '0 0 10px rgba(180,130,255,0.4)'}}>
                                    Знайти Страви
                                </Typography>
                            </Box>
                            <Grid container spacing={2} sx={{mb: 3, alignItems: 'stretch', flexShrink: 0}}>
                                <Grid item xs={12} lg={3.5}>
                                    <FilterTextField fullWidth label="Назва страви" variant="outlined" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                                     InputProps={{ startAdornment: ( <InputAdornment position="start"> <SearchIcon /> </InputAdornment> )}}
                                    />
                                </Grid>
                                {[
                                    {name: "type", label: "Тип", options: foodTypes, icon: <RestaurantIcon/>},
                                    {name: "goal", label: "Ціль", options: foodGoals, icon: <FitnessCenterIcon/>},
                                    {name: "diet", label: "Дієта", options: foodDiets, icon: <SpaIcon/>},
                                    {name: "difficulty", label: "Складність", options: foodDifficulties, icon: <SpeedIcon/>},
                                ].map(filter => (
                                    <Grid item xs={6} sm={3} lg={1.875} key={`${filter.name}-select-filter`}>
                                        <FilterSelectControl fullWidth variant="outlined">
                                            <InputLabel id={`${filter.name}-label`}>{filter.label}</InputLabel>
                                            <Select labelId={`${filter.name}-label`} name={filter.name} value={filters[filter.name]} onChange={handleFilterChange} label={filter.label}
                                                    startAdornment={filter.icon ? <InputAdornment position="start">{React.cloneElement(filter.icon, {fontSize: 'small'})}</InputAdornment> : null}
                                                    MenuProps={{ PaperProps: { sx: { maxHeight: 250, backgroundColor: 'rgba(45, 38, 65, 0.98)', backdropFilter: 'blur(8px)', border: '1px solid rgba(138,43,226,0.4)' } } }}>
                                                <MenuItem value=""><em>Всі</em></MenuItem>
                                                {filter.options.map(opt => <MenuItem key={`${filter.name}-option-${opt}`} value={opt}>{opt}</MenuItem>)}
                                            </Select>
                                        </FilterSelectControl>
                                    </Grid>
                                ))}
                                <Grid item xs={12} sm={12} lg={1.5} sx={{ display: 'flex', alignItems: 'stretch' }}>
                                    <FilterActionButton fullWidth startIcon={<SearchIcon />} onClick={handleSearch} disabled={isLoadingSearch}>{isLoadingSearch ? '...' : 'Знайти'}</FilterActionButton>
                                </Grid>
                            </Grid>

                            <Box sx={{
                                flexGrow: 1,
                                minHeight: 0,
                                maxHeight: '700px',
                                overflowY: 'auto',
                                pr: 1,
                                '&::-webkit-scrollbar': {width: '8px'},
                                '&::-webkit-scrollbar-thumb': {backgroundColor: 'rgba(138, 43, 226, 0.6)', borderRadius: '4px'},
                                '&::-webkit-scrollbar-track': {backgroundColor: 'rgba(255,255,255,0.08)'}
                            }}>
                                <Grid container spacing={{ xs: 2, sm: 2.5 }}>
                                    {isLoadingSearch ? (
                                        <Grid item xs={12} sx={{textAlign: 'center', py: 5}}>
                                            <Typography sx={{color: '#c67eff', fontStyle: 'italic'}}>Завантаження результатів...</Typography>
                                        </Grid>
                                    ) : searchResults.length > 0 ? searchResults.map((food) => {
                                        const defaultPortion = food.portionSize || 100;
                                        return (
                                            <Grid item xs={12} sm={6} md={4} key={food._id} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <Card
                                                    component="form"
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        const portion = parseFloat(e.target.elements[`portion-${food._id}`].value);
                                                        const mealType = e.target.elements[`mealType-${food._id}`].value;
                                                        handleAddFoodToDailyIntake(food, portion, mealType);
                                                    }}
                                                    sx={{
                                                        width: '400px',
                                                        minHeight: '600px',
                                                        background: 'rgba(12, 11, 29, 0.9) !important',
                                                        '&:hover': {
                                                            ...commonCardStyles['&:hover'],
                                                            transform: 'translateY(-6px) scale(1.01) translateZ(0)',
                                                        },
                                                        '&::before': {
                                                            background: 'linear-gradient(90deg, #b388ff, #8c5dff)',
                                                        },
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                    }}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        image={food.image ? `/food-images/${food.image}` : `https://via.placeholder.com/400x400.png/2c1f3a/c67eff?text=${encodeURIComponent((food.name || 'Їжа').split(' ')[0])}`}
                                                        alt={food.name || 'Зображення страви'}
                                                        sx={{
                                                            maxWidth: '400px',
                                                            maxHeight: '400px',
                                                            objectFit: 'cover',
                                                            filter: 'brightness(0.9)',
                                                            borderBottom: `2px solid #a96cff`,
                                                        }}
                                                    />
                                                    <CardContent
                                                        sx={{
                                                            p: 1,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            color: 'white',
                                                            flexGrow: 1,
                                                        }}
                                                    >
                                                        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1, fontSize: '1.1rem', lineHeight: 1.3, marginBottom: 2 }}>
                                                            {food.name || 'Назва не вказана'}
                                                        </Typography>

                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                                                            {food.type && <Chip icon={<RestaurantIcon fontSize="small" />} label={food.type} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(230,220,255,0.8)' }} />}
                                                            {food.goal && <Chip icon={<FitnessCenterIcon fontSize="small" />} label={food.goal} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(230,220,255,0.8)' }} />}
                                                            {food.diet && <Chip icon={<SpaIcon fontSize="small" />} label={food.diet} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(230,220,255,0.8)' }} />}
                                                            {food.difficulty && <Chip icon={<SpeedIcon fontSize="small" />} label={food.difficulty} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(230,220,255,0.8)' }} />}
                                                            {food.prepTime && <Chip icon={<ScheduleIcon fontSize="small" />} label={`${food.prepTime} хв`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(230,220,255,0.8)' }} />}
                                                            {food.tags?.slice(0, 5).map(tag => (
                                                                <Chip
                                                                    key={tag}
                                                                    icon={<TagIcon fontSize="small" />}
                                                                    label={tag}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{
                                                                        borderColor: 'rgba(198,126,255,0.35)',
                                                                        color: 'rgba(198,126,255,0.8)',
                                                                        height: '22px',
                                                                        fontSize: '0.65rem',
                                                                        borderRadius: '6px',
                                                                    }}
                                                                />
                                                            ))}
                                                        </Box>

                                                        <Divider sx={{ borderColor: 'rgba(138,43,226,0.2)', my: 1 }} />

                                                        <Grid container spacing={0.5} sx={{ mb: 1.5, fontSize: '0.8rem', color: 'rgba(230,220,255,0.8)' }}>
                                                            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <BarChartIcon fontSize="inherit" sx={{ mr: 0.5, color: '#c67eff' }} /> {food.caloriesPer100g || 0} ккал/100г
                                                            </Grid>
                                                            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <EggIcon fontSize="inherit" sx={{ mr: 0.5, color: '#c67eff' }} /> Б: {food.protein || 0}г
                                                            </Grid>
                                                            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <OilBarrelIcon fontSize="inherit" sx={{ mr: 0.5, color: '#c67eff' }} /> Ж: {food.fats || 0}г
                                                            </Grid>
                                                            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <GrainIcon fontSize="inherit" sx={{ mr: 0.5, color: '#c67eff' }} /> В: {food.carbs || 0}г
                                                            </Grid>
                                                        </Grid>

                                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 'auto', mb: 2 }}>
                                                            <TextField
                                                                name={`portion-${food._id}`}
                                                                label="Вага (г)"
                                                                type="number"
                                                                size="small"
                                                                defaultValue={defaultPortion}
                                                                InputProps={{
                                                                    sx: {
                                                                        color: 'white',
                                                                        borderRadius: '8px',
                                                                        background: 'rgba(55,45,75,0.7)',
                                                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(138,43,226,0.3)' },
                                                                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': { margin: 0, WebkitAppearance: 'none' },
                                                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(138,43,226,0.6)' },
                                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#c67eff' },
                                                                    },
                                                                    inputProps: { min: 1, step: 1 },
                                                                }}
                                                                InputLabelProps={{
                                                                    sx: {
                                                                        color: 'rgba(230,220,255,0.6)',
                                                                        '&.Mui-focused': { color: '#c67eff' },
                                                                    },
                                                                }}
                                                                sx={{ flexGrow: 1 }}
                                                            />

                                                            <FormControl fullWidth size="small" sx={{
                                                                minWidth: 120, flexGrow: 1,
                                                                '& .MuiInputLabel-root': { color: 'rgba(230,220,255,0.6)', '&.Mui-focused': { color: '#c67eff' } },
                                                                '& .MuiOutlinedInput-root': {
                                                                    color: 'white',
                                                                    borderRadius: '8px',
                                                                    background: 'rgba(55,45,75,0.7)',
                                                                    '& fieldset': { borderColor: 'rgba(138,43,226,0.3)' },
                                                                    '&:hover fieldset': { borderColor: 'rgba(138,43,226,0.6)' },
                                                                    '&.Mui-focused fieldset': { borderColor: '#c67eff' },
                                                                    '& .MuiSelect-icon': { color: 'rgba(230,220,255,0.6)' },
                                                                },
                                                            }}>
                                                                <InputLabel>Прийом їжі</InputLabel>
                                                                <Select
                                                                    name={`mealType-${food._id}`}
                                                                    defaultValue={food.type || foodTypes[0]}
                                                                    label="Прийом їжі"
                                                                    MenuProps={{
                                                                        PaperProps: {
                                                                            sx: {
                                                                                maxHeight: 200,
                                                                                backgroundColor: 'rgba(45, 38, 65, 0.95)',
                                                                                backdropFilter: 'blur(5px)',
                                                                                border: '1px solid rgba(138,43,226,0.3)',
                                                                            },
                                                                        },
                                                                    }}
                                                                >
                                                                    {foodTypes.map(mt => (
                                                                        <MenuItem key={mt} value={mt}>{mt}</MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Box>

                                                        <Button
                                                            type="submit"
                                                            fullWidth
                                                            variant="contained"
                                                            startIcon={<AddCircleOutlineIcon />}
                                                            sx={{
                                                                borderRadius: '8px',
                                                                background: 'linear-gradient(45deg, #8e44ad 0%, #c0392b 100%)',
                                                                color: 'white',
                                                                '&:hover': {
                                                                    background: 'linear-gradient(45deg, #7d3c98 0%, #a93226 100%)',
                                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                                                },
                                                            }}
                                                        >
                                                            Додати
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )
                                    }) : (
                                        <Grid item xs={12}>
                                            <Typography sx={{textAlign: 'center', color: 'rgba(230,220,255,0.7)', fontStyle: 'italic', py:5}}>
                                                { searchResults.length === 0 && !isLoadingSearch && (searchTerm || Object.values(filters).some(f => f))
                                                    ? "Страв не знайдено за вашими критеріями. Спробуйте змінити запит."
                                                    : "Використовуйте пошук та фільтри, щоб знайти потрібні страви."
                                                }
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        </Paper>
                    </Container>
                </Box>
                <Footer />
            </Box>
        </AppTheme>
    );
}

export default FoodPage;