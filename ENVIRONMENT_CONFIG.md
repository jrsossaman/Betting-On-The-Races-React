# Environment Configuration Summary

## What Changed

All hardcoded API URLs have been converted to use environment variables. This allows the app to work seamlessly in both development (local backend) and production (Heroku backend).

## Files Updated

### Configuration Files
- ✅ `.env.local` - Development environment (localhost:5001)
- ✅ `.env.example` - Template for setup
- ✅ `backend/Procfile` - Heroku deployment configuration

### Frontend API Files (src/api/)
- ✅ `add_money.jsx`
- ✅ `check_for_duplicates.jsx`
- ✅ `create_user.jsx`
- ✅ `delete_user.jsx`
- ✅ `get_all_users_admin.jsx`
- ✅ `get_user.jsx`
- ✅ `lose_money.jsx`
- ✅ `update_user.jsx`

### Components (src/components/)
- ✅ `account_management.jsx`
- ✅ `run_race.jsx`

### Context (src/context/)
- ✅ `race_betting_context.jsx` - Added API_URL constant

## How It Works

### Development (Local Testing)
```javascript
// Uses REACT_APP_API_URL from .env.local
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";
fetch(`${apiUrl}/api/users`)
```

### Production (GitHub Pages + Heroku)
```javascript
// Uses REACT_APP_API_URL from .env.production.local
// Automatically set during npm run build
const apiUrl = "https://your-app-name.herokuapp.com"
fetch(`${apiUrl}/api/users`)
```

## Environment Variables

### Local Development
`.env.local`:
```
REACT_APP_API_URL=http://localhost:5001
```

### Production
`.env.production.local`:
```
REACT_APP_API_URL=https://your-app-name.herokuapp.com
```

**Note:** Create `.env.production.local` AFTER you deploy to Heroku and know your app URL.

## Workflow for Production

1. **Deploy backend to Heroku**
   ```bash
   cd backend
   heroku create your-app-name
   heroku config:set MONGODB_URI="your-mongodb-atlas-url"
   git push heroku main
   ```

2. **Get your Heroku URL**
   - Will be something like: `https://your-app-name.herokuapp.com`

3. **Update production environment file**
   ```bash
   echo 'REACT_APP_API_URL=https://your-app-name.herokuapp.com' > .env.production.local
   ```

4. **Build and deploy frontend**
   ```bash
   npm run build
   npm run deploy
   ```

## Testing

### Verify Development Setup
```bash
# Backend running on localhost:5001
curl http://localhost:5001/api/drivers

# Frontend running on localhost:3000
npm start
# Should connect to localhost:5001
```

### Verify Production Setup
```bash
# Test backend endpoint
curl https://your-app-name.herokuapp.com/api/drivers

# Visit GitHub Pages URL
# Should connect to Heroku backend
```

## Fallback Behavior

If `REACT_APP_API_URL` is not set, all API calls default to `http://localhost:5001`:
```javascript
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";
```

This ensures the app never breaks if environment variables aren't configured.

## Important Notes

- ⚠️ `.env.local` and `.env.production.local` are in `.gitignore` - never committed
- ✅ `.env.example` shows the format for reference
- ✅ React automatically picks the correct env file based on build mode
- ✅ Changes to env variables require rebuild: `npm run build`

## Next Steps

1. Read `HEROKU_DEPLOYMENT_GUIDE.md` for complete deployment instructions
2. Set up MongoDB Atlas account
3. Deploy backend to Heroku
4. Create `.env.production.local` with your Heroku URL
5. Deploy frontend to GitHub Pages

## FAQ

**Q: Do I need to change anything locally?**
A: No! `.env.local` is already set to `http://localhost:5001`. Just run `npm start`.

**Q: What if I forget `.env.production.local`?**
A: The app will default to `localhost:5001`, which won't work from GitHub Pages.

**Q: Can I test production locally?**
A: Yes! Update `.env.local` to your Heroku URL and restart the dev server.

**Q: How do environment variables get into the build?**
A: React's build process reads `.env.production.local` when you run `npm run build`.
