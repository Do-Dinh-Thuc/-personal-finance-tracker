import styled from "styled-components";

export const MainLayout = styled.div`
    padding: 2rem;
    height: 100%;
    display: flex;
    gap: 2rem;
    
    @media (max-width: 1024px) {
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
        height: auto;
        min-height: 100vh;
    }
    
    @media (max-width: 768px) {
        padding: 0.5rem;
        gap: 0.5rem;
    }
`;

export const InnerLayout = styled.div`
    padding: 2rem 1.5rem;
    width: 100%;
    
    @media (max-width: 768px) {
        padding: 1rem;
    }
    
    @media (max-width: 480px) {
        padding: 0.5rem;
    }
`;