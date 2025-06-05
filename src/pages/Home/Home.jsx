import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme.jsx';
import { keyframes } from '@emotion/react';
import Footer from "../../components/Footer.jsx";

import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';

const gridLineGlow = keyframes`0% { opacity: 0.05; } 50% { opacity: 0.1; } 100% { opacity: 0.05; }`;
const fadeInUp = keyframes`0% { opacity: 0; transform: translateY(10px) translateZ(0); } 50% { opacity: 1; transform: translateY(0) translateZ(0); } 100% { opacity: 0; transform: translateY(-10px) translateZ(0); }`;
const pulseScroll = keyframes`0% { transform: scale(1) translateZ(0); } 50% { transform: scale(1.05) translateZ(0); } 100% { transform: scale(1) translateZ(0); }`;
const energyPulse = keyframes`
    0% {transform: scale(0.5) translateZ(0); opacity: 0; box-shadow: 0 0 0 0 rgba(138, 43, 226, 0.7);}
    50% {opacity: 0.8; box-shadow: 0 0 20px 10px rgba(138, 43, 226, 0.4);}
    100% {transform: scale(1.5) translateZ(0); opacity: 0; box-shadow: 0 0 30px 20px rgba(138, 43, 226, 0);}
`;
const textFadeInUp = keyframes`from {opacity: 0; transform: translateY(30px) translateZ(0);} to {opacity: 1; transform: translateY(0) translateZ(0);}`;


const gridBackgroundStyles = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, backgroundSize: '60px 60px',
    backgroundImage: `linear-gradient(to right, rgba(138, 43, 226, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(138, 43, 226, 0.04) 1px, transparent 1px)`,
    '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 30%, rgba(138, 43, 226, 0.08), transparent 60%)', animation: `${gridLineGlow} 5s infinite ease-in-out`},
    '&::after': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, rgba(18, 9, 29, 0.98) 0%, rgba(10, 5, 18, 1) 100%)', zIndex: -2},
};

const GrowthSlider = styled(Slider)(({ theme }) => ({
    color: '#a96cff', height: 10, '& .MuiSlider-track': { border: 'none', background: 'linear-gradient(90deg, #a96cff 0%, #8A2BE2 70%, #6A0DAD 100%)', borderRadius: 4 },
    '& .MuiSlider-thumb': { height: 26, width: 26, backgroundColor: '#fff', border: '2px solid currentColor', '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': { boxShadow: '0 0 0 8px rgba(169, 108, 255, 0.16)'}, '&:before': { display: 'none'}},
    '& .MuiSlider-valueLabel': { lineHeight: 1.2, fontSize: '0.8rem', fontWeight: 'bold', background: 'unset', padding: 0, width: 'auto', minWidth: 32, height: 32, borderRadius: '6px', backgroundColor: '#8A2BE2', color: theme.palette.common.white, paddingLeft: '8px', paddingRight: '8px', transformOrigin: 'bottom center', transform: 'translateY(-100%) translateY(-10px) scale(0)', '&.MuiSlider-valueLabelOpen': { transform: 'translateY(-100%) translateY(-10px) scale(1)'}, '&:before': { content: '""', position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: 10, height: 10, backgroundColor: '#8A2BE2'}},
    '& .MuiSlider-mark': { backgroundColor: 'rgba(255,255,255,0.3)', height: 10, width: 2, marginTop: -3.5, borderRadius: 1},
    '& .MuiSlider-markActive': { opacity: 1, backgroundColor: 'white'},
}));

const growthStages = [ { value: 0, label: 'Початок шляху', icon: <DirectionsWalkIcon sx={{fontSize: '3rem', color: '#b0bec5'}}/> }, { value: 25, label: 'Перші кроки', icon: <DirectionsRunIcon sx={{fontSize: '3rem', color: '#90caf9'}}/> }, { value: 50, label: 'Впевнений прогрес', icon: <FitnessCenterIcon sx={{fontSize: '3rem', color: '#a5d6a7'}}/> }, { value: 75, label: 'Майже профі', icon: <EmojiEventsIcon sx={{fontSize: '3rem', color: '#ffcc80'}}/> }, { value: 100, label: 'Легенда Grindzone!', icon: <WorkspacePremiumIcon sx={{fontSize: '3rem', color: '#ffd54f'}}/> }];

function valuetext(value) { return `${value}%`; }
function valueLabelFormat(value) { const stage = growthStages.slice().reverse().find(s => value >= s.value); return stage ? stage.label : `${value}%`; }

const trainingTypes = [
    { title: "Сила", icon: <FitnessCenterIcon sx={{ fontSize: '3rem', color: '#ff7043' }} />, description: "Набери масу та стань міцнішим.", bgColor: 'rgba(255, 112, 67, 0.1)' },
    { title: "Кардіо", icon: <DirectionsRunIcon sx={{ fontSize: '3rem', color: '#42a5f5' }} />, description: "Поліпши витривалість і серце.", bgColor: 'rgba(66, 165, 245, 0.1)' },
    { title: "Гнучкість", icon: <SelfImprovementIcon sx={{ fontSize: '3rem', color: '#ab47bc' }} />, description: "Поліпши мобільність тіла.", bgColor: 'rgba(171, 71, 188, 0.1)' },
    { title: "Харчування", icon: <RestaurantMenuIcon sx={{ fontSize: '3rem', color: '#66bb6a' }} />, description: "Контролюй вагу та енергію.", bgColor: 'rgba(102, 187, 106, 0.1)' },
];


function Home(props) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState(null);
    const navigate = useNavigate();

    const [sliderValue, setSliderValue] = React.useState(30);
    const [currentGrowthIcon, setCurrentGrowthIcon] = React.useState(growthStages[1].icon);

    const handleSliderChange = (event, newValue) => {
        setSliderValue(newValue);
        const currentStage = growthStages.slice().reverse().find(stage => newValue >= stage.value);
        if (currentStage) {
            setCurrentGrowthIcon(currentStage.icon);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    const commonCardStyles = {
        height: '100%',
        background: 'rgba(35, 28, 50, 0.75)',
        backdropFilter: 'blur(12px)',
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

    const handleAuthButtonClick = () => {
        if (isAuthenticated) {
            navigate('/profile');
        } else {
            navigate('/signup');
        }
    };


    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
                <Box sx={gridBackgroundStyles} />

                <Box id="hero-animation-section" sx={{ position: 'relative', width: '100%', height: { xs: 'auto', md: 'calc(85vh - 68px)' }, minHeight: { xs: '70vh', md: '500px' }, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', py: { xs: 6, md: 10 }, borderBottom: '1px solid rgba(138, 43, 226, 0.2)'}}>
                    {[0, 1, 2].map((i) => (<Box key={i} sx={{
                        position: 'absolute', top: '50%', left: '50%',
                        width: { xs: '200px', sm: '300px', md: '400px' },
                        height: { xs: '200px', sm: '300px', md: '400px' },
                        borderRadius: '50%',
                        animation: `${energyPulse} ${3 + i * 0.5}s infinite ease-out`,
                        animationDelay: `${i * 0.7}s`,
                        zIndex: 1,
                        willChange: 'transform, opacity, box-shadow',
                    }}/>))}
                    <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
                        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4.5rem' }, background: 'linear-gradient(120deg, #f3e7ff 0%, #c67eff 60%, #a96cff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 3, textShadow: '0 0 25px rgba(198, 126, 255, 0.5)', animation: `${textFadeInUp} 1s ease-out 0.2s backwards`}}>Ласкаво просимо до GRINDZONE</Typography>
                        <Typography variant="h5" component="p" sx={{ color: 'rgba(230, 220, 255, 0.85)', maxWidth: '700px', mx: 'auto', mb: 5, fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' }, lineHeight: 1.7, animation: `${textFadeInUp} 1s ease-out 0.5s backwards`}}>Ваш персональний тренер і помічник для досягнення фізичної досконалості. Розпочніть свій шлях до сили та витривалості вже сьогодні!</Typography>
                        <Button onClick={handleAuthButtonClick} variant="contained" size="large" sx={{ mt: 2, px: {xs: 4, sm: 6}, py: {xs: 1.5, sm: 2}, borderRadius: '50px', background: 'linear-gradient(45deg, #c67eff 0%, #a96cff 100%)', color: 'white', fontWeight: 'bold', fontSize: { xs: '1rem', md: '1.1rem' }, boxShadow: '0 10px 25px rgba(138, 43, 226, 0.4), 0 0 15px rgba(198, 126, 255, 0.3) inset', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.35s ease', animation: `${textFadeInUp} 1s ease-out 0.8s backwards`, '&:hover': { background: 'linear-gradient(45deg, #b065f0 0%, #904de0 100%)', transform: 'translateY(-4px) scale(1.03)', boxShadow: '0 15px 30px rgba(138, 43, 226, 0.5), 0 0 20px rgba(198, 126, 255, 0.4) inset',}}}>
                            {isAuthenticated ? 'Перейти до Профілю' : 'Приєднатися зараз'}
                        </Button>
                    </Container>
                </Box>

                <Box id="scroll-indicator-section" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: {xs: 3, md: 4}, cursor: 'pointer', borderBottom: '1px solid rgba(138, 43, 226, 0.15)'}} onClick={() => { const contentSection = document.getElementById('what-is-grindzone-section'); if (contentSection) { contentSection.scrollIntoView({ behavior: 'smooth' }); }}}>
                    <Typography variant="overline" sx={{ color: 'rgba(198, 126, 255, 0.8)', mb: 1.5, letterSpacing: '1.5px', fontSize: '0.85rem'}}>Дізнатись більше</Typography>
                    <Box sx={{ width: '28px', height: '48px', border: '2px solid rgba(138, 43, 226, 0.6)', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '5px 0', animation: `${pulseScroll} 2.5s infinite ease-in-out 1s`}}>
                        <Box sx={{ width: '3px', height: '10px', backgroundColor: 'rgba(138, 43, 226, 0.8)', borderRadius: '3px', animation: `${fadeInUp} 1.8s infinite ease-out`}}/>
                    </Box>
                </Box>

                <Box id="what-is-grindzone-section" sx={{ flexGrow: 1, py: {xs:4, md: 8}, px: {xs: 2, sm: 3}, position: 'relative', zIndex: 5, backgroundColor: 'rgba(18, 9, 29, 0.8)' }}>
                    <Container maxWidth="lg">
                        <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: {xs: 4, md: 6}, fontWeight: 'bold', color: 'white', textShadow: '0 0 10px rgba(198, 126, 255, 0.3)' }}>Що таке GRINDZONE?</Typography>
                        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} alignItems="stretch" justifyContent="center">
                            {[
                                { icon: <FitnessCenterIcon sx={{ fontSize: 40, mr: 1.5, color: '#c67eff', filter: 'drop-shadow(0 0 8px rgba(138, 43, 226, 0.7))' }} />, title: "Фізична активність", description: "Відстежуйте свої тренування, встановлюйте цілі та покращуйте фізичну форму." },
                                { icon: <RestaurantIcon sx={{ fontSize: 40, mr: 1.5, color: '#c67eff', filter: 'drop-shadow(0 0 8px rgba(138, 43, 226, 0.7))' }} />, title: "Харчування", description: "Слідкуйте за своїм раціоном та отримуйте рекомендації для здорового харчування." },
                                { icon: <PeopleIcon sx={{ fontSize: 40, mr: 1.5, color: '#c67eff', filter: 'drop-shadow(0 0 8px rgba(138, 43, 226, 0.7))' }} />, title: "Спільнота", description: "Діліться досягненнями, знаходьте однодумців, беріть участь у челенджах та отримуйте мотивацію." },
                                { icon: <EmojiEventsIcon sx={{ fontSize: 40, mr: 1.5, color: '#c67eff', filter: 'drop-shadow(0 0 8px rgba(138, 43, 226, 0.7))' }} />, title: "Досягнення", description: "Здобувайте нагороди за свої успіхи, ставте нові рекорди та піднімайтесь в рейтингах." }
                            ].map(feature => (
                                <Grid item xs={12} sm={6} md={6} key={feature.title} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Card sx={{...commonCardStyles, width: '100%', maxWidth: '400px'}}>
                                        <CardContent sx={{ p: {xs: 2.5, sm: 3, md: 3.5}, flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, color: 'white', '&::after': { content: '""', position: 'absolute', width: {xs: '55px', sm: '65px'}, height: {xs: '55px', sm: '65px'}, top: '15px', right: '15px', background: 'radial-gradient(circle, rgba(138, 43, 226, 0.2) 0%, rgba(138, 43, 226, 0) 60%)', filter: 'blur(10px)', zIndex: 0, transition: 'all 0.3s ease-in-out' }, '&:hover::after': { transform: 'scale(1.25)', opacity: 0.3 } }}>{feature.icon}<Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'white', fontSize: {xs: '1.2rem', sm: '1.35rem'} }}>{feature.title}</Typography></Box>
                                            <Typography variant="body1" sx={{ color: 'rgba(230, 220, 255, 0.75)', fontSize: {xs: '0.9rem', sm: '1rem'}, lineHeight: 1.6, minHeight: '100px' }}>{feature.description}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                <Box id="daily-example-section" sx={{ py: { xs: 5, md: 8 }, px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 5, backgroundColor: 'rgba(25, 20, 40, 0.7)', borderTop: '1px solid rgba(138, 43, 226, 0.25)', borderBottom: '1px solid rgba(138, 43, 226, 0.25)' }}>
                    <Container maxWidth="lg">
                        <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold', color: 'white', textShadow: '0 0 10px rgba(198, 126, 255, 0.3)' }}>Приклад твого дня</Typography>
                        <Typography variant="h6" component="p" sx={{ textAlign: 'center', mb: {xs:4, md:5}, color: 'rgba(230, 220, 255, 0.85)', fontSize: { xs: '1rem', sm: '1.1rem' } }}>Як може виглядати твій день з GRINDZONE:</Typography>
                        <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                            {[
                                { time: "9:00", activity: "Тренування: Full Body", icon: <FitnessCenterIcon sx={{ color: '#82eefd', fontSize: '2.5rem' }} /> },
                                { time: "13:00", activity: "Обід: 500 ккал", icon: <RestaurantMenuIcon sx={{ color: '#a5ff9b', fontSize: '2.5rem' }} /> },
                                { time: "15:00", activity: "Нагадування: Пий воду!", icon: <LocalDrinkIcon sx={{ color: '#8cb1ff', fontSize: '2.5rem' }} /> },
                                { time: "Всього", activity: "75% денної мети", icon: <CheckCircleOutlineIcon sx={{ color: '#ffc47d', fontSize: '2.5rem' }} /> }
                            ].map((item, index) => (
                                <Grid item xs={12} sm={6} md={6} key={index} sx={{ display: 'flex' }}>
                                    <Card sx={{
                                        height: '100%', background: 'rgba(45, 38, 65, 0.85)',
                                        backdropFilter: 'blur(8px)', borderRadius: '16px',
                                        border: '1px solid rgba(138, 43, 226, 0.3)',
                                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                                        p: {xs: 2, sm: 2.5}, display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', textAlign: 'center', gap: 1.5,
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        willChange: 'transform, box-shadow',
                                        isolation: 'isolate',
                                        transform: 'translateZ(0)',
                                        backfaceVisibility: 'hidden',
                                        '&:hover': { transform: 'translateY(-6px) scale(1.03) translateZ(0)', boxShadow: '0 12px 35px rgba(138, 43, 226, 0.35)'}
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', mb: 1 }}>{item.icon}</Box>
                                        <Box sx={{flexGrow: 1, display: 'flex', flexDirection:'column', justifyContent:'center'}}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', fontSize: {xs: '1.1rem', sm: '1.2rem'} }}>{item.time}</Typography>
                                            <Typography variant="body1" sx={{ color: 'rgba(230, 220, 255, 0.85)', fontSize: {xs: '0.9rem', sm: '1rem'} }}>{item.activity}</Typography>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                <Box id="growth-slider-section" sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 5, backgroundColor: 'rgba(15, 10, 25, 0.9)' }}>
                    <Container maxWidth="md">
                        <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold', color: 'white', textShadow: '0 0 10px rgba(198, 126, 255, 0.3)' }}>Твій шлях до вершини</Typography>
                        <Typography variant="h6" component="p" sx={{ textAlign: 'center', mb: {xs:3, md:4}, color: 'rgba(230, 220, 255, 0.85)', fontSize: { xs: '1rem', sm: '1.1rem' } }}>Відстежуй свій прогрес від новачка до легенди GRINDZONE!</Typography>
                        <Box sx={{ textAlign: 'center', mb: {xs:3, md:4}, minHeight: {xs: '50px', sm: '60px'} }}>
                            {currentGrowthIcon}
                        </Box>
                        <Box sx={{ width: '100%', maxWidth: '700px', mx: 'auto', px: {xs: 0, sm: 2} }}>
                            <GrowthSlider aria-label="Етап росту користувача" value={sliderValue} onChange={handleSliderChange} getAriaValueText={valuetext} valueLabelFormat={valueLabelFormat} valueLabelDisplay="on" step={1} marks={growthStages.map(stage => ({value: stage.value, label: ''}))} min={0} max={100}/>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, px: {xs:0, sm: 1} }}>
                                {growthStages.map((stage) => (<Typography key={stage.value} variant="caption" sx={{ color: 'rgba(230, 220, 255, 0.75)', textAlign: 'center', flexBasis: 0, flexGrow: 1, whiteSpace: 'normal', wordBreak: 'break-word', fontSize: {xs: '0.7rem', sm: '0.8rem'}, px: 0.5, lineHeight: 1.3}}>{stage.label}</Typography>))}
                            </Box>
                        </Box>
                    </Container>
                </Box>

                <Box id="training-types-section" sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 5, backgroundColor: 'rgba(22, 12, 38, 0.85)',  borderTop: '1px solid rgba(138, 43, 226, 0.2)', borderBottom: '1px solid rgba(138, 43, 226, 0.2)' }}>
                    <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 3 } }}>
                        <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold', fontStyle: 'italic', color: 'white', textShadow: '0 0 10px rgba(198, 126, 255, 0.3)' }}>
                            З нами ти можеш обрати свій напрям
                        </Typography>
                        <Typography variant="h6" component="p" sx={{ textAlign: 'center', mb: {xs:4, md:6}, color: 'rgba(230, 220, 255, 0.85)', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                            Ми підлаштуємося під тебе, щоб ти досяг своїх цілей:
                        </Typography>
                        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }} alignItems="stretch" justifyContent="center">
                            {trainingTypes.map((type) => (
                                <Grid item xs={12} sm={6} md={6} key={type.title} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Card sx={{
                                        width: '100%',
                                        minWidth: '400px',
                                        height: '100%',
                                        background: `linear-gradient(145deg, rgba(40, 30, 60, 0.85), rgba(55, 45, 75, 0.95))`,
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '18px',
                                        border: `1px solid ${type.icon.props.sx.color}55`,
                                        boxShadow: `0 8px 25px rgba(0, 0, 0, 0.3), 0 0 15px ${type.icon.props.sx.color}33 inset`,
                                        p: {xs: 2.5, sm: 3},
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        transition: 'all 0.3s ease-out',
                                        willChange: 'transform, box-shadow',
                                        isolation: 'isolate',
                                        transform: 'translateZ(0)',
                                        backfaceVisibility: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-8px) scale(1.04) translateZ(0)',
                                            boxShadow: `0 15px 35px ${type.icon.props.sx.color}44, 0 0 20px ${type.icon.props.sx.color}66 inset`,
                                        }
                                    }}>
                                        <Box sx={{ mb: 2, color: type.icon.props.sx.color }}>{type.icon}</Box>
                                        <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1.5, fontSize: {xs: '1.25rem', sm: '1.4rem'} }}>
                                            {type.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(230, 220, 255, 0.8)', flexGrow: 1, fontSize: {xs: '0.85rem', sm: '0.95rem'}, lineHeight: 1.55, minHeight: '10px' }}>
                                            {type.description}
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                <Box id="motivation-section" sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 5, background: 'linear-gradient(180deg, rgba(18, 9, 29, 0.95) 0%, rgba(10, 5, 18, 1) 100%)', borderTop: '1px solid rgba(138, 43, 226, 0.15)'}}>
                    <Container maxWidth="md">
                        <Typography variant="h3" component="p" sx={{ textAlign: 'center', fontWeight: 'bold', background: 'linear-gradient(135deg, #eacafc 10%, #a2d2ff 60%, #80ffdb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 3px 20px rgba(198, 126, 255, 0.25)', lineHeight: 1.5, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, fontStyle: 'italic'}}>
                            “Результати не приходять випадково. Вони приходять до тих, хто <Box component="span" sx={{color: '#c67eff', WebkitTextFillColor: '#c67eff', textShadow: '0 0 10px rgba(198,126,255,0.8)'}}>grind</Box>-ить щодня.”
                        </Typography>
                    </Container>
                </Box>

                <Footer />
            </Box>
        </AppTheme>
    );
}

export default Home;