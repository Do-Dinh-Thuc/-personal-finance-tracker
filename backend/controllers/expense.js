const Expense = require("../models/ExpenseModel")

exports.addExpense = async (req, res) => {
    const {title, amount, category, description, date} = req.body

    const expense = new Expense({
        title,
        amount,
        category,
        description,
        date,
        user: req.user.id 
    })

    try {
        if(!title || !category || !description || !date){
            return res.status(400).json({message: 'All fields are required!'})
        }
        if(amount <= 0 || typeof amount !== 'number'){
            return res.status(400).json({message: 'Amount must be a positive number!'})
        }
        await expense.save()
        res.status(200).json({message: 'Expense Added'})
    } catch (error) {
        console.error('Add Expense Error:', error);
        res.status(500).json({message: 'Server Error'})
    }
}

exports.getExpense = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({createdAt: -1})
        res.status(200).json(expenses)
    } catch (error) {
        console.error('Get Expenses Error:', error);
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        const {id} = req.params;
        const expense = await Expense.findOneAndDelete({ 
            _id: id, 
            user: req.user.id 
        });
        
        if (!expense) {
            return res.status(404).json({message: 'Expense not found'});
        }
        
        res.status(200).json({message: 'Expense Deleted'})
    } catch (error) {
        console.error('Delete Expense Error:', error);
        res.status(500).json({message: 'Server Error'})
    }
}