const auth = require('../middleware/auth');
const IncomeModel = require('../models/IncomeModel');

exports.addIncome = async (req, res) => {
    const {title, amount, category, description, date} = req.body;

    const income = new IncomeModel({
        title,
        amount,
        category,
        description,
        date,
        user: req.user.id
    });

    try {
        if(!title || !category || !description || !date){
            return res.status(400).json({message: 'All fields are required!'})
        }
        if(amount <= 0 || typeof amount !== 'number'){
            return res.status(400).json({message: 'Amount must be a positive number!'})
        }
        await income.save()
        res.status(200).json({message: 'Income Added'})
    } catch (error) {
        console.error('Add Income Error:', error);
        res.status(500).json({message: 'Server Error'})
    }
}

exports.getIncomes = async (req, res) => {
    try {
        const incomes = await IncomeModel.find({ user: req.user.id })
            .sort({createdAt: -1});
        res.status(200).json(incomes);
    } catch (error) {
        console.error('Get Incomes Error:', error);
        res.status(500).json({message: 'Server Error'});
    }
}

exports.deleteIncome = async (req, res) => {
    try {
        const {id} = req.params;
        const income = await IncomeModel.findOneAndDelete({ 
            _id: id, 
            user: req.user.id 
        });
        
        if (!income) {
            return res.status(404).json({message: 'Income not found'});
        }
        
        res.status(200).json({message: 'Income Deleted'});
    } catch (error) {
        console.error('Delete Income Error:', error);
        res.status(500).json({message: 'Server Error'});
    }
}