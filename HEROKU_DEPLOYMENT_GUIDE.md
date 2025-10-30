# Heroku Deployment Guide

## Overview
This guide walks you through deploying the Betting on the Races backend to Heroku and configuring the frontend to use the production backend.

## Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed (`brew install heroku` on macOS)
- Git repository initialized

## Step 1: Prepare Your Backend for Deployment

Your backend is already configured for Heroku! Here's what's in place:

### Procfile
Located at `backend/Procfile`:
```
web: node server.js
```
This tells Heroku how to start your server.

### Environment Variables
The `backend/.env` file uses environment variables:
- `PORT` - Automatically set by Heroku
- `MONGODB_URI` - Database connection string
- `NODE_ENV` - Set to "production"

## Step 2: Set Up MongoDB Atlas (Cloud Database)

Since Heroku can't use local MongoDB, use MongoDB Atlas:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Add connection IP (allow 0.0.0.0 for anywhere)
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/racing_betting?retryWrites=true&w=majority
   ```

## Step 3: Deploy Backend to Heroku

### 1. Login to Heroku
```bash
heroku login
```

### 2. Create Heroku App
```bash
cd backend
heroku create your-app-name  # Replace with your desired app name
```

This creates an app like: `https://your-app-name.herokuapp.com`

### 3. Set Environment Variables
```bash
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/racing_betting?retryWrites=true&w=majority"
heroku config:set NODE_ENV="production"
```

### 4. Deploy
```bash
git push heroku main  # or develop if that's your branch
```

To check logs:
```bash
heroku logs --tail
```

## Step 4: Configure Frontend for Production

### 1. Create Production Environment File
Create `.env.production.local` in the root directory:
```
REACT_APP_API_URL=https://your-app-name.herokuapp.com
```

### 2. Build and Deploy to GitHub Pages
```bash
npm run build
npm run deploy
```

## Step 5: Verify Setup

Test your deployment:

### Test Backend Directly
```bash
curl https://your-app-name.herokuapp.com/api/drivers
```

### Test Frontend
Visit: `https://jrsossaman.github.io/Betting-On-The-Races-React`

## Environment Variable Configuration

### Development (.env.local)
```
REACT_APP_API_URL=http://localhost:5001
```

### Production (.env.production.local)
```
REACT_APP_API_URL=https://your-app-name.herokuapp.com
```

React automatically uses the correct environment file based on the build mode.

## Troubleshooting

### Backend not deploying
- Check `Procfile` exists in backend folder
- Verify `.gitignore` doesn't exclude `package.json`
- Check `node_modules` is in `.gitignore`

### API calls failing
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS is enabled in backend (`cors` package)
- Verify MongoDB connection string is correct

### Session/Wallet not saving
- Ensure MongoDB Atlas connection is working
- Check user exists in MongoDB
- Verify wallet endpoint responds correctly

### Permission Errors
- Ensure admin flag is set correctly
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0)

## Manual Database Seeding

To seed the admin account on Heroku:

```bash
# From your local machine, in the backend folder:
mongo "mongodb+srv://username:password@cluster.mongodb.net/racing_betting" < seed-admin.js
```

Or use MongoDB Atlas UI to create the admin user directly.

## Continuous Deployment

To automatically deploy on git push:

```bash
heroku git:remote -a your-app-name
# Then: git push heroku main
```

## Monitoring

Check your app status:
```bash
heroku open                  # Open in browser
heroku logs -t               # Tail logs
heroku config               # View env variables
heroku releases             # View deployment history
```

## Free Tier Limitations

Heroku free tier has:
- Server sleeps after 30 minutes of inactivity
- Limited to 550 hours/month
- No guaranteed uptime

For production, upgrade to paid dyno ($7/month).

## Next Steps

1. Deploy backend to Heroku
2. Update MongoDB connection string
3. Create `.env.production.local` with Heroku URL
4. Build and deploy frontend to GitHub Pages
5. Test complete flow end-to-end

## Support

- Heroku Docs: https://devcenter.heroku.com/
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
