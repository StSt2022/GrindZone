import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { Link as RouterLink } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled, useTheme, alpha } from '@mui/material/styles';
import ForgotPassword from './components/ForgotPassword.jsx';
import AppTheme from '../../shared-theme/AppTheme.jsx';
import ColorModeSelect from '../../shared-theme/ColorModeSelect.jsx';
import { GoogleIcon, FacebookIcon } from './components/CustomIcons.jsx';
import {  useCallback } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const API_URL = import.meta.env.VITE_API_URL;

const StyledLink = styled(RouterLink)(({ theme }) => ({
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

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(3),
  gap: theme.spacing(1.5),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
    padding: theme.spacing(3),
  },
  boxShadow:
      'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
        'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
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

export default function SignIn(props) {
  const theme = useTheme();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [submitError, setSubmitError] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const sendIdTokenToBackend = useCallback(async (idToken, source) => {
    if (!idToken) {
      console.error(`SignIn (${source}): ID Token is missing.`);
      setSubmitError("Не вдалося отримати ID токен від Google.");
      return;
    }
    setSubmitError(null);
    try {
      const response = await fetch(`${API_URL}/auth/google/fedcm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Помилка сервера (${response.status})`);
      }
      const result = await response.json();
      console.log(`SignIn: User authenticated via ${source}:`, result);
      window.location.href = '/';
    } catch (error) {
      console.error(`SignIn: Error sending ID token from ${source} to backend:`, error);
      setSubmitError(error.message || "Помилка під час обробки входу через Google.");
    }
  }, []);


  const validateInputs = () => {
    let isValid = true;
    setEmailError(false); setEmailErrorMessage('');
    setPasswordError(false); setPasswordErrorMessage('');

    if (!email) {
      setEmailError(true); setEmailErrorMessage('Будь ласка, введіть електронну адресу.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true); setEmailErrorMessage('Будь ласка, введіть дійсну електронну адресу.');
      isValid = false;
    }
    if (!password) {
      setPasswordError(true); setPasswordErrorMessage('Будь ласка, введіть пароль.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(true); setPasswordErrorMessage('Пароль повинен містити щонайменше 6 символів.');
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);
    if (!validateInputs()) return;
    const userData = {
      email: email.trim(),
      password: password,
    };
    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при вході');
      }
      const result = await response.json();
      console.log('Користувач увійшов:', result);
      window.location.href = '/';
    } catch (error) {
      setSubmitError(error.message);
      console.error('Помилка:', error);
    }
  };

  return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <SignInContainer direction="column" justifyContent="center">
          <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
          <Card variant="outlined" sx={{ alignItems: 'center' }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 700, letterSpacing: '.15rem', color: theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main, mb: 1 }}>
              GRINDZONE
            </Typography>
            <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(1.8rem, 8vw, 2rem)', mb: 2 }}>
              Вхід
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1.5 }}>
              <FormControl>
                <FormLabel htmlFor="email">Електронна пошта</FormLabel>
                <TextField error={emailError} helperText={emailErrorMessage} id="email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" autoComplete="email" required fullWidth variant="outlined" size="small" color={emailError ? 'error' : 'primary'} />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Пароль</FormLabel>
                <TextField error={passwordError} helperText={passwordErrorMessage} name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" type="password" id="password" autoComplete="current-password" required fullWidth variant="outlined" size="small" color={passwordError ? 'error' : 'primary'} />
              </FormControl>
              <FormControlLabel control={<Checkbox value="remember" color="primary" size="small" />} label="Запам'ятати мене" />
              {submitError && (
                  <Typography variant="body2" sx={{ color: 'error.main', textAlign: 'center', bgcolor: theme => alpha(theme.palette.error.main, 0.1), p: 1.5, borderRadius: 1, border: theme => `1px solid ${theme.palette.error.main}20`, mb: 1.5, mt: 1 }}>
                    {submitError}
                  </Typography>
              )}
              <ForgotPassword open={open} handleClose={handleClose} />
              <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 1, py: 1.2 }}> Увійти </Button>
              <RouterLink component="button" type="button" onClick={handleClickOpen} style={{ color: theme.palette.primary.main, backgroundColor: 'transparent', border: 'none', padding: theme.spacing(0.5, 0), cursor: 'pointer', alignSelf: 'center', textDecoration: 'underline', fontSize: theme.typography.caption.fontSize, fontFamily: theme.typography.fontFamily, marginTop: theme.spacing(0.5) }}>
                Забули пароль?
              </RouterLink>
            </Box>
            <Divider sx={{ width: '100%', my: 1.5 }}>або</Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
              <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    console.log("SignIn: GoogleLogin component success:", credentialResponse);
                    if (credentialResponse.credential) {
                      sendIdTokenToBackend(credentialResponse.credential, "GoogleLogin Button");
                    } else {
                      setSubmitError("Не вдалося отримати ID токен від Google.");
                      console.error("SignIn: GoogleLogin - No credential.");
                    }
                  }}
                  onError={() => {
                    console.error('SignIn: GoogleLogin component error');
                    setSubmitError('Помилка входу через Google. Спробуйте ще раз або перевірте налаштування браузера.');
                  }}
                  useOneTap={false}
                  text="signin_with"
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  containerProps={{ style: { width: '100%' } }}
                  logo_alignment="left"
              />
              <Button fullWidth variant="outlined" color="primary" onClick={() => alert('Незабаром')} startIcon={<FacebookIcon />}> Вхід через Facebook </Button>
              <Typography sx={{ textAlign: 'center', pt: 1 }}> Не маєте облікового запису?{' '} <StyledLink to="/signup">Зареєструватися</StyledLink> </Typography>
            </Box>
          </Card>
        </SignInContainer>
      </AppTheme>
  );
}