import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation
} from 'react-router-dom';
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
import ScrollToTop from './components/ScrollToTop';

import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoadingAuth } = useAuth();
    if (isLoadingAuth) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Перевірка автентифікації...</div>;
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
    const { isAuthenticated, currentUser, logout } = useAuth();
    const hideNavOnRoutes = ['/signin', '/signup'];
    const shouldShowNav = !hideNavOnRoutes.includes(location.pathname);

    return (
        <>
            {shouldShowNav && (
                <NavigationBar
                    isAuthenticated={isAuthenticated}
                    currentUser={currentUser}
                    onLogout={logout}
                />
            )}
            {children}
        </>
    );
};

const AuthFormWrapper = ({ children }) => {
    const { login } = useAuth();
    return React.cloneElement(children, { onLoginSuccess: login });
};


function AppContent() {
    const { isAuthenticated, isLoadingAuth } = useAuth();

    if (isLoadingAuth) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Завантаження додатку...</div>;
    }

    return (
        <LayoutWithConditionalNav>
            <Routes>
                <Route path="/" element={<Home />} />

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
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/activities"
                    element={
                        <ProtectedRoute>
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
                        <ProtectedRoute>
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
                <ScrollToTop />
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </Router>
        </AppTheme>
    );
}

export default App;