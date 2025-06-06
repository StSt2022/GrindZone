import React, {createContext, useState, useEffect, useContext} from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    useEffect(() => {

        const storedUser = localStorage.getItem('currentUser');


        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && parsedUser.userId) {
                    setCurrentUser(parsedUser);
                    setIsAuthenticated(true);
                } else {

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
        if (userData && userData.userId) {
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

    };

    return (
        <AuthContext.Provider value={{isAuthenticated, currentUser, isLoadingAuth, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};