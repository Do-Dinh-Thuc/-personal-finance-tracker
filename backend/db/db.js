const mongoose = require('mongoose');
const config = require('../config/config');

const db = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(config.MONGO_URL) 
        console.log('✅ Database connected successfully')
    } catch (error) {
        console.log('❌ DB Connection Error:', error.message);
    }
}

module.exports = {db}