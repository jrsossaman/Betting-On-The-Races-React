/**
 * Test Script - Check Admin Account in MongoDB
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/racing_betting', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected');

    const admin = await User.findOne({ username: 'admin' });
    
    if (admin) {
      console.log('\n📋 Admin Account Found:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Username: ${admin.username}`);
      console.log(`Password stored: ${admin.password}`);
      console.log(`Name: ${admin.name}`);
      console.log(`Is Admin: ${admin.isAdmin}`);
      console.log(`Account Status: ${admin.accountStatus}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Test password comparison
      const testPassword = 'AdminPassword123!';
      console.log(`Testing password match:`);
      console.log(`Input password: "${testPassword}"`);
      console.log(`Stored password: "${admin.password}"`);
      console.log(`Match: ${admin.password === testPassword}`);
      
    } else {
      console.log('❌ Admin account not found');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.disconnect();
  }
};

checkAdmin();
