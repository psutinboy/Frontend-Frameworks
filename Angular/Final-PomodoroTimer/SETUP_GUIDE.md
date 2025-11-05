# Quick Setup Guide

## Step-by-Step Installation

### 1. Install MongoDB

#### Windows
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Install MongoDB as a Windows Service
4. MongoDB will start automatically

#### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian)
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Verify MongoDB is Running

```bash
# Connect to MongoDB shell
mongosh

# You should see a connection message
# Type 'exit' to quit
```

### 3. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# The .env file should already exist, but verify it contains:
# MONGODB_URI=mongodb://localhost:27017/pomodoro-timer
# JWT_SECRET=pomodoro-jwt-secret-2024
# PORT=3000

# Start the backend server
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server is running on port 3000
```

### 4. Setup Frontend (New Terminal)

```bash
# Navigate to project root
cd ..

# Install dependencies (if not already done)
npm install

# Start Angular development server
npm start
```

Wait for compilation to complete. You should see:
```
Application bundle generation complete.
Watch mode enabled. Watching for file changes...
➜  Local:   http://localhost:4200/
```

### 5. Access the Application

1. Open your browser and go to `http://localhost:4200`
2. You'll be redirected to the login page
3. Click "Register here" to create a new account
4. Fill in:
   - Name: Your name
   - Email: your@email.com
   - Password: At least 6 characters
5. After registration, you'll be automatically logged in and redirected to the dashboard

### 6. Test the Application

1. **Create a Task**:
   - Click "+ Add Task" in the Tasks section
   - Enter task details
   - Set estimated pomodoros
   - Click "Add"

2. **Start Timer**:
   - Select your task from the dropdown
   - Click "Start" button
   - Watch the circular progress bar
   - Timer will notify when complete

3. **View Statistics**:
   - Complete a few pomodoro sessions
   - Scroll down to see your productivity charts
   - Click "Refresh" to update stats

## Troubleshooting

### MongoDB Connection Error

**Problem**: Backend shows "MongoDB connection error"

**Solutions**:
```bash
# Check if MongoDB is running
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl status mongod
sudo systemctl start mongod
```

### Port Already in Use

**Problem**: "Port 3000 is already in use" or "Port 4200 is already in use"

**Solutions**:
```bash
# For Backend (Port 3000)
# Windows: Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# For Frontend (Port 4200)
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:4200 | xargs kill -9

# Or change the port in backend/.env or use ng serve --port 4300
```

### Dependencies Installation Issues

**Problem**: npm install fails

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still issues, try using exact versions
npm ci
```

### Chart.js Not Displaying

**Problem**: Stats charts are not showing

**Solution**:
```bash
# Make sure chart.js is installed
npm install chart.js@^4.4.0

# Restart the dev server
# Press Ctrl+C and run npm start again
```

### API Connection Error

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Verify backend is running on port 3000
2. Check `src/environments/environment.ts`:
   ```typescript
   apiUrl: 'http://localhost:3000/api'
   ```
3. Check browser console for CORS errors
4. Verify no firewall blocking localhost connections

### Authentication Issues

**Problem**: Login fails or token not working

**Solutions**:
1. Clear browser localStorage:
   ```javascript
   // In browser console
   localStorage.clear()
   ```
2. Verify JWT_SECRET is set in backend/.env
3. Check backend logs for authentication errors
4. Try registering a new account

## Default Test Account

After setup, create your own account using the registration page. There are no default accounts for security reasons.

## Next Steps

Once everything is running:

1. Create 3-5 tasks
2. Complete at least 2 pomodoro sessions
3. Check the statistics dashboard
4. Experiment with different timer modes
5. Try filtering tasks (All, Active, Completed)

## Development Tips

### Hot Reload
- Frontend: Automatically reloads on file changes
- Backend: Using ts-node-dev, automatically restarts on changes

### Debugging
- Frontend: Use Chrome DevTools (F12)
- Backend: Check terminal logs or add console.log statements

### Database Inspection
```bash
# Connect to MongoDB
mongosh

# Switch to pomodoro database
use pomodoro-timer

# View collections
show collections

# View users
db.users.find().pretty()

# View tasks
db.tasks.find().pretty()

# View pomodoro sessions
db.pomodorosessions.find().pretty()
```

## Need Help?

Check the main README.md for detailed API documentation and feature descriptions.

