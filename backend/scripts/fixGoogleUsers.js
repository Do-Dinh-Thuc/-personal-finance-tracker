const mongoose = require('mongoose');
const User = require('../models/UserModel');
require('dotenv').config();

const fixGoogleUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('🔗 Connected to MongoDB');

        // Find all Google users without createdAt
        const users = await User.find({
            loginType: 'google',
            $or: [
                { createdAt: { $exists: false } },
                { createdAt: null }
            ]
        });

        console.log(`📊 Found ${users.length} Google users without createdAt`);

        for (const user of users) {
            // Extract creation date from ObjectId
            const creationDate = user._id.getTimestamp();
            
            await User.findByIdAndUpdate(user._id, {
                createdAt: creationDate,
                updatedAt: new Date()
            });
            
            console.log(`✅ Fixed user: ${user.email} - Created: ${creationDate}`);
        }

        console.log('🎉 Migration completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

fixGoogleUsers();