# Local Development Setup

## Quick Start (Recommended)

### Just Run One Command!
```bash
npm start
```

That's it! This will automatically:
- Start the backend server on port 5001
- Start the frontend React app on port 3000
- Open your browser to `http://localhost:3000`
- Both run in the same terminal with color-coded output

## Alternative: Manual Control

If you need to run backend and frontend separately for debugging:

**Terminal 1 - Start Backend:**
```bash
npm run start:backend
```
You should see:
```
Server running on port 5001
MongoDB connected successfully
```

**Terminal 2 - Start Frontend:**
```bash
npm run start:frontend
```

## Production vs Development

### Local Development
- Backend: `http://localhost:5001` (configured in `.env.local`)
- Frontend: `http://localhost:3000` (React default)
- Both start automatically with `npm start`

### Production (GitHub Pages + Heroku)
- Backend: `https://your-app-name.herokuapp.com` (from `.env.production.local`)
- Frontend: `https://jrsossaman.github.io/Betting-On-The-Races-React`
- Deployed automatically via CI/CD

## Available Commands

```bash
# Start both backend and frontend (RECOMMENDED)
npm start

# Start only the backend
npm run start:backend

# Start only the frontend
npm run start:frontend

# Build production version
npm run build

# Deploy to GitHub Pages
npm run deploy

# Run tests
npm run test
```

## Stopping the Servers

Simply press `Ctrl+C` in the terminal to stop both servers.

## Troubleshooting

### "Port 5001 already in use"
```bash
# Kill process on port 5001
lsof -i :5001
kill -9 <PID>
```

### "Cannot connect to backend"
- Make sure you're running `npm start` (not `npm run start:frontend`)
- Check `.env.local` has `REACT_APP_API_URL=http://localhost:5001`
- Verify MongoDB is running locally

### "Cannot connect to MongoDB"
- If using local MongoDB, make sure it's running
- Check connection string in `backend/.env`
- If using MongoDB Atlas, verify connection string is correct

### Backend exits unexpectedly
- Check `backend/server.log` for error messages
- Verify Node.js is installed: `node --version`
- Verify npm is installed: `npm --version`

## Environment Variables

### `.env.local` (Development)
```
REACT_APP_API_URL=http://localhost:5001
```

### `.env.production.local` (Production)
```
REACT_APP_API_URL=https://your-app-name.herokuapp.com
```

## For Your Team

**Tell your team members to just run:**
```bash
npm install
npm start
```

That's all they need to do to get started! The backend and frontend will both start automatically.

## Next Steps

1. Run `npm start` to develop locally
2. Make changes and test (frontend auto-refreshes)
3. Commit to git when satisfied
4. Push to GitHub
5. Deploy to Heroku (backend) and GitHub Pages (frontend)
