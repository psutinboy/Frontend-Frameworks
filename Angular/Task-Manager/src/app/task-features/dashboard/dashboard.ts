import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Taskservice } from '../../services/taskservice';
import { Userservice } from '../../services/userservice';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  taskService = inject(Taskservice);
  userService = inject(Userservice);
}