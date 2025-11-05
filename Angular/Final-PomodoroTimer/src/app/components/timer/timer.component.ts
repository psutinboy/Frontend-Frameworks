import { Component, OnInit, OnDestroy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PomodoroService } from '../../services/pomodoro.service';
import { TaskService } from '../../services/task.service';
import { PomodoroType } from '../../models/pomodoro-session.model';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent implements OnInit, OnDestroy {
  public pomodoroService = inject(PomodoroService);
  public taskService = inject(TaskService);
  
  // Computed signals from services
  timeRemaining = this.pomodoroService.timeRemaining;
  isRunning = this.pomodoroService.isRunning;
  currentMode = this.pomodoroService.currentMode;
  selectedTaskId = this.pomodoroService.selectedTaskId;
  workSessionsCompleted = this.pomodoroService.workSessionsCompleted;
  tasks = this.taskService.tasks;

  // Computed values
  formattedTime = computed(() => this.pomodoroService.getFormattedTime());
  progress = computed(() => this.pomodoroService.getProgress());
  
  // Circle progress bar calculations
  radius = 120;
  circumference = 2 * Math.PI * this.radius;
  
  strokeDashoffset = computed(() => {
    const progress = this.progress();
    return this.circumference - (progress / 100) * this.circumference;
  });

  ngOnInit(): void {
    this.taskService.getTasks('active').subscribe();
  }

  ngOnDestroy(): void {
    this.pomodoroService.pause();
  }

  onStart(): void {
    this.pomodoroService.start();
  }

  onPause(): void {
    this.pomodoroService.pause();
  }

  onReset(): void {
    this.pomodoroService.reset();
  }

  onSkip(): void {
    this.pomodoroService.skip();
  }

  onModeChange(mode: PomodoroType): void {
    this.pomodoroService.setMode(mode);
  }

  onTaskChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const taskId = selectElement.value || null;
    this.pomodoroService.setTask(taskId);
  }

  getModeColor(): string {
    const mode = this.currentMode();
    switch (mode) {
      case 'work':
        return '#667eea';
      case 'shortBreak':
        return '#34d399';
      case 'longBreak':
        return '#f59e0b';
    }
  }

  getModeLabel(): string {
    const mode = this.currentMode();
    switch (mode) {
      case 'work':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  }
}

