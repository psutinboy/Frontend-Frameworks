import { Component, computed, inject, input, output, signal } from '@angular/core';

import { sign } from 'crypto';

import { CommonModule } from '@angular/common';
import { TaskFormComponent } from '../../task-form/task-form';
import { Taskservice } from '../../services/taskservice';
import { Task } from '../../Models/task';


@Component({
  selector: 'app-tasks',
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class TasksComponent {

  taskService = inject(Taskservice);
  showForm = signal(false);
  editingTask = signal<Task | null>(null);
  filter = signal<'all' | 'pending' | 'completed'>('all');

  filteredTasks = computed(() => {
    switch (this.filter()) {
      case 'pending': return this.taskService.pendingTasks();
      case 'completed': return this.taskService.completedTasks();
      default: return this.taskService.tasks();
    }
  });

  handleSaveTask(taskData: Partial<Task>) {
    const editing = this.editingTask();
    if (editing) {
      this.taskService.updateTask(editing.id, taskData);
    } else {
      this.taskService.addTask(taskData as any);
    }
    this.handleCancelForm();
  }

  handleCancelForm() {
    this.showForm.set(false);
    this.editingTask.set(null);
  }

  editTask(task: Task) {
    this.editingTask.set(task);
    this.showForm.set(true);
  }

  toggleTask(id: number) {
    this.taskService.toggleTask(id);
  }

  deleteTask(id: number) {
    if (confirm('Delete this task?')) {
      this.taskService.deleteTask(id);
    }
  }
}