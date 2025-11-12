import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { User } from '../Models/user';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserFormComponent {
  fb = inject(FormBuilder);
  
  // Signal inputs/outputs
  editUser = input<User | null>(null);
  onSave = output<Partial<User>>();
  onCancel = output<void>();
  
  // Form definition
  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]]
  });
  
  constructor() {
    // Populate form if editing
    effect(() => {
      const user = this.editUser();
      if (user) {
        this.userForm.patchValue({
          name: user.name,
          email: user.email
        });
      }
    });
  }
  
  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const userData: Partial<User> = {
        name: formValue.name!,
        email: formValue.email!
      };
      
      this.onSave.emit(userData);
      this.userForm.reset();
    }
  }
  
  handleClose() {
    this.onCancel.emit();
    this.userForm.reset();
  }
}

