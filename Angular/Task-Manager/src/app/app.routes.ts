import { Routes } from '@angular/router';
import { Dashboard } from './task-features/dashboard/dashboard';
import { Profile } from './task-features/profile/profile';
import { TasksComponent } from './task-features/tasks/tasks';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'tasks', component: TasksComponent },
  { path: 'profile', component: Profile },
];
