export type PomodoroType = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroSession {
  _id: string;
  userId: string;
  taskId?: string;
  type: PomodoroType;
  duration: number;
  completedAt: Date;
}

export interface CreatePomodoroRequest {
  taskId?: string;
  type: PomodoroType;
  duration: number;
}

