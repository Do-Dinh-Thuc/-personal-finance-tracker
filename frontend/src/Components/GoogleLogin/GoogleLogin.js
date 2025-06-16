import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/authContext';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import ForgotPassword from '../ForgotPassword/ForgotPassword';

const GoogleLoginComponent = () => {
    const { googleAuth, login, register, error, setError } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleGoogleSuccess = async (credentialResponse) => {
        console.log('🔍 Google Response:', credentialResponse);
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await googleAuth(credentialResponse.credential);
            if (!result.success) {
                console.error('Google authentication failed:', result.error);
                setError(result.error || 'Google authentication failed');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            setError('Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        console.log('Google Login Failed');
        setError('Google login was cancelled or failed');
    };

    const handleTraditionalLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const name = formData.get('name');
        
        try {
            let result;
            if (isRegisterMode) {
                result = await register(name, email, password);
            } else {
                result = await login(email, password);
            }
            
            if (!result.success) {
                console.error('Login failed:', result.error);
                setError(result.error || 'Authentication failed');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            setError('Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (showForgotPassword) {
        return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
    }

    return (
        <LoginContainer>
            <LoginCard>
                <LoginHeader>
                    <h1>
                        <i className="fa-solid fa-wallet"></i>
                        Expense Tracker
                    </h1>
                    <p>{isRegisterMode ? 'Create your account' : 'Sign in to manage your finances'}</p>
                </LoginHeader>

                <LoginForm onSubmit={handleTraditionalLogin}>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    
                    {isRegisterMode && (
                        <InputGroup>
                            <InputIcon>
                                <i className="fa-solid fa-user"></i>
                            </InputIcon>
                            <Input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                required
                            />
                        </InputGroup>
                    )}

                    <InputGroup>
                        <InputIcon>
                            <i className="fa-solid fa-envelope"></i>
                        </InputIcon>
                        <Input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <InputIcon>
                            <i className="fa-solid fa-lock"></i>
                        </InputIcon>
                        <Input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            minLength="6"
                        />
                    </InputGroup>

                    <LoginButton type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                {isRegisterMode ? 'Creating Account...' : 'Signing in...'}
                            </>
                        ) : (
                            <>
                                <i className={`fa-solid ${isRegisterMode ? 'fa-user-plus' : 'fa-sign-in-alt'}`}></i>
                                {isRegisterMode ? 'Create Account' : 'Sign In'}
                            </>
                        )}
                    </LoginButton>
                </LoginForm>

                <Divider>
                    <span>or</span>
                </Divider>

                <GoogleSignInContainer>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap={false}
                        auto_select={false}
                        width="300"
                        theme="outline"
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                    />
                </GoogleSignInContainer>

                <LoginFooter>
                    <p>
                        {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
                        <ToggleButton 
                            type="button"
                            onClick={() => {
                                setIsRegisterMode(!isRegisterMode);
                                setError(null);
                            }}
                        >
                            {isRegisterMode ? 'Sign in' : 'Sign up'}
                        </ToggleButton>
                    </p>
                    {!isRegisterMode && (
                        <p>
                            <ForgotPasswordLink 
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                            >
                                Forgot your password?
                            </ForgotPasswordLink>
                        </p>
                    )}
                </LoginFooter>
            </LoginCard>
        </LoginContainer>
    );
};

const LoginContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    font-family: 'Nunito', sans-serif;
`;

const LoginCard = styled.div`
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 3rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
`;

const LoginHeader = styled.div`
    text-align: center;
    margin-bottom: 2rem;

    h1 {
        color: #2d3748;
        font-size: 2rem;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        i {
            color: #667eea;
        }
    }

    p {
        color: #718096;
        font-size: 1rem;
    }
`;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

const ErrorMessage = styled.div`
    background: #fed7d7;
    color: #c53030;
    padding: 0.75rem;
    border-radius: 8px;
    font-size: 0.875rem;
    text-align: center;
`;

const InputGroup = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const InputIcon = styled.div`
    position: absolute;
    left: 1rem;
    color: #a0aec0;
    z-index: 1;
`;

const Input = styled.input`
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    background: white;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &::placeholder {
        color: #a0aec0;
    }
`;

const LoginButton = styled.button`
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const Divider = styled.div`
    position: relative;
    text-align: center;
    margin: 2rem 0;
    
    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: #e2e8f0;
    }

    span {
        background: white;
        padding: 0 1rem;
        color: #718096;
        font-size: 0.875rem;
    }
`;

const GoogleSignInContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
`;

const LoginFooter = styled.div`
    text-align: center;
    font-size: 0.875rem;
    color: #718096;

    p {
        margin: 0.5rem 0;
    }
`;

const ToggleButton = styled.button`
    background: none;
    border: none;
    color: #667eea;
    font-weight: 600;
    cursor: pointer;
    margin-left: 0.5rem;

    &:hover {
        text-decoration: underline;
    }
`;

const ForgotPasswordLink = styled.button`
    background: none;
    border: none;
    color: #667eea;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    font-size: 0.875rem;

    &:hover {
        color: #5a67d8;
    }
`;

export default GoogleLoginComponent;
