/**
 * Seed Script - Create Initial Admin Account
 * 
 * This script creates an initial admin account in MongoDB.
 * Run this once during setup: node backend/seed-admin.js
 * 
 * Default Admin Credentials:
 * Username: admin
 * Password: AdminPassword123!
 * 
 * IMPORTANT: Change the password after first login!
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/racing_betting', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`Admin Account: ${existingAdmin.username} (isAdmin: ${existingAdmin.isAdmin})`);
      
      if (!existingAdmin.isAdmin) {
        console.log('🔄 Updating existing admin user to have admin privileges...');
        existingAdmin.isAdmin = true;
        existingAdmin.accountStatus = 'active';
        await existingAdmin.save();
        console.log('✅ Admin privileges granted!');
      }
      
      mongoose.disconnect();
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      teamId: 2,
      username: 'admin',
      password: 'AdminPassword123!', // IMPORTANT: Change this after first login
      name: 'Administrator',
      wallet: 50000, // Give admin a larger wallet
      isAdmin: true,
      accountStatus: 'active',
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📋 Admin Account Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Username: ${adminUser.username}`);
    console.log(`Password: AdminPassword123!`);
    console.log(`Name: ${adminUser.name}`);
    console.log(`Wallet: $${adminUser.wallet}`);
    console.log(`Is Admin: ${adminUser.isAdmin}`);
    console.log(`Status: ${adminUser.accountStatus}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('⚠️  SECURITY WARNING:');
    console.log('1. Change the admin password immediately after first login');
    console.log('2. Use a strong password (at least 8 characters with mixed case and numbers)');
    console.log('3. Never share these credentials');
    console.log('');

    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    mongoose.disconnect();
    process.exit(1);
  }
};

createAdminUser();
