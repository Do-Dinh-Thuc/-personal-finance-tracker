const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api/v1';

const testProfileRoutes = async () => {
    console.log('🧪 Testing Profile Management Routes...\n');
    
    // You'll need to replace this with a real token from a logged-in user
    const testToken = 'your_test_jwt_token_here';
    
    const headers = {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
    };

    try {
        // Test 1: Update Profile
        console.log('1. Testing Profile Update...');
        const profileResponse = await axios.put(`${BASE_URL}/auth/profile`, {
            name: 'Updated Test Name',
            email: 'updated@test.com',
            picture: 'https://example.com/updated-avatar.jpg'
        }, { headers });
        
        console.log('✅ Profile Update:', profileResponse.status);
        
        // Test 2: Change Password (for traditional users)
        console.log('\n2. Testing Password Change...');
        try {
            const passwordResponse = await axios.put(`${BASE_URL}/auth/change-password`, {
                currentPassword: 'oldpassword',
                newPassword: 'newpassword123'
            }, { headers });
            
            console.log('✅ Password Change:', passwordResponse.status);
        } catch (error) {
            console.log('ℹ️ Password Change:', error.response?.status + ' - ' + error.response?.data?.message);
        }
        
        console.log('\n✅ All tests completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.status, error.response?.data?.message);
    }
};

// Uncomment to run tests (make sure you have a valid token)
// testProfileRoutes();

console.log('🔧 To test these routes:');
console.log('1. Start your backend server');
console.log('2. Login to get a valid JWT token');
console.log('3. Replace testToken with your real token');
console.log('4. Uncomment the testProfileRoutes() call');
console.log('5. Run: node scripts/testProfileRoutes.js');