import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import { dateFormat } from '../../utils/dateFormat';
import { 
    dollar, 
    calender, 
    comment, 
    trash,
    bitcoin,
    book,
    card,
    circle,
    clothing,
    food,
    freelance,
    medical,
    money,
    piggy,
    stocks,
    takeaway,
    tv,
    users,
    yt
} from '../../utils/Icons';
import Button from '../Button/Button';

const ViewTransactions = () => {
    const { incomes, expenses, getIncomes, getExpenses, deleteIncome, deleteExpense, totalIncome, totalExpenses, totalBalance } = useGlobalContext();
    const [filter, setFilter] = useState('all'); // all, income, expense
    const [sortBy, setSortBy] = useState('date'); // date, amount, category
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getIncomes();
        getExpenses();
    }, []);

    // Combine and process transactions
    const allTransactions = [
        ...incomes.map(item => ({ ...item, type: 'income' })),
        ...expenses.map(item => ({ ...item, type: 'expense' }))
    ];

    // Filter transactions
    const filteredTransactions = allTransactions
        .filter(transaction => {
            const matchesFilter = filter === 'all' || transaction.type === filter;
            const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'amount':
                    return b.amount - a.amount;
                case 'category':
                    return a.category.localeCompare(b.category);
                case 'date':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

    const getIcon = (category, type) => {
        if (type === 'income') {
            switch(category) {
                case 'salary': return money;
                case 'freelancing': return freelance;
                case 'investments': return stocks;
                case 'stocks': return users;
                case 'bitcoin': return bitcoin;
                case 'bank': return card;
                case 'youtube': return yt;
                case 'other': return piggy;
                default: return money;
            }
        } else {
            switch (category) {
                case 'education': return book;
                case 'groceries': return food;
                case 'health': return medical;
                case 'subscriptions': return tv;
                case 'takeaways': return takeaway;
                case 'clothing': return clothing;
                case 'travelling': return freelance;
                case 'other': return circle;
                default: return circle;
            }
        }
    };

    const handleDelete = (id, type) => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            if (type === 'income') {
                deleteIncome(id);
            } else {
                deleteExpense(id);
            }
        }
    };

    return (
        <TransactionsStyled>
            <InnerLayout>
                <Header>
                    <h1>All Transactions</h1>
                    <TransactionStats>
                        <StatCard className="income">
                            <h3>Total Income</h3>
                            <p>{dollar} {totalIncome()}</p>
                        </StatCard>
                        <StatCard className="expense">
                            <h3>Total Expenses</h3>
                            <p>{dollar} {totalExpenses()}</p>
                        </StatCard>
                        <StatCard className="balance">
                            <h3>Net Balance</h3>
                            <p className={totalBalance() >= 0 ? 'positive' : 'negative'}>
                                {dollar} {totalBalance()}
                            </p>
                        </StatCard>
                    </TransactionStats>
                </Header>

                <FilterControls>
                    <SearchBox>
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="fa-solid fa-search"></i>
                    </SearchBox>

                    <FilterGroup>
                        <FilterButton 
                            active={filter === 'all'} 
                            onClick={() => setFilter('all')}
                        >
                            All ({allTransactions.length})
                        </FilterButton>
                        <FilterButton 
                            active={filter === 'income'} 
                            onClick={() => setFilter('income')}
                            className="income"
                        >
                            Income ({incomes.length})
                        </FilterButton>
                        <FilterButton 
                            active={filter === 'expense'} 
                            onClick={() => setFilter('expense')}
                            className="expense"
                        >
                            Expenses ({expenses.length})
                        </FilterButton>
                    </FilterGroup>

                    <SortSelect>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="date">Sort by Date</option>
                            <option value="amount">Sort by Amount</option>
                            <option value="category">Sort by Category</option>
                        </select>
                    </SortSelect>
                </FilterControls>

                <TransactionsList>
                    {filteredTransactions.length === 0 ? (
                        <EmptyState>
                            <i className="fa-solid fa-receipt"></i>
                            <h3>No transactions found</h3>
                            <p>
                                {searchTerm ? 
                                    `No transactions match "${searchTerm}"` : 
                                    'Start by adding some income or expenses'
                                }
                            </p>
                        </EmptyState>
                    ) : (
                        filteredTransactions.map((transaction) => (
                            <TransactionItem key={`${transaction.type}-${transaction._id}`}>
                                <TransactionIcon className={transaction.type}>
                                    {getIcon(transaction.category, transaction.type)}
                                </TransactionIcon>
                                
                                <TransactionDetails>
                                    <TransactionHeader>
                                        <h4>{transaction.title}</h4>
                                        <TransactionAmount className={transaction.type}>
                                            {transaction.type === 'income' ? '+' : '-'}{dollar} {Math.abs(transaction.amount)}
                                        </TransactionAmount>
                                    </TransactionHeader>
                                    
                                    <TransactionMeta>
                                        <span className="category">
                                            <i className="fa-solid fa-tag"></i>
                                            {transaction.category}
                                        </span>
                                        <span className="date">
                                            {calender} {dateFormat(transaction.date)}
                                        </span>
                                    </TransactionMeta>
                                    
                                    {transaction.description && (
                                        <TransactionDescription>
                                            {comment} {transaction.description}
                                        </TransactionDescription>
                                    )}
                                </TransactionDetails>
                                
                                <TransactionActions>
                                    <Button 
                                        icon={trash}
                                        bPad={'0.5rem'}
                                        bRad={'50%'}
                                        bg={'#ff4757'}
                                        color={'#fff'}
                                        onClick={() => handleDelete(transaction._id, transaction.type)}
                                    />
                                </TransactionActions>
                            </TransactionItem>
                        ))
                    )}
                </TransactionsList>

                {filteredTransactions.length > 0 && (
                    <TransactionSummary>
                        <SummaryItem>
                            <strong>Showing {filteredTransactions.length} transaction(s)</strong>
                        </SummaryItem>
                        <SummaryItem>
                            Total Value: {dollar} {filteredTransactions.reduce((sum, t) => 
                                sum + (t.type === 'income' ? t.amount : -t.amount), 0
                            ).toFixed(2)}
                        </SummaryItem>
                    </TransactionSummary>
                )}
            </InnerLayout>
        </TransactionsStyled>
    );
};

const TransactionsStyled = styled.div`
    padding: 1rem;
`;

const Header = styled.div`
    margin-bottom: 2rem;
    
    h1 {
        color: var(--primary-color);
        margin-bottom: 1.5rem;
        font-size: 2rem;
    }
`;

const TransactionStats = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
`;

const StatCard = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1.5rem;
    text-align: center;
    
    h3 {
        color: var(--primary-color);
        margin-bottom: 0.5rem;
        font-size: 1rem;
    }
    
    p {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0;
    }
    
    &.income p {
        color: var(--color-green);
    }
    
    &.expense p {
        color: #ff4757;
    }
    
    &.balance p.positive {
        color: var(--color-green);
    }
    
    &.balance p.negative {
        color: #ff4757;
    }
`;

const FilterControls = styled.div`
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 1rem;
    margin-bottom: 2rem;
    align-items: center;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
`;

const SearchBox = styled.div`
    position: relative;
    
    input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.5rem;
        border: 2px solid #e2e8f0;
        border-radius: 25px;
        font-size: 1rem;
        background: white;
        transition: all 0.3s ease;
        
        &:focus {
            outline: none;
            border-color: var(--color-accent);
            box-shadow: 0 0 0 3px rgba(245, 102, 146, 0.1);
        }
    }
    
    i {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #a0aec0;
    }
`;

const FilterGroup = styled.div`
    display: flex;
    gap: 0.5rem;
    background: #f7fafc;
    padding: 0.25rem;
    border-radius: 25px;
`;

const FilterButton = styled.button`
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 20px;
    background: ${props => props.active ? '#667eea' : 'transparent'};
    color: ${props => props.active ? 'white' : '#4a5568'};
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;
    
    &:hover {
        background: ${props => props.active ? '#667eea' : '#e2e8f0'};
    }
    
    &.income {
        background: ${props => props.active ? 'var(--color-green)' : 'transparent'};
        &:hover {
            background: ${props => props.active ? 'var(--color-green)' : '#f0fff4'};
        }
    }
    
    &.expense {
        background: ${props => props.active ? '#ff4757' : 'transparent'};
        &:hover {
            background: ${props => props.active ? '#ff4757' : '#fff5f5'};
        }
    }
`;

const SortSelect = styled.div`
    select {
        padding: 0.5rem 1rem;
        border: 2px solid #e2e8f0;
        border-radius: 20px;
        background: white;
        font-size: 0.875rem;
        cursor: pointer;
        
        &:focus {
            outline: none;
            border-color: var(--color-accent);
        }
    }
`;

const TransactionsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 3rem 1rem;
    color: #a0aec0;
    
    i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #e2e8f0;
    }
    
    h3 {
        color: #4a5568;
        margin-bottom: 0.5rem;
    }
    
    p {
        color: #718096;
    }
`;

const TransactionItem = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1.5rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
    align-items: center;
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0px 5px 25px rgba(0, 0, 0, 0.1);
    }
`;

const TransactionIcon = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    
    &.income {
        background: rgba(66, 173, 0, 0.1);
        color: var(--color-green);
    }
    
    &.expense {
        background: rgba(255, 71, 87, 0.1);
        color: #ff4757;
    }
`;

const TransactionDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const TransactionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h4 {
        color: var(--primary-color);
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
    }
`;

const TransactionAmount = styled.span`
    font-size: 1.2rem;
    font-weight: 700;
    
    &.income {
        color: var(--color-green);
    }
    
    &.expense {
        color: #ff4757;
    }
`;

const TransactionMeta = styled.div`
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: #718096;
    
    .category {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        text-transform: capitalize;
    }
    
    .date {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
`;

const TransactionDescription = styled.div`
    font-size: 0.875rem;
    color: #4a5568;
    display: flex;
    align-items: center;
    gap: 0.25rem;
`;

const TransactionActions = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const TransactionSummary = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f7fafc;
    border-radius: 15px;
    margin-top: 2rem;
    font-size: 0.875rem;
    color: #4a5568;
`;

const SummaryItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

export default ViewTransactions;