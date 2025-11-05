export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  estimatedPomodoros: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  estimatedPomodoros?: number;
}

export type TaskFilter = 'all' | 'active' | 'completed';

