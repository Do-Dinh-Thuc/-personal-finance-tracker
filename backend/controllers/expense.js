const ExpenseSchema = require("../models/ExpenseModel")

exports.addExpense = async (req, res) => {
    const { title, amount, category, description, date } = req.body
    const userId = req.userId;

    const expense = ExpenseSchema({
        title,
        amount: parseFloat(amount), // Convert to number
        category,
        description,
        date,
        userId
    })

    try {
        // Updated validation
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' })
        }
        if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) { // Better validation
            return res.status(400).json({ message: 'Amount must be a positive number!' })
        }
        
        await expense.save()
        res.status(200).json({ message: 'Expense Added' })
    } catch (error) {
        console.error('Add expense error:', error);
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.getExpense = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        console.log('🔍 Fetching expenses for user:', userId);
        
        const expenses = await ExpenseSchema.find({ userId }).sort({ createdAt: -1 })
        console.log(`✅ Found ${expenses.length} expenses`);
        
        res.status(200).json(expenses)
    } catch (error) {
        console.error('❌ Get expenses error:', error);
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId; // From auth middleware

    try {
        console.log('🔍 Deleting expense:', id, 'for user:', userId);
        
        const expense = await ExpenseSchema.findOne({ _id: id, userId });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found or unauthorized' });
        }

        await ExpenseSchema.findByIdAndDelete(id);
        console.log('✅ Expense deleted successfully');
        res.status(200).json({ message: 'Expense Deleted' });
    } catch (error) {
        console.error('❌ Delete expense error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}