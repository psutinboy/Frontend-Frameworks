import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilter } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  // Signal for reactive task list
  tasks = signal<Task[]>([]);
  currentFilter = signal<TaskFilter>('all');

  constructor(private http: HttpClient) {}

  getTasks(filter: TaskFilter = 'all'): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?filter=${filter}`).pipe(
      tap(tasks => {
        this.tasks.set(tasks);
        this.currentFilter.set(filter);
      })
    );
  }

  createTask(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, request).pipe(
      tap(newTask => {
        this.tasks.update(tasks => [newTask, ...tasks]);
      })
    );
  }

  updateTask(id: string, request: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, request).pipe(
      tap(updatedTask => {
        this.tasks.update(tasks =>
          tasks.map(task => task._id === id ? updatedTask : task)
        );
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.tasks.update(tasks => tasks.filter(task => task._id !== id));
      })
    );
  }

  completeTask(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/complete`, {}).pipe(
      tap(updatedTask => {
        this.tasks.update(tasks =>
          tasks.map(task => task._id === id ? updatedTask : task)
        );
      })
    );
  }

  incrementPomodoro(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/pomodoro`, {}).pipe(
      tap(updatedTask => {
        this.tasks.update(tasks =>
          tasks.map(task => task._id === id ? updatedTask : task)
        );
      })
    );
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks().find(task => task._id === id);
  }
}

