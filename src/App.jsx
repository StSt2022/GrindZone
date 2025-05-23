import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignUp from './pages/SignUp/SignUp.jsx';
import SignIn from './pages/SignIn/SignIn.jsx';
import Home from './pages/Home/Home';
import AppTheme from './shared-theme/AppTheme.jsx';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
    if (!GOOGLE_CLIENT_ID) {
        console.error("CRITICAL: Google Client ID is not available! Check VITE_GOOGLE_CLIENT_ID in your .env file and Render environment variables.");
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red', fontSize: '18px' }}>
                Помилка конфігурації: Google Client ID відсутній. Будь ласка, зв'яжіться з адміністратором.
            </div>
        );
    }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AppTheme>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/profile" element={<Home />} />
                        <Route path="/activities" element={<Home />} />
                        <Route path="/food" element={<Home />} />
                        <Route path="/community" element={<Home />} />
                    </Routes>
                </Router>
            </AppTheme>
        </GoogleOAuthProvider>
    );
}

export default App;