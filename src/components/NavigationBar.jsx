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

const DEFAULT_PAGES_NAV = [
    { title: 'Профіль', path: '/profile' },
    { title: 'Активності', path: '/activities' },
    { title: 'Харчування', path: '/food' },
    { title: 'Спільнота', path: '/community' }
];
const DEFAULT_SETTINGS_MENU = ['Профіль', 'Налаштування', 'Вихід'];

const navButtonBaseStyles = { my: 2, color: 'rgba(255, 255, 255, 0.9)', display: 'block', px: 2.2, py: 0.8, borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.03)', boxShadow: 'none', transition: 'all 0.25s ease-out', textTransform: 'none', fontWeight: 500, fontSize: '0.9rem', '&:hover': { background: 'rgba(255, 255, 255, 0.12)', transform: 'translateY(-1px)', boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)', color: 'white'}};
const signInButtonStyles = { ...navButtonBaseStyles };
const signUpButtonStyles = { ...navButtonBaseStyles, background: 'linear-gradient(45deg, #0072ff 0%, #00c6ff 100%)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(0, 114, 255, 0.25)', '&:hover': { ...navButtonBaseStyles['&:hover'], background: 'linear-gradient(45deg, #005fcc 0%, #00a0cc 100%)', boxShadow: '0 6px 15px rgba(0, 114, 255, 0.35)'}};


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

    const handleSettingClick = (setting) => {
        handleCloseUserMenu();
        if (setting === 'Вихід') {
            if (onLogout) onLogout();
            navigate('/');
        } else if (setting === 'Профіль') {
            navigate('/profile');
        } else if (setting === 'Налаштування') {
            console.log("Перехід до налаштувань");
            // navigate('/settings');
        }
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                background: 'linear-gradient(90deg, rgba(30, 35, 50, 0.8) 0%, rgba(50, 55, 75, 0.9) 100%)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                borderBottomLeftRadius: {sm: '20px'}, borderBottomRightRadius: {sm: '20px'},
                boxShadow: '0 5px 25px rgba(0, 0, 0, 0.25)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                zIndex: 1200,
                willChange: 'backdrop-filter',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'white',
                            textDecoration: 'none',
                            textShadow: '0 0 8px rgba(255, 255, 255, 0.4)'
                        }}
                    >
                        GRINDZONE
                    </Typography>

                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="меню навігації"
                            aria-controls="menu-appbar-mobile"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            sx={{
                                color: 'white',
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(5px)',
                                borderRadius: '50%',
                                p: 1,
                                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                                '&:hover': { background: 'rgba(255, 255, 255, 0.15)' }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar-mobile"
                            anchorEl={anchorElNav}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                                '& .MuiPaper-root': {
                                    background: 'rgba(35, 40, 55, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '15px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                                    minWidth: '200px',
                                },
                                '& .MuiList-root': { padding: '8px' },
                                '& .MuiMenuItem-root': {
                                    borderRadius: '10px',
                                    margin: '4px 0',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    transition: 'all 0.2s ease',
                                    justifyContent: 'center',
                                    '&:hover': {
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        color: 'white',
                                    }
                                }
                            }}
                        >
                            {isAuthenticated
                                ? pagesNav.map((page) => (
                                    <MenuItem key={page.title} onClick={() => handleMobileLinkClick(page.path)}>
                                        <Typography textAlign="center">{page.title}</Typography>
                                    </MenuItem>
                                ))
                                : [
                                    <MenuItem key="signin" onClick={() => handleMobileLinkClick('/signin')}>
                                        <Typography textAlign="center">Увійти</Typography>
                                    </MenuItem>,
                                    <MenuItem key="signup" onClick={() => handleMobileLinkClick('/signup')}>
                                        <Typography textAlign="center">Зареєструватися</Typography>
                                    </MenuItem>
                                ]}
                        </Menu>
                    </Box>

                    <Typography
                        variant="h5"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            justifyContent: 'center',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'white',
                            textDecoration: 'none',
                            textShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
                            ...(isAuthenticated && { pr: '56px' })
                        }}
                    >
                        GRINDZONE
                    </Typography>

                    <Box sx={{ flexGrow: { xs: 0, md: 1 }, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
                            {isAuthenticated && pagesNav.map((page) => (
                                <Button
                                    key={page.title}
                                    component={Link}
                                    to={page.path}
                                    sx={{
                                        ...navButtonBaseStyles,
                                        ...(location.pathname === page.path && {
                                            background: 'rgba(255, 255, 255, 0.15)',
                                            color: 'white',
                                            border: '1px solid rgba(198, 126, 255, 0.5)'
                                        })
                                    }}
                                >
                                    {page.title}
                                </Button>
                            ))}
                        </Box>

                        {isAuthenticated && currentUser ? (
                            <Box sx={{ ml: {md: 1 } }}>
                                <Tooltip title="Відкрити налаштування">
                                    <IconButton
                                        onClick={handleOpenUserMenu}
                                        sx={{
                                            p: 0.5,
                                            background: 'rgba(255, 255, 255, 0.08)',
                                            backdropFilter: 'blur(5px)',
                                            boxShadow: '0 0 12px rgba(60, 120, 220, 0.3)',
                                            transition: 'all 0.3s ease',
                                            borderRadius: '50%',
                                            '&:hover': {
                                                background: 'rgba(255, 255, 255, 0.18)',
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    >
                                        <Avatar
                                            alt={currentUser.name}
                                            src={currentUser.avatarUrl || "/static/images/avatar/default.jpg"}
                                            sx={{
                                                border: '2px solid rgba(60, 120, 220, 0.5)',
                                                width: 40,
                                                height: 40
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
                                    sx={{
                                        mt: '45px',
                                        '& .MuiPaper-root': {
                                            background: 'rgba(35, 40, 55, 0.9)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: '15px',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                                            minWidth: '180px',
                                        },
                                        '& .MuiList-root': { padding: '8px' },
                                        '& .MuiMenuItem-root': {
                                            borderRadius: '10px',
                                            margin: '4px 0',
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                color: 'white',
                                            }
                                        }
                                    }}
                                >
                                    {settingsMenu.map((setting) => (
                                        <MenuItem key={setting} onClick={() => handleSettingClick(setting)}>
                                            <Typography textAlign="center" sx={{flexGrow: 1}}>{setting}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        ) : (
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5, ml: {md:1} }}>
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