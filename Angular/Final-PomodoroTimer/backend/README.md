# Pomodoro Timer Backend API

Backend API for the Pomodoro Timer application built with Node.js, Express, TypeScript, and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/pomodoro-timer
JWT_SECRET=your-secret-key
PORT=3000
```

3. Make sure MongoDB is running locally or update the MONGODB_URI to point to your MongoDB instance.

## Development

Run the development server with hot reload:
```bash
npm run dev
```

## Build

Compile TypeScript to JavaScript:
```bash
npm run build
```

## Production

Run the compiled JavaScript:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks (Protected)
- `GET /api/tasks?filter=all|active|completed` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/complete` - Toggle task completion
- `PATCH /api/tasks/:id/pomodoro` - Increment completed pomodoros

### Pomodoro Sessions (Protected)
- `POST /api/pomodoros` - Create completed pomodoro session
- `GET /api/pomodoros/stats` - Get productivity statistics

