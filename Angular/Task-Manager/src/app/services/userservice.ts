import { computed, Injectable, signal } from '@angular/core';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root',
})
export class Userservice {
  // Private writable signal
  private usersSignal = signal<User[]>([]);

  // Public read-only signal
  users = this.usersSignal.asReadonly();

  // Computed signals
  totalUsers = computed(() => this.users().length);

  constructor() {
    // Initialize with sample data
    this.loadSampleUsers();
  }

  // CRUD Operations
  addUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    const newUser: User = {
      ...user,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.usersSignal.update((users) => [...users, newUser]);
    return newUser;
  }

  updateUser(id: number, updates: Partial<User>) {
    this.usersSignal.update((users) =>
      users.map((user) => (user.id === id ? { ...user, ...updates, updatedAt: new Date() } : user))
    );
  }

  deleteUser(id: number) {
    this.usersSignal.update((users) => users.filter((u) => u.id !== id));
  }

  private loadSampleUsers() {
    const sampleUsers: User[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        createdAt: new Date(2025, 0, 1),
        updatedAt: new Date(2025, 0, 1),
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        createdAt: new Date(2025, 0, 5),
        updatedAt: new Date(2025, 0, 5),
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        createdAt: new Date(2025, 0, 10),
        updatedAt: new Date(2025, 0, 10),
      },
    ];

    this.usersSignal.set(sampleUsers);
  }
}

