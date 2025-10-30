# Admin System Data Flow & Architecture Diagram

## System Architecture Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                         React Frontend                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────┐         ┌──────────────────────────┐ │
│  │   User Navigation        │         │   Admin Navigation      │ │
│  │  (Always Visible)        │         │  (Visible if isAdmin)   │ │
│  │                          │         │                          │ │
│  │  • Account              │         │  • 👑 Admin Panel       │ │
│  │  • Racing               │         │  • Account              │ │
│  │  • Logout               │         │  • Racing               │ │
│  └──────────────────────────┘         │  • Logout               │ │
│                                       └──────────────────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │             Admin Panel Component (admin_panel.jsx)            ││
│  │                                                                ││
│  │  ┌─────────────────┬──────────────────┬──────────────────┐   ││
│  │  │   Active Users  │ Suspended Users  │  Deleted Users   │   ││
│  │  │  [Tab 1]        │   [Tab 2]        │   [Tab 3]        │   ││
│  │  └─────────────────┴──────────────────┴──────────────────┘   ││
│  │                                                                ││
│  │  User List:                                                   ││
│  │  ┌────────────────────────────────────────────────────────┐   ││
│  │  │ Avatar | Name | Wallet | Status | [Suspend] [Delete] │   ││
│  │  │ Avatar | Name | Wallet | Status | [Suspend] [Delete] │   ││
│  │  │ ...                                                    │   ││
│  │  └────────────────────────────────────────────────────────┘   ││
│  │                                                                ││
│  │  Confirmation Dialogs:                                        ││
│  │  ┌────────────────────────────────────────────────────────┐   ││
│  │  │ Confirm suspend/unsuspend/delete action              │   ││
│  │  │ [Confirm] [Cancel]                                   │   ││
│  │  └────────────────────────────────────────────────────────┘   ││
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │   Race Betting Context (race_betting_context.jsx)             ││
│  │                                                                ││
│  │   Methods:                                                    ││
│  │   • getAllUsers(adminId)                                     ││
│  │   • suspendUser(userId, adminId)                            ││
│  │   • unsuspendUser(userId, adminId)                          ││
│  │   • deleteUserPermanently(userId, adminId)                  ││
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└────────────────────┬───────────────────────────────────────────────┘
                     │ HTTP REST API
                     ↓
┌────────────────────────────────────────────────────────────────────┐
│                     Express Backend (Node.js)                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │        Authorization & Helper Functions                     │  │
│  │                                                              │  │
│  │  verifyAdmin(adminId) {                                    │  │
│  │    • Find user by ID                                       │  │
│  │    • Check isAdmin === true                                │  │
│  │    • Check accountStatus === 'active'                      │  │
│  │    • Return true/false                                     │  │
│  │  }                                                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │          Admin Endpoints (require authorization)             │  │
│  │                                                              │  │
│  │  POST /api/admin/suspend/:userId                           │  │
│  │    ├─ Parse adminId from body                              │  │
│  │    ├─ Call verifyAdmin(adminId)                            │  │
│  │    ├─ Find target user by ID                               │  │
│  │    ├─ Check target.isAdmin (prevent admin suspension)      │  │
│  │    ├─ Set accountStatus = 'suspended'                      │  │
│  │    ├─ Save to database                                     │  │
│  │    └─ Return success response                              │  │
│  │                                                              │  │
│  │  POST /api/admin/unsuspend/:userId                         │  │
│  │    ├─ Verify admin authorization                           │  │
│  │    ├─ Find target user                                     │  │
│  │    ├─ Set accountStatus = 'active'                         │  │
│  │    ├─ Save to database                                     │  │
│  │    └─ Return success response                              │  │
│  │                                                              │  │
│  │  POST /api/admin/delete/:userId                            │  │
│  │    ├─ Verify admin authorization                           │  │
│  │    ├─ Find target user                                     │  │
│  │    ├─ Check target.isAdmin (prevent admin deletion)        │  │
│  │    ├─ Set accountStatus = 'deleted'                        │  │
│  │    ├─ Save to database (soft delete)                       │  │
│  │    └─ Return success response                              │  │
│  │                                                              │  │
│  │  GET /api/admin/users/active?adminId=...&teamId=2         │  │
│  │    ├─ Verify admin authorization                           │  │
│  │    ├─ Find all users for team                              │  │
│  │    ├─ Categorize by accountStatus                          │  │
│  │    ├─ Group into: active, suspended, deleted              │  │
│  │    └─ Return categorized users                             │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │   Status-Aware User Endpoints (updated)                     │  │
│  │                                                              │  │
│  │  GET /api/users/username/:username                         │  │
│  │    ├─ Find user by username                                │  │
│  │    ├─ If accountStatus === 'suspended'                     │  │
│  │    │  └─ Return 403: "Account is suspended"                │  │
│  │    ├─ If accountStatus === 'deleted'                       │  │
│  │    │  └─ Return 404: "User not found"                      │  │
│  │    └─ If accountStatus === 'active'                        │  │
│  │       └─ Return user data                                  │  │
│  │                                                              │  │
│  │  GET /get/all (legacy endpoint)                            │  │
│  │    ├─ Get all drivers                                      │  │
│  │    ├─ Get only ACTIVE users (filter status)               │  │
│  │    └─ Return drivers + active users                        │  │
│  │                                                              │  │
│  │  DELETE /delete/user (legacy endpoint)                     │  │
│  │    ├─ Find user by username                                │  │
│  │    ├─ Set accountStatus = 'deleted' (soft delete)          │  │
│  │    ├─ Save to database                                     │  │
│  │    └─ Return deleted user                                  │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Existing Endpoints (unchanged - work with all users)       │  │
│  │                                                              │  │
│  │  POST /api/users           - Create user                    │  │
│  │  GET /api/users            - List all users                 │  │
│  │  GET /api/users/:id        - Get user by ID                 │  │
│  │  PUT /api/users/:id        - Update user                    │  │
│  │  DELETE /api/users/:id     - Delete user                    │  │
│  │                                                              │  │
│  │  (Similar for drivers)                                      │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└────────────────────┬───────────────────────────────────────────────┘
                     │ MongoDB Query/Update
                     ↓
┌────────────────────────────────────────────────────────────────────┐
│                      MongoDB Database                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  User Collection:                                                  │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ _id: ObjectId                                              │   │
│  │ teamId: 2                                                  │   │
│  │ username: "john_doe"                                       │   │
│  │ password: "hashed_password"                                │   │
│  │ name: "John Doe"                                           │   │
│  │ wallet: 1000                                               │   │
│  │ isAdmin: false                    [NEW FIELD]              │   │
│  │ accountStatus: "active"            [NEW FIELD]             │   │
│  │ createdAt: 2025-10-29T10:00:00Z   [EXISTING]              │   │
│  │ updatedAt: 2025-10-29T10:00:00Z   [EXISTING]              │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Admin User Example:                                               │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ _id: ObjectId                                              │   │
│  │ teamId: 2                                                  │   │
│  │ username: "admin"                                          │   │
│  │ password: "hashed_password"                                │   │
│  │ name: "Administrator"                                      │   │
│  │ wallet: 50000                                              │   │
│  │ isAdmin: true                     [ADMIN FLAG]             │   │
│  │ accountStatus: "active"           [ACTIVE STATUS]          │   │
│  │ createdAt: 2025-10-29T09:00:00Z                            │   │
│  │ updatedAt: 2025-10-29T09:00:00Z                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Suspended User Example:                                           │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ _id: ObjectId                                              │   │
│  │ username: "jane_smith"                                     │   │
│  │ ...                                                        │   │
│  │ accountStatus: "suspended"        [SUSPENDED STATUS]       │   │
│  │ ...                                                        │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Deleted User Example:                                             │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ _id: ObjectId                                              │   │
│  │ username: "old_user"                                       │   │
│  │ ...                                                        │   │
│  │ accountStatus: "deleted"          [DELETED STATUS]         │   │
│  │ ...                (ALL DATA PRESERVED - SOFT DELETE)      │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
```

---

## Admin Action Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Admin Clicks "Suspend"                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
         ┌─────────────────────────────────┐
         │  Confirmation Dialog Appears    │
         │  "Suspend user jane_smith?"     │
         │  [Confirm]  [Cancel]            │
         └──────────┬──────────┬───────────┘
                    │          │
         [Confirm]  │          │  [Cancel]
                    ↓          ↓
             ┌─────────┐   ┌───────┐
             │ Proceed │   │ Close │
             └────┬────┘   └───────┘
                  │
                  ↓
    ┌─────────────────────────────────┐
    │  Call suspendUser(userId,       │
    │         adminId)                │
    └──────────────┬──────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │  Frontend Sends HTTP Request:   │
    │  POST /api/admin/suspend/userId  │
    │  Body: { adminId: "..." }       │
    └──────────────┬───────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │  Backend Receives Request        │
    │  1. Extract adminId              │
    │  2. Extract userId               │
    └──────────────┬───────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │  Verify Admin Authorization      │
    │  • Find admin by ID              │
    │  • Check isAdmin === true        │
    │  • Check status === 'active'     │
    └────┬─────────────────────────────┘
         │
    ┌────┴──────────────┐
    │ Valid Admin?      │
    └────┬──────────────┘
         │
    ┌────┴──────────────────────────────┐
    │ NO ─→ Return 403 Unauthorized     │
    │ YES ─→ Continue                   │
    └─┬──────────────────────────────────┘
      │
      ↓
    ┌──────────────────────────────────┐
    │  Find Target User                │
    │  • Query by userId               │
    └──────────────┬───────────────────┘
         ┌────────┴──────────┐
         │ User Found?       │
         └────┬──────────────┘
              │
         ┌────┴──────────────────────┐
         │ NO ─→ Return 404 Not Found│
         │ YES ─→ Continue           │
         └─┬─────────────────────────┘
           │
           ↓
         ┌──────────────────────────┐
         │  Check if Admin User     │
         │  • isAdmin === true?     │
         └──────────┬───────────────┘
                    │
           ┌────────┴─────────┐
           │ Is Admin?        │
           └────┬──────────────┘
                │
         ┌──────┴───────────────────────┐
         │ YES ─→ Return 400 Bad Request│
         │        Cannot suspend admin  │
         │ NO ─→ Continue               │
         └─┬────────────────────────────┘
           │
           ↓
         ┌──────────────────────────────┐
         │  Update User Status          │
         │  accountStatus = 'suspended' │
         └──────────────┬───────────────┘
                        │
                        ↓
         ┌──────────────────────────────┐
         │  Save to MongoDB             │
         │  user.save()                 │
         └──────────────┬───────────────┘
                        │
                        ↓
         ┌──────────────────────────────┐
         │  Return 200 Success          │
         │  Response with updated user  │
         └──────────────┬───────────────┘
                        │
                        ↓
    ┌─────────────────────────────────────┐
    │  Frontend Receives Response         │
    │  • Extract user data                │
    │  • Update local state               │
    │  • Reload user list                 │
    │  • Show success message             │
    └─────────────────────────────────────┘
```

---

## Login Flow with Status Check

```
┌─────────────────────────────────────────┐
│  User Enters Credentials & Clicks Login │
└──────────────────┬──────────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │  Frontend Calls getUser()         │
    │  with username & password        │
    └──────────────┬───────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │  Backend Endpoint Called:         │
    │  GET /api/users/username/username │
    └──────────────┬───────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────┐
    │  Find User by Username           │
    │  • Query database                │
    └──────────────┬───────────────────┘
         ┌────────┴─────────┐
         │ User Found?      │
         └────┬──────────────┘
              │
         ┌────┴──────────────────┐
         │ NO ─→ Return 404      │
         │ YES ─→ Continue       │
         └─┬──────────────────────┘
           │
           ↓
    ┌──────────────────────────────────┐
    │  Check Account Status            │
    └──────────────┬───────────────────┘
         ┌────────┴──────────┬──────────┐
         │                   │          │
    Status:  'suspended'   'deleted'  'active'
         │                   │          │
         ↓                   ↓          ↓
    Return 403         Return 404   Continue
    "Account is     "Account no    to verify
    suspended.      longer         password
    Contact         exists"
    support"
                                      │
                                      ↓
                              ┌──────────────────┐
                              │ Verify Password  │
                              │ match?           │
                              └────┬─────────────┘
                                   │
                           ┌───────┴────────┐
                           │ YES        NO  │
                           ↓                ↓
                    ┌──────────────┐  Return 401
                    │ Login Success│  "Incorrect
                    │              │   password"
                    │ Return user  │
                    │ data         │
                    └──────────────┘
```

---

## Database Record States

```
ACTIVE USER:
{
  _id: ObjectId("..."),
  username: "john_doe",
  name: "John Doe",
  wallet: 1000,
  isAdmin: false,
  accountStatus: "active",          ← Can login & access platform
  createdAt: "2025-10-29T...",
  updatedAt: "2025-10-29T..."
}

        ↓ Admin Clicks Suspend
        
SUSPENDED USER:
{
  _id: ObjectId("..."),
  username: "john_doe",
  name: "John Doe",
  wallet: 1000,              ← Preserved
  isAdmin: false,            ← Preserved
  accountStatus: "suspended", ← Changed - Cannot login
  createdAt: "2025-10-29T...", ← Original preserved
  updatedAt: "2025-10-29T..."  ← Updated
}

        ↓ Admin Clicks Unsuspend
        
ACTIVE USER AGAIN:
{
  _id: ObjectId("..."),
  username: "john_doe",
  name: "John Doe",
  wallet: 1000,
  isAdmin: false,
  accountStatus: "active",   ← Restored - Can login again
  createdAt: "2025-10-29T...",
  updatedAt: "2025-10-29T..."
}

        ↓ Admin Clicks Delete
        
DELETED USER:
{
  _id: ObjectId("..."),
  username: "john_doe",
  name: "John Doe",
  wallet: 1000,              ← All data preserved
  isAdmin: false,            ← All data preserved
  accountStatus: "deleted",  ← Changed - Hidden from queries
  createdAt: "2025-10-29T...", ← Original preserved
  updatedAt: "2025-10-29T..."  ← Updated
  
  NOTE: Data is NOT deleted from database
        Only marked as deleted (soft delete)
        Can be recovered if needed
}
```

This comprehensive system ensures:
✅ Data integrity through soft deletes
✅ Security through authorization checks
✅ API compatibility through status awareness
✅ User management through account states
✅ Admin control through privilege verification

