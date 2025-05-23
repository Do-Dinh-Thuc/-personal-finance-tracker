import React, { useState } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <AuthStyled>
            <InnerLayout>
                <div className="auth-container">
                    <h1>Personal Finance Tracker</h1>
                    <div className="auth-toggle">
                        <button 
                            className={isLogin ? 'active' : ''}
                            onClick={() => setIsLogin(true)}
                        >
                            Login
                        </button>
                        <button 
                            className={!isLogin ? 'active' : ''}
                            onClick={() => setIsLogin(false)}
                        >
                            Register
                        </button>
                    </div>
                    
                    {isLogin ? <LoginForm /> : <RegisterForm />}
                </div>
            </InnerLayout>
        </AuthStyled>
    );
}

const AuthStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;

    .auth-container {
        width: 100%;
        max-width: 500px;
        text-align: center;
    }

    h1 {
        color: var(--primary-color);
        margin-bottom: 2rem;
        font-size: 2.5rem;
    }

    .auth-toggle {
        display: flex;
        margin-bottom: 2rem;
        background: #FCF6F9;
        border-radius: 30px;
        padding: 0.5rem;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);

        button {
            flex: 1;
            padding: 0.8rem 1.5rem;
            border: none;
            background: transparent;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
            color: rgba(34, 34, 96, 0.6);

            &.active {
                background: var(--color-accent);
                color: white;
            }

            &:hover:not(.active) {
                color: rgba(34, 34, 96, 1);
            }
        }
    }
`;

export default Auth;