import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { googleLogout } from '@react-oauth/google';
import config from '../config/config';

const BASE_URL = config.API_BASE_URL;

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
                    const response = await axios.get(`${BASE_URL}/auth/me`);
                    // ✅ FIX: Ensure user data includes proper timestamps
                    const userData = response.data.user;
                    
                    // If createdAt is missing, try to extract from _id
                    if (!userData.createdAt && userData._id) {
                        try {
                            const timestamp = parseInt(userData._id.substring(0, 8), 16) * 1000;
                            userData.createdAt = new Date(timestamp).toISOString();
                        } catch (e) {
                            console.log('Could not extract creation date from user ID');
                        }
                    }
                    
                    setUser(userData);
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
            const response = await axios.post(`${BASE_URL}/auth/login`, {
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
            const response = await axios.post(`${BASE_URL}/auth/register`, {
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
            const response = await axios.post(`${BASE_URL}/auth/google-auth`, {
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

    // ✅ NEW: Update Profile Function
    const updateProfile = async (profileData) => {
        try {
            setError(null);
            console.log('📝 Updating profile with data:', profileData);

            const response = await axios.put(`${BASE_URL}/auth/profile`, profileData);
            
            const { user: updatedUser } = response.data;
            
            // Update local user state
            setUser(updatedUser);
            
            console.log('✅ Profile updated successfully');
            return { success: true, message: 'Profile updated successfully' };
        } catch (error) {
            console.error('❌ Profile update failed:', error);
            const message = error.response?.data?.message || 'Profile update failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    // ✅ NEW: Upload Profile Picture Function
    const uploadProfilePicture = async (file) => {
        try {
            setError(null);
            console.log('📷 Uploading profile picture...');

            const formData = new FormData();
            formData.append('profilePicture', file);

            const response = await axios.post(`${BASE_URL}/auth/upload-avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const { user: updatedUser } = response.data;
            
            // Update local user state
            setUser(updatedUser);
            
            console.log('✅ Profile picture uploaded successfully');
            return { success: true, imageUrl: updatedUser.picture };
        } catch (error) {
            console.error('❌ Profile picture upload failed:', error);
            const message = error.response?.data?.message || 'Image upload failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    // ✅ NEW: Change Password Function
    const changePassword = async (currentPassword, newPassword) => {
        try {
            setError(null);
            console.log('🔒 Changing password...');

            const response = await axios.put(`${BASE_URL}/auth/change-password`, {
                currentPassword,
                newPassword
            });

            console.log('✅ Password changed successfully');
            return { success: true, message: 'Password changed successfully' };
        } catch (error) {
            console.error('❌ Password change failed:', error);
            const message = error.response?.data?.message || 'Password change failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    // ✅ NEW: Delete Account Function
    const deleteAccount = async (password) => {
        try {
            setError(null);
            console.log('🗑️ Deleting account...');

            await axios.delete(`${BASE_URL}/auth/delete-account`, {
                data: { password }
            });

            // Clear all local data
            logout();
            
            console.log('✅ Account deleted successfully');
            return { success: true, message: 'Account deleted successfully' };
        } catch (error) {
            console.error('❌ Account deletion failed:', error);
            const message = error.response?.data?.message || 'Account deletion failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    // ✅ NEW: Get User Settings Function
    const getUserSettings = () => {
        try {
            const savedSettings = localStorage.getItem('userSettings');
            if (savedSettings) {
                return JSON.parse(savedSettings);
            }
            
            // Default settings
            return {
                notifications: true,
                emailAlerts: false,
                darkMode: false,
                currency: 'USD',
                language: 'en',
                autoBackup: true,
                twoFactor: false
            };
        } catch (error) {
            console.error('Error loading user settings:', error);
            return {
                notifications: true,
                emailAlerts: false,
                darkMode: false,
                currency: 'USD',
                language: 'en',
                autoBackup: true,
                twoFactor: false
            };
        }
    };

    // ✅ NEW: Save User Settings Function
    const saveUserSettings = (settings) => {
        try {
            localStorage.setItem('userSettings', JSON.stringify(settings));
            console.log('✅ User settings saved successfully');
            return { success: true };
        } catch (error) {
            console.error('❌ Failed to save user settings:', error);
            return { success: false, error: 'Failed to save settings' };
        }
    };

    // Logout
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userSettings'); // ✅ NEW: Clear settings on logout
        delete axios.defaults.headers.common['Authorization'];
        
        // Sign out from Google using the new library
        googleLogout();
    };

    const forgotPassword = async (email) => {
        try {
            setError(null);
            const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
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
            const response = await axios.post(`${BASE_URL}/auth/reset-password`, {
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
        forgotPassword,
        resetPassword,
        // ✅ NEW: Profile management functions
        updateProfile,
        uploadProfilePicture,
        changePassword,
        deleteAccount,
        // ✅ NEW: Settings management functions
        getUserSettings,
        saveUserSettings,
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