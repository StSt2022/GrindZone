// src/components/activities/BookingSection.jsx
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { styled, alpha } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { uk } from 'date-fns/locale';
import { addMinutes, format, parse, isValid as isValidDate } from 'date-fns';

import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { useAuth } from '../../../context/AuthContext'; // Перевір шлях

// ... (стилі залишаються такими ж)
const primaryPurple = '#8737c9';
const secondaryPurple = '#601ab6';
const hoverPurple = '#550f8d';
const cardBg = 'rgba(20, 15, 40, 0.95)';
const lightText = 'rgba(220, 210, 255, 0.9)';
const subtleText = 'rgba(220, 210, 255, 0.7)';
const iconColor = '#e1d2f5';

const formControlBaseStyles = (isDisabled = false) => ({
    mb: 2.5,
    width: '100%',
    '& .MuiInputLabel-root': {
        color: isDisabled ? alpha(lightText, 0.5) : subtleText,
        fontWeight: 500,
        fontSize: '0.95rem',
    },
    '& .MuiOutlinedInput-root': {
        color: isDisabled ? alpha(lightText, 0.6) : 'white',
        borderRadius: '14px',
        fontSize: '1rem',
        transition: 'border-color 0.3s ease',
        '& fieldset': {
            borderColor: isDisabled ? alpha(primaryPurple, 0.3) : alpha(primaryPurple, 0.5),
            borderWidth: '1px',
            transition: 'border-color 0.3s ease',
        },
        '&:hover fieldset': {
            borderColor: isDisabled ? alpha(primaryPurple, 0.3) : secondaryPurple,
        },
        '&.Mui-focused fieldset': {
            borderColor: secondaryPurple,
            boxShadow: `0 0 0 2.5px ${alpha(secondaryPurple, 0.25)}`,
        },
        '&.Mui-disabled': {
            WebkitTextFillColor: alpha(lightText, 0.55),
            color: alpha(lightText, 0.55),
            '& fieldset': { borderColor: `${alpha(primaryPurple, 0.25)} !important` },
        },
        '& .MuiInputAdornment-root .MuiSvgIcon-root': {
            color: isDisabled ? alpha(iconColor, 0.5) : iconColor,
        },
    },
    '& .MuiSelect-icon': {
        color: isDisabled ? alpha(iconColor, 0.5) : iconColor,
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: 'translate(14px, -9px) scale(0.75)',
    },
    '& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)': {
        transform: 'translate(14px, 16px) scale(1)',
    },
});

const selectControlStyles = (isDisabled = false) => ({
    ...formControlBaseStyles(isDisabled),
    '& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)': {
        transform: 'translate(14px, 9px) scale(1)',
    },
});

const menuProps = {
    PaperProps: {
        sx: {
            backgroundColor: alpha(cardBg, 0.98),
            backdropFilter: 'blur(10px)',
            color: lightText,
            border: `1px solid ${alpha(primaryPurple, 0.6)}`,
            maxHeight: 300,
            '& .MuiMenuItem-root': {
                fontSize: '1rem',
                '&:hover': { backgroundColor: alpha(primaryPurple, 0.25) },
                '&.Mui-selected': { backgroundColor: `${alpha(primaryPurple, 0.4)} !important` }
            }
        },
    },
};

const StyledBookingButton = styled(Button)(({ theme, disabled }) => ({
    padding: theme.spacing(1.75, 4),
    borderRadius: '16px',
    fontWeight: '600',
    fontSize: '1.05rem',
    textTransform: 'none',
    color: theme.palette.common.white,
    position: 'relative',
    background: disabled
        ? alpha(secondaryPurple, 0.3)
        : `linear-gradient(45deg, ${secondaryPurple} 0%, ${primaryPurple} 100%)`,
    boxShadow: disabled
        ? 'none'
        : `0 6px 20px -5px ${alpha(secondaryPurple, 0.5)}, inset 0 -2px 5px rgba(0,0,0,0.1)`,
    transition: 'all 0.25s ease-in-out',
    border: `1px solid ${disabled ? alpha(secondaryPurple, 0.2) : alpha(theme.palette.common.white, 0.2)}`,
    '&:hover': {
        background: disabled
            ? alpha(secondaryPurple, 0.3)
            : `linear-gradient(45deg, ${hoverPurple} 0%, ${alpha(primaryPurple, 0.9)} 100%)`,
        boxShadow: disabled
            ? 'none'
            : `0 8px 25px -5px ${alpha(hoverPurple, 0.6)}, inset 0 -2px 8px rgba(0,0,0,0.15)`,
        transform: disabled ? 'none' : 'translateY(-2px) scale(1.01)',
        borderColor: disabled ? alpha(secondaryPurple, 0.2) : alpha(theme.palette.common.white, 0.3),
    },
    '&.Mui-disabled': {
        color: alpha(theme.palette.common.white, 0.5),
        background: alpha(cardBg, 0.6),
    },
    '& .MuiButton-startIcon': {
        marginRight: theme.spacing(1.2),
        marginLeft: theme.spacing(-0.8),
    },
}));

const BookingFormCard = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: '720px',
    background: cardBg,
    backdropFilter: 'blur(18px)',
    borderRadius: '28px',
    border: `1px solid ${alpha(primaryPurple, 0.6)}`,
    boxShadow: `0 18px 50px ${alpha(theme.palette.common.black, 0.35)}`,
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: '1px',
        borderRadius: '27px',
        background: `radial-gradient(ellipse at 50% 0%, ${alpha(primaryPurple, 0.07)} 0%, transparent 70%)`,
        opacity: 0.9,
        zIndex: 0,
    },
    '& > .MuiCardContent-root': {
        position: 'relative',
        zIndex: 1,
    },
}));


const BookingSection = ({ allEquipment, allClasses, allZones, initialTarget, onBookingConfirmed, onClearTarget }) => {
    const { currentUser, isAuthenticated } = useAuth();

    const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
    const [equipmentDate, setEquipmentDate] = useState(null);
    const [equipmentStartTime, setEquipmentStartTime] = useState(null);
    const [equipmentDuration, setEquipmentDuration] = useState(30);
    const [equipmentBookerPhone, setEquipmentBookerPhone] = useState('');
    const [isEquipmentBooking, setIsEquipmentBooking] = useState(false);

    const [selectedClassId, setSelectedClassId] = useState('');
    const [classDate, setClassDate] = useState(null);
    const [classStartTime, setClassStartTime] = useState(null);
    const [classEndTime, setClassEndTime] = useState(null);
    const [classBookerPhone, setClassBookerPhone] = useState('');
    const [isClassBooking, setIsClassBooking] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const resetEquipmentForm = () => {
        setSelectedEquipmentId('');
        setEquipmentDate(null);
        setEquipmentStartTime(null);
        setEquipmentDuration(30);
        setEquipmentBookerPhone('');
    };

    const resetClassForm = () => {
        setSelectedClassId('');
        setClassBookerPhone('');
    };

    // Функція для обробки введення номера телефону (тільки цифри та обмеження довжини)
    const handlePhoneInputChange = (event, setter) => {
        const rawValue = event.target.value;
        const numericValue = rawValue.replace(/[^0-9]/g, ''); // Видаляємо всі нецифрові символи
        // Можна додати обмеження довжини, наприклад, до 12-13 символів (для +380XXXXXXXXX)
        setter(numericValue.slice(0, 12)); // Приклад: обмежуємо до 12 цифр
    };


    useEffect(() => {
        if (initialTarget) {
            if (initialTarget.type === 'equipment') {
                setSelectedEquipmentId(initialTarget.item.id);
                setEquipmentDate(new Date());
                resetClassForm();
            } else if (initialTarget.type === 'class') {
                const classItem = initialTarget.item;
                setSelectedClassId(classItem.id);
                resetEquipmentForm();
            }
        }
    }, [initialTarget]);

    useEffect(() => {
        if (selectedClassId && allClasses?.length > 0) {
            const sClass = allClasses.find(c => c.id === selectedClassId);
            if (sClass) {
                try {
                    const parsedDate = parse(sClass.date, 'yyyy-MM-dd', new Date());
                    if (isValidDate(parsedDate)) {
                        setClassDate(parsedDate);
                        const parsedStartTime = parse(`${sClass.date} ${sClass.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
                        if (isValidDate(parsedStartTime)) setClassStartTime(parsedStartTime); else setClassStartTime(null);
                        const parsedEndTime = parse(`${sClass.date} ${sClass.endTime}`, 'yyyy-MM-dd HH:mm', new Date());
                        if (isValidDate(parsedEndTime)) setClassEndTime(parsedEndTime); else setClassEndTime(null);
                    } else {
                        setClassDate(null); setClassStartTime(null); setClassEndTime(null);
                    }
                } catch (error) {
                    console.error('Error parsing class time:', error);
                    setClassDate(null); setClassStartTime(null); setClassEndTime(null);
                }
            }
        } else {
            setClassDate(null); setClassStartTime(null); setClassEndTime(null);
        }
    }, [selectedClassId, allClasses]);

    const handleEquipmentBooking = async (e) => {
        e.preventDefault();
        if (!isAuthenticated || !currentUser?.userId) {
            showSnackbar("Для бронювання потрібно авторизуватися.", "error");
            return;
        }
        if (!selectedEquipmentId || !equipmentDate || !equipmentStartTime || !equipmentDuration || !equipmentBookerPhone) {
            showSnackbar("Будь ласка, заповніть усі обов'язкові поля для тренажера.", "error");
            return;
        }
        if (equipmentBookerPhone.length < 9 || equipmentBookerPhone.length > 12) { // Приклад валідації довжини
            showSnackbar("Номер телефону має містити від 9 до 12 цифр.", "error");
            return;
        }

        setIsEquipmentBooking(true);
        const equipmentDetails = allEquipment.find(eq => eq.id === selectedEquipmentId);
        if (!equipmentDetails) {
            showSnackbar("Обраний тренажер не знайдено.", "error");
            setIsEquipmentBooking(false);
            return;
        }
        const calculatedEndTime = addMinutes(equipmentStartTime, equipmentDuration);

        const payload = {
            userId: currentUser.userId,
            type: 'equipment',
            itemId: selectedEquipmentId,
            itemName: equipmentDetails.name,
            zoneId: equipmentDetails.zoneId,
            bookingDate: format(equipmentDate, 'yyyy-MM-dd'),
            startTime: format(equipmentStartTime, 'HH:mm'),
            endTime: format(calculatedEndTime, 'HH:mm'),
            duration: equipmentDuration,
            bookerPhone: equipmentBookerPhone // Вже тільки цифри
        };

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (response.ok) {
                showSnackbar(`Тренажер "${equipmentDetails.name}" успішно заброньовано!`, "success");
                if (onBookingConfirmed) onBookingConfirmed(data.bookingDetails);
                if (onClearTarget) onClearTarget();
                resetEquipmentForm();
            } else {
                showSnackbar(data.message || "Помилка бронювання тренажера.", "error");
            }
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Помилка в /api/bookings:`, error);
            showSnackbar("Помилка мережі або сервера при бронюванні тренажера.", "error");
        } finally {
            setIsEquipmentBooking(false);
        }
    };

    const handleClassBooking = async (e) => {
        e.preventDefault();
        if (!isAuthenticated || !currentUser?.userId) {
            showSnackbar("Для бронювання потрібно авторизуватися.", "error");
            return;
        }
        if (!selectedClassId || !classBookerPhone) {
            showSnackbar("Будь ласка, оберіть заняття та вкажіть телефон.", "error");
            return;
        }
        if (classBookerPhone.length < 9 || classBookerPhone.length > 12) { // Приклад валідації довжини
            showSnackbar("Номер телефону має містити від 9 до 12 цифр.", "error");
            return;
        }

        setIsClassBooking(true);
        const classDetails = allClasses.find(c => c.id === selectedClassId);
        if (!classDetails) {
            showSnackbar("Обране заняття не знайдено.", "error");
            setIsClassBooking(false);
            return;
        }
        if (classDetails.bookedUserIds.length >= classDetails.maxCapacity) {
            showSnackbar("На жаль, на це заняття вже немає вільних місць.", "warning");
            setIsClassBooking(false);
            return;
        }

        const payload = {
            userId: currentUser.userId,
            type: 'class',
            itemId: selectedClassId,
            itemName: classDetails.title,
            zoneId: classDetails.zoneId,
            bookingDate: classDetails.date,
            startTime: classDetails.startTime,
            endTime: classDetails.endTime,
            bookerPhone: classBookerPhone // Вже тільки цифри
        };

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (response.ok) {
                showSnackbar(`Ви успішно записані на заняття "${classDetails.title}"!`, "success");
                if (onBookingConfirmed) onBookingConfirmed(data.bookingDetails);
                if (onClearTarget) onClearTarget();
                resetClassForm();
            } else {
                showSnackbar(data.message || "Помилка запису на заняття.", "error");
            }
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Помилка в /api/bookings:`, error);
            showSnackbar("Помилка мережі або сервера при записі на заняття.", "error");
        } finally {
            setIsClassBooking(false);
        }
    };

    const selectedGroupClass = selectedClassId ? allClasses.find(c => c.id === selectedClassId) : null;
    const isGroupClassFull = selectedGroupClass ? (selectedGroupClass.bookedUserIds.length >= selectedGroupClass.maxCapacity) : false;

    const durationOptions = [
        { value: 30, label: '30 хвилин' },
        { value: 45, label: '45 хвилин' },
        { value: 60, label: '1 година' },
        { value: 90, label: '1.5 години' },
    ];

    if (!allEquipment || !allClasses || !allZones) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
                <Typography sx={{ml: 2}}>Завантаження форм бронювання...</Typography>
            </Box>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
            <Box component="section" sx={{ py: { xs: 5, md: 8 } }}>
                <Typography
                    variant="h2"
                    component="h2"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: 'white',
                        mb: { xs: 5, md: 7 },
                        textShadow: '0 0 20px rgba(198, 126, 255, 0.4)',
                        fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                        background: 'linear-gradient(120deg, #e6ceff 0%, #c67eff 60%, #a96cff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Забронюйте Тренажер або Заняття!
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: { xs: 4, md: 6 },
                }}>
                    <BookingFormCard>
                        <CardContent sx={{ p: { xs: 3, sm: 4, md: 4.5 }}}>
                            <Box sx={{display: 'flex', alignItems: 'center', color: lightText, mb: 4.5}}>
                                <FitnessCenterIcon sx={{fontSize: '3rem', mr: 2, color: iconColor}}/>
                                <Typography variant="h5" sx={{ fontWeight: '600', color: iconColor }}>Тренажер</Typography>
                            </Box>
                            <Box component="form" onSubmit={handleEquipmentBooking}>
                                <FormControl fullWidth sx={selectControlStyles(isEquipmentBooking)}>
                                    <InputLabel id="equipment-select-label">Оберіть тренажер</InputLabel>
                                    <Select
                                        labelId="equipment-select-label" value={selectedEquipmentId} label="Оберіть тренажер"
                                        onChange={(e) => setSelectedEquipmentId(e.target.value)} required MenuProps={menuProps}
                                        disabled={isEquipmentBooking}
                                    >
                                        {allEquipment.map((eq) => {
                                            const zone = allZones.find(z => z.id === eq.zoneId);
                                            return (<MenuItem key={eq.id} value={eq.id}>{eq.name} {zone ? `(${zone.name})` : ''}</MenuItem>);
                                        })}
                                    </Select>
                                </FormControl>
                                <DatePicker
                                    label="Дата" value={equipmentDate} onChange={setEquipmentDate} minDate={new Date()}
                                    disabled={isEquipmentBooking}
                                    slots={{ openPickerIcon: EventNoteIcon }}
                                    slotProps={{
                                        textField: { sx: formControlBaseStyles(isEquipmentBooking), required: true, fullWidth: true },
                                        openPickerButton: { size: 'medium', edge: 'end', sx:{mr: -0.5}}
                                    }}
                                />
                                <Grid container spacing={2.5} alignItems="center">
                                    <Grid item xs={12} sm={7}>
                                        <TimePicker
                                            label="Час початку" value={equipmentStartTime} onChange={setEquipmentStartTime}
                                            ampm={false} minutesStep={15}
                                            disabled={isEquipmentBooking}
                                            slots={{ openPickerIcon: AccessTimeFilledIcon }}
                                            slotProps={{
                                                textField: { sx: formControlBaseStyles(isEquipmentBooking), required: true, fullWidth: true },
                                                openPickerButton: { size: 'medium', edge: 'end', sx:{mr: -0.5}}
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={5}>
                                        <FormControl fullWidth sx={formControlBaseStyles(isEquipmentBooking)}>
                                            <InputLabel id="duration-select-label">Тривалість</InputLabel>
                                            <Select labelId="duration-select-label" value={equipmentDuration} label="Тривалість"
                                                    onChange={(e) => setEquipmentDuration(e.target.value)} required MenuProps={menuProps}
                                                    disabled={isEquipmentBooking}
                                                    startAdornment={<ScheduleIcon sx={{mr:1.2, ml:0.5, color: iconColor, fontSize:'1.3rem'}} />}
                                            >
                                                {durationOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <TextField
                                    label="Ваш телефон"
                                    type="tel" // Залишаємо type="tel" для семантики та потенційної мобільної клавіатури
                                    inputMode="numeric" // Підказка для браузера про тип клавіатури
                                    pattern="[0-9]*"    // Додаткова підказка для валідації (не завжди працює як очікується для блокування)
                                    fullWidth
                                    required
                                    sx={formControlBaseStyles(isEquipmentBooking)}
                                    value={equipmentBookerPhone}
                                    onChange={(e) => handlePhoneInputChange(e, setEquipmentBookerPhone)}
                                    placeholder="+380 XX XXX XX XX" // Можна залишити для формату
                                    disabled={isEquipmentBooking}
                                    InputProps={{
                                        startAdornment: <PhoneIphoneIcon sx={{mr:1.2, ml:0.5, color: iconColor, fontSize:'1.3rem'}}/>
                                    }}
                                />
                                <Box sx={{ mt: 2, mb: 5 }}>
                                    <StyledBookingButton type="submit" fullWidth startIcon={isEquipmentBooking ? null : <CheckCircleOutlineIcon/>} disabled={isEquipmentBooking}>
                                        {isEquipmentBooking ? <CircularProgress size={24} color="inherit" /> : "Забронювати тренажер"}
                                    </StyledBookingButton>
                                </Box>
                            </Box>
                        </CardContent>
                    </BookingFormCard>

                    <BookingFormCard>
                        <CardContent sx={{ p: { xs: 3, sm: 4, md: 4.5 }}}>
                            <Box sx={{display: 'flex', alignItems: 'center', color: lightText, mb: 4.5}}>
                                <Diversity3Icon sx={{fontSize: '3rem', mr: 2, color: iconColor}}/>
                                <Typography variant="h5" sx={{ fontWeight: '600', color: iconColor }}>Групове Заняття</Typography>
                            </Box>
                            <Box component="form" onSubmit={handleClassBooking}>
                                <FormControl fullWidth sx={selectControlStyles(isClassBooking || (isGroupClassFull && !selectedClassId))}>
                                    <InputLabel id="class-select-label">Оберіть заняття</InputLabel>
                                    <Select
                                        labelId="class-select-label" value={selectedClassId} label="Оберіть заняття"
                                        onChange={(e) => setSelectedClassId(e.target.value)} required MenuProps={menuProps}
                                        disabled={isClassBooking || (isGroupClassFull && !selectedClassId)}
                                    >
                                        {allClasses.map((sClass) => (
                                            <MenuItem key={sClass.id} value={sClass.id} disabled={sClass.bookedUserIds.length >= sClass.maxCapacity}>
                                                {sClass.title} ({sClass.date ? format(parse(sClass.date, 'yyyy-MM-dd', new Date()), 'dd MMM', {locale: uk}) : 'Дата не вказана'}, {sClass.startTime})
                                                {sClass.bookedUserIds.length >= sClass.maxCapacity && " (Немає місць)"}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {isGroupClassFull && selectedClassId && <FormHelperText error sx={{ml:1.5, fontSize:'0.8rem', color: alpha(lightText, 0.9)}}>На це заняття немає вільних місць.</FormHelperText>}
                                </FormControl>
                                <DatePicker
                                    label="Дата заняття" value={classDate} readOnly disabled
                                    slots={{ openPickerIcon: EventNoteIcon }}
                                    slotProps={{
                                        textField: { sx: formControlBaseStyles(true), fullWidth: true },
                                        openPickerButton: { size: 'medium', edge: 'end', sx:{mr: -0.5}}
                                    }}
                                />
                                <Grid container spacing={2.5}>
                                    <Grid item xs={6}>
                                        <TimePicker
                                            label="Час початку" value={classStartTime} readOnly disabled ampm={false}
                                            slots={{ openPickerIcon: AccessTimeFilledIcon }}
                                            slotProps={{
                                                textField: { sx: formControlBaseStyles(true), fullWidth: true },
                                                openPickerButton: { size: 'medium', edge: 'end', sx:{mr: -0.5}}
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TimePicker
                                            label="Час закінчення" value={classEndTime} readOnly disabled ampm={false}
                                            slots={{ openPickerIcon: AccessTimeFilledIcon }}
                                            slotProps={{
                                                textField: { sx: formControlBaseStyles(true), fullWidth: true },
                                                openPickerButton: { size: 'medium', edge: 'end', sx:{mr: -0.5}}
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <TextField
                                    label="Ваш телефон"
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    fullWidth
                                    required
                                    sx={formControlBaseStyles(isClassBooking)}
                                    value={classBookerPhone}
                                    onChange={(e) => handlePhoneInputChange(e, setClassBookerPhone)}
                                    placeholder="+380 XX XXX XX XX"
                                    disabled={isClassBooking}
                                    InputProps={{
                                        startAdornment: <PhoneIphoneIcon sx={{mr:1.2, ml:0.5, color: iconColor, fontSize:'1.3rem'}}/>
                                    }}
                                />
                                <Box sx={{ mt: 2, mb: 5 }}>
                                    <StyledBookingButton type="submit" fullWidth disabled={isClassBooking || isGroupClassFull} startIcon={isClassBooking ? null : (isGroupClassFull ? <EventBusyIcon/> : <CheckCircleOutlineIcon/>)}>
                                        {isClassBooking ? <CircularProgress size={24} color="inherit" /> : (isGroupClassFull ? "Немає місць" : "Забронювати заняття")}
                                    </StyledBookingButton>
                                </Box>
                            </Box>
                        </CardContent>
                    </BookingFormCard>
                </Box>
            </Box>
            <Snackbar
                open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} variant="filled" sx={{ width: '100%', boxShadow: 6, '.MuiAlert-icon': {fontSize: '1.5rem'} }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </LocalizationProvider>
    );
};

export default BookingSection;