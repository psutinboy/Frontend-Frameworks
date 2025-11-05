import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { TimerComponent } from '../timer/timer.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { StatsDashboardComponent } from '../stats-dashboard/stats-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    TimerComponent,
    TaskListComponent,
    StatsDashboardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {}

