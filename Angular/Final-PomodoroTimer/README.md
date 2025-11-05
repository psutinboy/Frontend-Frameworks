# Pomodoro Timer Application

A full-stack productivity application built with Angular and Node.js that helps you manage your time using the Pomodoro Technique.

## Features

### Timer Component
- 25-minute work sessions
- 5-minute short breaks
- 15-minute long breaks
- Circular progress bar visualization
- Start, pause, reset, and skip functionality
- Audio notification when timer completes
- Auto-transition between work and break modes
- Select active task during work sessions

### Task Management
- Add, edit, and delete tasks
- Mark tasks as complete
- Assign estimated pomodoros to each task
- Track completed pomodoros per task
- Filter views: All, Active, Completed
- Progress bars showing task completion

### Productivity Statistics
- Daily pomodoro completion chart (last 7 days)
- Weekly pomodoro trend chart (last 4 weeks)
- Hourly productivity heatmap (24 hours)
- Total focus time tracked
- Task completion rate percentage
- Consecutive day streak counter
- Most productive hour display

### Authentication
- User registration with name, email, and password
- Secure login with JWT tokens
- Protected routes with auth guard
- Session persistence

## Tech Stack

### Frontend
- **Framework**: Angular 20.3.0
- **Language**: TypeScript 5.9.2
- **Routing**: Angular Router with Guards
- **HTTP Client**: Angular HttpClient with Interceptors
- **State Management**: Angular Signals
- **Charts**: Chart.js 4.4.0
- **Styling**: Custom CSS with modern design

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose 8.0.0
- **Authentication**: JWT (jsonwebtoken 9.0.2) & bcrypt (bcryptjs 2.4.3)
- **Security**: CORS enabled

## Project Structure

```
Final-PomodoroTimer/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Task.ts
│   │   │   └── PomodoroSession.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── task.routes.ts
│   │   │   └── pomodoro.routes.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── dashboard/
│   │   │   ├── header/
│   │   │   ├── timer/
│   │   │   ├── task-list/
│   │   │   └── stats-dashboard/
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── task.model.ts
│   │   │   ├── pomodoro-session.model.ts
│   │   │   └── stats.model.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── task.service.ts
│   │   │   ├── pomodoro.service.ts
│   │   │   ├── stats.service.ts
│   │   │   └── http-interceptor.service.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── styles.css
└── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or remote instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/pomodoro-timer
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3000
```

4. Start MongoDB (if running locally):
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

5. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Or build and run production
npm run build
npm start
```

The backend API will be running on `http://localhost:3000`

### Frontend Setup

1. Navigate to the project root directory:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Start the Angular development server:
```bash
npm start
# or
ng serve
```

The application will be running on `http://localhost:4200`

## Usage

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in with your credentials at `/login`
3. **Dashboard**: Access the main dashboard with three sections:
   - **Timer**: Start pomodoro sessions and track your work
   - **Tasks**: Manage your task list and track progress
   - **Statistics**: View your productivity metrics and charts

### Pomodoro Workflow

1. Create tasks in the Task Management section
2. Select a task from the timer dropdown (optional)
3. Click "Start" to begin a 25-minute work session
4. Work until the timer completes and plays a notification sound
5. Take a 5-minute break (or 15-minute break after 4 work sessions)
6. Repeat the cycle

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks (Protected)
- `GET /api/tasks?filter=all|active|completed` - Get tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/complete` - Toggle completion
- `PATCH /api/tasks/:id/pomodoro` - Increment pomodoro count

### Pomodoro Sessions (Protected)
- `POST /api/pomodoros` - Create completed session
- `GET /api/pomodoros/stats` - Get productivity statistics

## Development

### Frontend Development
```bash
npm start          # Start dev server
npm run build      # Production build
npm test           # Run tests
```

### Backend Development
```bash
npm run dev        # Start with auto-reload
npm run build      # Compile TypeScript
npm start          # Run compiled code
```

## Environment Variables

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3000)

### Frontend (environment.ts)
- `apiUrl` - Backend API URL (default: http://localhost:3000/api)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is a learning project. Feel free to fork and modify as needed!

## License

MIT

## Author

Built as part of Frontend Frameworks learning project
