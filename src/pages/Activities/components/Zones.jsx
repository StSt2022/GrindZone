import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import {keyframes} from '@emotion/react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(30px) translateZ(0);
    }
    to {
        opacity: 1;
        transform: translateY(0) translateZ(0);
    }
`;


const ZoneCard = ({zone, index, allEquipment}) => {
    const accent = zone.accentColor || 'rgba(138, 43, 226, 0.45)';

    const cardStyles = {
        background: 'rgba(30, 20, 50, 0.9)',
        backdropFilter: 'blur(12px)',
        borderRadius: '28px',
        border: `2px solid ${accent}`,
        boxShadow: `0 10px 35px rgba(0,0,0,0.25), 0 0 20px ${accent}20`,
        transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: {xs: 'column', md: 'row'},
        alignItems: {md: 'stretch'},
        minHeight: {xs: 'auto', md: '320px'},
        animation: `${fadeInUp} 0.6s ease-out ${index * 0.15}s backwards`,
        '&:hover': {
            transform: 'translateY(-12px) scale(1.02) translateZ(0)',
            boxShadow: `0 20px 55px ${accent}50, 0 0 35px ${accent}35`,
            borderColor: `${accent}CC`,
        },
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            borderRadius: 'inherit',
            background: `linear-gradient(135deg, ${accent}26 0%, transparent 70%)`,
            opacity: 0,
            transition: 'opacity 0.4s ease, background 0.4s ease',
            zIndex: 0,
        },
        '&:hover::before': {
            opacity: 1,
        }
    };


    const equipmentInZone = allEquipment
        .filter(eq => eq.zoneId === zone.id)
        .map(eq => eq.name)
        .slice(0, 4);


    const totalEquipmentInZoneCount = allEquipment.filter(eq => eq.zoneId === zone.id).length;


    return (
        <Card sx={cardStyles}>
            <CardMedia
                component="img"
                sx={{
                    width: {xs: '100%', md: '45%'},
                    height: '100%',
                    maxHeight: '320px',
                    minHeight: 0,
                    alignSelf: 'center',
                    flex: '0 0 auto',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    borderRight: {md: `2px solid ${accent}55`},
                    borderBottom: {xs: `2px solid ${accent}55`, md: 'none'},
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
                pl: {xs: 3, sm: 3.5, md: 4},
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 1,
            }}>
                <Box>
                    <Typography variant="h4" component="h3" sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        mb: 2,
                        fontSize: {xs: '1.8rem', sm: '2.2rem', md: '2.4rem'},
                        background: `linear-gradient(135deg, #f0e6ff 40%, ${accent} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: `0 2px 12px ${accent}2A`
                    }}>
                        {zone.name}
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: 'rgba(235, 225, 255, 0.9)',
                        fontSize: {xs: '0.95rem', sm: '1.05rem'},
                        lineHeight: 1.7,
                        mb: 3,
                        maxWidth: '65ch'
                    }}>
                        {zone.description}
                    </Typography>
                </Box>

                {equipmentInZone.length > 0 && (
                    <Box mt="auto">
                        <Typography variant="subtitle1"
                                    sx={{color: accent, fontWeight: '600', mb: 1, fontSize: '1.1rem'}}>
                            Основне обладнання:
                        </Typography>
                        <List dense disablePadding sx={{mb: -1}}>
                            {equipmentInZone.map((name, i) => (
                                <ListItem key={i} disableGutters sx={{py: 0.3}}>
                                    <ListItemIcon sx={{minWidth: '30px', color: `${accent}B3`}}>
                                        <CheckCircleOutlineIcon fontSize="small"/>
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
                        {totalEquipmentInZoneCount > equipmentInZone.length && (
                            <Typography variant="caption" sx={{
                                color: 'rgba(210, 190, 250, 0.6)',
                                fontStyle: 'italic',
                                display: 'block',
                                textAlign: 'right',
                                mt: 0.5
                            }}>
                                та ще {totalEquipmentInZoneCount - equipmentInZone.length} од...
                            </Typography>
                        )}
                    </Box>
                )}
                {totalEquipmentInZoneCount === 0 && (
                    <Typography variant="caption"
                                sx={{color: 'rgba(210, 190, 250, 0.7)', fontStyle: 'italic', mt: 'auto'}}>
                        Спеціальний інвентар для групових програм.
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};


const Zones = ({zones, allEquipment}) => {
    if (!zones || zones.length === 0) {
        return <Typography color="text.secondary" sx={{textAlign: 'center', my: 4, fontStyle: 'italic'}}>Інформація про
            зони наразі недоступна.</Typography>;
    }
    if (!allEquipment) {
        return <Typography color="text.secondary" sx={{textAlign: 'center', my: 4, fontStyle: 'italic'}}>Завантаження
            даних про обладнання...</Typography>;
    }

    return (
        <Box component="section" sx={{py: {xs: 4, md: 6}, height: '100%'}}>
            <Typography variant="h2" component="h2" sx={{
                textAlign: 'center', fontWeight: 'bold', color: 'white',
                mb: {xs: 5, md: 7},
                textShadow: '0 0 20px rgba(198, 126, 255, 0.4)',
                fontSize: {xs: '2.5rem', sm: '3rem', md: '3.5rem'},
                background: 'linear-gradient(120deg, #e6ceff 0%, #c67eff 60%, #a96cff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}>
                Наші Тренувальні Зони
            </Typography>
            <Grid container spacing={{xs: 4, md: 5}} justifyContent="center">
                {zones.map((zone, index) => (
                    <Grid item xs={12} sm={11} md={10} lg={8} key={zone.id} sx={{width: '80%', height: 'auto'}}>
                        <ZoneCard zone={zone} index={index} allEquipment={allEquipment}/>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Zones;