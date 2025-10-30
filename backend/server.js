const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Driver = require('./models/Driver');
const User = require('./models/User');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/racing_betting', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// ==================== CRUD ENDPOINTS ====================

// ---------- DRIVER CRUD OPERATIONS ----------

// CREATE - Create new driver(s)
app.post('/api/drivers', async (req, res) => {
  try {
    const teamId = parseInt(req.query.teamId) || 2;
    const { drivers } = req.body;

    if (!drivers || !Array.isArray(drivers)) {
      return res.status(400).json({ error: 'drivers array required in body' });
    }

    const driversToCreate = drivers.map(driver => ({
      ...driver,
      teamId,
    }));

    const createdDrivers = await Driver.insertMany(driversToCreate);

    res.status(201).json({
      success: true,
      message: 'Drivers created successfully',
      data: createdDrivers,
    });
  } catch (error) {
    console.error('Error creating drivers:', error);
    res.status(500).json({ error: error.message });
  }
});

// READ - Get all drivers
app.get('/api/drivers', async (req, res) => {
  try {
    const teamId = parseInt(req.query.teamId) || 2;
    const drivers = await Driver.find({ teamId });

    res.json({
      success: true,
      count: drivers.length,
      data: drivers,
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: error.message });
  }
});

// READ - Get a single driver by ID
app.get('/api/drivers/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json({
      success: true,
      data: driver,
    });
  } catch (error) {
    console.error('Error fetching driver:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update a driver by ID
app.put('/api/drivers/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json({
      success: true,
      message: 'Driver updated successfully',
      data: driver,
    });
  } catch (error) {
    console.error('Error updating driver:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete a driver by ID
app.delete('/api/drivers/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json({
      success: true,
      message: 'Driver deleted successfully',
      data: driver,
    });
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---------- USER CRUD OPERATIONS ----------

// CREATE - Create new user
app.post('/api/users', async (req, res) => {
  try {
    const teamId = parseInt(req.query.teamId) || 2;
    const { username, password, name, wallet } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const newUser = await User.create({
      teamId,
      username,
      password,
      name: name || username,
      wallet: wallet || 1000,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// READ - Get all users (includes deleted/suspended for admin viewing)
app.get('/api/users', async (req, res) => {
  try {
    const teamId = parseInt(req.query.teamId) || 2;
    // Optionally filter to exclude deleted users for non-admin requests
    // For now, include all users with status info
    const users = await User.find({ teamId });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// READ - Get a single user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});

// READ - Get user by username
app.get('/api/users/username/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is suspended or deleted
    if (user.accountStatus === 'suspended') {
      return res.status(403).json({ 
        error: 'Account is suspended. Please contact support.',
        accountStatus: 'suspended'
      });
    }

    if (user.accountStatus === 'deleted') {
      return res.status(404).json({ error: 'Account no longer exists' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update a user by username
app.put('/api/users/username/:username', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update a user by ID
app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete a user by username
app.delete('/api/users/username/:username', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ADMIN MANAGEMENT ENDPOINTS ====================

// Helper function to verify admin authorization
const verifyAdmin = async (adminId) => {
  try {
    const admin = await User.findById(adminId);
    return admin && admin.isAdmin && admin.accountStatus === 'active';
  } catch (error) {
    return false;
  }
};

// SUSPEND - Suspend a user account
app.post('/api/admin/suspend/:userId', async (req, res) => {
  try {
    const { adminId } = req.body;

    if (!adminId) {
      return res.status(400).json({ error: 'adminId required in body' });
    }

    // Verify admin authorization
    const isAdmin = await verifyAdmin(adminId);
    if (!isAdmin) {
      return res.status(403).json({ error: 'Unauthorized: Admin privileges required' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isAdmin) {
      return res.status(400).json({ error: 'Cannot suspend other admin accounts' });
    }

    user.accountStatus = 'suspended';
    await user.save();

    res.json({
      success: true,
      message: `User ${user.username} has been suspended`,
      data: user,
    });
  } catch (error) {
    console.error('Error suspending user:', error);
    res.status(500).json({ error: error.message });
  }
});

// ADD MONEY - Add funds to a user's wallet
app.post('/api/add-money/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.wallet += amount;
    await user.save();

    res.json({
      success: true,
      message: 'Money added successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error adding money:', error);
    res.status(500).json({ error: error.message });
  }
});

// LOSE MONEY - Subtract funds from a user's wallet
app.post('/api/lose-money/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.wallet < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    user.wallet -= amount;
    await user.save();

    res.json({
      success: true,
      message: 'Money deducted successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error deducting money:', error);
    res.status(500).json({ error: error.message });
  }
});

// RECORD RACE - Save race result to user's history
app.post('/api/race/record/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { driver1, driver2, winner, betAmount, userWon } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update race statistics
    user.raceCount = (user.raceCount || 0) + 1;
    if (userWon) {
      user.totalWinnings = (user.totalWinnings || 0) + betAmount;
    }

    // Add to race history
    user.raceHistory.push({
      driver1,
      driver2,
      winner,
      betAmount,
      userWon,
      timestamp: new Date(),
    });

    await user.save();

    res.json({
      success: true,
      message: 'Race recorded successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error recording race:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ADMIN ENDPOINTS ====================

// SUSPEND - Suspend a user account
app.post('/api/admin/suspend/:userId', async (req, res) => {
  try {
    const { adminId } = req.body;

    if (!adminId) {
      return res.status(400).json({ error: 'adminId required in body' });
    }

    // Verify admin authorization
    const isAdmin = await verifyAdmin(adminId);
    if (!isAdmin) {
      return res.status(403).json({ error: 'Unauthorized: Admin privileges required' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.accountStatus = 'active';
    await user.save();

    res.json({
      success: true,
      message: `User ${user.username} has been unsuspended`,
      data: user,
    });
  } catch (error) {
    console.error('Error unsuspending user:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Permanently delete a user account (soft delete)
app.post('/api/admin/delete/:userId', async (req, res) => {
  try {
    const { adminId } = req.body;

    if (!adminId) {
      return res.status(400).json({ error: 'adminId required in body' });
    }

    // Verify admin authorization
    const isAdmin = await verifyAdmin(adminId);
    if (!isAdmin) {
      return res.status(403).json({ error: 'Unauthorized: Admin privileges required' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isAdmin) {
      return res.status(400).json({ error: 'Cannot delete admin accounts' });
    }

    // Soft delete by marking as deleted
    user.accountStatus = 'deleted';
    await user.save();

    res.json({
      success: true,
      message: `User ${user.username} has been permanently deleted`,
      data: user,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Get all active users (for admin panel)
app.get('/api/admin/users/active', async (req, res) => {
  try {
    const { adminId } = req.query;

    if (!adminId) {
      return res.status(400).json({ error: 'adminId query parameter required' });
    }

    // Verify admin authorization
    const isAdmin = await verifyAdmin(adminId);
    if (!isAdmin) {
      return res.status(403).json({ error: 'Unauthorized: Admin privileges required' });
    }

    const teamId = parseInt(req.query.teamId) || 2;
    const users = await User.find({ teamId });

    // Separate users by status for admin overview
    const activeUsers = users.filter(u => u.accountStatus === 'active');
    const suspendedUsers = users.filter(u => u.accountStatus === 'suspended');
    const deletedUsers = users.filter(u => u.accountStatus === 'deleted');

    res.json({
      success: true,
      data: {
        active: activeUsers,
        suspended: suspendedUsers,
        deleted: deletedUsers,
        totalCount: users.length,
      },
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== LEGACY ENDPOINTS (for backwards compatibility) ====================

// GET /get/all - Fetch all drivers and users for a team
app.get('/get/all', async (req, res) => {
  try {
    const teamId = parseInt(req.query.teamId) || 2;
    
    const drivers = await Driver.find({ teamId });
    // Filter to only include active users
    const users = await User.find({ teamId, accountStatus: 'active' });

    res.json({
      response: [],
      body: {
        drivers,
        users,
      },
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /drivers - Create new driver(s) (legacy)
app.post('/drivers', async (req, res) => {
  try {
    const teamId = parseInt(req.query.teamId) || 2;
    const { drivers } = req.body;

    if (!drivers || !Array.isArray(drivers)) {
      return res.status(400).json({ error: 'drivers array required in body' });
    }

    const createdDrivers = drivers.map(driver => ({
      ...driver,
      teamId,
    }));

    const result = await Driver.insertMany(createdDrivers);

    res.json({
      response: [],
      body: {
        drivers: result,
      },
    });
  } catch (error) {
    console.error('Error creating drivers:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /update/data - Update driver or user data (legacy)
app.patch('/update/data', async (req, res) => {
  try {
    const teamId = parseInt(req.query.teamId) || 2;
    const { body } = req.body;

    if (!body) {
      return res.status(400).json({ error: 'body object required' });
    }

    let updatedDrivers = [];
    let updatedUsers = [];

    // Update drivers if provided
    if (body.drivers && Array.isArray(body.drivers)) {
      for (const driverUpdate of body.drivers) {
        const driver = await Driver.findOneAndUpdate(
          { teamId, number: driverUpdate.number },
          driverUpdate,
          { new: true, upsert: false }
        );
        if (driver) {
          updatedDrivers.push(driver);
        }
      }
    }

    // Update users if provided
    if (body.users && Array.isArray(body.users)) {
      for (const userUpdate of body.users) {
        const user = await User.findOneAndUpdate(
          { teamId, username: userUpdate.username },
          userUpdate,
          { new: true, upsert: true }
        );
        updatedUsers.push(user);
      }
    }

    res.json({
      response: [],
      body: {
        drivers: updatedDrivers,
        users: updatedUsers,
      },
    });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /delete/user - Delete a user (legacy - now performs soft delete)
app.delete('/delete/user', async (req, res) => {
  try {
    const teamId = parseInt(req.query.teamId) || 2;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'username required' });
    }

    const user = await User.findOne({ teamId, username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Perform soft delete by marking as deleted
    user.accountStatus = 'deleted';
    await user.save();

    res.json({
      response: [],
      body: {
        users: [user],
      },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
