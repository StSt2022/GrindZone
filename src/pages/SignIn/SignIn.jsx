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
import AppTheme from "../../shared-theme/AppTheme.jsx";
import ColorModeSelect from '../../shared-theme/ColorModeSelect.jsx';
import { GoogleIcon, FacebookIcon } from './components/CustomIcons';

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
  alignSelf: 'center', // Картка залишається по центру сторінки
  width: '100%',
  padding: theme.spacing(3), // Трохи зменшив загальний padding картки
  gap: theme.spacing(1.5),   // Зменшив проміжки між елементами в картці
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
    padding: theme.spacing(3), // Зменшив padding для sm
  },
  boxShadow:
      'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
        'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
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
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateInputs()) return;
    const data = new FormData(event.currentTarget);
    console.log({ email: data.get('email'), password: data.get('password') });
  };

  const validateInputs = () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    let isValid = true;
    if (!emailInput.value || !/\S+@\S+\.\S+/.test(emailInput.value)) {
      setEmailError(true);
      setEmailErrorMessage('Будь ласка, введіть дійсну електронну адресу.');
      isValid = false;
    } else {
      setEmailError(false); setEmailErrorMessage('');
    }
    if (!passwordInput.value || passwordInput.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Пароль повинен містити щонайменше 6 символів.');
      isValid = false;
    } else {
      setPasswordError(false); setPasswordErrorMessage('');
    }
    return isValid;
  };

  return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <SignInContainer direction="column" justifyContent="center">
          <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
          {/* alignItems: 'flex-start' для картки, щоб контент починався зліва */}
          <Card variant="outlined" sx={{ alignItems: 'center' }}>
            <Typography
                variant="h5" // Зменшено розмір (було h4)
                component="div"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '.15rem', // Трохи зменшено letterSpacing
                  color: theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main,
                  textDecoration: 'none',
                  // textAlign: 'left', // За замовчуванням, але можна явно вказати
                  mb: 1, // Зменшено відступ знизу
                  // Можна прибрати textShadow або зробити його менш виразним, якщо заважає
                  // textShadow: theme.palette.mode === 'dark' ? `0 0 8px ${alpha(theme.palette.primary.main, 0.5)}` : 'none',
                }}
            >
              GRINDZONE
            </Typography>
            <Typography
                component="h1"
                variant="h4" // Залишаємо h4 для "Вхід"
                sx={{
                  width: '100%',
                  fontSize: 'clamp(1.8rem, 8vw, 2rem)', // Трохи зменшено розмір шрифту
                  // textAlign: 'left', // Якщо потрібно, щоб і цей заголовок був зліва
                  mb: 2, // Відступ перед формою
                }}
            >
              Вхід
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%', // Форма займає всю ширину картки
                  gap: 1.5, // Зменшено проміжки у формі
                }}
            >
              <FormControl>
                <FormLabel htmlFor="email">Електронна пошта</FormLabel>
                <TextField
                    error={emailError}
                    helperText={emailErrorMessage}
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    required
                    fullWidth
                    variant="outlined"
                    size="small" // Зменшує висоту поля
                    color={emailError ? 'error' : 'primary'}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Пароль</FormLabel>
                <TextField
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    name="password"
                    placeholder="••••••"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    fullWidth
                    variant="outlined"
                    size="small" // Зменшує висоту поля
                    color={passwordError ? 'error' : 'primary'}
                />
              </FormControl>
              <FormControlLabel
                  control={<Checkbox value="remember" color="primary" size="small" />} // Зменшує розмір чекбоксу
                  label="Запам'ятати мене"
              />
              <ForgotPassword open={open} handleClose={handleClose} />
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1, py: 1.2 }} // Зменшив вертикальний padding кнопки
              >
                Увійти
              </Button>
              <RouterLink
                  component="button"
                  type="button"
                  onClick={handleClickOpen}
                  style={{
                    color: theme.palette.primary.main,
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: theme.spacing(0.5, 0), // Зменшив padding
                    cursor: 'pointer',
                    alignSelf: 'center',
                    textDecoration: 'underline',
                    fontSize: theme.typography.caption.fontSize, // Зробив меншим (caption size)
                    fontFamily: theme.typography.fontFamily,
                    marginTop: theme.spacing(0.5) // Зменшив відступ
                  }}
              >
                Забули пароль?
              </RouterLink>
            </Box>
            <Divider sx={{width: '100%', my: 1.5}}>або</Divider> {/* Розширив Divider на всю ширину */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}> {/* width: 100% */}
              <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => alert('Вхід через Google')}
                  startIcon={<GoogleIcon />}
              >
                Вхід через Google
              </Button>
              <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => alert('Незабаром')}
                  startIcon={<FacebookIcon />}
              >
                Вхід через Facebook
              </Button>
              <Typography sx={{ textAlign: 'center', pt: 1 }}> {/* Додав невеликий відступ зверху */}
                Не маєте облікового запису?{' '}
                <StyledLink to="/signup">
                  Зареєструватися
                </StyledLink>
              </Typography>
            </Box>
          </Card>
        </SignInContainer>
      </AppTheme>
  );
}