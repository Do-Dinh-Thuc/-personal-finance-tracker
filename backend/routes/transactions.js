const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const auth = require('../middleware/auth');

const router = require('express').Router();

console.log('🔍 Transaction routes loaded!'); // Debug line

// Income routes - all protected with auth middleware
router.post('/add-income', auth, addIncome)
    .get('/get-incomes', auth, getIncomes)
    .delete('/delete-income/:id', auth, deleteIncome)
    
// Expense routes - all protected with auth middleware
router.post('/add-expense', auth, addExpense)
    .get('/get-expenses', auth, getExpense)
    .delete('/delete-expense/:id', auth, deleteExpense)

module.exports = router;