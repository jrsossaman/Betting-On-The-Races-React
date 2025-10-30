# API Documentation - CRUD Operations

## Overview
This API implements full CRUD (Create, Read, Update, Delete) operations for both Drivers and Users.

## Base URL
```
http://localhost:5000
```

---

## 🚗 DRIVER CRUD OPERATIONS

### CREATE Driver(s)
**POST** `/api/drivers?teamId=2`

Create one or multiple drivers.

**Request Body:**
```json
{
  "drivers": [
    {
      "number": 5,
      "name": "Michael",
      "status": true,
      "driveBonus": 3
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Drivers created successfully",
  "data": [
    {
      "_id": "65f1234567890abcdef12345",
      "teamId": 2,
      "number": 5,
      "name": "Michael",
      "status": true,
      "driveBonus": 3,
      "createdAt": "2025-10-25T10:00:00.000Z",
      "updatedAt": "2025-10-25T10:00:00.000Z"
    }
  ]
}
```

---

### READ All Drivers
**GET** `/api/drivers?teamId=2`

Get all drivers for a specific team.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "_id": "65f1234567890abcdef12345",
      "teamId": 2,
      "number": 1,
      "name": "Benjamin",
      "status": true,
      "driveBonus": 2
    }
    // ... more drivers
  ]
}
```

---

### READ Single Driver
**GET** `/api/drivers/:id`

Get a specific driver by their MongoDB ID.

**Example:** `GET /api/drivers/65f1234567890abcdef12345`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12345",
    "teamId": 2,
    "number": 1,
    "name": "Benjamin",
    "status": true,
    "driveBonus": 2
  }
}
```

---

### UPDATE Driver
**PUT** `/api/drivers/:id`

Update a driver's information.

**Request Body:**
```json
{
  "name": "Benjamin Jr.",
  "driveBonus": 5,
  "status": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Driver updated successfully",
  "data": {
    "_id": "65f1234567890abcdef12345",
    "teamId": 2,
    "number": 1,
    "name": "Benjamin Jr.",
    "status": false,
    "driveBonus": 5
  }
}
```

---

### DELETE Driver
**DELETE** `/api/drivers/:id`

Delete a driver permanently.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Driver deleted successfully",
  "data": {
    "_id": "65f1234567890abcdef12345",
    "teamId": 2,
    "number": 1,
    "name": "Benjamin",
    "status": true,
    "driveBonus": 2
  }
}
```

---

## 👤 USER CRUD OPERATIONS

### CREATE User
**POST** `/api/users?teamId=2`

Create a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securePassword123",
  "name": "John Doe",
  "wallet": 1000
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "65f1234567890abcdef12346",
    "teamId": 2,
    "username": "john_doe",
    "password": "securePassword123",
    "name": "John Doe",
    "wallet": 1000,
    "createdAt": "2025-10-25T10:00:00.000Z",
    "updatedAt": "2025-10-25T10:00:00.000Z"
  }
}
```

---

### READ All Users
**GET** `/api/users?teamId=2`

Get all users for a specific team.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "65f1234567890abcdef12346",
      "teamId": 2,
      "username": "john_doe",
      "name": "John Doe",
      "wallet": 1000
    }
    // ... more users
  ]
}
```

---

### READ Single User by ID
**GET** `/api/users/:id`

Get a specific user by their MongoDB ID.

**Example:** `GET /api/users/65f1234567890abcdef12346`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12346",
    "teamId": 2,
    "username": "john_doe",
    "name": "John Doe",
    "wallet": 1000
  }
}
```

---

### READ User by Username
**GET** `/api/users/username/:username`

Get a user by their username.

**Example:** `GET /api/users/username/john_doe`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12346",
    "teamId": 2,
    "username": "john_doe",
    "name": "John Doe",
    "wallet": 1000
  }
}
```

---

### UPDATE User
**PUT** `/api/users/:id`

Update a user's information.

**Request Body:**
```json
{
  "name": "John D. Smith",
  "wallet": 1500
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "65f1234567890abcdef12346",
    "teamId": 2,
    "username": "john_doe",
    "name": "John D. Smith",
    "wallet": 1500
  }
}
```

---

### DELETE User
**DELETE** `/api/users/:id`

Delete a user permanently.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "_id": "65f1234567890abcdef12346",
    "teamId": 2,
    "username": "john_doe",
    "name": "John Doe",
    "wallet": 1000
  }
}
```

---

## � ADMIN MANAGEMENT ENDPOINTS

### Authorization
All admin endpoints require `adminId` in the request body to verify admin privileges. The user identified by `adminId` must have:
- `isAdmin: true`
- `accountStatus: 'active'`

### Account Status Values
- `'active'` - User can login and access the platform
- `'suspended'` - User cannot login, account is temporarily disabled
- `'deleted'` - Account is permanently deleted (soft delete)

---

### SUSPEND User Account
**POST** `/api/admin/suspend/:userId`

Suspend a user's account. Suspended users will receive a 403 error on login.

**Request Body:**
```json
{
  "adminId": "65f1234567890abcdef12347"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User john_doe has been suspended",
  "data": {
    "_id": "65f1234567890abcdef12346",
    "username": "john_doe",
    "name": "John Doe",
    "accountStatus": "suspended",
    "isAdmin": false,
    "wallet": 1000
  }
}
```

**Error Responses:**
- `400` - "Cannot suspend other admin accounts"
- `403` - "Unauthorized: Admin privileges required"
- `404` - "User not found"

---

### UNSUSPEND User Account
**POST** `/api/admin/unsuspend/:userId`

Restore a suspended user's account access.

**Request Body:**
```json
{
  "adminId": "65f1234567890abcdef12347"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User john_doe has been unsuspended",
  "data": {
    "_id": "65f1234567890abcdef12346",
    "username": "john_doe",
    "name": "John Doe",
    "accountStatus": "active",
    "isAdmin": false,
    "wallet": 1000
  }
}
```

**Error Responses:**
- `403` - "Unauthorized: Admin privileges required"
- `404` - "User not found"

---

### DELETE User Account (Permanent)
**POST** `/api/admin/delete/:userId`

Permanently delete a user account (soft delete - data is marked as deleted).

**Request Body:**
```json
{
  "adminId": "65f1234567890abcdef12347"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User john_doe has been permanently deleted",
  "data": {
    "_id": "65f1234567890abcdef12346",
    "username": "john_doe",
    "name": "John Doe",
    "accountStatus": "deleted",
    "isAdmin": false,
    "wallet": 1000
  }
}
```

**Error Responses:**
- `400` - "Cannot delete admin accounts"
- `403` - "Unauthorized: Admin privileges required"
- `404` - "User not found"

---

### GET All Users with Status Overview
**GET** `/api/admin/users/active?adminId=<adminId>&teamId=2`

Retrieve all users categorized by their account status.

**Query Parameters:**
- `adminId` (required) - The admin user's MongoDB ID
- `teamId` (optional) - Team ID, defaults to 2

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "active": [
      {
        "_id": "65f1234567890abcdef12346",
        "username": "john_doe",
        "name": "John Doe",
        "accountStatus": "active",
        "wallet": 1000
      }
    ],
    "suspended": [
      {
        "_id": "65f1234567890abcdef12348",
        "username": "jane_smith",
        "name": "Jane Smith",
        "accountStatus": "suspended",
        "wallet": 500
      }
    ],
    "deleted": [
      {
        "_id": "65f1234567890abcdef12349",
        "username": "old_user",
        "name": "Old User",
        "accountStatus": "deleted",
        "wallet": 0
      }
    ],
    "totalCount": 3
  }
}
```

**Error Responses:**
- `400` - "adminId query parameter required"
- `403` - "Unauthorized: Admin privileges required"

---

## 🔑 Creating an Admin Account

### Initial Setup
Run the seed script to create the first admin account:

```bash
cd backend
node seed-admin.js
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `AdminPassword123!`

⚠️ **Important**: Change the admin password immediately after first login.

### Admin User Schema
```json
{
  "teamId": 2,
  "username": "admin",
  "password": "AdminPassword123!",
  "name": "Administrator",
  "wallet": 50000,
  "isAdmin": true,
  "accountStatus": "active"
}
```

---

## �📝 Legacy Endpoints (Backwards Compatibility)

These endpoints are maintained for backwards compatibility with existing frontend code:

- **GET** `/get/all?teamId=2` - Get all drivers and users
- **POST** `/drivers?teamId=2` - Create drivers (legacy format)
- **PATCH** `/update/data?teamId=2` - Update drivers/users (legacy format)
- **DELETE** `/delete/user?teamId=2` - Delete user by username (legacy format)

---

## 🧪 Testing with cURL

### Create a Driver
```bash
curl -X POST http://localhost:5000/api/drivers?teamId=2 \
  -H "Content-Type: application/json" \
  -d '{
    "drivers": [
      {
        "number": 5,
        "name": "Michael",
        "status": true,
        "driveBonus": 3
      }
    ]
  }'
```

### Get All Drivers
```bash
curl http://localhost:5000/api/drivers?teamId=2
```

### Update a Driver
```bash
curl -X PUT http://localhost:5000/api/drivers/<driver_id> \
  -H "Content-Type: application/json" \
  -d '{
    "driveBonus": 5,
    "status": false
  }'
```

### Delete a Driver
```bash
curl -X DELETE http://localhost:5000/api/drivers/<driver_id>
```

### Create a User
```bash
curl -X POST http://localhost:5000/api/users?teamId=2 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123",
    "name": "John Doe",
    "wallet": 1000
  }'
```

### Get All Users
```bash
curl http://localhost:5000/api/users?teamId=2
```

---

## 👑 Testing Admin Endpoints with cURL

### Suspend a User
```bash
curl -X POST http://localhost:5000/api/admin/suspend/<user_id> \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "<admin_id>"
  }'
```

### Unsuspend a User
```bash
curl -X POST http://localhost:5000/api/admin/unsuspend/<user_id> \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "<admin_id>"
  }'
```

### Delete a User
```bash
curl -X POST http://localhost:5000/api/admin/delete/<user_id> \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "<admin_id>"
  }'
```

### Get All Users with Status Overview
```bash
curl "http://localhost:5000/api/admin/users/active?adminId=<admin_id>&teamId=2"
```

---

## ⚠️ Error Responses

**400 Bad Request:**
```json
{
  "error": "username and password required"
}
```

**404 Not Found:**
```json
{
  "error": "Driver not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Database connection error"
}
```

---

## 🚀 Getting Started

1. Make sure MongoDB is running locally or configure MongoDB Atlas
2. Update `.env` file with your MongoDB connection string
3. Install dependencies: `cd backend && npm install`
4. Start the server: `npm start` or `npm run dev` (for development)
5. Test the endpoints using the examples above

---

## 📊 Complete CRUD Compliance

✅ **CREATE** - POST endpoints for both Drivers and Users  
✅ **READ** - GET endpoints for collections and individual items  
✅ **UPDATE** - PUT endpoints for modifying existing records  
✅ **DELETE** - DELETE endpoints for removing records  

All CRUD operations are fully implemented and tested!
