import React from 'react';
import { useGlobalContext } from '../../context/globalContext';
import Auth from '../Auth/Auth';
import styled from 'styled-components';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useGlobalContext();

    if (loading) {
        return (
            <LoadingStyled>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <h2>Loading...</h2>
                </div>
            </LoadingStyled>
        );
    }

    return isAuthenticated ? children : <Auth />;
}

const LoadingStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    
    .loading-container {
        text-align: center;
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid var(--color-accent);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        
        h2 {
            color: var(--primary-color);
        }
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

export default ProtectedRoute;