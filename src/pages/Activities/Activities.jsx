// src/pages/ActivitiesPage.jsx
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import { keyframes, alpha, styled } from '@mui/material/styles';

import AppTheme from '../../shared-theme/AppTheme'; // Перевір шлях
import Footer from '../../components/Footer'; // Перевір шлях

// Переконайся, що шляхи правильні
import { mockZones, mockEquipment, mockGroupClasses, mockInfoCards } from './components/mockDb';
import Zones from './components/Zones';
import Equipment from './components/Equipment';
import Classes from './components/Classes';
import BookingSection from './components/BookingSection';
import InfoCardsSection from './components/InfoCardsSection';
import { parse } from "date-fns";

const gridLineGlow = keyframes`0% { opacity: 0.04; } 50% { opacity: 0.08; } 100% { opacity: 0.04; }`;

const titleTextPopIn = keyframes`
    0% { opacity: 0; transform: translateY(30px) scale(0.9); }
    60% { opacity: 0.8; transform: translateY(-8px) scale(1.05); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const subTextFadeInSmooth = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
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
    mb: { xs: 5, md: 7 },
    p: { xs: 0.5, sm:1, md: 1.5 },
    boxShadow: `0 18px 55px ${alpha('#000000', 0.2)}, inset 0 0 25px ${alpha('#8A2BE2', 0.08)}`,
    border: `1px solid ${alpha('#8A2BE2', 0.15)}`,
    overflow: 'hidden',
});

const GrindSpan = styled('span')(({ theme }) => ({
    color: '#c67eff',
    textShadow: '0 0 12px rgba(198,126,255,0.7)',
    fontStyle: 'italic',
    fontWeight: 'bold',
}));


function ActivitiesPage(props) {
    const [bookingTarget, setBookingTarget] = useState(null);
    const [currentGroupClasses, setCurrentGroupClasses] = useState(mockGroupClasses);

    const handleBookEquipment = (equipmentItem) => {
        setBookingTarget({ type: 'equipment', item: equipmentItem });
        document.getElementById('booking-section-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleBookClass = (classItem) => {
        setBookingTarget({ type: 'class', item: classItem });
        document.getElementById('booking-section-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleBookingConfirmed = (bookingDetails) => {
        console.log("Бронювання підтверджено (ActivitiesPage):", bookingDetails);
        if (bookingDetails.type === 'class') {
            setCurrentGroupClasses(prevClasses =>
                prevClasses.map(cls =>
                    cls.id === bookingDetails.itemId
                        ? { ...cls, bookedUserIds: [...cls.bookedUserIds, `mockUser_${Date.now()}`] }
                        : cls
                )
            );
        }
        setBookingTarget(null);
    };

    const upcomingClasses = currentGroupClasses.filter(cls => {
        if (!cls.date || !cls.endTime) return false;
        try {
            const classDateTime = parse(`${cls.date} ${cls.endTime}`, 'yyyy-MM-dd HH:mm', new Date());
            return !isNaN(classDateTime.getTime()) && classDateTime >= new Date();
        } catch { return false; }
    }).sort((a,b) => {
        try {
            const dateA = parse(`${a.date} ${a.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
            const dateB = parse(`${b.date} ${b.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
            return dateA - dateB;
        } catch { return 0; }
    });


    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
                <Box sx={pageGlobalBackgroundStyles} />

                <Container maxWidth="xl" sx={{ pt: { xs: 6, md: 9 }, pb: {xs:4, md:6}, position: 'relative', zIndex: 1 }}>
                    <Box sx={{
                        textAlign: 'center',
                        mb: { xs: 7, md: 10 },
                        position: 'relative',
                        // Додамо трохи падінгу, щоб світіння не обрізалося краями Box, якщо текст близько
                        // Це може бути не обов'язково, залежить від розмірів світіння і тексту
                        // py: { xs: 2, md: 3 }, // Вертикальний падінг для Box

                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            // Збільшимо розміри та інтенсивність
                            width: 'clamp(400px, 70vw, 850px)', // Трохи ширше
                            height: 'clamp(220px, 35vh, 380px)', // Трохи вище
                            // Змінюємо градієнт: робимо його більш насиченим в центрі (0.12) і розширюємо до 70%
                            background: 'radial-gradient(ellipse at center, rgba(198, 126, 255, 0.12) 0%, transparent 70%)',
                            filter: 'blur(25px)', // Трохи зменшимо блюр, щоб краї були чіткішими, або збільшимо, якщо хочемо м'якше
                            zIndex: -1,
                            opacity: 1, // Залишимо opacity псевдоелемента на 1, контролюємо прозорість через градієнт
                        },
                    }}>
                        <Typography variant="h1" component="h1" sx={{
                            position: 'relative', // Залишаємо для гарантії контексту стекування
                            zIndex: 0,            // Залишаємо
                            fontWeight: 'bold',
                            fontSize: { xs: '3rem', sm: '3.8rem', md: '4.5rem' },
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
                            position: 'relative', // Залишаємо
                            zIndex: 0,            // Залишаємо
                            color: 'rgba(230, 220, 255, 0.9)',
                            maxWidth: '700px',
                            mx: 'auto',
                            fontSize: { xs: '1.15rem', sm: '1.3rem', md: '1.45rem' },
                            lineHeight: 1.75,
                            fontWeight: 600,
                            letterSpacing: '0.2px',
                            textShadow: '0 1px 4px rgba(0,0,0,0.25)',
                            animation: `${subTextFadeInSmooth} 1s ease-out 0.5s backwards`
                        }}>
                            Відкрий для себе простір можливостей, бронюй та заряджайся енергією GRINDZONE!
                        </Typography>
                    </Box>

                    <Box sx={sectionStyles(true)}> <Zones zones={mockZones} /> </Box>
                    <StyledDivider />
                    <Box sx={sectionStyles(false)}> <Equipment zones={mockZones} equipment={mockEquipment} onBookEquipment={handleBookEquipment}/> </Box>

                    <div id="booking-section-anchor" style={{scrollMarginTop: '100px'}}></div>
                    <StyledDivider />
                    <Box sx={sectionStyles(true)}>
                        <BookingSection
                            allEquipment={mockEquipment}
                            allClasses={upcomingClasses}
                            allZones={mockZones}
                            initialTarget={bookingTarget}
                            onBookingConfirmed={handleBookingConfirmed}
                            onClearTarget={() => setBookingTarget(null)}
                        />
                    </Box>
                    <StyledDivider />
                    <Box sx={sectionStyles(true)}> <Classes groupClasses={upcomingClasses} onBookClass={handleBookClass} /> </Box>
                    <StyledDivider />
                    <Box sx={sectionStyles(true)}> <InfoCardsSection infoCards={mockInfoCards} /> </Box>
                </Container>
                <Footer />
            </Box>
        </AppTheme>
    );
}

const StyledDivider = () => (
    <Divider sx={{
        my: { xs: 5, md: 8 },
        borderColor: alpha('#8A2BE2', 0.15),
        borderWidth: '1px', width: '60%', mx: 'auto',
        '&::before, &::after': { borderColor: alpha('#8A2BE2', 0.1) }
    }} />
);

export default ActivitiesPage;