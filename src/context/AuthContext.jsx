// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Окремий стан завантаження для автентифікації

    useEffect(() => {
        // Ця логіка перевіряє localStorage при першому завантаженні
        const storedUser = localStorage.getItem('currentUser');
        const token = localStorage.getItem('authToken'); // Якщо використовуєш токени для сесії

        if (storedUser) { // Перевірка може бути складнішою, наприклад, валідація токена
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && parsedUser.userId) { // Переконайся, що userId існує
                    setCurrentUser(parsedUser);
                    setIsAuthenticated(true);
                } else {
                    // Якщо дані користувача неповні або некоректні
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('authToken');
                }
            } catch (error) {
                console.error("Error parsing stored user from localStorage:", error);
                localStorage.removeItem('currentUser');
                localStorage.removeItem('authToken');
            }
        }
        setIsLoadingAuth(false);
    }, []);

    const login = (userData, token) => {
        if (userData && userData.userId) { // Важливо перевіряти наявність userId
            localStorage.setItem('currentUser', JSON.stringify(userData));
            if (token) {
                localStorage.setItem('authToken', token);
            }
            setCurrentUser(userData);
            setIsAuthenticated(true);
        } else {
            console.error("Login attempt with invalid userData:", userData);
        }
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        setCurrentUser(null);
        setIsAuthenticated(false);
        // Навігація на головну сторінку або сторінку входу буде оброблятися в компонентах
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, currentUser, isLoadingAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Хук для зручного використання контексту
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};