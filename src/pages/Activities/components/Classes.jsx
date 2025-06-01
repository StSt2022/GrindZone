// src/components/activities/Classes.jsx
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import { keyframes, styled, alpha } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress'; // Для індикатора завантаження

// Icons
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import EventBusyIcon from '@mui/icons-material/EventBusy';

// Імпортуємо всі можливі іконки, які можуть прийти з 'iconName'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SpaIcon from '@mui/icons-material/Spa';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
// Додай інші, якщо є

// Об'єкт для мапінгу назв іконок на компоненти
const iconComponents = {
    FitnessCenterIcon: FitnessCenterIcon,
    SelfImprovementIcon: SelfImprovementIcon,
    DirectionsRunIcon: DirectionsRunIcon,
    SpaIcon: SpaIcon,
    SportsKabaddiIcon: SportsKabaddiIcon,
    AccessibilityNewIcon: AccessibilityNewIcon,
    // Додай інші за потреби
};


const primaryPurple = '#a96cff';
const secondaryPurple = '#c67eff';
const lightText = 'rgba(235, 230, 255, 0.9)';

const scanLineColor = alpha(primaryPurple, 0.04);
const scanLineThickness = '1px';
const scanLineSpacing = '3px';

const cardPopIn = keyframes`
    0% { opacity: 0; transform: translateY(25px) scale(0.98); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const StyledClassButton = styled(Button)(({ theme, disabled, isfull }) => ({
    padding: theme.spacing(1.2, 2.5),
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '0.9rem',
    textTransform: 'none',
    color: theme.palette.common.white,
    background: isfull === 'true'
        ? alpha(theme.palette.grey[700], 0.4)
        : `linear-gradient(45deg, ${alpha('#c67eff', 0.9)} 0%, ${alpha('#a96cff', 0.9)} 100%)`,
    boxShadow: isfull === 'true'
        ? 'none'
        : `0 4px 12px -3px ${alpha('#a96cff', 0.4)}, inset 0 -1px 2px rgba(0,0,0,0.1)`,
    transition: 'all 0.25s ease-out',
    border: `1px solid ${isfull === 'true' ? alpha(theme.palette.grey[600], 0.3) : alpha(theme.palette.common.white, 0.1)}`,
    '&:hover': {
        background: isfull === 'true'
            ? alpha(theme.palette.grey[700], 0.4)
            : `linear-gradient(45deg, ${alpha('#b065f0', 0.95)} 0%, ${alpha('#904de0', 0.95)} 100%)`,
        boxShadow: isfull === 'true'
            ? 'none'
            : `0 6px 15px -3px ${alpha('#a96cff', 0.5)}, inset 0 -1px 3px rgba(0,0,0,0.15)`,
        transform: isfull === 'true' ? 'none' : 'translateY(-2px)',
    },
    '&.Mui-disabled': {
        color: alpha(theme.palette.common.white, 0.5),
        background: alpha('#555', 0.7),
        boxShadow: 'none',
        borderColor: alpha('#777', 0.5),
    },
    '& .MuiButton-startIcon': {
        marginRight: theme.spacing(0.8),
    },
}));

const ClassCard = styled(Card)(({ theme, isFull }) => {
    const cardAnimationDelay = `${theme.transitions.duration.standard}ms`;
    return {
        width: '100%',
        maxWidth: '600px',
        minHeight: '600px', // Розглянь можливість зробити її адаптивною або трохи меншою
        background: 'rgba(35, 28, 50, 0.85)',
        borderRadius: '20px',
        border: `1px solid ${isFull ? alpha('#E53935', 0.5) : alpha('#a96cff', 0.35)}`,
        boxShadow: `0 10px 30px rgba(0, 0, 0, 0.25)`,
        transition: 'all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: `${cardPopIn} 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${cardAnimationDelay} backwards`,
        '&:hover': {
            transform: 'translateY(-6px) scale(1.01)',
            boxShadow: `0 18px 45px ${isFull ? alpha('#B71C1C', 0.35) : alpha('#a96cff', 0.35)}, 0 0 25px ${alpha('#a96cff', 0.2)}`,
            borderColor: isFull ? alpha('#E53935', 0.7) : alpha('#c67eff', 0.55),
            '&::before': { opacity: 0.9, height: '5px' },
        },
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: isFull
                ? `linear-gradient(90deg, ${alpha('#D32F2F', 0.8)} 0%, ${alpha('#B71C1C', 0.9)} 100%)`
                : `linear-gradient(90deg, ${alpha('#c67eff', 0.8)} 0%, ${alpha('#a96cff', 0.9)} 100%)`,
            opacity: 0.6,
            transition: 'opacity 0.35s ease, height 0.35s ease',
        },
    };
});

const Classes = ({ groupClasses, onBookClass }) => {
    const [page, setPage] = useState(1);
    const classesPerPage = 4; // Кількість карток на сторінці

    // Якщо дані ще завантажуються (проп groupClasses може бути undefined або null спочатку)
    if (groupClasses === undefined || groupClasses === null) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2, color: 'text.secondary' }}>Завантаження розкладу...</Typography>
            </Box>
        );
    }

    if (groupClasses.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', my: 4, py: 5 }}>
                <Typography variant="h5" sx={{ color: 'rgba(230, 220, 255, 0.8)' }}>
                    Наразі немає доступних групових занять.
                </Typography>
                <Typography sx={{ color: 'rgba(230, 220, 255, 0.6)', mt: 1 }}>
                    Будь ласка, перевірте розклад пізніше.
                </Typography>
            </Box>
        );
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        const sectionElement = document.getElementById('group-classes-section-title');
        if (sectionElement) {
            sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const count = Math.ceil(groupClasses.length / classesPerPage);
    const currentClasses = groupClasses.slice(
        (page - 1) * classesPerPage,
        page * classesPerPage
    );

    return (
        <Box sx={{
            py: { xs: 4, md: 6 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
                backgroundImage: `repeating-linear-gradient(
                    to bottom,
                    ${scanLineColor},
                    ${scanLineColor} ${scanLineThickness},
                    transparent ${scanLineThickness},
                    transparent ${scanLineSpacing}
                )`,
            }
        }}>
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3 } }}>
                <Typography
                    variant="h2"
                    component="h2"
                    id="group-classes-section-title"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: 'white',
                        mb: { xs: 5, md: 7 },
                        textShadow: '0 0 25px rgba(198, 126, 255, 0.45)',
                        fontSize: { xs: '2.3rem', sm: '2.9rem', md: '3.3rem' },
                        background: 'linear-gradient(120deg, #e6ceff 0%, #c67eff 60%, #a96cff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Розклад Групових Занять
                </Typography>
                <Grid
                    container
                    spacing={{ xs: 3, sm: 3, md: 4 }} // Трохи збільшив spacing
                    justifyContent="center"
                    alignItems="stretch" // Важливо для однакової висоти карток в ряду
                >
                    {currentClasses.map((sClass) => {
                        const bookedPercentage = sClass.maxCapacity > 0 ? (sClass.bookedUserIds.length / sClass.maxCapacity) * 100 : 0;
                        const isFull = sClass.maxCapacity > 0 && sClass.bookedUserIds.length >= sClass.maxCapacity;

                        // Отримуємо компонент іконки
                        const IconComponent = iconComponents[sClass.iconName] || FitnessCenterIcon; // FitnessCenterIcon як дефолтна

                        return (
                            <Grid
                                item
                                xs={12}
                                sm={6} // По дві картки в рядку на sm і більше
                                md={6} // Зберігаємо по дві на md
                                lg={6} // І на lg, якщо classesPerPage = 4, то буде 2 ряди по 2
                                key={sClass.id}
                                sx={{
                                    display: 'flex', // Для alignItems: 'stretch'
                                    justifyContent: 'center',
                                }}
                            >
                                <ClassCard isFull={isFull}>
                                    <Box sx={{
                                        position: 'relative',
                                        width: '100%',
                                        paddingTop: '56.25%', // 16:9 aspect ratio
                                        overflow: 'hidden',
                                    }}>
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderBottom: `2px solid ${primaryPurple}`, // Можна зробити динамічним від isFull
                                            }}
                                            image={sClass.imageUrl || `https://via.placeholder.com/600x400/6a0dad/ffffff?text=${encodeURIComponent(sClass.title)}`}
                                            alt={sClass.title}
                                        />
                                    </Box>
                                    <CardContent sx={{
                                        flexGrow: 1,
                                        p: { xs: 2, sm: 2.5, md: 3 },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between', // Розтягує контент
                                        // minHeight: '300px', // Залежить від контенту, можна прибрати якщо flexGrow працює
                                    }}>
                                        <Box> {/* Верхня частина контенту */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, minHeight: '60px' }}>
                                                <IconComponent sx={{ color: isFull ? alpha('#E53935', 0.8) : secondaryPurple, mr: 2, fontSize: '2.2rem' }} />
                                                <Typography variant="h6" component="div" sx={{
                                                    fontWeight: 'bold', color: 'white', fontSize: '1.25rem', lineHeight: '1.4',
                                                    textShadow: isFull ? `0 0 6px ${alpha('#E53935', 0.6)}` : 'none',
                                                }}>
                                                    {sClass.title}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                icon={<BarChartIcon sx={{ fontSize: '1rem', color: alpha('#e0c6ff', 0.8) }} />}
                                                label={`Складність: ${sClass.difficulty || 'N/A'}`}
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'rgba(169, 108, 255, 0.2)',
                                                    color: '#e0c6ff',
                                                    mb: 2,
                                                    alignSelf: 'flex-start',
                                                    fontSize: '0.8rem',
                                                    px: '6px',
                                                    borderRadius: '12px'
                                                }}
                                            />
                                            <Grid container spacing={1} sx={{ mb: 2.5 }}>
                                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <CalendarTodayIcon sx={{ fontSize: '1.1rem', mr: 1, opacity: 0.8, color: lightText }} />
                                                    <Typography variant="body2" sx={{ fontSize: '0.88rem', color: 'rgba(235, 230, 245, 0.95)' }}>
                                                        {new Date(sClass.date).toLocaleDateString('uk-UA', { weekday: 'long', day: '2-digit', month: 'long' })}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <AccessTimeIcon sx={{ fontSize: '1.1rem', mr: 1, opacity: 0.8, color: lightText }} />
                                                    <Typography variant="body2" sx={{ fontSize: '0.88rem', color: 'rgba(235, 230, 245, 0.95)' }}>
                                                        {sClass.startTime} - {sClass.endTime} ({sClass.durationMinutes} хв)
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <PeopleAltIcon sx={{ fontSize: '1.1rem', mr: 1, opacity: 0.8, color: lightText }} />
                                                    <Typography variant="body2" sx={{
                                                        fontSize: '0.88rem',
                                                        color: 'rgba(235, 230, 245, 0.95)',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {sClass.coach}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Tooltip title={`${sClass.bookedUserIds.length} з ${sClass.maxCapacity} місць зайнято`} placement="top">
                                                <Box sx={{ width: '100%', mb: 2 }}>
                                                    <Typography variant="caption" color={alpha(lightText, 0.8)} sx={{ mb: 0.5, fontSize: '0.8rem', display: 'block' }}>
                                                        Зайнято: {sClass.bookedUserIds.length} / {sClass.maxCapacity}
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={bookedPercentage}
                                                        sx={{
                                                            height: 10, borderRadius: 5,
                                                            backgroundColor: alpha(primaryPurple, 0.15),
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: isFull ? alpha('#D32F2F', 0.9) : primaryPurple,
                                                                transition: 'width .4s ease-in-out',
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            </Tooltip>
                                            <Typography variant="body2" color={alpha(lightText, 0.85)} sx={{ fontSize: '0.85rem', lineHeight: 1.6, mb: 3, minHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                                {sClass.description}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mt: 'auto' }}> {/* Кнопка завжди внизу */}
                                            <StyledClassButton
                                                onClick={() => onBookClass(sClass)}
                                                disabled={isFull}
                                                isfull={isFull.toString()} // Передаємо як рядок для styled component
                                                startIcon={isFull ? <EventBusyIcon /> : <EventAvailableIcon />}
                                                sx={{ width: '100%' }} // Замість mb:2, якщо він останній
                                            >
                                                {isFull ? 'Немає місць' : 'Забронювати участь'}
                                            </StyledClassButton>
                                        </Box>
                                    </CardContent>
                                </ClassCard>
                            </Grid>
                        );
                    })}
                    {/* Заповнювачі для рівномірного розподілу, якщо останній ряд неповний */}
                    {currentClasses.length > 0 && currentClasses.length % 2 !== 0 && (classesPerPage === 4 || classesPerPage === 2) && (
                        <Grid item xs={12} sm={6} md={6} lg={6} sx={{ display: { xs: 'none', sm: 'block' } }} />
                    )}
                </Grid>
                {count > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 6, md: 8 } }}>
                        <Pagination
                            count={count}
                            page={page}
                            onChange={handleChangePage}
                            size="large"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: 'rgba(230, 220, 255, 0.85)',
                                    borderColor: 'rgba(138, 43, 226, 0.45)',
                                    fontWeight: 500,
                                    fontSize: '0.95rem',
                                    margin: '0 4px',
                                    minWidth: '38px',
                                    height: '38px',
                                    borderRadius: '10px',
                                    background: 'rgba(45, 38, 65, 0.6)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(138, 43, 226, 0.2)',
                                        borderColor: '#c67eff',
                                    },
                                },
                                '& .Mui-selected': {
                                    background: 'linear-gradient(45deg, #c67eff, #a96cff) !important',
                                    color: 'white !important',
                                    fontWeight: 'bold',
                                    borderColor: 'transparent !important',
                                    boxShadow: '0 4px 15px rgba(169, 108, 255, 0.4)',
                                },
                            }}
                        />
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Classes;