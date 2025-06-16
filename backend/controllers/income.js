const IncomeSchema = require("../models/IncomeModel")

exports.addIncome = async (req, res) => {
    console.log('🔍 Add income request from user:', req.userId);
    console.log('🔍 Income data received:', req.body); // Debug what's received
    
    const { title, amount, category, description, date } = req.body
    const userId = req.userId;

    try {
        // Validation (make exactly like expenses)
        if (!title || !category || !description || !date) {
            console.log('❌ Missing fields:', { title, category, description, date });
            return res.status(400).json({ message: 'All fields are required!' })
        }
        
        // Convert amount and validate (same as expenses)
        const numAmount = parseFloat(amount);
        if (numAmount <= 0 || isNaN(numAmount)) {
            console.log('❌ Invalid amount:', amount, 'converted to:', numAmount);
            return res.status(400).json({ message: 'Amount must be a positive number!' })
        }

        const income = IncomeSchema({
            title,
            amount: numAmount, // Use converted number
            category,
            description,
            date,
            userId
        })
        
        await income.save()
        console.log('✅ Income added successfully');
        res.status(200).json({ message: 'Income Added' })
    } catch (error) {
        console.error('❌ Add income error:', error);
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.getIncomes = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        console.log('🔍 Fetching incomes for user:', userId);
        
        const incomes = await IncomeSchema.find({ userId }).sort({ createdAt: -1 })
        console.log(`✅ Found ${incomes.length} incomes`);
        
        res.status(200).json(incomes)
    } catch (error) {
        console.error('❌ Get incomes error:', error);
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId; // From auth middleware

    try {
        console.log('🔍 Deleting income:', id, 'for user:', userId);
        
        const income = await IncomeSchema.findOne({ _id: id, userId });
        if (!income) {
            return res.status(404).json({ message: 'Income not found or unauthorized' });
        }

        await IncomeSchema.findByIdAndDelete(id);
        console.log('✅ Income deleted successfully');
        res.status(200).json({ message: 'Income Deleted' });
    } catch (error) {
        console.error('❌ Delete income error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}