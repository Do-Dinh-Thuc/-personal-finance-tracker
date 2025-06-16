import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import { dollar } from '../../utils/Icons';
import Chart from '../Chart/Chart';

function Dashboard() {
    const {totalExpenses,incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses } = useGlobalContext()

    useEffect(() => {
        getIncomes()
        getExpenses()
    }, [])

    const balance = totalBalance();
    const totalTransactions = incomes.length + expenses.length;
    const savingsRate = totalIncome() > 0 ? ((balance / totalIncome()) * 100).toFixed(1) : 0;

    return (
        <DashboardStyled>
            <InnerLayout>
                <Header>
                    <Title>Financial Dashboard</Title>
                    <Subtitle>Overview of your financial health</Subtitle>
                </Header>

                {/* Main Stats Row */}
                <MainStatsRow>
                    <StatCard className="balance">
                        <StatCardHeader>
                            <StatIcon className="balance">
                                <i className={`fa-solid ${balance >= 0 ? 'fa-trending-up' : 'fa-trending-down'}`}></i>
                            </StatIcon>
                            <StatLabel>Total Balance</StatLabel>
                        </StatCardHeader>
                        <StatValue className={balance >= 0 ? 'positive' : 'negative'}>
                            {dollar}{Math.abs(balance).toLocaleString()}
                        </StatValue>
                        <StatStatus className={balance >= 0 ? 'positive' : 'negative'}>
                            {balance >= 0 ? 'Surplus' : 'Deficit'}
                        </StatStatus>
                    </StatCard>

                    <StatCard className="income">
                        <StatCardHeader>
                            <StatIcon className="income">
                                <i className="fa-solid fa-arrow-up"></i>
                            </StatIcon>
                            <StatLabel>Total Income</StatLabel>
                        </StatCardHeader>
                        <StatValue>{dollar}{totalIncome().toLocaleString()}</StatValue>
                        <StatMeta>{incomes.length} transactions</StatMeta>
                    </StatCard>

                    <StatCard className="expense">
                        <StatCardHeader>
                            <StatIcon className="expense">
                                <i className="fa-solid fa-arrow-down"></i>
                            </StatIcon>
                            <StatLabel>Total Expenses</StatLabel>
                        </StatCardHeader>
                        <StatValue>{dollar}{totalExpenses().toLocaleString()}</StatValue>
                        <StatMeta>{expenses.length} transactions</StatMeta>
                    </StatCard>

                    <StatCard className="savings">
                        <StatCardHeader>
                            <StatIcon className="savings">
                                <i className="fa-solid fa-percentage"></i>
                            </StatIcon>
                            <StatLabel>Savings Rate</StatLabel>
                        </StatCardHeader>
                        <StatValue>{savingsRate}%</StatValue>
                        <StatMeta>
                            {savingsRate > 20 ? 'Excellent!' : 
                             savingsRate > 10 ? 'Good progress' : 
                             'Keep saving'}
                        </StatMeta>
                    </StatCard>
                </MainStatsRow>

                {/* Content Row */}
                <ContentRow>
                    {/* Chart Section */}
                    <ChartSection>
                        <SectionTitle>Financial Trends</SectionTitle>
                        <ChartWrapper>
                            <Chart />
                        </ChartWrapper>
                    </ChartSection>

                    {/* Right Sidebar */}
                    <Sidebar>
                        {/* Recent Transactions */}
                        <SidebarCard>
                            <SidebarTitle>Recent Activity</SidebarTitle>
                            <History />
                        </SidebarCard>

                        {/* Quick Insights */}
                        <SidebarCard>
                            <SidebarTitle>Quick Insights</SidebarTitle>
                            <InsightGrid>
                                <InsightItem>
                                    <InsightLabel>Avg Income</InsightLabel>
                                    <InsightValue className="positive">
                                        {dollar}{incomes.length > 0 ? (totalIncome() / incomes.length).toFixed(0) : 0}
                                    </InsightValue>
                                </InsightItem>
                                <InsightItem>
                                    <InsightLabel>Avg Expense</InsightLabel>
                                    <InsightValue className="negative">
                                        {dollar}{expenses.length > 0 ? (totalExpenses() / expenses.length).toFixed(0) : 0}
                                    </InsightValue>
                                </InsightItem>
                                <InsightItem>
                                    <InsightLabel>Highest Income</InsightLabel>
                                    <InsightValue className="positive">
                                        {dollar}{incomes.length > 0 ? Math.max(...incomes.map(i => i.amount)) : 0}
                                    </InsightValue>
                                </InsightItem>
                                <InsightItem>
                                    <InsightLabel>Highest Expense</InsightLabel>
                                    <InsightValue className="negative">
                                        {dollar}{expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0}
                                    </InsightValue>
                                </InsightItem>
                                <InsightItem>
                                    <InsightLabel>Lowest Income</InsightLabel>
                                    <InsightValue className="positive">
                                        {dollar}{incomes.length > 0 ? Math.min(...incomes.map(i => i.amount)) : 0}
                                    </InsightValue>
                                </InsightItem>
                                <InsightItem>
                                    <InsightLabel>Lowest Expense</InsightLabel>
                                    <InsightValue className="negative">
                                        {dollar}{expenses.length > 0 ? Math.min(...expenses.map(e => e.amount)) : 0}
                                    </InsightValue>
                                </InsightItem>
                            </InsightGrid>
                        </SidebarCard>

                        {/* Summary Stats */}
                        <SidebarCard>
                            <SidebarTitle>Summary</SidebarTitle>
                            <SummaryList>
                                <SummaryItem>
                                    <SummaryLabel>Total Transactions</SummaryLabel>
                                    <SummaryValue>{totalTransactions}</SummaryValue>
                                </SummaryItem>
                                <SummaryItem>
                                    <SummaryLabel>This Month</SummaryLabel>
                                    <SummaryValue>
                                        {[...incomes, ...expenses].filter(item => 
                                            new Date(item.date).getMonth() === new Date().getMonth()
                                        ).length}
                                    </SummaryValue>
                                </SummaryItem>
                                <SummaryItem>
                                    <SummaryLabel>Net Worth Trend</SummaryLabel>
                                    <SummaryValue className={balance >= 0 ? 'positive' : 'negative'}>
                                        {balance >= 0 ? '↗' : '↘'} {balance >= 0 ? 'Growing' : 'Declining'}
                                    </SummaryValue>
                                </SummaryItem>
                            </SummaryList>
                        </SidebarCard>
                    </Sidebar>
                </ContentRow>
            </InnerLayout>
        </DashboardStyled>
    )
}

const DashboardStyled = styled.div`
    padding: 0;
    background: transparent;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 0;
`;

const Title = styled.h1`
    color: var(--primary-color);
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, var(--primary-color), #667eea);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`;

const Subtitle = styled.p`
    color: rgba(34, 34, 96, 0.6);
    font-size: 1.1rem;
    margin: 0;
`;

const MainStatsRow = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin-bottom: 3rem;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
`;

const StatCard = styled.div`
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    height: 160px;
    display: flex;
    flex-direction: column;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: ${props => {
            if (props.className?.includes('balance')) return 'linear-gradient(135deg, #667eea, #764ba2)';
            if (props.className?.includes('income')) return 'var(--color-green)';
            if (props.className?.includes('expense')) return '#ff4757';
            if (props.className?.includes('savings')) return '#ffa502';
            return '#667eea';
        }};
    }

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }
`;

const StatCardHeader = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
`;

const StatIcon = styled.div`
    width: 45px;
    height: 45px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;

    &.balance {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
    }

    &.income {
        background: rgba(66, 173, 0, 0.1);
        color: var(--color-green);
    }

    &.expense {
        background: rgba(255, 71, 87, 0.1);
        color: #ff4757;
    }

    &.savings {
        background: rgba(255, 165, 2, 0.1);
        color: #ffa502;
    }
`;

const StatLabel = styled.div`
    font-size: 0.95rem;
    color: rgba(34, 34, 96, 0.7);
    font-weight: 500;
    flex: 1;
    line-height: 1.2;
    margin-top: 2px;
`;

const StatValue = styled.div`
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
    margin: 1rem 0;
    line-height: 1;

    &.positive {
        color: var(--color-green);
    }

    &.negative {
        color: #ff4757;
    }
`;

const StatStatus = styled.div`
    font-size: 0.85rem;
    font-weight: 500;
    margin-top: auto;
    margin-bottom: 0.5rem;
    
    &.positive {
        color: var(--color-green);
    }

    &.negative {
        color: #ff4757;
    }
`;

const StatMeta = styled.div`
    font-size: 0.85rem;
    color: rgba(34, 34, 96, 0.5);
    font-weight: 400;
    margin-top: auto;
    margin-bottom: 0.5rem;
`;

const ContentRow = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
`;

const ChartSection = styled.div`
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    min-height: 500px;
`;

const SectionTitle = styled.h3`
    color: var(--primary-color);
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    margin-top: 0;
    flex-shrink: 0;
`;

const ChartWrapper = styled.div`
    height: 400px;
    width: 100%;
    position: relative;
    
    canvas {
        max-height: 100% !important;
        height: 100% !important;
    }
    
    > div {
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
`;

const Sidebar = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const SidebarCard = styled.div`
    background: white;
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SidebarTitle = styled.h4`
    color: var(--primary-color);
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    margin-top: 0;
`;

const InsightGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
`;

const InsightItem = styled.div`
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
`;

const InsightLabel = styled.div`
    font-size: 0.8rem;
    color: rgba(34, 34, 96, 0.6);
    margin-bottom: 0.5rem;
    font-weight: 500;
`;

const InsightValue = styled.div`
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--primary-color);

    &.positive {
        color: var(--color-green);
    }

    &.negative {
        color: #ff4757;
    }
`;

const SummaryList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const SummaryItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }
`;

const SummaryLabel = styled.div`
    font-size: 0.9rem;
    color: rgba(34, 34, 96, 0.6);
    font-weight: 500;
`;

const SummaryValue = styled.div`
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--primary-color);

    &.positive {
        color: var(--color-green);
    }

    &.negative {
        color: #ff4757;
    }
`;

export default Dashboard