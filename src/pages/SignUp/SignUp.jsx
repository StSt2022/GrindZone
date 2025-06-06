import React, {useState, useEffect} from 'react';
import {useNavigate, Link as RouterLink} from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import {styled, useTheme, alpha} from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme.jsx';
import ColorModeSelect from '../../shared-theme/ColorModeSelect.jsx';
import {GoogleIcon, FacebookIcon} from './components/CustomIcons.jsx';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const StyledLink = styled(RouterLink)(({theme}) => ({
    color: theme.palette.primary.main,
    fontWeight: 500,
    position: 'relative',
    textDecoration: 'none',
    padding: '2px 4px',
    borderRadius: '4px',
    transition: 'all 0.2s ease-in-out',
    '&::after': {
        content: '""',
        position: 'absolute',
        width: '0%',
        height: '2px',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: theme.palette.primary.main,
        transition: 'width 0.3s ease',
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        '&::after': {
            width: '80%',
        },
    },
    '&:active': {
        transform: 'scale(0.98)',
    },
}));

const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(3),
    gap: theme.spacing(1.5),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
        padding: theme.spacing(3),
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignUpContainer = styled(Stack)(({theme}) => ({
    position: 'relative',
    minHeight: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function SignUp({onLoginSuccess}) {
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState(null);
    const theme = useTheme();
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState('');

    useEffect(() => {
        if (window.google && GOOGLE_CLIENT_ID) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGISCallback,
            });
            console.log('Google Identity Services initialized for Sign Up');
        } else {
            console.warn('Google Identity Services script not loaded or GOOGLE_CLIENT_ID missing for Sign Up.');
        }
    }, []);

    const processGoogleAuthResponse = (result) => {
        const userData = {
            userId: result.userId,
            name: result.name,
            email: result.email,
            avatarUrl: result.avatarUrl || null
        };
        const token = result.token || null;
        onLoginSuccess(userData, token);
        navigate('/');
    }

    const handleGISCallback = async (response) => {
        setSubmitError(null);
        if (!response.credential) {
            setSubmitError("Не вдалося отримати дані для реєстрації від Google (GIS).");
            console.error("GIS response missing credential.");
            return;
        }
        try {
            const signupResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/fedcm`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({token: response.credential}),
            });

            const result = await signupResponse.json();

            if (!signupResponse.ok) {
                throw new Error(result.message || 'Помилка при реєстрації через Google (GIS)');
            }
            console.log('Користувач успішно зареєстрований/увійшов через Google (GIS):', result);
            processGoogleAuthResponse(result);
        } catch (error) {
            setSubmitError(error.message);
            console.error('Помилка обробки GIS відповіді для реєстрації:', error);
        }
    };

    const validateInputs = () => {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const nameInput = document.getElementById('name');
        let isValid = true;

        if (!emailInput.value || !/\S+@\S+\.\S+/.test(emailInput.value)) {
            setEmailError(true);
            setEmailErrorMessage('Будь ласка, введіть дійсну електронну адресу.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!passwordInput.value || passwordInput.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Пароль повинен містити щонайменше 6 символів.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!nameInput.value || nameInput.value.length < 1) {
            setNameError(true);
            setNameErrorMessage("Ім'я обов'язкове.");
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitError(null);
        if (!validateInputs()) {
            return;
        }

        const data = new FormData(event.currentTarget);
        const userData = {
            name: data.get('name'),
            email: data.get('email'),
            password: data.get('password'),
            allowExtraEmails: data.get('allowExtraEmails') === 'on',
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Помилка при реєстрації');
            }
            console.log('Користувач зареєстрований (звичайна реєстрація):', result);
            navigate('/signin');
        } catch (error) {
            setSubmitError(error.message);
            console.error('Помилка звичайної реєстрації:', error);
        }
    };

    const fallbackToGIS = async () => {
        if (!window.google || !window.google.accounts || !window.google.accounts.id) {
            setSubmitError("Google Identity Services не доступне. Перевірте підключення скрипта або спробуйте оновити сторінку.");
            console.error("Google SDK not available for GIS fallback.");
            return;
        }
        try {
            console.log("Attempting GIS prompt for Sign Up...");
            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    console.warn('GIS prompt was not displayed or skipped:', notification.getNotDisplayedReason(), notification.getSkippedReason());
                    let message = "Не вдалося відобразити вікно реєстрації Google.";
                    if (notification.isNotDisplayed()) {
                        const reason = notification.getNotDisplayedReason();
                        if (reason === "suppressed_by_user") message = "Вікно реєстрації Google було закрито. Спробуйте ще раз.";
                        else if (reason === "browser_not_supported") message = "Ваш браузер не підтримує цей метод реєстрації Google.";
                        else message = "Не вдалося відобразити вікно реєстрації Google. Перевірте налаштування браузера.";
                    } else if (notification.isSkippedMoment()) {
                        const reason = notification.getSkippedReason();
                        if (reason === "user_cancel" || reason === "tap_outside") message = "Реєстрацію через Google скасовано.";
                        else message = "Реєстрацію через Google пропущено. Спробуйте ще раз.";
                    }
                    setSubmitError(message);
                }
            });
        } catch (error) {
            console.error('Помилка GIS fallback prompt (Sign Up):', error);
            setSubmitError('Не вдалося ініціювати реєстрацію через Google: ' + error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        setSubmitError(null);
        try {
            if (!GOOGLE_CLIENT_ID) {
                setSubmitError("Google Client ID не налаштовано.");
                console.error("Google Client ID is not configured.");
                return;
            }
            if (!navigator.credentials || !navigator.credentials.get) {
                console.log("FedCM API is not available, falling back to GIS for Sign Up");
                return await fallbackToGIS();
            }

            console.log("Attempting FedCM get with Google for Sign Up");
            const credential = await navigator.credentials.get({
                federated: {
                    providers: [{configURL: "https://accounts.google.com/gsi/fedcm.json", clientId: GOOGLE_CLIENT_ID}],
                },
            });

            console.log("FedCM credential received for Sign Up:", credential);

            if (credential && credential.token) {
                const signupResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/fedcm`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({token: credential.token}),
                });

                const result = await signupResponse.json();

                if (!signupResponse.ok) {
                    throw new Error(result.message || 'Помилка при реєстрації через Google (FedCM)');
                }
                console.log('Користувач успішно зареєстрований/увійшов через Google (FedCM):', result);
                processGoogleAuthResponse(result);
            } else {
                console.log("FedCM returned null or no token, falling back to GIS for Sign Up");
                await fallbackToGIS();
            }
        } catch (error) {
            console.error("Помилка FedCM Google Sign Up:", error);
            if (error.name === 'AbortError' || (error.message && error.message.toLowerCase().includes('aborted'))) {
                setSubmitError("Реєстрацію через Google було скасовано.");
            } else if (error.message && (error.message.includes("The request is not allowed by the user agent") || error.message.includes("disabled") || error.message.includes("InvalidStateError"))) {
                setSubmitError("Запит на реєстрацію через Google заблоковано. Перевірте налаштування браузера.");
                console.log("Falling back to GIS due to FedCM block/error (Sign Up)");
                await fallbackToGIS();
            } else {
                setSubmitError(error.message || "Невідома помилка під час реєстрації через Google.");
                console.log("Falling back to GIS due to general error in FedCM flow (Sign Up)");
                await fallbackToGIS();
            }
        }
    };

    return (
        <AppTheme>
            <CssBaseline enableColorScheme/>
            <ColorModeSelect sx={{position: 'fixed', top: '1rem', right: '1rem', zIndex: 1}}/>
            <SignUpContainer direction="column" justifyContent="center">
                <Card variant="outlined" sx={{alignItems: 'center'}}>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{
                            fontWeight: 700,
                            letterSpacing: '.15rem',
                            color: theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main,
                            textDecoration: 'none',
                            mb: 1,
                        }}
                    >
                        GRINDZONE
                    </Typography>
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            width: '100%',
                            fontSize: 'clamp(1.8rem, 8vw, 2rem)',
                            mb: 2,
                        }}
                    >
                        Реєстрація
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 1.5,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="name">Повне ім'я</FormLabel>
                            <TextField
                                autoComplete="name"
                                name="name"
                                required
                                fullWidth
                                id="name"
                                placeholder="Іван Петренко"
                                error={nameError}
                                helperText={nameErrorMessage}
                                color={nameError ? 'error' : 'primary'}
                                size="small"
                                onChange={() => {
                                    setNameError(false);
                                    setNameErrorMessage('');
                                    setSubmitError(null);
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email">Електронна пошта</FormLabel>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                placeholder="your@email.com"
                                name="email"
                                autoComplete="email"
                                variant="outlined"
                                error={emailError}
                                helperText={emailErrorMessage}
                                color={emailError ? 'error' : 'primary'}
                                size="small"
                                onChange={() => {
                                    setEmailError(false);
                                    setEmailErrorMessage('');
                                    setSubmitError(null);
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Пароль</FormLabel>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                variant="outlined"
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
                                size="small"
                                onChange={() => {
                                    setPasswordError(false);
                                    setPasswordErrorMessage('');
                                    setSubmitError(null);
                                }}
                            />
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox name="allowExtraEmails" color="primary" size="small"/>}
                            label="Я хочу отримувати оновлення електронною поштою."
                        />
                        {submitError && (
                            <Typography
                                variant="body2"
                                sx={{color: 'error.main', textAlign: 'center', mt: 1}}
                            >
                                {submitError}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{mt: 1, py: 1.2}}
                        >
                            Зареєструватися
                        </Button>
                    </Box>
                    <Divider sx={{width: '100%', my: 1.5}}>
                        <Typography sx={{color: 'text.secondary'}}>або</Typography>
                    </Divider>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%'}}>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="primary"
                            onClick={handleGoogleSignIn}
                            startIcon={<GoogleIcon/>}
                        >
                            Реєстрація через Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                                setSubmitError(null);
                                alert('Реєстрація через Facebook незабаром')
                            }}
                            startIcon={<FacebookIcon/>}
                        >
                            Реєстрація через Facebook
                        </Button>
                        <Typography sx={{textAlign: 'center', pt: 1}}>
                            Вже маєте обліковий запис?{' '}
                            <StyledLink to="/signin" onClick={() => setSubmitError(null)}>Увійти</StyledLink>
                        </Typography>
                    </Box>
                </Card>
            </SignUpContainer>
        </AppTheme>
    );
}