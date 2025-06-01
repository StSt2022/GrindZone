// App.jsx
import React from 'react'; // useEffect, useState тут більше не потрібні для auth
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SignUp from './pages/SignUp/SignUp.jsx';
import SignIn from './pages/SignIn/SignIn.jsx';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Activities from './pages/Activities/Activities';
import Food from './pages/Food/Food';
import Community from './pages/Community/Community';
import AppTheme from './shared-theme/AppTheme.jsx';
import ChatWidget from "./widgets/ChatWidget.jsx";
import NavigationBar from './components/NavigationBar';

// Імпортуємо AuthProvider та useAuth
import { AuthProvider, useAuth } from './context/AuthContext'; // Адаптуй шлях!

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoadingAuth } = useAuth();
    if (isLoadingAuth) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Перевірка автентифікації...</div>; // Або інший індикатор
    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }
    return children;
};

const GuestRoute = ({ children }) => {
    const { isAuthenticated, isLoadingAuth } = useAuth();
    if (isLoadingAuth) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Перевірка автентифікації...</div>;
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const LayoutWithConditionalNav = ({ children }) => {
    const location = useLocation();
    const { isAuthenticated, currentUser, logout } = useAuth(); // Отримуємо дані з контексту
    const hideNavOnRoutes = ['/signin', '/signup'];
    const shouldShowNav = !hideNavOnRoutes.includes(location.pathname);

    return (
        <>
            {shouldShowNav && (
                <NavigationBar
                    isAuthenticated={isAuthenticated}
                    currentUser={currentUser}
                    onLogout={logout} // Використовуємо logout з контексту
                />
            )}
            {children}
        </>
    );
};

// Компонент-обгортка для SignIn/SignUp, щоб передати функцію login
const AuthFormWrapper = ({ children }) => {
    const { login } = useAuth();
    // Клонуємо дочірній елемент (SignIn або SignUp) і передаємо йому onLoginSuccess
    return React.cloneElement(children, { onLoginSuccess: login });
};


function AppContent() {
    // Цей компонент потрібен, щоб LayoutWithConditionalNav був всередині Router,
    // оскільки він використовує useLocation
    const { isAuthenticated, isLoadingAuth } = useAuth();

    if (isLoadingAuth) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Завантаження додатку...</div>;
    }

    return (
        <LayoutWithConditionalNav>
            <Routes>
                <Route path="/" element={<Home />} /> {/* isAuthenticated та currentUser тепер доступні в Home через useAuth */}

                <Route
                    path="/signup"
                    element={
                        <GuestRoute>
                            <AuthFormWrapper><SignUp /></AuthFormWrapper>
                        </GuestRoute>
                    }
                />
                <Route
                    path="/signin"
                    element={
                        <GuestRoute>
                            <AuthFormWrapper><SignIn /></AuthFormWrapper>
                        </GuestRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute> {/* Profile тепер захищений */}
                            <Profile /> {/* currentUser доступний через useAuth */}
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/activities"
                    element={
                        <ProtectedRoute> {/* Activities тепер захищений */}
                            <Activities />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/food"
                    element={
                        <ProtectedRoute>
                            <Food />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/community"
                    element={
                        <ProtectedRoute> {/* Community також варто захистити */}
                            <Community />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            {isAuthenticated && <ChatWidget />}
        </LayoutWithConditionalNav>
    );
}

function App() {
    return (
        <AppTheme>
            <Router>
                <AuthProvider> {/* Обертаємо все в AuthProvider */}
                    <AppContent />
                </AuthProvider>
            </Router>
        </AppTheme>
    );
}

export default App;