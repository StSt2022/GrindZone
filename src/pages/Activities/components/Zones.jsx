// src/components/activities/Zones.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid'; // Залишаємо Grid з @mui/material, поки не міняємо
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import { keyframes } from '@emotion/react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Для списку обладнання

// Імпортуємо mockEquipment, щоб отримати назви
import { mockEquipment } from './mockDb.jsx'; // Адаптуй шлях!

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px) translateZ(0); }
  to { opacity: 1; transform: translateY(0) translateZ(0); }
`;

const ZoneCard = ({ zone, index }) => {
    const accent = zone.accentColor || 'rgba(138, 43, 226, 0.45)'; // Фолбек колір

    const cardStyles = {
        background: 'rgba(30, 20, 50, 0.9)', // Трохи змінив фон
        backdropFilter: 'blur(12px)',
        borderRadius: '28px', // Трохи збільшив
        border: `2px solid ${accent}`, // Використовуємо accentColor для рамки
        boxShadow: `0 10px 35px rgba(0,0,0,0.25), 0 0 20px ${accent}20`, // Тінь з акцентом
        transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { md: 'stretch' },
        minHeight: { xs: 'auto', md: '320px' }, // Трохи збільшив висоту
        animation: `${fadeInUp} 0.6s ease-out ${index * 0.15}s backwards`,
        '&:hover': {
            transform: 'translateY(-12px) scale(1.02) translateZ(0)',
            boxShadow: `0 20px 55px ${accent}50, 0 0 35px ${accent}35`,
            borderColor: `${accent}CC`, // Яскравіша рамка при ховері
        },
        position: 'relative',
        // Градієнтна підсвітка при ховері
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            borderRadius: 'inherit',
            background: `linear-gradient(135deg, ${accent}26 0%, transparent 70%)`, // Градієнт з акцентом
            opacity: 0,
            transition: 'opacity 0.4s ease, background 0.4s ease',
            zIndex: 0,
        },
        '&:hover::before': {
            opacity: 1,
        }
    };

    // Отримуємо назви обладнання
    const equipmentList = zone.equipmentIds
        .map(id => mockEquipment.find(eq => eq.id === id)?.name)
        .filter(name => name) // Видаляємо undefined, якщо ID не знайдено
        .slice(0, 4); // Показуємо перші 4 для прикладу

    return (
        <Card sx={cardStyles}>
            <CardMedia
                component="img"
                sx={{
                    width: { xs: '100%', md: '45%' }, // Можна трохи зменшити, щоб текст мав більше місця
                    height: '100%', // Фіксована висота для xs, автоматична для md, щоб розтягувалось
                    maxHeight: '320px',
                    minHeight: 0,
                    alignSelf: 'center',
                    flex: '0 0 auto',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    borderRight: { md: `2px solid ${accent}55` },
                    borderBottom: { xs: `2px solid ${accent}55`, md: 'none' },
                    filter: 'brightness(0.85) contrast(1.05) saturate(1.1)',
                    transition: 'filter 0.3s ease-in-out, transform 0.3s ease-in-out',
                    '&:hover': {
                        filter: 'brightness(1) contrast(1.1) saturate(1.2)',
                        transform: 'scale(1.03)',
                    }
                }}
                image={zone.imageUrl || `https://via.placeholder.com/700x500/${accent.slice(1)}/FFFFFF?text=${zone.name.replace(' ', '+')}`}
                alt={zone.name}
            />
            <CardContent sx={{
                pl: { xs: 3, sm: 3.5, md: 4 }, // Падінги
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between', // Для кращого розподілу контенту
                position: 'relative',
                zIndex: 1,
            }}>
                <Box>
                    <Typography variant="h4" component="h3" sx={{ // Зменшив до h4 для кращої ієрархії, якщо h2 - заголовок секції
                        fontWeight: 'bold',
                        color: 'white',
                        mb: 2,
                        fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.4rem' }, // Адаптував розмір
                        // Використовуємо accentColor для градієнту тексту або тіні
                        background: `linear-gradient(135deg, #f0e6ff 40%, ${accent} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: `0 2px 12px ${accent}2A`
                    }}>
                        {zone.name}
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: 'rgba(235, 225, 255, 0.9)',
                        fontSize: { xs: '0.95rem', sm: '1.05rem' },
                        lineHeight: 1.7,
                        mb: 3, // Збільшив відступ
                        maxWidth: '65ch'
                    }}>
                        {zone.description}
                    </Typography>
                </Box>

                {equipmentList.length > 0 && (
                    <Box mt="auto"> {/* Розміщуємо список внизу */}
                        <Typography variant="subtitle1" sx={{ color: accent, fontWeight: '600', mb: 1, fontSize: '1.1rem' }}>
                            Основне обладнання:
                        </Typography>
                        <List dense disablePadding sx={{mb: -1}}> {/* dense для компактності */}
                            {equipmentList.map((name, i) => (
                                <ListItem key={i} disableGutters sx={{py: 0.3}}>
                                    <ListItemIcon sx={{ minWidth: '30px', color: `${accent}B3` }}>
                                        <CheckCircleOutlineIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={name}
                                        primaryTypographyProps={{
                                            fontSize: '0.9rem',
                                            color: 'rgba(220, 210, 240, 0.85)',
                                            fontWeight: 500
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        {zone.equipmentIds.length > equipmentList.length && (
                            <Typography variant="caption" sx={{ color: 'rgba(210, 190, 250, 0.6)', fontStyle: 'italic', display:'block', textAlign: 'right', mt:0.5 }}>
                                та ще {zone.equipmentIds.length - equipmentList.length} од...
                            </Typography>
                        )}
                    </Box>
                )}
                {equipmentList.length === 0 && zone.equipmentIds && zone.equipmentIds.length > 0 && (
                    <Typography variant="caption" sx={{ color: 'rgba(210, 190, 250, 0.6)', fontStyle: 'italic', mt: 'auto' }}>
                        Спеціалізоване обладнання (деталі у адміністратора).
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

const Zones = ({ zones }) => { // `equipment` тут не потрібен, бо ми його імпортуємо напряму в ZoneCard
    if (!zones || zones.length === 0) {
        return <Typography color="error" sx={{ textAlign: 'center', my: 4 }}>Зони не завантажені.</Typography>;
    }

    return (
        <Box component="section" sx={{ py: { xs: 4, md: 6 }, height: '100%' }}>
            <Typography variant="h2" component="h2" sx={{
                textAlign: 'center', fontWeight: 'bold', color: 'white',
                mb: { xs: 5, md: 7 },
                textShadow: '0 0 20px rgba(198, 126, 255, 0.4)',
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                background: 'linear-gradient(120deg, #e6ceff 0%, #c67eff 60%, #a96cff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}>
                Наші Тренувальні Зони
            </Typography>
            <Grid container spacing={{xs: 4, md: 5}} justifyContent="center"> {/* Зменшив spacing між картками */}
                {zones.map((zone, index) => (
                    // Обмеження ширини через Grid item
                    // На md екранах займає 9/12 = 75%, на lg 8/12 ~ 66%
                    <Grid item xs={12} sm={11} md={10} lg={8} key={zone.id} sx={{ width: '80%', height: 'auto' }}>
                        <ZoneCard zone={zone} index={index} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Zones;