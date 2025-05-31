// src/pages/ActivitiesPage.jsx
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import { keyframes } from '@emotion/react';

import AppTheme from '../../shared-theme/AppTheme';
import Footer from '../../components/Footer';

import { mockZones, mockEquipment, mockGroupClasses, mockInfoCards } from './components/mockDb';

import Zones from './components/Zones';
import Equipment from './components/Equipment';
import Classes from './components/Classes';
import BookingSection from './components/BookingSection';
import InfoCardsSection from './components/InfoCardsSection';
import {parse} from "date-fns";

const gridLineGlow = keyframes`0% { opacity: 0.04; } 50% { opacity: 0.08; } 100% { opacity: 0.04; }`;
const textFadeInUpSlight = keyframes`from {opacity: 0; transform: translateY(15px) translateZ(0);} to {opacity: 1; transform: translateY(0) translateZ(0);}`;

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

// Фони для секцій
const sectionStyles = (isPrimary = true) => ({
    backgroundColor: isPrimary ? 'rgba(18, 9, 29, 0.85)' : 'rgba(25, 15, 40, 0.85)', // Зменшив прозорість для читабельності
    backdropFilter: 'blur(5px)', // Легкий блюр для глибини
    borderRadius: '28px', // Більш округлі кути
    mb: { xs: 5, md: 7 }, // Збільшив відступи між секціями
    p: { xs: 0.5, sm:1, md: 1 }, // Внутрішні відступи для секцій, щоб контент не прилипав
    boxShadow: '0 15px 50px rgba(0,0,0,0.15), inset 0 0 20px rgba(138, 43, 226, 0.05)',
    border: '1px solid rgba(138, 43, 226, 0.1)', // Тонка рамка
    overflow: 'hidden', // Щоб внутрішні тіні не вилазили
});


function ActivitiesPage(props) {
    const [bookingTarget, setBookingTarget] = useState(null);
    // Стан для оновлення mockGroupClasses (лише для демо)
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
        // Тут буде реальна логіка відправки на бекенд
        console.log("Бронювання підтверджено (ActivitiesPage):", bookingDetails);

        if (bookingDetails.type === 'class') {
            // Оновлюємо кількість заброньованих місць для мок-даних (тільки для візуалізації)
            setCurrentGroupClasses(prevClasses =>
                prevClasses.map(cls =>
                    cls.id === bookingDetails.itemId
                        ? { ...cls, bookedUserIds: [...cls.bookedUserIds, `mockUser_${Date.now()}`] }
                        : cls
                )
            );
        }
        setBookingTarget(null); // Скидаємо ціль бронювання
    };

    // Фільтруємо класи, які ще не пройшли
    const upcomingClasses = currentGroupClasses.filter(cls => {
        const classDateTime = parse(`${cls.date} ${cls.endTime}`, 'yyyy-MM-dd HH:mm', new Date());
        return classDateTime >= new Date();
    }).sort((a,b) => { // Сортуємо за датою та часом
        const dateA = parse(`${a.date} ${a.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
        const dateB = parse(`${b.date} ${b.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
        return dateA - dateB;
    });


    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
                <Box sx={pageGlobalBackgroundStyles} />

                <Container maxWidth="xl" sx={{ pt: { xs: 4, md: 6 }, pb: {xs:4, md:6}, position: 'relative', zIndex: 1 }}>
                    <Typography variant="h1" component="h1" gutterBottom sx={{
                        textAlign: 'center', fontWeight: 'bold',
                        fontSize: { xs: '3rem', sm: '3.8rem', md: '4.5rem' },
                        background: 'linear-gradient(125deg, #fce0ff 0%, #e6ceff 30%, #c67eff 60%, #a96cff 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        mb: { xs: 5, md: 8 }, textShadow: '0 0 30px rgba(198, 126, 255, 0.5)',
                        animation: `${textFadeInUpSlight} 1s ease-out 0.1s backwards`
                    }}>
                        Активності та Розклад
                    </Typography>

                    <Box sx={sectionStyles(true)}> <Zones zones={mockZones} /> </Box>
                    <StyledDivider />
                    <Box sx={sectionStyles(false)}> <Equipment zones={mockZones} equipment={mockEquipment} onBookEquipment={handleBookEquipment}/> </Box>

                    <div id="booking-section-anchor" style={{scrollMarginTop: '100px'}}></div>
                    <StyledDivider />
                    <Box sx={sectionStyles(true)}>
                        <BookingSection
                            allEquipment={mockEquipment}
                            allClasses={upcomingClasses} // Передаємо відфільтровані та відсортовані класи
                            allZones={mockZones}
                            initialTarget={bookingTarget}
                            onBookingConfirmed={handleBookingConfirmed}
                            onClearTarget={() => setBookingTarget(null)}
                        />
                    </Box>
                    <StyledDivider />
                    <Box sx={sectionStyles(false)}> <Classes groupClasses={upcomingClasses} onBookClass={handleBookClass} /> </Box>
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
        my: { xs: 5, md: 8 }, // Збільшив відступи
        borderColor: 'rgba(138, 43, 226, 0.12)', // Трохи темніший розділювач
        borderWidth: '1px', width: '60%', mx: 'auto',
        '&::before, &::after': { borderColor: 'rgba(138, 43, 226, 0.08)' } // Для кращого вигляду
    }} />
);

export default ActivitiesPage;