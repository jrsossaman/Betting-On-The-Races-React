/**
 * API Test Suite for Betting on the Races
 * 
 * Tests all major API endpoints to ensure they work correctly
 * Run with: node api-tests.js
 */

const http = require('http');
const URL = require('url').URL;

const BASE_URL = 'http://localhost:5001';

// Test utilities
let passedTests = 0;
let failedTests = 0;
let testAdminId = null;
let testUserId = null;
let testDriverId = null;
let testUsername = `testuser_${Date.now()}`;
let testAdminUsername = `admin_${Date.now()}`;

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);

    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const req = http.request(urlObj, requestOptions, (res) => {
      let body = '';

      res.on('data', chunk => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          resolve({ status: res.statusCode, data });
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

class APITest {
  constructor(name) {
    this.name = name;
    this.passed = false;
    this.error = null;
  }

  async run() {
    try {
      await this.test();
      this.passed = true;
      console.log(`✅ PASS: ${this.name}`);
      passedTests++;
    } catch (error) {
      this.passed = false;
      this.error = error.message;
      console.log(`❌ FAIL: ${this.name}`);
      console.log(`   Error: ${error.message}`);
      failedTests++;
    }
  }

  async test() {
    throw new Error('test() must be implemented');
  }

  async fetch(url, options = {}) {
    const { status, data } = await makeRequest(url, options);

    if (status >= 400) {
      throw new Error(
        `HTTP ${status}: ${data.error || JSON.stringify(data)}`
      );
    }

    return { status, data };
  }
}

// ==================== USER TESTS ====================

class CreateUserTest extends APITest {
  constructor() {
    super('Create User - POST /api/users');
  }

  async test() {
    const { data } = await this.fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      body: {
        username: testUsername,
        password: 'testpass123',
        name: 'Test User',
        wallet: 1000,
      },
    });

    if (!data.success || !data.data._id) {
      throw new Error('User not created or missing _id');
    }

    testUserId = data.data._id;
  }
}

class GetUserByIdTest extends APITest {
  constructor() {
    super('Get User by ID - GET /api/users/:id');
  }

  async test() {
    if (!testUserId) throw new Error('testUserId not set');

    const { data } = await this.fetch(`${BASE_URL}/api/users/${testUserId}`);

    if (!data.success || data.data._id !== testUserId) {
      throw new Error('User data mismatch');
    }
  }
}

class GetUserByUsernameTest extends APITest {
  constructor() {
    super('Get User by Username - GET /api/users/username/:username');
  }

  async test() {
    const { data } = await this.fetch(
      `${BASE_URL}/api/users/username/${testUsername}`
    );

    if (!data.success || data.data.username !== testUsername) {
      throw new Error('Username mismatch');
    }
  }
}

class GetAllUsersTest extends APITest {
  constructor() {
    super('Get All Users - GET /api/users');
  }

  async test() {
    const { data } = await this.fetch(`${BASE_URL}/api/users`);

    if (!data.success || !Array.isArray(data.data)) {
      throw new Error('Users array not returned');
    }

    const userExists = data.data.some(u => u.username === testUsername);
    if (!userExists) {
      throw new Error('Test user not found in users list');
    }
  }
}

class UpdateUserByUsernameTest extends APITest {
  constructor() {
    super('Update User by Username - PUT /api/users/username/:username');
  }

  async test() {
    const { data } = await this.fetch(
      `${BASE_URL}/api/users/username/${testUsername}`,
      {
        method: 'PUT',
        body: {
          name: 'Updated Test User',
          wallet: 2000,
        },
      }
    );

    if (!data.success || data.data.wallet !== 2000) {
      throw new Error('User not updated correctly');
    }
  }
}

class UpdateUserByIdTest extends APITest {
  constructor() {
    super('Update User by ID - PUT /api/users/:id');
  }

  async test() {
    if (!testUserId) throw new Error('testUserId not set');

    const { data } = await this.fetch(`${BASE_URL}/api/users/${testUserId}`, {
      method: 'PUT',
      body: {
        name: 'Updated Test User v2',
      },
    });

    if (!data.success) {
      throw new Error('User not updated');
    }
  }
}

class AddMoneyTest extends APITest {
  constructor() {
    super('Add Money - POST /api/add-money/:username');
  }

  async test() {
    const { data } = await this.fetch(
      `${BASE_URL}/api/add-money/${testUsername}`,
      {
        method: 'POST',
        body: { amount: 500 },
      }
    );

    if (!data.success || data.data.wallet !== 2500) {
      throw new Error(`Wallet not updated correctly: ${data.data.wallet}`);
    }
  }
}

class LoseMoneyTest extends APITest {
  constructor() {
    super('Lose Money - POST /api/lose-money/:username');
  }

  async test() {
    const { data } = await this.fetch(
      `${BASE_URL}/api/lose-money/${testUsername}`,
      {
        method: 'POST',
        body: { amount: 300 },
      }
    );

    if (!data.success || data.data.wallet !== 2200) {
      throw new Error(`Wallet not reduced correctly: ${data.data.wallet}`);
    }
  }
}

// ==================== DRIVER TESTS ====================

class CreateDriverTest extends APITest {
  constructor() {
    super('Create Driver - POST /api/drivers');
  }

  async test() {
    const { data } = await this.fetch(`${BASE_URL}/api/drivers`, {
      method: 'POST',
      body: {
        drivers: [
          {
            number: 1,
            name: 'Test Driver',
            experience: 5,
            wins: 0,
            losses: 0,
          },
        ],
      },
    });

    if (!data.success || !data.data[0]._id) {
      throw new Error('Driver not created');
    }

    testDriverId = data.data[0]._id;
  }
}

class GetDriverByIdTest extends APITest {
  constructor() {
    super('Get Driver by ID - GET /api/drivers/:id');
  }

  async test() {
    if (!testDriverId) throw new Error('testDriverId not set');

    const { data } = await this.fetch(`${BASE_URL}/api/drivers/${testDriverId}`);

    if (!data.success || data.data._id !== testDriverId) {
      throw new Error('Driver data mismatch');
    }
  }
}

class GetAllDriversTest extends APITest {
  constructor() {
    super('Get All Drivers - GET /api/drivers');
  }

  async test() {
    const { data } = await this.fetch(`${BASE_URL}/api/drivers`);

    if (!data.success || !Array.isArray(data.data)) {
      throw new Error('Drivers array not returned');
    }

    const driverExists = data.data.some(d => d._id === testDriverId);
    if (!driverExists) {
      throw new Error('Test driver not found in drivers list');
    }
  }
}

class UpdateDriverTest extends APITest {
  constructor() {
    super('Update Driver - PUT /api/drivers/:id');
  }

  async test() {
    if (!testDriverId) throw new Error('testDriverId not set');

    const { data } = await this.fetch(`${BASE_URL}/api/drivers/${testDriverId}`, {
      method: 'PUT',
      body: {
        driveBonus: 5,
        status: false,
      },
    });

    if (!data.success) {
      throw new Error(`Update failed: ${JSON.stringify(data)}`);
    }
    
    if (data.data.driveBonus !== 5) {
      throw new Error(`Driver not updated correctly: driveBonus=${data.data.driveBonus}, expected 5`);
    }

    if (data.data.status !== false) {
      throw new Error(`Driver status not updated correctly: status=${data.data.status}, expected false`);
    }
  }
}

// ==================== ADMIN TESTS ====================

class CreateAdminTest extends APITest {
  constructor() {
    super('Create Admin User - POST /api/users (with admin privileges)');
  }

  async test() {
    const { data } = await this.fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      body: {
        username: testAdminUsername,
        password: 'adminpass123',
        name: 'Test Admin',
        wallet: 5000,
      },
    });

    if (!data.success || !data.data._id) {
      throw new Error('Admin user not created');
    }

    testAdminId = data.data._id;

    // Update to make user an admin
    const updateRes = await this.fetch(`${BASE_URL}/api/users/${testAdminId}`, {
      method: 'PUT',
      body: {
        isAdmin: true,
      },
    });

    if (!updateRes.data.success) {
      throw new Error('Failed to grant admin privileges');
    }
  }
}

class GetActiveUsersAdminTest extends APITest {
  constructor() {
    super('Get Active Users (Admin) - GET /api/admin/users/active');
  }

  async test() {
    if (!testAdminId) throw new Error('testAdminId not set');

    const { data } = await this.fetch(
      `${BASE_URL}/api/admin/users/active?adminId=${testAdminId}`
    );

    if (!data.success || !data.data.active) {
      throw new Error('Active users not returned');
    }
  }
}

// ==================== LEGACY ENDPOINT TESTS ====================

class GetAllLegacyTest extends APITest {
  constructor() {
    super('Legacy Get All - GET /get/all');
  }

  async test() {
    const { data } = await this.fetch(`${BASE_URL}/get/all`);

    if (!data.body || !Array.isArray(data.body.drivers) || !Array.isArray(data.body.users)) {
      throw new Error('Invalid response format for legacy endpoint');
    }
  }
}

// ==================== CLEANUP TESTS ====================

class DeleteUserByUsernameTest extends APITest {
  constructor() {
    super('Delete User by Username - DELETE /api/users/username/:username');
  }

  async test() {
    if (!testUsername) throw new Error('testUsername not set');

    const { data } = await this.fetch(
      `${BASE_URL}/api/users/username/${testUsername}`,
      {
        method: 'DELETE',
      }
    );

    if (!data.success) {
      throw new Error('User not deleted');
    }
  }
}

class DeleteUserByIdTest extends APITest {
  constructor() {
    super('Delete User by ID - DELETE /api/users/:id');
  }

  async test() {
    if (!testAdminId) throw new Error('testAdminId not set');

    const { data } = await this.fetch(`${BASE_URL}/api/users/${testAdminId}`, {
      method: 'DELETE',
    });

    if (!data.success) {
      throw new Error('User not deleted');
    }
  }
}

class DeleteDriverTest extends APITest {
  constructor() {
    super('Delete Driver - DELETE /api/drivers/:id');
  }

  async test() {
    if (!testDriverId) throw new Error('testDriverId not set');

    const { data } = await this.fetch(`${BASE_URL}/api/drivers/${testDriverId}`, {
      method: 'DELETE',
    });

    if (!data.success) {
      throw new Error('Driver not deleted');
    }
  }
}

// ==================== ERROR HANDLING TESTS ====================

class InvalidUserCreationTest extends APITest {
  constructor() {
    super('Error Handling - Missing Required Fields');
  }

  async test() {
    try {
      await this.fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        body: {
          username: 'testuser_nopass',
          // password is missing
        },
      });
      throw new Error('Should have returned 400 error');
    } catch (error) {
      if (!error.message.includes('400')) {
        throw error;
      }
    }
  }
}

class InsufficientFundsTest extends APITest {
  constructor() {
    super('Error Handling - Insufficient Funds for Lose Money');
  }

  async test() {
    // Create a user with small wallet
    const createRes = await this.fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      body: {
        username: `pooruser_${Date.now()}`,
        password: 'test',
        wallet: 10,
      },
    });

    const username = createRes.data.data.username;

    try {
      await this.fetch(`${BASE_URL}/api/lose-money/${username}`, {
        method: 'POST',
        body: { amount: 1000 },
      });
      throw new Error('Should have returned 400 error for insufficient funds');
    } catch (error) {
      if (!error.message.includes('400')) {
        throw error;
      }
    }
  }
}

class UserNotFoundTest extends APITest {
  constructor() {
    super('Error Handling - User Not Found');
  }

  async test() {
    try {
      await this.fetch(`${BASE_URL}/api/users/username/nonexistent_${Date.now()}`);
      throw new Error('Should have returned 404 error');
    } catch (error) {
      if (!error.message.includes('404')) {
        throw error;
      }
    }
  }
}

// ==================== TEST RUNNER ====================

async function runAllTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 API TEST SUITE - Betting on the Races');
  console.log('='.repeat(60) + '\n');

  const testClasses = [
    // User Tests
    CreateUserTest,
    GetUserByIdTest,
    GetUserByUsernameTest,
    GetAllUsersTest,
    UpdateUserByUsernameTest,
    UpdateUserByIdTest,
    AddMoneyTest,
    LoseMoneyTest,

    // Driver Tests
    CreateDriverTest,
    GetDriverByIdTest,
    GetAllDriversTest,
    UpdateDriverTest,

    // Admin Tests
    CreateAdminTest,
    GetActiveUsersAdminTest,

    // Legacy Tests
    GetAllLegacyTest,

    // Error Handling Tests
    InvalidUserCreationTest,
    InsufficientFundsTest,
    UserNotFoundTest,

    // Cleanup Tests
    DeleteUserByUsernameTest,
    DeleteUserByIdTest,
    DeleteDriverTest,
  ];

  for (const TestClass of testClasses) {
    const test = new TestClass();
    await test.run();
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Total: ${passedTests + failedTests}`);
  console.log(`📊 Success Rate: ${(passedTests / (passedTests + failedTests) * 100).toFixed(2)}%`);
  console.log('='.repeat(60) + '\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
