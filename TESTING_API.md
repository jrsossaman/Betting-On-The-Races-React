# API Testing Guide

## Quick Start

### Prerequisites
- Node.js installed
- MongoDB running and accessible
- Environment variables configured (see `.env.example`)

### Running the Tests

#### Option 1: Run Backend and Tests Separately

```bash
# Terminal 1: Start the backend server
cd backend
npm install
npm start

# Terminal 2: Run the test suite
cd backend
node api-tests.js
```

#### Option 2: Run Both Concurrently

```bash
# From project root
npm install
npm start  # This runs both backend and frontend concurrently
```

Then in another terminal:
```bash
cd backend
sleep 2  # Wait for server to start
node api-tests.js
```

---

## Test Output Explanation

### Successful Test Output
```
============================================================
🧪 API TEST SUITE - Betting on the Races
============================================================

✅ PASS: Create User - POST /api/users
✅ PASS: Get User by ID - GET /api/users/:id
...

============================================================
📊 TEST RESULTS
============================================================
✅ Passed: 21
❌ Failed: 0
📈 Total: 21
📊 Success Rate: 100.00%
============================================================
```

### What Each Test Verifies

#### User Tests
- **Create User:** Validates user creation with proper validation
- **Get User by ID:** Retrieves user using MongoDB object ID
- **Get User by Username:** Retrieves user using username lookup
- **Get All Users:** Lists all users for a team
- **Update User by Username:** Updates user profile via username
- **Update User by ID:** Updates user profile via MongoDB ID
- **Add Money:** Adds funds to user wallet
- **Lose Money:** Deducts funds with validation

#### Driver Tests
- **Create Driver:** Creates driver entries
- **Get Driver by ID:** Retrieves driver by MongoDB ID
- **Get All Drivers:** Lists all drivers
- **Update Driver:** Updates driver properties

#### Admin Tests
- **Create Admin User:** Creates admin account
- **Get Active Users (Admin):** Lists users by status

#### Integration Tests
- **Legacy Endpoint:** Tests backwards compatibility
- **Error Handling:** Validates proper error responses
- **Missing Fields:** Confirms validation works
- **Insufficient Funds:** Tests business logic
- **User Not Found:** Tests 404 handling

---

## Troubleshooting

### Tests Fail with "fetch failed"
**Solution:** Ensure MongoDB is running and the backend server started successfully.

```bash
# Check MongoDB
mongosh  # or mongo

# Check Node process
ps aux | grep "node server.js"
```

### Connection Refused Error
**Solution:** Backend server is not running. Start it with:
```bash
cd backend && npm start
```

### Port Already in Use
**Solution:** The port 5001 is already in use. Change it:
```bash
PORT=5002 npm start
```

### MongoDB Connection Error
**Solution:** Check MongoDB connection string in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/racing_betting
```

---

## Test Data

The test suite creates temporary test data during execution:
- Test usernames: `testuser_[timestamp]`
- Test admin: `admin_[timestamp]`
- Test driver: Automatically generated

All test data is cleaned up after tests complete (via delete operations).

---

## API Endpoints Quick Reference

### Users
- `POST /api/users` - Create user
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/username/:username` - Get user by username
- `PUT /api/users/:id` - Update user by ID
- `PUT /api/users/username/:username` - Update user by username
- `DELETE /api/users/:id` - Delete user by ID
- `DELETE /api/users/username/:username` - Delete user by username

### Drivers
- `POST /api/drivers` - Create drivers
- `GET /api/drivers` - List all drivers
- `GET /api/drivers/:id` - Get driver by ID
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

### Money Operations
- `POST /api/add-money/:username` - Add funds to wallet
- `POST /api/lose-money/:username` - Deduct funds from wallet

### Admin
- `POST /api/admin/suspend/:userId` - Suspend user account
- `POST /api/admin/delete/:userId` - Delete user account
- `GET /api/admin/users/active` - Get user statistics

### Legacy
- `GET /get/all` - Get all drivers and users (backwards compatibility)

---

## Adding New Tests

To add a new test, create a class extending `APITest`:

```javascript
class MyNewTest extends APITest {
  constructor() {
    super('Test Name - ENDPOINT DESCRIPTION');
  }

  async test() {
    const { data } = await this.fetch(`${BASE_URL}/api/endpoint`, {
      method: 'POST',
      body: {
        field: 'value'
      }
    });

    if (!data.success) {
      throw new Error('Test failed: Expected success');
    }
  }
}
```

Then add it to the `testClasses` array in `runAllTests()`.

---

## Continuous Integration

To run tests in CI/CD pipeline:

```bash
#!/bin/bash
cd backend
npm install
npm start &
SERVER_PID=$!
sleep 3
node api-tests.js
TEST_RESULT=$?
kill $SERVER_PID
exit $TEST_RESULT
```

---

## Performance Metrics

Expected test execution time: **5-10 seconds**

If tests take significantly longer, check:
- MongoDB performance
- Network connectivity
- Server resource availability

---

## Support

For issues or questions about the tests:
1. Check the `API_VERIFICATION_REPORT.md` for detailed results
2. Review individual test error messages
3. Verify all prerequisites are met
4. Check MongoDB connection and data
