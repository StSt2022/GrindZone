// src/components/activities/Equipment.jsx
import React, { useState, useEffect, useRef } from 'react';
import Slider from "react-slick";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

// Icons
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EventSeatIcon from '@mui/icons-material/EventSeat';

import { Global, keyframes, css } from '@emotion/react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const cardHoverShine = keyframes`
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
`;

const slickDotsStyles = css`
    .slick-dots li button:before {
        font-size: 11px;
        color: rgba(138, 43, 226, 0.45);
        opacity: 0.75;
        transition: all 0.3s ease;
    }
    .slick-dots li.slick-active button:before {
        color: #b388ff;
        opacity: 1;
    }
    .slick-dots {
        bottom: -45px;
    }
`;

const StyledBookButton = styled(Button)(({ theme }) => ({ /* ... (стилі кнопки залишаються) ... */
    background: 'linear-gradient(45deg, #b388ff 30%, #7c4dff 90%)',
    border: 0,
    borderRadius: '12px',
    color: theme.palette.common.white,
    fontWeight: 'bold',
    padding: '10px 22px',
    boxShadow: '0 3px 5px 2px rgba(126, 77, 255, .25)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    textTransform: 'none',
    fontSize: '0.9rem',
    width: '100%',
    '&:hover': {
        background: 'linear-gradient(45deg, #a272f0 30%, #651fff 90%)',
        boxShadow: '0 5px 8px 3px rgba(126, 77, 255, .35)',
        transform: 'translateY(-1px)',
    },
}));

const EquipmentCard = ({ equipment, onBookClick }) => { /* ... (код картки залишається майже таким же) ... */
    const cardMinHeight = 430;

    const cardStyles = {
        minHeight: `${cardMinHeight}px`,
        height: '100%',
        background: 'rgba(38, 30, 65, 0.92)', // Трохи змінив фон для контрасту з фоном слайдера
        borderRadius: '20px',
        border: '1px solid rgba(138, 43, 226, 0.25)', // Трохи яскравіша рамка
        boxShadow: '0 7px 20px rgba(0, 0, 0, 0.3)', // Виразніша тінь
        transition: 'all 0.35s ease-out',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden', // Важливо для ::after
        '&::after': { // Блиск при ховері на центральну картку
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '70%',
            height: '100%',
            background: `linear-gradient(
              90deg,
              transparent,
              rgba(198, 126, 255, 0.1), // Зробив блиск менш інтенсивним
              transparent
            )`,
            transition: 'left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s', // Додав невелику затримку
            pointerEvents: 'none',
            zIndex: 1, // Поверх контенту картки, але під кнопкою, якщо вона абсолютна
        },
    };

    return (
        <Box sx={{ p: {xs: 0.5, sm: 1}, height: '100%' }}> {/* Зменшив padding, щоб картки були ближче одна до одної */}
            <Card sx={cardStyles}>
                <Box sx={{ height: '200px', overflow: 'hidden', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', position:'relative', zIndex: 2 }}> {/* zIndex, щоб картинка була над блиском */}
                    <CardMedia
                        className="equipment-image"
                        component="img"
                        sx={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.45s ease-out',
                        }}
                        image={equipment.imageUrl || `https://via.placeholder.com/400x200/6A0DAD/FFFFFF?text=${equipment.name.replace(' ', '+')}`}
                        alt={equipment.name}
                    />
                </Box>
                <CardContent sx={{
                    flexGrow: 1,
                    p: {xs: 2, sm: 2.5},
                    display: 'flex',
                    flexDirection: 'column',
                    position:'relative', zIndex: 2, // zIndex, щоб контент був над блиском
                }}>
                    <Typography variant="h6" component="div" sx={{
                        fontWeight: '600', color: 'white', fontSize: '1.1rem', mb: 1.5,
                        lineHeight: 1.3, minHeight: '46px',
                        textAlign: 'left',
                    }}>
                        {equipment.name}
                    </Typography>
                    <Typography variant="body2" color="rgba(230, 220, 255, 0.75)" sx={{ // Зробив текст трохи яскравішим
                        fontSize: '0.88rem', lineHeight: 1.55, mb: 2,
                        flexGrow: 1,
                        minHeight: '70px',
                        textAlign: 'left',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical',
                    }}>
                        {equipment.description}
                    </Typography>
                </CardContent>
                <CardActions sx={{ p: {xs: 1.5, sm: 2}, pt: 0, marginTop: 'auto', position:'relative', zIndex: 2 }}>
                    <StyledBookButton
                        onClick={() => onBookClick(equipment)}
                        startIcon={<EventSeatIcon />}
                        fullWidth
                    >
                        Обрати для бронювання
                    </StyledBookButton>
                </CardActions>
            </Card>
        </Box>
    );
};

const CustomArrow = ({ direction, onClick }) => { /* ... (код стрілок залишається) ... */
    return (
        <IconButton
            onClick={onClick}
            sx={{
                position: 'absolute',
                top: 'calc(50% - 40px)', // Відкоригувати, якщо картки вищі/нижчі
                transform: 'translateY(-50%)',
                ...(direction === 'prev' ? { left: {xs: -10, sm:-15, md:-25} } : { right: {xs: -10, sm:-15, md:-25} }),
                zIndex: 2,
                bgcolor: 'rgba(35, 28, 55, 0.9)',
                color: '#c67eff',
                border: '1px solid rgba(138, 43, 226, 0.3)',
                boxShadow: '0 0 12px rgba(138, 43, 226, 0.15)',
                width: {xs: 40, sm: 48}, height: {xs: 40, sm: 48},
                '&:hover': { bgcolor: 'rgba(50, 40, 70, 0.95)', transform: 'scale(1.1) translateY(-50%)', boxShadow: '0 0 15px rgba(138, 43, 226, 0.25)' },
                transition: 'all 0.25s ease'
            }}
        >
            {direction === 'prev' ? <ArrowBackIosNewIcon /> : <ArrowForwardIosIcon />}
        </IconButton>
    );
};

const Equipment = ({ zones, equipment, onBookEquipment }) => {
    // ... (стейт, useEffects, хендлери - залишаються такими ж) ...
    const [selectedZoneId, setSelectedZoneId] = useState('');
    const [filteredEquipment, setFilteredEquipment] = useState([]);
    const sliderRef = useRef(null);

    useEffect(() => {
        if (zones && zones.length > 0 && !selectedZoneId) {
            setSelectedZoneId(zones[0].id);
        }
    }, [zones, selectedZoneId]);

    useEffect(() => {
        let newFilteredEquipment = [];
        if (selectedZoneId) {
            const zone = zones.find(z => z.id === selectedZoneId);
            newFilteredEquipment = zone?.equipmentIds
                ? equipment.filter(eq => zone.equipmentIds.includes(eq.id))
                : [];
        } else {
            newFilteredEquipment = equipment;
        }
        setFilteredEquipment(newFilteredEquipment);

        if (sliderRef.current) {
            sliderRef.current.slickGoTo(0);
        }
    }, [selectedZoneId, zones, equipment]);

    const handleZoneChange = (event) => {
        setSelectedZoneId(event.target.value);
    };

    const slidesToShowDefault = 3;
    const enableCenterMode = filteredEquipment.length >= slidesToShowDefault;

    const sliderSettings = {
        dots: filteredEquipment.length > (enableCenterMode ? 1 : slidesToShowDefault),
        infinite: filteredEquipment.length > (enableCenterMode ? 1 : slidesToShowDefault),
        speed: 600,
        slidesToShow: enableCenterMode ? slidesToShowDefault : Math.min(slidesToShowDefault, filteredEquipment.length || 1),
        slidesToScroll: 1,
        autoplay: filteredEquipment.length > (enableCenterMode ? 1 : slidesToShowDefault),
        autoplaySpeed: 5000,
        pauseOnHover: true,
        cssEase: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        centerMode: enableCenterMode,
        centerPadding: enableCenterMode ? '80px' : '0px', // ЗБІЛЬШИВ centerPadding для більшого простору
        nextArrow: <CustomArrow direction="next" />,
        prevArrow: <CustomArrow direction="prev" />,
        responsive: [ // Адаптуємо responsive налаштування
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: filteredEquipment.length < 3 ? filteredEquipment.length : 3,
                    centerMode: filteredEquipment.length >= 3,
                    centerPadding: filteredEquipment.length >= 3 ? '70px' : '0px',
                    dots: filteredEquipment.length > (filteredEquipment.length < 3 ? filteredEquipment.length : 3),
                    infinite: filteredEquipment.length > (filteredEquipment.length < 3 ? filteredEquipment.length : 3),
                    autoplay: filteredEquipment.length > (filteredEquipment.length < 3 ? filteredEquipment.length : 3),
                }
            },
            {
                breakpoint: 1100, // Додав ще один брейкпоінт
                settings: {
                    slidesToShow: filteredEquipment.length < 2 ? filteredEquipment.length : 2,
                    centerMode: filteredEquipment.length >= 2,
                    centerPadding: filteredEquipment.length >= 2 ? '60px' : '0px',
                    dots: filteredEquipment.length > (filteredEquipment.length < 2 ? filteredEquipment.length : 2),
                    infinite: filteredEquipment.length > (filteredEquipment.length < 2 ? filteredEquipment.length : 2),
                    autoplay: filteredEquipment.length > (filteredEquipment.length < 2 ? filteredEquipment.length : 2),
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: false,
                    arrows: filteredEquipment.length > 1,
                    dots: filteredEquipment.length > 1,
                    infinite: filteredEquipment.length > 1,
                    autoplay: filteredEquipment.length > 1,
                    centerPadding: '0px',
                }
            }
        ],
    };


    if (!zones || !equipment) { /* ... */ }

    // Стиль для фону контейнера слайдера, який буде видно в проміжках
    const sliderContainerBackground = enableCenterMode ? {
        // Варіант 1: Ледь помітний шум/текстура (потребує SVG або base64 encoded image)
        // backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'10\' viewBox=\'0 0 10 10\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M-1 1l2-2M0 10l10-10M9 11l2-2\' stroke=\'%23A96CFF22\' stroke-width=\'0.5\'/%3E%3C/svg%3E")',
        // backgroundRepeat: 'repeat',

        // Варіант 2: Радіальний градієнт з центру проміжку
        // Це складно зробити точно для проміжків, тому спробуємо більш загальний фон
        // background: 'radial-gradient(ellipse at center, rgba(138, 43, 226, 0.08) 0%, transparent 70%)',

        // Варіант 3: Дуже легкий лінійний градієнт зверху вниз, трохи темніший за основний фон сторінки
        // background: 'linear-gradient(180deg, rgba(10, 5, 18, 0.95) 0%, rgba(18, 9, 29, 0.98) 100%)',

        // Варіант 4: Спробуємо тонкий геометричний патерн через linear-gradient
        backgroundSize: '20px 20px',
        backgroundImage: `
            linear-gradient(to right, rgba(169, 108, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(169, 108, 255, 0.03) 1px, transparent 1px)
        `,
        // Важливо, щоб цей фон був темнішим або відрізнявся від фону карток
    } : {};


    return (
        <Box component="section" sx={{ py: { xs: 4, md: 6 }, position: 'relative', overflow: 'hidden', ...sliderContainerBackground }}>
            <Global styles={slickDotsStyles} />
            {/* ... (Typography для заголовка та підзаголовка) ... */}
            <Typography variant="h2" component="h2" sx={{
                textAlign: 'center', fontWeight: 'bold', color: 'white', mb: 1,
                textShadow: '0 0 20px rgba(198, 126, 255, 0.4)',
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
                background: 'linear-gradient(120deg, #e6ceff 0%, #c67eff 60%, #a96cff 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
                Наші Тренажери
            </Typography>
            <Typography variant="h6" sx={{ textAlign: 'center', color: 'rgba(230, 220, 255, 0.8)', mb: { xs: 4, md: 6 }, fontWeight: 400, fontSize: {xs: '1rem', sm: '1.1rem'} }}>
                Оберіть зону, щоб переглянути доступне обладнання
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: {xs: 7, sm: 8} }}>
                {/* ... (FormControl для вибору зони) ... */}
                <FormControl variant="outlined" sx={{
                    minWidth: {xs: '85%', sm: 320, md: 380},
                    '& .MuiInputLabel-root': { color: 'rgba(230, 220, 255, 0.8)', fontWeight: 500 },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(138, 43, 226, 0.4)', borderWidth: '1px' },
                        '&:hover fieldset': { borderColor: '#a96cff' },
                        '&.Mui-focused fieldset': { borderColor: '#c67eff', boxShadow: '0 0 10px rgba(169, 108, 255, 0.4)' },
                        color: 'white', borderRadius: '14px',
                        backgroundColor: 'rgba(40, 30, 60, 0.85)',
                        fontSize: '1.1rem'
                    },
                    '& .MuiSelect-icon': { color: '#c67eff' }
                }}>
                    <InputLabel id="zone-select-label">Виберіть Зону</InputLabel>
                    <Select
                        labelId="zone-select-label"
                        value={selectedZoneId}
                        onChange={handleZoneChange}
                        label="Виберіть Зону"
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    backgroundColor: 'rgba(35, 25, 55, 0.98)', color: 'white',
                                    border: '1px solid rgba(138, 43, 226, 0.5)',
                                    maxHeight: 300,
                                    '& .MuiMenuItem-root': {
                                        fontSize: '1rem',
                                        '&:hover': { backgroundColor: 'rgba(138, 43, 226, 0.3)' },
                                        '&.Mui-selected': { backgroundColor: 'rgba(138, 43, 226, 0.5) !important' }
                                    }
                                },
                            },
                        }}
                    >
                        {zones.map((zone) => (
                            <MenuItem key={zone.id} value={zone.id}>{zone.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {filteredEquipment.length > 0 ? (
                <Box sx={{
                    maxWidth: '1250px',
                    mx: 'auto',
                    px: {xs: 0, sm: 2, md: 0},
                    mb: 5,
                    '.slick-slider .slick-list': {
                        overflow: 'visible', // Важливо для тіней та сусідніх слайдів
                        padding: enableCenterMode ? '20px 0' : '10px 0', // Збільшив відступ для тіней
                    },
                    '.slick-slider .slick-slide': {
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), filter 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        // padding тут не потрібен, відступи між картками регулюються centerPadding та шириною слайдів
                    },
                    '.slick-slider .slick-slide > div': { // Обгортка слайда
                        height: '100%',
                        display: 'flex',
                        padding: enableCenterMode ? '0 5px' : '0 8px', // Зменшив padding, якщо centerMode, щоб картки були ближче
                    },
                    '.slick-slider .slick-slide:not(.slick-center) > div > div > div[class*="MuiCard-root"]': {
                        transform: 'scale(0.88)',
                        opacity: 0.6, // Зробив менш прозорими
                        filter: 'blur(1.8px)', // Трохи сильніший блюр
                        cursor: 'default', // Немає сенсу клікати на розмиті
                    },
                    '.slick-slider .slick-slide.slick-center > div > div > div[class*="MuiCard-root"]': {
                        transform: 'scale(1)',
                        opacity: 1,
                        boxShadow: '0 18px 50px rgba(0,0,0,0.4), 0 0 35px rgba(169,108,255,0.3)',
                        borderColor: 'rgba(198, 126, 255, 0.65)',
                        cursor: 'pointer',
                    },
                    '.slick-slider .slick-slide.slick-center:hover > div > div > div[class*="MuiCard-root"]': {
                        transform: 'translateY(-10px) scale(1.025)',
                        borderColor: 'rgba(198, 126, 255, 0.75)',
                        boxShadow: '0 22px 60px rgba(0,0,0,0.45), 0 0 40px rgba(169,108,255,0.4)',
                        '& .equipment-image': {
                            transform: 'scale(1.06)',
                        },
                        '&::after': { // Блиск на картці
                            left: '130%',
                        }
                    },
                }}>
                    <Slider ref={sliderRef} {...sliderSettings}>
                        {filteredEquipment.map((eqItem) => (
                            <EquipmentCard key={eqItem.id} equipment={eqItem} onBookClick={onBookEquipment} />
                        ))}
                    </Slider>
                </Box>
            ) : (
                <Typography sx={{ textAlign: 'center', color: 'rgba(230, 220, 255, 0.75)', mt: 4, fontStyle: 'italic', fontSize: '1.1rem', pb: 5 }}>
                    {selectedZoneId ? `В обраній зоні поки немає тренажерів для онлайн бронювання.` : "Будь ласка, оберіть зону."}
                </Typography>
            )}
        </Box>
    );
};

export default Equipment;