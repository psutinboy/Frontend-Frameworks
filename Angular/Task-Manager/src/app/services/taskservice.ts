import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Taskservice {

  // private writable signal for tasks
  //private tasks = signal<Task[]>([]);

  //public readonly signal for tasks
  //tasks = computed(() => this.tasks());

  // Computed signal
  //totalTasks = computed(() => this.tasks().length);


}
