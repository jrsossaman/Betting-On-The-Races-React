# Admin Account System Implementation Guide

## Overview
This document outlines the complete implementation of an admin account system for the "Betting on the Races" application. The system allows administrators to manage user accounts through suspension, unsuspension, and deletion while maintaining full API functionality.

---

## Architecture & Design Decisions

### 1. **Account Status System**
Instead of hard-deleting users, the system uses a soft-delete approach with three status states:

- **`active`** - User can log in and access the platform normally
- **`suspended`** - User cannot log in; account is temporarily disabled (admin can unsuspend)
- **`deleted`** - User account is marked as permanently deleted (soft delete for data integrity)

**Benefits:**
- ✅ Preserves data integrity and historical records
- ✅ Allows recovery of suspended accounts
- ✅ Maintains referential integrity for race history and statistics
- ✅ Existing APIs continue to work without breaking

### 2. **Authorization Model**
All admin operations are protected by:
- `adminId` validation: Request must include an admin's user ID
- Role verification: Admin user must have `isAdmin: true` and `accountStatus: 'active'`
- Privilege checks: Admins cannot suspend/delete other admins

**Benefits:**
- ✅ Prevents unauthorized account modifications
- ✅ Protects admin accounts from accidental/malicious deletion
- ✅ Maintains audit trail via request verification

### 3. **API Endpoint Design**
New endpoints use RESTful conventions with clear intent:

```
POST   /api/admin/suspend/:userId     - Suspend a user
POST   /api/admin/unsuspend/:userId   - Restore a user
POST   /api/admin/delete/:userId      - Permanently mark as deleted
GET    /api/admin/users/active        - Get users by status
```

---

## Implementation Details

### Backend Changes

#### 1. **User Schema Updates** (`backend/models/User.js`)
```javascript
isAdmin: {
  type: Boolean,
  default: false,
  required: true,
}
accountStatus: {
  type: String,
  enum: ['active', 'suspended', 'deleted'],
  default: 'active',
  required: true,
}
```

#### 2. **Admin Endpoints** (`backend/server.js`)

**Helper Function:**
```javascript
const verifyAdmin = async (adminId) => {
  const admin = await User.findById(adminId);
  return admin && admin.isAdmin && admin.accountStatus === 'active';
};
```

**New Endpoints:**
- `POST /api/admin/suspend/:userId` - Suspend user account
- `POST /api/admin/unsuspend/:userId` - Unsuspend user account
- `POST /api/admin/delete/:userId` - Mark user as deleted
- `GET /api/admin/users/active?adminId=...` - Get users by status

#### 3. **Existing Endpoint Updates**

**User Lookup by Username:**
```javascript
app.get('/api/users/username/:username', async (req, res) => {
  // Returns 403 if user is suspended
  // Returns 404 if user is deleted
  // Returns user data if active
});
```

**Legacy Endpoints:**
- `/get/all` - Now only returns active users
- `/delete/user` - Now performs soft delete instead of hard delete

#### 4. **Admin Account Creation** (`backend/seed-admin.js`)
```bash
node backend/seed-admin.js
```
Creates initial admin user:
- Username: `admin`
- Password: `AdminPassword123!`
- Wallet: `$50,000`
- Status: `active`

### Frontend Changes

#### 1. **Context Updates** (`src/context/race_betting_context.jsx`)
New methods added:
```javascript
getAllUsers()                           // Fetch all users grouped by status
suspendUser(userId, adminId)           // Suspend user account
unsuspendUser(userId, adminId)         // Unsuspend user account
deleteUserPermanently(userId, adminId) // Mark user as deleted
```

#### 2. **Admin Panel Component** (`src/components/admin_panel.jsx`)
New component with three tabs:
- **Active Users** - List of active users with suspend button
- **Suspended Users** - List of suspended users with unsuspend/delete buttons
- **Deleted Users** - Archival view of deleted users

Features:
- Real-time user status updates
- Confirmation dialogs for destructive actions
- Success/error message feedback
- Loading states

#### 3. **Navigation Updates** (`src/app.jsx`)
- Added "Admin" button (only visible to admin users)
- Admin button conditionally renders admin panel
- Styling applied with `btn-admin` class

---

## API Workflow Examples

### Example 1: Suspending a User
**Frontend:**
```javascript
const adminId = user._id; // Current logged-in admin
const userId = targetUser._id;
await suspendUser(userId, adminId);
```

**Backend Request:**
```bash
POST /api/admin/suspend/65f1234567890abcdef12346
Content-Type: application/json

{
  "adminId": "65f1234567890abcdef12347"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User john_doe has been suspended",
  "data": {
    "username": "john_doe",
    "accountStatus": "suspended"
  }
}
```

**User Behavior:**
- Attempting login returns 403: "Account is suspended"
- User cannot access platform features
- Admin can unsuspend at any time

---

### Example 2: Deleting a User (Soft Delete)
**Frontend:**
```javascript
await deleteUserPermanently(userId, adminId);
```

**Backend:**
```bash
POST /api/admin/delete/65f1234567890abcdef12346
Content-Type: application/json

{
  "adminId": "65f1234567890abcdef12347"
}
```

**Data Preservation:**
- User record remains in database
- `accountStatus` set to `'deleted'`
- Historical race data preserved
- User lookups return 404

---

## Security Considerations

### ✅ Implemented Protections

1. **Admin Role Verification**
   - Every admin endpoint verifies `adminId`
   - Checks `isAdmin === true` and `accountStatus === 'active'`

2. **Privilege Escalation Prevention**
   - Admins cannot suspend/delete other admins
   - Returns 400 error if attempted

3. **Account Status Enforcement**
   - Suspended users receive 403 errors on login
   - Deleted users return 404 (data hidden)
   - Active-only queries exclude suspended/deleted users

4. **Data Integrity**
   - Soft deletes preserve historical data
   - Race history and statistics remain intact
   - Referential integrity maintained

### ⚠️ Security Best Practices

1. **Change Default Admin Password**
   - Immediately change `AdminPassword123!` after setup
   - Use strong password (12+ chars, mixed case, numbers, symbols)

2. **Limit Admin Accounts**
   - Create admin accounts only when necessary
   - Remove admin privileges from users who no longer need them

3. **Monitor Account Activity**
   - Review suspended/deleted accounts regularly
   - Log admin actions for audit trail

4. **Environment Variables**
   - Store `MONGODB_URI` securely
   - Never commit credentials to git

---

## Testing Guide

### Setup Admin Account
```bash
cd backend
node seed-admin.js
```

### Test Cases

**1. Create Normal User**
```bash
curl -X POST http://localhost:5000/api/users?teamId=2 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "name": "Test User"
  }'
```

**2. Login as Normal User** ✅ Should succeed
```javascript
// In frontend, try logging in with testuser credentials
```

**3. Admin Suspends User**
```bash
# Get admin ID and user ID first
curl -X POST http://localhost:5000/api/admin/suspend/<user_id> \
  -H "Content-Type: application/json" \
  -d '{"adminId": "<admin_id>"}'
```

**4. Login Suspended User** ❌ Should fail with 403
```javascript
// Attempt login with suspended user credentials
// Error: "Account is suspended. Please contact support."
```

**5. Admin Unsuspends User**
```bash
curl -X POST http://localhost:5000/api/admin/unsuspend/<user_id> \
  -H "Content-Type: application/json" \
  -d '{"adminId": "<admin_id>"}'
```

**6. Login Again** ✅ Should succeed

**7. Admin Deletes User**
```bash
curl -X POST http://localhost:5000/api/admin/delete/<user_id> \
  -H "Content-Type: application/json" \
  -d '{"adminId": "<admin_id>"}'
```

**8. Lookup Deleted User** ❌ Should return 404
```bash
curl http://localhost:5000/api/users/username/testuser
# Error: "Account no longer exists"
```

**9. Admin Panel Access**
- ✅ Admin user sees "👑 Admin" button
- ❌ Normal users don't see it
- ✅ Admin can view all user statuses
- ✅ Admin can perform actions

---

## API Backwards Compatibility

### ✅ Existing APIs Continue to Work

**For Active Users:**
- `GET /api/users` - Returns all users (filtered to active)
- `GET /api/users/:id` - Works as before
- `GET /api/users/username/:username` - Works as before
- `PUT /api/users/:id` - Works as before

**For Suspended/Deleted Users:**
- Automatically excluded from normal queries
- Admin endpoints provide access for management
- Legacy `/get/all` endpoint only returns active users
- Legacy `/delete/user` now soft-deletes

### No Breaking Changes
✅ Existing frontend code continues to function  
✅ Existing API calls work unchanged  
✅ Database migration is backward compatible  

---

## File Summary

### Backend Files
- **`backend/models/User.js`** - Updated schema with `isAdmin` and `accountStatus`
- **`backend/server.js`** - Added admin endpoints and status checks
- **`backend/seed-admin.js`** - Script to create initial admin account
- **`backend/API_DOCUMENTATION.md`** - Updated with admin endpoint docs

### Frontend Files
- **`src/context/race_betting_context.jsx`** - Added admin methods
- **`src/components/admin_panel.jsx`** - New admin management UI
- **`src/app.jsx`** - Updated navigation for admin access
- **`ADMIN_IMPLEMENTATION.md`** - This file

---

## Deployment Checklist

- [ ] Update `backend/models/User.js` with new schema fields
- [ ] Update `backend/server.js` with admin endpoints
- [ ] Create `backend/seed-admin.js` for admin account setup
- [ ] Run `node backend/seed-admin.js` to create initial admin
- [ ] Update `src/context/race_betting_context.jsx` with admin methods
- [ ] Create `src/components/admin_panel.jsx` component
- [ ] Update `src/app.jsx` navigation
- [ ] Update API documentation
- [ ] Test all admin workflows
- [ ] Change default admin password
- [ ] Deploy to production

---

## Troubleshooting

### Admin Endpoint Returns 403
**Problem:** "Unauthorized: Admin privileges required"
**Solution:** Verify `adminId` is correct and user has `isAdmin: true` and `accountStatus: 'active'`

### Cannot Suspend Admin User
**Problem:** "Cannot suspend other admin accounts"
**Solution:** This is intentional protection. Admins cannot be suspended by other admins.

### User Disappears After Deletion
**Problem:** User is not visible in user lists
**Solution:** User is soft-deleted (accountStatus = 'deleted'). Check admin panel's "Deleted" tab or query directly with MongoDB.

### Admin Button Not Showing
**Problem:** "👑 Admin" button missing in navigation
**Solution:** User must have `isAdmin: true`. Check user record in database. May need to create new admin with seed script.

---

## Future Enhancements

1. **Audit Logging** - Track all admin actions with timestamps
2. **Password Reset System** - Allow admins to reset user passwords
3. **Role-Based Access Control** - Support multiple admin levels
4. **Rate Limiting** - Prevent abuse of admin endpoints
5. **Email Notifications** - Notify users of account suspension
6. **Account Recovery** - Allow users to appeal suspensions
7. **Automatic Expiration** - Temporary bans that auto-lift

---

## Support & Questions

For issues or questions about the admin system:
1. Check this documentation
2. Review API_DOCUMENTATION.md
3. Check backend/server.js for endpoint logic
4. Verify MongoDB connection and user data
5. Check browser console for frontend errors

