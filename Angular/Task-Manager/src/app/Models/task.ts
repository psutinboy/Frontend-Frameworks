export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}
export type TaskPriority = Task['priority'];
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}
