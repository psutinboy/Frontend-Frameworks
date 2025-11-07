import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreatePomodoroRequest, PomodoroType } from '../models/pomodoro-session.model';
import { TaskService } from './task.service';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {
  private readonly apiUrl = `${environment.apiUrl}/pomodoros`;
  
  // Timer durations in seconds
  private readonly WORK_DURATION = 25 * 60; // 25 minutes
  private readonly SHORT_BREAK_DURATION = 5 * 60; // 5 minutes
  private readonly LONG_BREAK_DURATION = 15 * 60; // 15 minutes
  private readonly LONG_BREAK_INTERVAL = 4; // After 4 work sessions

  // Timer state signals
  timeRemaining = signal<number>(this.WORK_DURATION);
  totalTime = signal<number>(this.WORK_DURATION);
  isRunning = signal<boolean>(false);
  currentMode = signal<PomodoroType>('work');
  selectedTaskId = signal<string | null>(null);
  workSessionsCompleted = signal<number>(0);

  private timerSubscription?: Subscription;
  private soundService = inject(SoundService);

  constructor(
    private http: HttpClient,
    private taskService: TaskService
  ) {}

  start(): void {
    if (this.isRunning()) return;

    this.isRunning.set(true);
    this.timerSubscription = interval(1000).subscribe(() => {
      const remaining = this.timeRemaining();
      if (remaining > 0) {
        this.timeRemaining.set(remaining - 1);
      } else {
        this.complete();
      }
    });
  }

  pause(): void {
    this.isRunning.set(false);
    this.timerSubscription?.unsubscribe();
  }

  reset(): void {
    this.pause();
    const duration = this.getDurationForMode(this.currentMode());
    this.timeRemaining.set(duration);
    this.totalTime.set(duration);
  }

  skip(): void {
    this.complete();
  }

  setMode(mode: PomodoroType): void {
    this.pause();
    this.currentMode.set(mode);
    const duration = this.getDurationForMode(mode);
    this.timeRemaining.set(duration);
    this.totalTime.set(duration);
  }

  setTask(taskId: string | null): void {
    this.selectedTaskId.set(taskId);
  }

  getProgress(): number {
    const total = this.totalTime();
    const remaining = this.timeRemaining();
    return total > 0 ? ((total - remaining) / total) * 100 : 0;
  }

  getFormattedTime(): string {
    const seconds = this.timeRemaining();
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private complete(): void {
    this.pause();
    this.playNotification();

    const currentMode = this.currentMode();
    const duration = Math.floor(this.getDurationForMode(currentMode) / 60); // Convert to minutes

    // Save session to backend
    this.createPomodoroSession({
      taskId: this.selectedTaskId() || undefined,
      type: currentMode,
      duration
    }).subscribe();

    // If work session completed, increment counter
    if (currentMode === 'work') {
      const completed = this.workSessionsCompleted() + 1;
      this.workSessionsCompleted.set(completed);

      // If task was selected, increment its pomodoro count
      const taskId = this.selectedTaskId();
      if (taskId) {
        this.taskService.incrementPomodoro(taskId).subscribe();
      }
    }

    // Auto-transition to next mode
    this.autoTransition();
  }

  private autoTransition(): void {
    const currentMode = this.currentMode();
    let nextMode: PomodoroType;

    if (currentMode === 'work') {
      const sessions = this.workSessionsCompleted();
      // After 4 work sessions, take a long break
      if (sessions % this.LONG_BREAK_INTERVAL === 0) {
        nextMode = 'longBreak';
      } else {
        nextMode = 'shortBreak';
      }
    } else {
      // After any break, go back to work
      nextMode = 'work';
    }

    this.setMode(nextMode);
  }

  private getDurationForMode(mode: PomodoroType): number {
    switch (mode) {
      case 'work':
        return this.WORK_DURATION;
      case 'shortBreak':
        return this.SHORT_BREAK_DURATION;
      case 'longBreak':
        return this.LONG_BREAK_DURATION;
    }
  }

  private playNotification(): void {
    this.soundService.playNotificationSound();
  }

  private createPomodoroSession(request: CreatePomodoroRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, request);
  }
}

