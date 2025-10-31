import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Task } from '../../Models/task';
import { Taskservice } from '../../services/taskservice';
@Component({
  selector: 'app-tasks',
  imports: [CommonModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class TasksComponent {
  taskService = inject(Taskservice);
  filter = signal<'all' | 'pending' | 'completed'>('all');
  showAddForm = signal(false);
  filteredTasks = computed(() => {
    switch (this.filter()) {
      case 'pending':
        return this.taskService.pendingTasks();
      case 'completed':
        return this.taskService.completedTasks();
      default:
        return this.taskService.tasks();
    }
  });
  toggleTask(id: number) {
    this.taskService.toggleTask(id);
  }
  editTask(task: Task) {
    console.log('Edit task:', task);
    // Will implement in forms module
  }
  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id);
    }
  }
}
