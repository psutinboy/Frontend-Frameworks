import express, { Response } from 'express';
import PomodoroSession from '../models/PomodoroSession';
import Task from '../models/Task';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Helper function to format date in local timezone
function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Apply auth middleware to all pomodoro routes
router.use(authMiddleware);

// Create completed pomodoro session
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { taskId, type, duration, completedAt } = req.body;
    const userId = req.userId;

    if (!type || !duration) {
      res.status(400).json({ error: 'Type and duration are required' });
      return;
    }

    const sessionData: any = {
      userId,
      taskId: taskId || null,
      type,
      duration
    };

    // Allow custom completedAt for demo/seed data
    if (completedAt) {
      sessionData.completedAt = new Date(completedAt);
    }

    const session = new PomodoroSession(sessionData);

    await session.save();

    // If it's a work session and has a taskId, increment the task's completed pomodoros
    if (type === 'work' && taskId) {
      await Task.findByIdAndUpdate(taskId, { $inc: { completedPomodoros: 1 } });
    }

    res.status(201).json(session);
  } catch (error) {
    console.error('Create pomodoro session error:', error);
    res.status(500).json({ error: 'Server error creating pomodoro session' });
  }
});

// Get productivity statistics
router.get('/stats', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const now = new Date();

    // Get all work sessions for the user
    const workSessions = await PomodoroSession.find({
      userId,
      type: 'work'
    }).sort({ completedAt: -1 });

    // Calculate total focus time (in minutes)
    const totalFocusTime = workSessions.reduce((sum, session) => sum + session.duration, 0);

    // Get daily pomodoro counts for last 7 days
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyData: { [key: string]: number } = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = getLocalDateKey(date);
      dailyData[dateKey] = 0;
    }

    workSessions.forEach(session => {
      const dateKey = getLocalDateKey(session.completedAt);
      if (dailyData.hasOwnProperty(dateKey)) {
        dailyData[dateKey] += 1;
      }
    });

    // Get weekly pomodoro counts for last 4 weeks
    const fourWeeksAgo = new Date(now);
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const weeklyData: { [key: string]: number } = {};
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekKey = `Week ${4 - i}`;
      weeklyData[weekKey] = 0;
    }

    workSessions.forEach(session => {
      const daysDiff = Math.floor((now.getTime() - session.completedAt.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff < 28) {
        const weekIndex = Math.floor(daysDiff / 7);
        const weekKey = `Week ${4 - weekIndex}`;
        weeklyData[weekKey] += 1;
      }
    });

    // Get monthly pomodoro counts for last 6 months
    const monthlyData: { [key: string]: number } = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthlyData[monthKey] = 0;
    }

    workSessions.forEach(session => {
      const sessionDate = new Date(session.completedAt);
      const monthKey = `${monthNames[sessionDate.getMonth()]} ${sessionDate.getFullYear()}`;
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey] += 1;
      }
    });

    // Calculate most productive hours
    const hourlyData: { [key: number]: number } = {};
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = 0;
    }

    workSessions.forEach(session => {
      const hour = session.completedAt.getHours();
      hourlyData[hour] += 1;
    });

    // Find most productive hour
    let mostProductiveHour = 0;
    let maxCount = 0;
    Object.entries(hourlyData).forEach(([hour, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostProductiveHour = parseInt(hour);
      }
    });

    // Calculate task completion rate
    const tasks = await Task.find({ userId });
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    const taskCompletionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    // Calculate streak (consecutive days with at least one pomodoro)
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const nextDate = new Date(checkDate);
      nextDate.setDate(nextDate.getDate() + 1);

      const hasSession = workSessions.some(session => {
        const sessionDate = new Date(session.completedAt);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === checkDate.getTime();
      });

      if (hasSession) {
        streak++;
      } else if (i > 0) {
        // If we're past today and find a day without sessions, break
        break;
      }
    }

    res.json({
      totalFocusTime,
      dailyPomodoros: dailyData,
      weeklyPomodoros: weeklyData,
      monthlyPomodoros: monthlyData,
      hourlyProductivity: hourlyData,
      mostProductiveHour,
      taskCompletionRate,
      streak,
      totalPomodoros: workSessions.length
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error fetching statistics' });
  }
});

export default router;

