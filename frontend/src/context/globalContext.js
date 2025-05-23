import React, { useContext, useState, useEffect } from "react"
import axios from 'axios'

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {
    // Authentication State
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    // Existing State
    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    // Set up axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            checkAuthStatus();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setLoading(false);
        }
    }, [token]);

    // Check authentication status
    const checkAuthStatus = async () => {
        try {
            const response = await axios.get(`${BASE_URL}auth/me`);
            setUser(response.data.user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Auth check failed:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    // Authentication Functions
    const register = async (userData) => {
        try {
            setLoading(true);
            setError('');
            
            const response = await axios.post(`${BASE_URL}auth/register`, userData);
            
            const { token: newToken, user: newUser } = response.data;
            
            // Store token and update state
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(newUser);
            setIsAuthenticated(true);
            
            return true;
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setLoading(true);
            setError('');
            
            const response = await axios.post(`${BASE_URL}auth/login`, credentials);
            
            const { token: newToken, user: newUser } = response.data;
            
            // Store token and update state
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(newUser);
            setIsAuthenticated(true);
            
            return true;
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setIncomes([]);
        setExpenses([]);
        setError('');
        delete axios.defaults.headers.common['Authorization'];
    };

    const updateProfile = async (profileData) => {
        try {
            setLoading(true);
            setError('');
            
            const response = await axios.put(`${BASE_URL}auth/profile`, profileData);
            
            setUser(response.data.user);
            return true;
        } catch (error) {
            setError(error.response?.data?.message || 'Profile update failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Income Functions (Updated with authentication)
    const addIncome = async (income) => {
        try {
            const response = await axios.post(`${BASE_URL}add-income`, income);
            await getIncomes();
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add income');
            return false;
        }
    }

    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`);
            setIncomes(response.data);
        } catch (error) {
            console.error('Error fetching incomes:', error);
            if (error.response?.status === 401) {
                logout();
            }
        }
    }

    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`);
            await getIncomes();
            return true;
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete income');
            return false;
        }
    }

    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) => {
            totalIncome = totalIncome + income.amount
        })
        return totalIncome;
    }

    // Expense Functions (Updated with authentication)
    const addExpense = async (expense) => {
        try {
            const response = await axios.post(`${BASE_URL}add-expense`, expense);
            await getExpenses();
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add expense');
            return false;
        }
    }

    const getExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`);
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            if (error.response?.status === 401) {
                logout();
            }
        }
    }

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`);
            await getExpenses();
            return true;
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete expense');
            return false;
        }
    }

    const totalExpenses = () => {
        let totalIncome = 0;
        expenses.forEach((income) => {
            totalIncome = totalIncome + income.amount
        })
        return totalIncome;
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
            // Authentication
            user,
            token,
            isAuthenticated,
            loading,
            register,
            login,
            logout,
            updateProfile,
            
            // Existing functionality
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

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}
