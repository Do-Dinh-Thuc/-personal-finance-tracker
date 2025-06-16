import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/authContext';

const ForgotPassword = ({ onBackToLogin }) => {
    const { forgotPassword, error, setError } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage('');

        const result = await forgotPassword(email);
        
        if (result.success) {
            setMessage(result.message);
            setEmail('');
        }
        
        setIsLoading(false);
    };

    return (
        <ForgotPasswordContainer>
            <ForgotPasswordCard>
                <Header>
                    <h1>
                        <i className="fa-solid fa-key"></i>
                        Reset Password
                    </h1>
                    <p>Enter your email address and we'll send you a reset link</p>
                </Header>

                <Form onSubmit={handleSubmit}>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {message && <SuccessMessage>{message}</SuccessMessage>}
                    
                    <InputGroup>
                        <InputIcon>
                            <i className="fa-solid fa-envelope"></i>
                        </InputIcon>
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </InputGroup>

                    <SubmitButton type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                Sending Reset Link...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-paper-plane"></i>
                                Send Reset Link
                            </>
                        )}
                    </SubmitButton>
                </Form>

                <BackButton onClick={onBackToLogin}>
                    <i className="fa-solid fa-arrow-left"></i>
                    Back to Login
                </BackButton>
            </ForgotPasswordCard>
        </ForgotPasswordContainer>
    );
};

// Styled components for ForgotPassword
const ForgotPasswordContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    font-family: 'Nunito', sans-serif;
`;

const ForgotPasswordCard = styled.div`
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

const SuccessMessage = styled.div`
    background: #c6f6d5;
    color: #22543d;
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

const BackButton = styled.button`
    width: 100%;
    padding: 0.75rem;
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover {
        background: #667eea;
        color: white;
        transform: translateY(-2px);
    }
`;

export default ForgotPassword;