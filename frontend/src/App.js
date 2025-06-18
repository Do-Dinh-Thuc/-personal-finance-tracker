import React, {useState, useMemo} from 'react'
import styled from "styled-components";
import bg from './img/bg.png'
import {MainLayout} from './styles/Layouts'
import Orb from './Components/Orb/Orb'
import Navigation from './Components/Navigation/Navigation'
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income'
import Expenses from './Components/Expenses/Expenses';
import { GlobalProvider } from './context/globalContext';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './Components/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Transactions from './Components/Transaction/Transactions';
import config from './config/config';

function App() {
  const [active, setActive] = useState(1)

  const displayData = () => {
    switch(active){
      case 1:
        return <Dashboard />
      case 2:
        return <Transactions />
      case 3:
        return <Income />
      case 4: 
        return <Expenses />
      default: 
        return <Dashboard />
    }
  }

  const orbMemo = useMemo(() => {
    return <Orb />
  },[])

  // Check if Google Client ID is configured
  if (!config.GOOGLE_CLIENT_ID) {
    return (
      <ErrorContainer>
        <ErrorCard>
          <h1>⚠️ Configuration Error</h1>
          <p>Google Client ID is not configured.</p>
          <p>Please check your <code>.env</code> file and add <code>REACT_APP_GOOGLE_CLIENT_ID</code></p>
          <p>See README.md for setup instructions.</p>
        </ErrorCard>
      </ErrorContainer>
    );
  }

  return (
    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
      <AuthProvider>
          <AppStyled bg={bg} className="App">
            {orbMemo}
            <ProtectedRoute>
              <GlobalProvider>
                <MainLayout>
                  <Navigation active={active} setActive={setActive} />
                  <main>
                    {displayData()}
                  </main>
                </MainLayout>
              </GlobalProvider>
            </ProtectedRoute>
          </AppStyled>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

const AppStyled = styled.div`
    height: 100vh;
    background-image: url(${props => props.bg});
    position: relative;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    
    @media (max-width: 1024px) {
        height: auto;
        min-height: 100vh;
        background-attachment: scroll;
    }
    
    main{
        flex: 1;
        background: rgba(252, 246, 249, 0.78);
        border: 3px solid #FFFFFF;
        backdrop-filter: blur(4.5px);
        border-radius: 32px;
        overflow-x: hidden;
        
        @media (max-width: 1024px) {
            border-radius: 16px;
            border: 2px solid #FFFFFF;
        }
        
        @media (max-width: 768px) {
            border-radius: 12px;
            border: 1px solid #FFFFFF;
        }
        
        &::-webkit-scrollbar{
            width: 0;
        }
    }
`;

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
`;

const ErrorCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 3rem;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

  h1 {
    color: #e53e3e;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
    color: #2d3748;
  }

  code {
    background: #f7fafc;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
  }
`;

export default App;