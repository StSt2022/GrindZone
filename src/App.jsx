import React, { useState, useEffect } from 'react';
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

const ProtectedRoute = ({ isAuthenticated, children }) => {
    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }
    return children;
};

const GuestRoute = ({ isAuthenticated, children }) => {
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return children;
};

// Компонент-обгортка, який вирішує, чи показувати NavigationBar
const LayoutWithConditionalNav = ({ isAuthenticated, currentUser, onLogout, children }) => {
    const location = useLocation();
    const hideNavOnRoutes = ['/signin', '/signup'];
    const shouldShowNav = !hideNavOnRoutes.includes(location.pathname);

    return (
        <>
            {shouldShowNav && (
                <NavigationBar
                    isAuthenticated={isAuthenticated}
                    currentUser={currentUser}
                    onLogout={onLogout}
                />
            )}
            {children}
        </>
    );
};


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        const token = localStorage.getItem('authToken');

        if (storedUser && token) { // Або тільки storedUser, якщо токен не зберігається/не використовується для цієї логіки
            try {
                const parsedUser = JSON.parse(storedUser);
                setCurrentUser(parsedUser);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Error parsing stored user:", error);
                localStorage.removeItem('currentUser');
                localStorage.removeItem('authToken');
            }
        }
        setIsLoading(false);
    }, []);

    const handleLoginSuccess = (userData, token) => {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('authToken', token);
        }
        setCurrentUser(userData);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        setCurrentUser(null);
        setIsAuthenticated(false);
        // Навігація на '/' відбудеться автоматично або через NavigationBar
    };

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Завантаження...</div>;
    }

    return (
        <AppTheme>
            <Router>
                <LayoutWithConditionalNav
                    isAuthenticated={isAuthenticated}
                    currentUser={currentUser}
                    onLogout={handleLogout}
                >
                    <Routes>
                        <Route path="/" element={<Home isAuthenticated={isAuthenticated} currentUser={currentUser} />} />

                        <Route
                            path="/signup"
                            element={
                                <GuestRoute isAuthenticated={isAuthenticated}>
                                    <SignUp onLoginSuccess={handleLoginSuccess} />
                                </GuestRoute>
                            }
                        />
                        <Route
                            path="/signin"
                            element={
                                <GuestRoute isAuthenticated={isAuthenticated}>
                                    <SignIn onLoginSuccess={handleLoginSuccess} />
                                </GuestRoute>
                            }
                        />

                        <Route
                            path="/profile"
                            element={
                                <Profile currentUser={currentUser} />
                            }
                        />
                        <Route
                            path="/activities"
                            element={
                                <Activities />
                            }
                        />
                        <Route
                            path="/food"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Food />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/community"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Community />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    {isAuthenticated && <ChatWidget />}
                </LayoutWithConditionalNav>
            </Router>
        </AppTheme>
    );
}

export default App;