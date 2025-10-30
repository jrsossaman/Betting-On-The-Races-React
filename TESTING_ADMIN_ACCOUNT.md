# Testing Admin Account - Step by Step

## Prerequisites
Make sure you have:
1. ✅ Created the admin account: `node backend/seed-admin.js`
2. ✅ MongoDB running and connected
3. ✅ Backend server running on port 5000
4. ✅ React app running on port 3000

---

## Step 1: Start Backend Server

**Terminal 1:**
```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB connected successfully
Server running on port 5000
```

---

## Step 2: Start React App

**Terminal 2:**
```bash
npm start
```

The app will open at `http://localhost:3000`

---

## Step 3: Test Admin Login

### Test Case 1: Login as Admin
1. You'll see the login/signup form
2. Enter:
   - **Username:** `admin`
   - **Password:** `AdminPassword123!`
3. Click **Login**

**Expected Result:**
- ✅ Alert: "Welcome back, Administrator!"
- ✅ Form clears
- ✅ Navigation appears with "👑 Admin" button
- ✅ Regular "Account" and "Racing" buttons also visible

### Test Case 2: Access Admin Panel
1. Click the **"👑 Admin"** button in the navigation
2. You should see three tabs: Active, Suspended, Deleted

**Expected Result:**
- ✅ Admin panel loads
- ✅ Shows "Active Users" tab first
- ✅ May be empty if no other users exist (that's OK)

---

## Step 4: Create Test User (Optional)

To test suspension/deletion, you need a test user. Use cURL:

```bash
curl -X POST http://localhost:5000/api/users?teamId=2 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123",
    "name": "Test User"
  }'
```

---

## Step 5: Test Admin Functions

### Test Suspend User
1. In Admin Panel, click "Suspend" button on a user
2. Confirm the action
3. User should move to "Suspended" tab

### Test Unsuspend User
1. Go to "Suspended" tab
2. Click "Unsuspend" button
3. User should move back to "Active" tab

### Test Delete User
1. Click "Delete" button on any user
2. Confirm the action
3. User should move to "Deleted" tab

---

## Step 6: Test Suspended User Cannot Login

If you suspended a user:
1. Logout (click Logout button)
2. Try logging in with the suspended user's credentials
3. You should get error: "Account is suspended. Please contact support."

---

## Troubleshooting

### Issue: "Invalid username or password"
**Solution:**
- Check spelling of username: `admin`
- Check spelling of password: `AdminPassword123!`
- Make sure backend is running on port 5000
- Check MongoDB connection

### Issue: No "👑 Admin" button appears
**Solution:**
- Admin account wasn't created properly
- Run `node backend/seed-admin.js` again
- Make sure you logged in with `admin` account
- Check browser console for errors

### Issue: Admin panel is empty
**That's normal!** The user list will be empty until you create other users.

### Issue: Backend connection error
**Solution:**
- Check that backend server is running: `npm start` in backend folder
- Verify port 5000 is available
- Check MongoDB connection string in `.env`

---

## API Verification (Optional)

Test the admin endpoints directly with cURL:

### Get Admin User
```bash
curl http://localhost:5000/api/users/username/admin
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "admin",
    "name": "Administrator",
    "isAdmin": true,
    "accountStatus": "active",
    "wallet": 50000
  }
}
```

### Get All Active Users (as Admin)
```bash
curl "http://localhost:5000/api/admin/users/active?adminId=<admin_id>&teamId=2"
```

Replace `<admin_id>` with the admin's MongoDB ID from the response above.

---

## Success Checklist

- [ ] Backend running on port 5000
- [ ] React app running on port 3000
- [ ] Admin account created with `node backend/seed-admin.js`
- [ ] Can login with admin/AdminPassword123!
- [ ] "👑 Admin" button appears after login
- [ ] Admin panel loads with 3 tabs
- [ ] Can see user list (if users exist)
- [ ] Can create test user via API
- [ ] Can suspend/unsuspend users
- [ ] Can delete users
- [ ] Suspended users can't login
- [ ] All tests passing ✅

---

## Next Steps After Successful Test

1. **Change admin password** immediately
   - Use the Account Management panel
   - Set a strong, unique password

2. **Create more users**
   - Use the signup form or API
   - Test with multiple users

3. **Test all admin features**
   - Suspend various users
   - Unsuspend them
   - Delete accounts

4. **Review logs**
   - Check browser console
   - Check backend logs
   - Ensure no errors

5. **Prepare for production**
   - Follow deployment checklist
   - Set secure environment variables
   - Backup MongoDB

---

## Need Help?

See documentation files:
- **Quick Start:** ADMIN_QUICK_START.md
- **Detailed Guide:** ADMIN_IMPLEMENTATION.md
- **Architecture:** SYSTEM_ARCHITECTURE.md
- **API Reference:** backend/API_DOCUMENTATION.md

