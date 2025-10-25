# Testing CRUD Operations

## Server Status
✅ Server is running on port 5001
✅ MongoDB connected successfully

## Quick Test Commands

You can test the CRUD operations using these curl commands in your terminal:

### 1. CREATE a new driver
```bash
curl -X POST http://localhost:5001/api/drivers?teamId=2 \
  -H "Content-Type: application/json" \
  -d '{
    "drivers": [
      {
        "number": 10,
        "name": "TestDriver",
        "status": true,
        "driveBonus": 4
      }
    ]
  }'
```

### 2. READ all drivers
```bash
curl http://localhost:5001/api/drivers?teamId=2
```

### 3. CREATE a new user
```bash
curl -X POST http://localhost:5001/api/users?teamId=2 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "name": "Test User",
    "wallet": 1500
  }'
```

### 4. READ all users
```bash
curl http://localhost:5001/api/users?teamId=2
```

### 5. UPDATE a driver (replace <driver_id> with actual ID from step 2)
```bash
curl -X PUT http://localhost:5001/api/drivers/<driver_id> \
  -H "Content-Type: application/json" \
  -d '{
    "driveBonus": 6
  }'
```

### 6. DELETE a driver (replace <driver_id> with actual ID)
```bash
curl -X DELETE http://localhost:5001/api/drivers/<driver_id>
```

## Using Postman or Thunder Client

If you prefer a GUI, you can use Postman or Thunder Client VS Code extension to test these endpoints.

### Thunder Client (Recommended for VS Code)
1. Install Thunder Client extension from VS Code marketplace
2. Create new requests for each CRUD operation
3. Use the examples above as reference

## Note
Remember to update your React frontend to use port 5001 instead of 5000 if you're making API calls from the frontend!
