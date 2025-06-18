import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const GoogleLogin = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Google OAuth configuration
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

    if (!GOOGLE_CLIENT_ID) {
        return (
            // eslint-disable-next-line react/jsx-no-undef
            <ErrorCard>
                <h1>⚠️ Configuration Error</h1>
                <p>Google Client ID is not configured.</p>
                <p>Please add REACT_APP_GOOGLE_CLIENT_ID to your .env file</p>
            </ErrorCard>
        );
    }

  useEffect(() => {
    // Load Google OAuth script
    const loadGoogleScript = () => {
      if (window.google) return;
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleAuth;
      document.head.appendChild(script);
    };

    const initializeGoogleAuth = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the Google Sign-In button
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: 300,
            text: 'signin_with',
            shape: 'rectangular',
          }
        );
      }
    };

    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      loadGoogleScript();
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    setIsLoading(true);
    try {
      // Decode JWT token to get user info
      const userInfo = parseJwt(response.credential);
      
      const userData = {
        id: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        token: response.credential
      };

      // Save user data
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Here you would typically send the token to your backend for verification
      console.log('User authenticated:', userData);
      
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  const handleSignOut = () => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  const handleTraditionalLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    // For demo purposes - in real app, validate with backend
    if (email && password) {
      const userData = {
        id: 'demo-' + Date.now(),
        name: email.split('@')[0],
        email: email,
        picture: 'https://via.placeholder.com/100',
        loginType: 'traditional'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } else {
      alert('Please enter both email and password');
    }
  };

  // If user is logged in, show dashboard access
  if (user) {
    return (
      <LoginContainer>
        <WelcomeCard>
          <UserInfo>
            <Avatar src={user.picture} alt="Profile" />
            <div>
              <h2>Welcome, {user.name}!</h2>
              <p>{user.email}</p>
            </div>
          </UserInfo>
          
          <ButtonGroup>
            <AccessButton onClick={() => window.location.href = '/dashboard'}>
              <i className="fa-solid fa-chart-line"></i>
              Access Expense Tracker
            </AccessButton>
            <SignOutButton onClick={handleSignOut}>
              <i className="fa-solid fa-sign-out-alt"></i>
              Sign Out
            </SignOutButton>
          </ButtonGroup>
        </WelcomeCard>
      </LoginContainer>
    );
  }

  // Login form
  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <h1>
            <i className="fa-solid fa-wallet"></i>
            Expense Tracker
          </h1>
          <p>Sign in to manage your finances</p>
        </LoginHeader>

        <LoginForm onSubmit={handleTraditionalLogin}>
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
            />
          </InputGroup>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Signing in...
              </>
            ) : (
              <>
                <i className="fa-solid fa-sign-in-alt"></i>
                Sign In
              </>
            )}
          </LoginButton>
        </LoginForm>

        <Divider>
          <span>or</span>
        </Divider>

        <GoogleSignInContainer>
          <div id="google-signin-button"></div>
        </GoogleSignInContainer>

        <LoginFooter>
          <p>Don't have an account? <a href="#signup">Sign up</a></p>
          <p><a href="#forgot">Forgot password?</a></p>
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

const WelcomeCard = styled(LoginCard)`
  text-align: center;
  max-width: 500px;
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

  #google-signin-button {
    display: flex;
    justify-content: center;
  }
`;

const LoginFooter = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: #718096;

  p {
    margin: 0.5rem 0;
  }

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 16px;

  h2 {
    margin: 0 0 0.5rem 0;
    color: #2d3748;
  }

  p {
    margin: 0;
    color: #718096;
  }
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AccessButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(72, 187, 120, 0.3);
  }
`;

const SignOutButton = styled.button`
  padding: 1rem 2rem;
  background: transparent;
  color: #e53e3e;
  border: 2px solid #e53e3e;
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
    background: #e53e3e;
    color: white;
    transform: translateY(-2px);
  }
`;

export default GoogleLogin;