import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { googleLogout } from '@react-oauth/google';
import config from '../config/config';

const BASE_URL = config.API_URL + '/'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Set up axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Check if user is authenticated on app load
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const response = await axios.get(`${BASE_URL}auth/me`);
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [token]);

    // Traditional login
    const login = async (email, password) => {
        try {
            setError(null);
            const response = await axios.post(`${BASE_URL}auth/login`, {
                email,
                password
            });

            const { token: authToken, user: userData } = response.data;
            
            setToken(authToken);
            setUser(userData);
            localStorage.setItem('token', authToken);
            
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    // Register
    const register = async (name, email, password) => {
        try {
            setError(null);
            const response = await axios.post(`${BASE_URL}auth/register`, {
                name,
                email,
                password
            });

            const { token: authToken, user: userData } = response.data;
            
            setToken(authToken);
            setUser(userData);
            localStorage.setItem('token', authToken);
            
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    // Google authentication
    const googleAuth = async (googleToken) => {
        try {
            setError(null);
            const response = await axios.post(`${BASE_URL}auth/google-auth`, {
                token: googleToken
            });

            const { token: authToken, user: userData } = response.data;
            
            setToken(authToken);
            setUser(userData);
            localStorage.setItem('token', authToken);
            
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Google authentication failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    // Logout
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        
        // Sign out from Google using the new library
        googleLogout();
    };

    const forgotPassword = async (email) => {
        try {
            setError(null);
            const response = await axios.post(`${BASE_URL}auth/forgot-password`, {
                email
            });
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to send reset email';
            setError(message);
            return { success: false, error: message };
        }
    };

    // Reset Password
    const resetPassword = async (token, password) => {
        try {
            setError(null);
            const response = await axios.post(`${BASE_URL}auth/reset-password`, {
                token,
                password
            });

            const { token: authToken, user: userData } = response.data;
            
            setToken(authToken);
            setUser(userData);
            localStorage.setItem('token', authToken);
            
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Password reset failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    const value = {
        user,
        token,
        loading,
        error,
        login,
        register,
        googleAuth,
        logout,
        forgotPassword,  // Add this
        resetPassword,   // Add this
        isAuthenticated: !!user,
        setError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};