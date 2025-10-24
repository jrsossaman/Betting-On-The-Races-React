const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
const database = {
  drivers: [
    { teamId: 2, number: 1, name: 'Benjamin', status: true, driveBonus: 2 },
    { teamId: 2, number: 2, name: 'Jonathan', status: true, driveBonus: 2 },
    { teamId: 2, number: 3, name: 'Andrew', status: true, driveBonus: 2 },
    { teamId: 2, number: 4, name: 'Christopher', status: true, driveBonus: 2 },
  ],
  users: []
};

// GET /get/all - Fetch all drivers and users for a team
app.get('/get/all', (req, res) => {
  try {
    const teamId = parseInt(req.query.teamId) || 2;
    
    const drivers = database.drivers.filter(d => d.teamId === teamId);
    const users = database.users.filter(u => u.teamId === teamId);

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

// POST /drivers - Create new driver(s)
app.post('/drivers', (req, res) => {
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

    database.drivers.push(...createdDrivers);

    res.json({
      response: [],
      body: {
        drivers: createdDrivers,
      },
    });
  } catch (error) {
    console.error('Error creating drivers:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /update/data - Update driver or user data
app.patch('/update/data', (req, res) => {
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
        const driver = database.drivers.find(
          d => d.teamId === teamId && d.number === driverUpdate.number
        );
        if (driver) {
          if (driverUpdate.status !== undefined) driver.status = driverUpdate.status;
          if (driverUpdate.driveBonus !== undefined) driver.driveBonus = driverUpdate.driveBonus;
          updatedDrivers.push(driver);
        }
      }
    }

    // Update users if provided
    if (body.users && Array.isArray(body.users)) {
      for (const userUpdate of body.users) {
        const user = database.users.find(
          u => u.teamId === teamId && u.username === userUpdate.username
        );
        if (user) {
          if (userUpdate.wallet !== undefined) user.wallet = userUpdate.wallet;
          if (userUpdate.name !== undefined) user.name = userUpdate.name;
          updatedUsers.push(user);
        } else if (userUpdate.username) {
          // If user doesn't exist, create it
          const newUser = {
            teamId,
            username: userUpdate.username,
            password: userUpdate.password || '',
            name: userUpdate.name || userUpdate.username,
            wallet: userUpdate.wallet || 1000,
          };
          database.users.push(newUser);
          updatedUsers.push(newUser);
        }
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

// DELETE /delete/user - Delete a user
app.delete('/delete/user', (req, res) => {
  try {
    const teamId = parseInt(req.query.teamId) || 2;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'username required' });
    }

    const userIndex = database.users.findIndex(
      u => u.teamId === teamId && u.username === username
    );

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const deletedUser = database.users.splice(userIndex, 1);

    res.json({
      response: [],
      body: {
        users: deletedUser,
      },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
