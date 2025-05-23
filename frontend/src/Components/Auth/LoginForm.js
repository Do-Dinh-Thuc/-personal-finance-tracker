import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';

function LoginForm() {
    const { login, error, setError, loading } = useGlobalContext();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const handleChange = (name) => (e) => {
        setFormData({ ...formData, [name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError('All fields are required!');
            return;
        }

        await login(formData);
    };

    return (
        <LoginFormStyled onSubmit={handleSubmit}>
            <h2>Welcome Back!</h2>
            {error && <p className='error'>{error}</p>}
            
            <div className="input-control">
                <input
                    type="email"
                    value={email}
                    name="email"
                    placeholder="Email Address"
                    onChange={handleChange('email')}
                    disabled={loading}
                />
            </div>

            <div className="input-control">
                <input
                    type="password"
                    value={password}
                    name="password"
                    placeholder="Password"
                    onChange={handleChange('password')}
                    disabled={loading}
                />
            </div>

            <div className="submit-btn">
                <Button
                    name={loading ? 'Logging in...' : 'Login'}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent'}
                    color={'#fff'}
                />
            </div>
        </LoginFormStyled>
    );
}

const LoginFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 2rem;

    h2 {
        text-align: center;
        color: var(--primary-color);
        margin-bottom: 1rem;
    }

    input {
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: none;
        padding: .8rem 1rem;
        border-radius: 5px;
        border: 2px solid #fff;
        background: transparent;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        color: rgba(34, 34, 96, 0.9);
        width: 100%;

        &::placeholder {
            color: rgba(34, 34, 96, 0.4);
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }

    .submit-btn {
        button {
            width: 100%;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            
            &:hover {
                background: var(--color-green) !important;
            }

            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        }
    }

    .error {
        color: red;
        text-align: center;
        margin: 0;
        animation: shake 0.5s ease-in-out;
    }
`;

export default LoginForm;