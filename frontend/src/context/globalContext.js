import React, { useContext, useState } from "react"
import axios from 'axios'
import config from '../config/config'; 

const BASE_URL = config.API_URL + '/'; 

const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {
    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    // Get auth token from localStorage
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        } : {};
    };

    //calculate incomes
    const addIncome = async (income) => {
    try {
        console.log('🔍 Adding income with data:', income); // Debug what's sent
        const response = await axios.post(`${BASE_URL}add-income`, income, getAuthHeaders());
        console.log('✅ Add income success:', response.data);
        getIncomes();
        return { success: true };
    } catch (err) {
        console.error('❌ Add income failed:', err.response?.data); // Show exact error
        console.error('❌ Full error:', err);
        const message = err.response?.data?.message || 'Failed to add income';
        setError(message);
        return { success: false, error: message };
    }
}

    const getIncomes = async () => {
    try {
        console.log('🔍 Fetching incomes...'); 
        const response = await axios.get(`${BASE_URL}get-incomes`, getAuthHeaders());
        console.log('✅ Incomes response:', response.data);
        setIncomes(response.data);
    } catch (error) {
        console.error('❌ Failed to fetch incomes:', error); 
        console.error('❌ Error details:', error.response);
        setError('Failed to fetch incomes');
    }
}

    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`, getAuthHeaders());
            getIncomes();
        } catch (error) {
            console.error('Failed to delete income:', error);
            setError('Failed to delete income');
        }
    }

    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })
        return totalIncome;
    }

    //calculate expenses
    const addExpense = async (expense) => {
        try {
            const response = await axios.post(`${BASE_URL}add-expense`, expense, getAuthHeaders());
            getExpenses();
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to add expense';
            setError(message);
            return { success: false, error: message };
        }
    }

    const getExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`, getAuthHeaders());
            setExpenses(response.data);
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
            setError('Failed to fetch expenses');
        }
    }

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`, getAuthHeaders());
            getExpenses();
        } catch (error) {
            console.error('Failed to delete expense:', error);
            setError('Failed to delete expense');
        }
    }

    const totalExpenses = () => {
        let totalExpense = 0;
        expenses.forEach((expense) =>{
            totalExpense = totalExpense + expense.amount
        })
        return totalExpense;
    }

    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })
        return history.slice(0, 3)
    }

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () =>{
    return useContext(GlobalContext)
}