
import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Task, TaskPriority } from '../Models/task';

function futureDateValidator() {
  return (control: any) => {
    if (!control.value) return null;
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate < today ? { pastDate: true } : null;
  };
}

@Component({
  selector: 'app-task-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskFormComponent {
  fb = inject(FormBuilder);
  
  // Signal inputs/outputs
  editTask = input<Task | null>(null);
  onSave = output<Partial<Task>>();
  onCancel = output<void>();
  
  // Form definition
  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    priority: ['medium' as TaskPriority, Validators.required],
    dueDate: ['', futureDateValidator()],
    tags: this.fb.array<string>([])
  });
  
  get tagsArray() {
    return this.taskForm.get('tags') as any;
  }
  
  constructor() {
    // Populate form if editing
    effect(() => {
      const task = this.editTask();
      if (task) {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate ? this.formatDate(task.dueDate) : ''
        });
        
        // Clear and repopulate tags
        this.tagsArray.clear();
        task.tags.forEach(tag => {
          this.tagsArray.push(this.fb.control(tag));
        });
      }
    });
  }
  
  addTag() {
    this.tagsArray.push(this.fb.control(''));
  }
  
  removeTag(index: number) {
    this.tagsArray.removeAt(index);
  }
  
  onSubmit() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const taskData: Partial<Task> = {
        title: formValue.title!,
        description: formValue.description!,
        priority: formValue.priority!,
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : null,
        tags: (formValue.tags || [])
  .filter((tag: unknown): tag is string => typeof tag === 'string' && tag.trim().length > 0),
        completed: false
      };
      
      this.onSave.emit(taskData);
      this.taskForm.reset();
    }
  }
  
  handleClose() {
    this.onCancel.emit();
    this.taskForm.reset();
  }
  
  private formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}