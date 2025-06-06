import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import {keyframes, alpha, styled} from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import AppTheme from '../../shared-theme/AppTheme';
import Footer from '../../components/Footer';


import {mockInfoCards} from './components/mockDb';
import Zones from './components/Zones';
import Equipment from './components/Equipment';
import Classes from './components/Classes';
import BookingSection from './components/BookingSection';
import InfoCardsSection from './components/InfoCardsSection';


const gridLineGlow = keyframes`0% {
                                   opacity: 0.04;
                               }
                                   50% {
                                       opacity: 0.08;
                                   }
                                   100% {
                                       opacity: 0.04;
                                   }`;

const titleTextPopIn = keyframes`
    0% {
        opacity: 0;
        transform: translateY(30px) scale(0.9);
    }
    60% {
        opacity: 0.8;
        transform: translateY(-8px) scale(1.05);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
`;

const subTextFadeInSmooth = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const pageGlobalBackgroundStyles = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, backgroundSize: '70px 70px',
    backgroundImage: `
        linear-gradient(to right, rgba(138, 43, 226, 0.025) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(138, 43, 226, 0.025) 1px, transparent 1px)
    `,
    '&::before': {
        content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(138, 43, 226, 0.07) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(100, 60, 180, 0.05) 0%, transparent 60%)',
        animation: `${gridLineGlow} 7s infinite ease-in-out`,
    },
    '&::after': {
        content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(180deg, rgba(12, 6, 22, 0.99) 0%, rgba(8, 4, 15, 1) 70%, rgba(5,2,10,1) 100%)',
        zIndex: -2,
    },
};

const sectionStyles = (isPrimary = true) => ({
    backgroundColor: isPrimary ? 'rgba(18, 9, 29, 0.88)' : 'rgba(26, 18, 46, 0.88)',
    backdropFilter: 'blur(8px)',
    borderRadius: '32px',
    mb: {xs: 5, md: 7},
    p: {xs: 0.5, sm: 1, md: 1.5},
    boxShadow: `0 18px 55px ${alpha('#000000', 0.2)}, inset 0 0 25px ${alpha('#8A2BE2', 0.08)}`,
    border: `1px solid ${alpha('#8A2BE2', 0.15)}`,
    overflow: 'hidden',
});

const GrindSpan = styled('span')(() => ({
    color: '#c67eff',
    textShadow: '0 0 12px rgba(198,126,255,0.7)',
    fontStyle: 'italic',
    fontWeight: 'bold',
}));


function ActivitiesPage(props) {
    const [zones, setZones] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [groupClasses, setGroupClasses] = useState([]);
    const [upcomingClasses, setUpcomingClasses] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [bookingTarget, setBookingTarget] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [zonesRes, equipmentRes, classesRes] = await Promise.all([
                    fetch('/api/zones'),
                    fetch('/api/equipment'),
                    fetch('/api/group-classes')
                ]);

                if (!zonesRes.ok) throw new Error(`Failed to fetch zones: ${zonesRes.statusText}`);
                if (!equipmentRes.ok) throw new Error(`Failed to fetch equipment: ${equipmentRes.statusText}`);
                if (!classesRes.ok) throw new Error(`Failed to fetch group classes: ${classesRes.statusText}`);

                const zonesData = await zonesRes.json();
                const equipmentData = await equipmentRes.json();
                const classesData = await classesRes.json();

                setZones(zonesData);
                setEquipment(equipmentData);
                setGroupClasses(classesData);
                setUpcomingClasses(classesData);

            } catch (err) {
                console.error("Error fetching activities data:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleBookEquipment = (equipmentItem) => {
        setBookingTarget({type: 'equipment', item: equipmentItem});
        document.getElementById('booking-section-anchor')?.scrollIntoView({behavior: 'smooth', block: 'center'});
    };

    const handleBookClass = (classItem) => {
        setBookingTarget({type: 'class', item: classItem});
        document.getElementById('booking-section-anchor')?.scrollIntoView({behavior: 'smooth', block: 'center'});
    };

    const handleBookingConfirmed = (bookingDetails) => {
        console.log("Бронювання підтверджено (ActivitiesPage):", bookingDetails);
        if (bookingDetails.type === 'class') {


            const fetchClassesAgain = async () => {
                try {
                    const classesRes = await fetch('/api/group-classes');
                    if (!classesRes.ok) throw new Error('Failed to refetch classes');
                    const updatedClassesData = await classesRes.json();
                    setGroupClasses(updatedClassesData);
                    setUpcomingClasses(updatedClassesData);
                } catch (err) {
                    console.error("Error refetching classes:", err);
                }
            };
            fetchClassesAgain();
        }

        setBookingTarget(null);
    };


    if (isLoading) {
        return (
            <AppTheme {...props}>
                <CssBaseline enableColorScheme/>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    bgcolor: 'background.default'
                }}>
                    <CircularProgress size={60}/>
                    <Typography variant="h6" sx={{ml: 2, color: 'text.secondary'}}>Завантаження даних...</Typography>
                </Box>
            </AppTheme>
        );
    }

    if (error) {
        return (
            <AppTheme {...props}>
                <CssBaseline enableColorScheme/>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    flexDirection: 'column',
                    p: 3,
                    bgcolor: 'background.default'
                }}>
                    <Typography variant="h5" color="error" gutterBottom>Помилка завантаження даних</Typography>
                    <Typography color="error.light" sx={{textAlign: 'center'}}>{error}</Typography>
                    <Button variant="contained" onClick={() => window.location.reload()} sx={{mt: 3}}>Спробувати ще
                        раз</Button>
                </Box>
            </AppTheme>
        );
    }

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme/>
            <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative'}}>
                <Box sx={pageGlobalBackgroundStyles}/>

                <Container maxWidth="xl" sx={{pt: {xs: 6, md: 9}, pb: {xs: 4, md: 6}, position: 'relative', zIndex: 1}}>
                    <Box sx={{
                        textAlign: 'center',
                        mb: {xs: 7, md: 10},
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 'clamp(400px, 70vw, 850px)',
                            height: 'clamp(220px, 35vh, 380px)',
                            background: 'radial-gradient(ellipse at center, rgba(198, 126, 255, 0.12) 0%, transparent 70%)',
                            filter: 'blur(25px)',
                            zIndex: -1,
                            opacity: 1,
                        },
                    }}>
                        <Typography variant="h1" component="h1" sx={{
                            position: 'relative',
                            zIndex: 0,
                            fontWeight: 'bold',
                            fontSize: {xs: '3rem', sm: '3.8rem', md: '4.5rem'},
                            lineHeight: 1.2,
                            background: 'linear-gradient(125deg, #fdeaff 0%, #e9d8ff 30%, #d8bfff 60%, #c6aeff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2.5,
                            textShadow: '0 0 35px rgba(198, 126, 255, 0.45)',
                            animation: `${titleTextPopIn} 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s backwards`
                        }}>
                            Твоя Зона для <GrindSpan>GRIND</GrindSpan>-у
                        </Typography>
                        <Typography variant="h5" component="p" sx={{
                            position: 'relative',
                            zIndex: 0,
                            color: 'rgba(230, 220, 255, 0.9)',
                            maxWidth: '700px',
                            mx: 'auto',
                            fontSize: {xs: '1.15rem', sm: '1.3rem', md: '1.45rem'},
                            lineHeight: 1.75,
                            fontWeight: 600,
                            letterSpacing: '0.2px',
                            textShadow: '0 1px 4px rgba(0,0,0,0.25)',
                            animation: `${subTextFadeInSmooth} 1s ease-out 0.5s backwards`
                        }}>
                            Відкрий для себе простір можливостей, бронюй та заряджайся енергією GRINDZONE!
                        </Typography>
                    </Box>

                    <Box sx={sectionStyles(true)}> <Zones zones={zones} allEquipment={equipment}/> </Box>
                    <StyledDivider/>
                    <Box sx={sectionStyles(false)}> <Equipment zones={zones} equipment={equipment}
                                                               onBookEquipment={handleBookEquipment}/> </Box>

                    <div id="booking-section-anchor" style={{scrollMarginTop: '100px'}}></div>
                    <StyledDivider/>
                    <Box sx={sectionStyles(true)}>
                        <BookingSection
                            allEquipment={equipment}
                            allClasses={upcomingClasses}
                            allZones={zones}
                            initialTarget={bookingTarget}
                            onBookingConfirmed={handleBookingConfirmed}
                            onClearTarget={() => setBookingTarget(null)}
                        />
                    </Box>
                    <StyledDivider/>
                    <Box sx={sectionStyles(true)}> <Classes groupClasses={upcomingClasses}
                                                            onBookClass={handleBookClass}/> </Box>
                    <StyledDivider/>
                    <Box sx={sectionStyles(true)}> <InfoCardsSection infoCards={mockInfoCards}/> </Box>
                </Container>
                <Footer/>
            </Box>
        </AppTheme>
    );
}

const StyledDivider = () => (
    <Divider sx={{
        my: {xs: 5, md: 8},
        borderColor: alpha('#8A2BE2', 0.15),
        borderWidth: '1px', width: '60%', mx: 'auto',
        '&::before, &::after': {borderColor: alpha('#8A2BE2', 0.1)}
    }}/>
);

export default ActivitiesPage;