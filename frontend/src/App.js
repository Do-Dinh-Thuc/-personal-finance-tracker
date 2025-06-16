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
  main{
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar{
      width: 0;
    }
  }
`;

export default App;