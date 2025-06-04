import * as React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

// Іконки (залишаємо для мобільного меню та меню користувача)
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleIcon from '@mui/icons-material/People';

const DEFAULT_PAGES_NAV = [
    { title: 'Профіль', path: '/profile', icon: <DashboardIcon fontSize="small" /> },
    { title: 'Активності', path: '/activities', icon: <FitnessCenterIcon fontSize="small" /> },
    { title: 'Харчування', path: '/food', icon: <RestaurantIcon fontSize="small" /> },
    { title: 'Спільнота', path: '/community', icon: <PeopleIcon fontSize="small" /> }
];
const DEFAULT_SETTINGS_MENU = [
    { text: 'Профіль', icon: <AccountCircleIcon fontSize="small" />, action: 'Профіль' },
    { text: 'Налаштування', icon: <SettingsIcon fontSize="small" />, action: 'Налаштування' },
    { text: 'Вихід', icon: <LogoutIcon fontSize="small" />, action: 'Вихід' }
];

const ACCENT_COLOR_MAIN = '#00A9FF';
const ACCENT_COLOR_SECONDARY = '#0077B6';

const navButtonStyles = (isActive) => ({
    my: 2,
    color: isActive ? ACCENT_COLOR_MAIN : 'rgba(255, 255, 255, 0.8)',
    display: 'block',
    px: 1.8,
    py: 0.6,
    borderRadius: '6px',
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    transition: 'color 0.2s ease-in-out, background-color 0.2s ease-in-out, transform 0.2s ease-in-out',
    textTransform: 'none',
    fontWeight: isActive ? 600 : 500,
    fontSize: '0.95rem',
    position: 'relative',
    '&:hover': {
        color: 'white',
        background: 'rgba(255, 255, 255, 0.08)',
        transform: 'translateY(-1px)',
    },
    ...(isActive && {
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-2px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '70%',
            height: '2px',
            background: ACCENT_COLOR_MAIN,
            borderRadius: '2px',
        }
    })
});

const signInButtonStyles = {
    ...navButtonStyles(false),
    color: 'rgba(255, 255, 255, 0.8)',
    border: `1px solid rgba(255, 255, 255, 0.2)`,
    px: 2.2,
    py: 0.7,
    '&:hover': {
        ...navButtonStyles(false)['&:hover'],
        borderColor: ACCENT_COLOR_MAIN,
        color: 'white',
        background: `rgba(0, 169, 255, 0.1)`
    }
};

const signUpButtonStyles = {
    my: 2,
    color: 'white',
    display: 'block',
    px: 2.2,
    py: 0.7,
    borderRadius: '6px',
    border: 'none',
    background: `linear-gradient(45deg, ${ACCENT_COLOR_SECONDARY} 0%, ${ACCENT_COLOR_MAIN} 100%)`,
    boxShadow: `0 4px 12px rgba(0, 120, 200, 0.3)`,
    transition: 'all 0.25s ease-out',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    '&:hover': {
        transform: 'translateY(-2px) scale(1.03)',
        boxShadow: `0 6px 18px rgba(0, 120, 200, 0.45)`,
        background: `linear-gradient(45deg, ${ACCENT_COLOR_MAIN} 0%, #00C6FF 100%)`,
    }
};

function NavigationBar({
                           isAuthenticated,
                           currentUser,
                           onLogout,
                           pagesNav = DEFAULT_PAGES_NAV,
                           settingsMenu = DEFAULT_SETTINGS_MENU
                       }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleMobileLinkClick = (path) => {
        handleCloseNavMenu();
        navigate(path);
    };

    const handleSettingClick = (settingAction) => {
        handleCloseUserMenu();
        if (settingAction === 'Вихід') {
            if (onLogout) onLogout();
            navigate('/');
        } else if (settingAction === 'Профіль') {
            navigate('/profile');
        } else if (settingAction === 'Налаштування') {
            console.log("Перехід до налаштувань");
            // navigate('/settings');
        }
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: 'linear-gradient(90deg, rgba(30, 35, 50, 0.8) 0%, rgba(50, 55, 75, 0.9) 100%)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                borderBottomLeftRadius: { sm: '20px' }, borderBottomRightRadius: { sm: '20px' },
                boxShadow: '0 5px 25px rgba(0, 0, 0, 0.25)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                zIndex: 1200,
                willChange: 'backdrop-filter',
            }}
        >
            <Container maxWidth="xl">
                {/*
                    Toolbar є flex-контейнером.
                    1. Логотип (Desktop)
                    2. Мобільне меню (іконка)
                    3. Мобільне лого (текст)
                    4. Блок навігації (Desktop) - ЦЕЙ БЛОК МАЄ РОЗТЯГУВАТИСЯ І ЦЕНТРУВАТИ СВІЙ ВМІСТ
                    5. Блок авторизації/користувача (Desktop/Mobile Avatar)
                */}
                <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 68 } }}>
                    {/* Desktop Logo */}
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            // mr: 2, // Замість mr, дозволимо наступному flex-елементу розтягуватися
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            fontFamily: 'inherit',
                            fontWeight: 700,
                            letterSpacing: '.15rem',
                            color: 'white',
                            textDecoration: 'none',
                            textShadow: `0 0 8px rgba(${parseInt(ACCENT_COLOR_MAIN.slice(1,3),16)}, ${parseInt(ACCENT_COLOR_MAIN.slice(3,5),16)}, ${parseInt(ACCENT_COLOR_MAIN.slice(5,7),16)}, 0.5)`,
                            transition: 'transform 0.3s ease, text-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                textShadow: `0 0 12px rgba(${parseInt(ACCENT_COLOR_MAIN.slice(1,3),16)}, ${parseInt(ACCENT_COLOR_MAIN.slice(3,5),16)}, ${parseInt(ACCENT_COLOR_MAIN.slice(5,7),16)}, 0.7)`,
                            },
                            // Додамо невеликий правий відступ, щоб не прилипало до навігації
                            // або можна використати gap на батьківському Toolbar, якщо він підтримує
                            // Для Toolbar краще використовувати Box як обгортки для секцій
                            // Поки що залишимо так, або додамо margin на наступний елемент
                        }}
                    >
                        GRINDZONE
                    </Typography>

                    {/* Mobile: Burger Icon + Menu */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' /* flexGrow: 1, якщо логотип теж flexGrow: 1 */ }}>
                        <IconButton
                            size="large"
                            onClick={handleOpenNavMenu}
                            sx={{ color: 'white', '&:hover': { background: 'rgba(255,255,255,0.1)'} }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar-mobile" // ... (код мобільного меню залишається без змін)
                            anchorEl={anchorElNav}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            PaperProps={{
                                sx: {
                                    background: 'rgba(25, 30, 45, 0.92)',
                                    backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.35)',
                                    minWidth: '220px', mt: 1,
                                }
                            }}
                            MenuListProps={{ sx: { padding: '8px' } }}
                        >
                            {isAuthenticated
                                ? pagesNav.map((page) => (
                                    <MenuItem key={page.title} onClick={() => handleMobileLinkClick(page.path)} sx={{ borderRadius: '8px', margin: '4px 0', color: 'rgba(255, 255, 255, 0.9)', '&:hover': { background: 'rgba(255, 255, 255, 0.15)', color: 'white' } }}>
                                        {page.icon && <ListItemIcon sx={{ color: 'inherit', minWidth: '36px' }}>{page.icon}</ListItemIcon>}
                                        <Typography textAlign="left">{page.title}</Typography>
                                    </MenuItem>
                                ))
                                : [
                                    <MenuItem key="signin" onClick={() => handleMobileLinkClick('/signin')} sx={{ borderRadius: '8px', margin: '4px 0', color: 'rgba(255, 255, 255, 0.9)', '&:hover': { background: 'rgba(255, 255, 255, 0.15)', color: 'white' } }}>
                                        <ListItemIcon sx={{ color: 'inherit', minWidth: '36px' }}><LoginIcon fontSize="small" /></ListItemIcon>
                                        <Typography textAlign="left">Увійти</Typography>
                                    </MenuItem>,
                                    <MenuItem key="signup" onClick={() => handleMobileLinkClick('/signup')} sx={{ borderRadius: '8px', margin: '4px 0', color: 'rgba(255, 255, 255, 0.9)', '&:hover': { background: 'rgba(255, 255, 255, 0.15)', color: 'white' } }}>
                                        <ListItemIcon sx={{ color: 'inherit', minWidth: '36px' }}><PersonAddAlt1Icon fontSize="small" /></ListItemIcon>
                                        <Typography textAlign="left">Зареєструватися</Typography>
                                    </MenuItem>
                                ]}
                        </Menu>
                    </Box>

                    {/* Mobile Logo (centered) */}
                    <Typography
                        variant="h5"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1, // Дозволяє цьому елементу зайняти простір і центрувати текст
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 700,
                            letterSpacing: '.15rem',
                            color: 'white',
                            textDecoration: 'none',
                            textShadow: `0 0 8px rgba(${parseInt(ACCENT_COLOR_MAIN.slice(1,3),16)}, ${parseInt(ACCENT_COLOR_MAIN.slice(3,5),16)}, ${parseInt(ACCENT_COLOR_MAIN.slice(5,7),16)}, 0.5)`,
                            // Важливо: якщо справа є ще елементи на мобільному (наприклад, аватар), то це центрування буде відносним.
                            // Для ідеального центрування тексту, цей Typography має бути єдиним flexGrow: 1 елементом між крайніми фіксованими.
                            // Наприклад, IconButton для бургер-меню зліва, і IconButton для аватара справа.
                        }}
                    >
                        GRINDZONE
                    </Typography>

                    {/* Desktop Navigation Links - ЦЕНТРАЛЬНИЙ БЛОК */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: { xs: 'none', md: 'flex' },
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 0.5,
                        }}
                    >
                        {isAuthenticated && pagesNav.map((page) => (
                            <Button
                                key={page.title}
                                component={Link}
                                to={page.path}
                                sx={navButtonStyles(location.pathname === page.path)}
                            >
                                {page.title}
                            </Button>
                        ))}
                    </Box>

                    {/* Auth buttons / User Menu - ПРАВИЙ БЛОК */}
                    <Box
                        sx={{
                            position: { md: 'absolute' }, // Абсолютне позиціонування тільки для десктопу
                            right: { md: 0 }, // Притискаємо до правого краю
                            top: { md: '50%' }, // Вертикальне центрування
                            transform: { md: 'translateY(-50%)' }, // Вертикальне центрування
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1, md: 1.5 },
                            // Видаляємо ml: { md: 2 }, оскільки воно більше не потрібне
                        }}
                    >
                        {isAuthenticated && currentUser ? (
                            <Box>
                                <Tooltip title="Відкрити налаштування">
                                    <IconButton
                                        onClick={handleOpenUserMenu}
                                        sx={{
                                            p: 0.5,
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            transition: 'all 0.3s ease',
                                            borderRadius: '50%',
                                            '&:hover': {
                                                background: 'rgba(255, 255, 255, 0.15)',
                                                transform: 'scale(1.1)',
                                            },
                                        }}
                                    >
                                        <Avatar
                                            alt={currentUser.name || 'User'}
                                            src={currentUser.avatarUrl || '/static/images/avatar/default.jpg'}
                                            sx={{
                                                border: `2px solid rgba(${parseInt(
                                                    ACCENT_COLOR_MAIN.slice(1, 3),
                                                    16
                                                )}, ${parseInt(ACCENT_COLOR_MAIN.slice(3, 5), 16)}, ${parseInt(
                                                    ACCENT_COLOR_MAIN.slice(5, 7),
                                                    16
                                                )}, 0.4)`,
                                                width: 38,
                                                height: 38,
                                            }}
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    id="menu-appbar-user"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    keepMounted
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                    PaperProps={{
                                        sx: {
                                            mt: '50px',
                                            background: 'rgba(25, 30, 45, 0.92)',
                                            backdropFilter: 'blur(15px)',
                                            WebkitBackdropFilter: 'blur(15px)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255, 255, 255, 0.12)',
                                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.35)',
                                            minWidth: '200px',
                                        },
                                    }}
                                    MenuListProps={{ sx: { padding: '8px' } }}
                                >
                                    {settingsMenu.map((setting) => (
                                        <MenuItem
                                            key={setting.text}
                                            onClick={() => handleSettingClick(setting.action)}
                                            sx={{
                                                borderRadius: '8px',
                                                margin: '4px 0',
                                                color: 'rgba(255, 255, 255, 0.9)',
                                                '&:hover': {
                                                    background: 'rgba(255, 255, 255, 0.15)',
                                                    color: 'white',
                                                },
                                            }}
                                        >
                                            {setting.icon && (
                                                <ListItemIcon sx={{ color: 'inherit', minWidth: '36px' }}>
                                                    {setting.icon}
                                                </ListItemIcon>
                                            )}
                                            <Typography textAlign="left" sx={{ flexGrow: 1 }}>
                                                {setting.text}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        ) : (
                            <Box
                                sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}
                            >
                                <Button component={Link} to="/signin" sx={signInButtonStyles}>
                                    Увійти
                                </Button>
                                <Button component={Link} to="/signup" sx={signUpButtonStyles}>
                                    Зареєструватися
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavigationBar;