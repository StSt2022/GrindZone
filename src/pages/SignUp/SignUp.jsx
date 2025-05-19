import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { Link as RouterLink } from 'react-router-dom'; // Перейменовано
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled, useTheme, alpha } from '@mui/material/styles'; // Додано alpha, якщо потрібно
import AppTheme from '../../shared-theme/AppTheme.jsx';
import ColorModeSelect from '../../shared-theme/ColorModeSelect.jsx';
import { GoogleIcon, FacebookIcon } from './components/CustomIcons.jsx';
import { useState } from 'react';
import { useEffect } from 'react';

const StyledLink = styled(RouterLink)(({ theme }) => ({ // Змінено Link на RouterLink
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
    backgroundColor: alpha(theme.palette.primary.main, 0.1), // Використовуємо alpha
    '&::after': {
      width: '80%',
    },
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

const Card = styled(MuiCard)(({ theme }) => ({
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

const SignUpContainer = styled(Stack)(({ theme }) => ({
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

export default function SignUp(props) {
  const [submitError, setSubmitError] = useState(null);
  const theme = useTheme(); // Додано для доступу до теми
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');

  useEffect(() => {
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: '1003673495994-bnvt6eep44n2pruvabp7fmm7s02gu5o5.apps.googleusercontent.com',
        scope: 'email profile',
      });
    });
  }, []);

  const validateInputs = () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const nameInput = document.getElementById('name'); // Змінив ім'я змінної

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
      setNameErrorMessage("Ім'я обов'язкове."); // Прибрав апостроф, що міг викликати помилку
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при реєстрації');
      }

      const result = await response.json();
      console.log('Користувач зареєстрований:', result);
      window.location.href = '/signin';
    } catch (error) {
      setSubmitError(error.message);
      console.error('Помилка:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    const auth2 = window.gapi.auth2.getAuth2Instance();
    try {
      const googleUser = await auth2.signIn();
      const profile = googleUser.getBasicProfile();
      const idToken = googleUser.getAuthResponse().id_token;

      const userData = {
        name: profile.getName(),
        email: profile.getEmail(),
        googleId: profile.getId(),
        idToken: idToken,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/signup/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при реєстрації через Google');
      }

      const result = await response.json();
      console.log('Користувач зареєстрований через Google:', result);
      window.location.href = '/signin';
    } catch (error) {
      setSubmitError(error.message);
      console.error('Помилка Google Sign-In:', error);
    }
  };

  return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1 }} />
        <SignUpContainer direction="column" justifyContent="center">
          <Card variant="outlined" sx={{ alignItems: 'center' }}>
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
                />
              </FormControl>
              <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" size="small" />}
                  label="Я хочу отримувати оновлення електронною поштою."
              />
              {submitError && (
                  <Typography
                      variant="body2"
                      sx={{ color: 'error.main', textAlign: 'center', mt: 1 }}
                  >
                    {submitError}
                  </Typography>
              )}
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1, py: 1.2 }}
              >
                Зареєструватися
              </Button>
            </Box>
            <Divider sx={{ width: '100%', my: 1.5 }}>
              <Typography sx={{ color: 'text.secondary' }}>або</Typography>
            </Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
              <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={handleGoogleSignIn}
                  startIcon={<GoogleIcon />}
              >
                Реєстрація через Google
              </Button>
              <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => alert('Незабаром')}
                  startIcon={<FacebookIcon />}
              >
                Реєстрація через Facebook
              </Button>
              <Typography sx={{ textAlign: 'center', pt: 1 }}>
                Вже маєте обліковий запис?{' '}
                <StyledLink to="/signin">
                  Увійти
                </StyledLink>
              </Typography>
            </Box>
          </Card>
        </SignUpContainer>
      </AppTheme>
  );
}