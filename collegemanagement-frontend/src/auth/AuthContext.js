import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:8080/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const login = async (email, password) => {
        try {
            console.log('Sending login request to backend...');
            const response = await axios.post('/auth/login', {
                email,
                password
            });
            
            console.log('Login response received:', response.data);
            
            const { token, role, name, email: userEmail, id } = response.data;
            
            // Store token and user data
            localStorage.setItem('token', token);
            setToken(token);
            setUser({ id, role, name, email: userEmail });
            
            // Set default authorization header for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            return response.data;
        } catch (error) {
            console.error('Login error in AuthContext:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        token,
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};