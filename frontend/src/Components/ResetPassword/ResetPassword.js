import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const { resetPassword, error, setError } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Get token from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get('token');
        
        if (!resetToken) {
            setError('Invalid reset link');
            return;
        }
        
        setToken(resetToken);
    }, [setError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        const result = await resetPassword(token, password);
        
        if (result.success) {
            // Password reset successful, user is now logged in
            navigate('/dashboard');
        }
        
        setIsLoading(false);
    };

    if (!token) {
        return (
            <ResetPasswordContainer>
                <ResetPasswordCard>
                    <Header>
                        <h1>
                            <i className="fa-solid fa-exclamation-triangle"></i>
                            Invalid Reset Link
                        </h1>
                        <p>The password reset link is invalid or has expired.</p>
                    </Header>
                </ResetPasswordCard>
            </ResetPasswordContainer>
        );
    }

    return (
        <ResetPasswordContainer>
            <ResetPasswordCard>
                <Header>
                    <h1>
                        <i className="fa-solid fa-lock"></i>
                        Set New Password
                    </h1>
                    <p>Enter your new password below</p>
                </Header>

                <Form onSubmit={handleSubmit}>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    
                    <InputGroup>
                        <InputIcon>
                            <i className="fa-solid fa-lock"></i>
                        </InputIcon>
                        <Input
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </InputGroup>

                    <InputGroup>
                        <InputIcon>
                            <i className="fa-solid fa-lock"></i>
                        </InputIcon>
                        <Input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </InputGroup>

                    <SubmitButton type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                Resetting Password...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-check"></i>
                                Reset Password
                            </>
                        )}
                    </SubmitButton>
                </Form>
            </ResetPasswordCard>
        </ResetPasswordContainer>
    );
};

// Styled components (similar to ForgotPassword)
const ResetPasswordContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    font-family: 'Nunito', sans-serif;
`;

const ResetPasswordCard = styled.div`
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 3rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Header = styled.div`
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

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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

const SubmitButton = styled.button`
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

export default ResetPassword;
