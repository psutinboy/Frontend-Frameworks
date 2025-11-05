import express, { Response } from 'express';
import Task from '../models/Task';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Apply auth middleware to all task routes
router.use(authMiddleware);

// Get all tasks for user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { filter } = req.query; // all, active, or completed
    const userId = req.userId;

    let query: any = { userId };

    if (filter === 'active') {
      query.isCompleted = false;
    } else if (filter === 'completed') {
      query.isCompleted = true;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server error fetching tasks' });
  }
});

// Create new task
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, estimatedPomodoros } = req.body;
    const userId = req.userId;

    if (!title) {
      res.status(400).json({ error: 'Task title is required' });
      return;
    }

    const task = new Task({
      userId,
      title,
      description,
      estimatedPomodoros: estimatedPomodoros || 1
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Server error creating task' });
  }
});

// Update task
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, estimatedPomodoros } = req.body;
    const userId = req.userId;

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (estimatedPomodoros) task.estimatedPomodoros = estimatedPomodoros;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Server error updating task' });
  }
});

// Delete task
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await Task.findOneAndDelete({ _id: id, userId });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Server error deleting task' });
  }
});

// Toggle task completion
router.patch('/:id/complete', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    task.isCompleted = !task.isCompleted;
    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({ error: 'Server error toggling task' });
  }
});

// Increment completed pomodoros
router.patch('/:id/pomodoro', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    task.completedPomodoros += 1;
    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Increment pomodoro error:', error);
    res.status(500).json({ error: 'Server error incrementing pomodoro' });
  }
});

export default router;

