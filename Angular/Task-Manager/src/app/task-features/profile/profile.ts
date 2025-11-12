import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from '../../user-form/user-form';
import { Userservice } from '../../services/userservice';
import { User } from '../../Models/user';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, UserFormComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  userService = inject(Userservice);
  showForm = signal(false);
  editingUser = signal<User | null>(null);

  handleSaveUser(userData: Partial<User>) {
    const editing = this.editingUser();
    if (editing) {
      this.userService.updateUser(editing.id, userData);
    } else {
      this.userService.addUser(userData as any);
    }
    this.handleCancelForm();
  }

  handleCancelForm() {
    this.showForm.set(false);
    this.editingUser.set(null);
  }

  editUser(user: User) {
    this.editingUser.set(user);
    this.showForm.set(true);
  }

  deleteUser(id: number) {
    if (confirm('Delete this user?')) {
      this.userService.deleteUser(id);
    }
  }
}