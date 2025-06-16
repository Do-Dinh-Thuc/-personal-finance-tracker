import React from 'react';
import { useAuth } from '../context/authContext';
import GoogleLogin from './GoogleLogin/GoogleLogin';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.2rem',
                fontFamily: 'Nunito, sans-serif'
            }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px', color: '#667eea' }}></i>
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <GoogleLogin />;
    }

    return children;
};

export default ProtectedRoute;