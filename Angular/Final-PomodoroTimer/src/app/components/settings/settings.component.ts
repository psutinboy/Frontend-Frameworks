import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { HeaderComponent } from '../header/header.component';
import { SoundService } from '../../services/sound.service';
import { SOUND_OPTIONS, SoundOption } from '../../models/sound.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private soundService = inject(SoundService);

  currentUser = this.authService.currentUser;
  isLoadingUser = signal(false);
  isUpdatingPassword = signal(false);
  isUpdatingEmail = signal(false);
  isDeletingAccount = signal(false);
  
  passwordMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);
  emailMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sound settings
  soundOptions = SOUND_OPTIONS;
  selectedSound = this.soundService.currentSound;

  passwordForm: FormGroup;
  emailForm: FormGroup;
  deleteForm: FormGroup;

  constructor() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.emailForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.deleteForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmationText: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    this.isLoadingUser.set(true);
    this.authService.getUserDetails().subscribe({
      next: () => {
        this.isLoadingUser.set(false);
      },
      error: (error) => {
        console.error('Error loading user details:', error);
        this.isLoadingUser.set(false);
      }
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onUpdatePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.value;
    this.isUpdatingPassword.set(true);
    this.passwordMessage.set(null);

    this.authService.updatePassword({ currentPassword, newPassword }).subscribe({
      next: (response) => {
        this.isUpdatingPassword.set(false);
        this.passwordMessage.set({ type: 'success', text: response.message });
        this.passwordForm.reset();
        
        setTimeout(() => {
          this.passwordMessage.set(null);
        }, 5000);
      },
      error: (error) => {
        this.isUpdatingPassword.set(false);
        this.passwordMessage.set({ 
          type: 'error', 
          text: error.error?.error || 'Failed to update password' 
        });
      }
    });
  }

  onUpdateEmail(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    const { newEmail, password } = this.emailForm.value;
    this.isUpdatingEmail.set(true);
    this.emailMessage.set(null);

    this.authService.updateEmail({ newEmail, password }).subscribe({
      next: () => {
        this.isUpdatingEmail.set(false);
        this.emailMessage.set({ type: 'success', text: 'Email updated successfully' });
        this.emailForm.reset();
        
        setTimeout(() => {
          this.emailMessage.set(null);
        }, 5000);
      },
      error: (error) => {
        this.isUpdatingEmail.set(false);
        this.emailMessage.set({ 
          type: 'error', 
          text: error.error?.error || 'Failed to update email' 
        });
      }
    });
  }

  onDeleteAccount(): void {
    if (this.deleteForm.invalid) {
      this.deleteForm.markAllAsTouched();
      return;
    }

    const { password, confirmationText } = this.deleteForm.value;

    if (confirmationText !== 'DELETE') {
      alert('Please type DELETE exactly to confirm account deletion');
      return;
    }

    const confirmed = confirm(
      'Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted.'
    );

    if (!confirmed) {
      return;
    }

    this.isDeletingAccount.set(true);

    this.authService.deleteAccount({ password, confirmationText }).subscribe({
      next: () => {
        this.isDeletingAccount.set(false);
        alert('Account deleted successfully. You will be redirected to the login page.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isDeletingAccount.set(false);
        alert(error.error?.error || 'Failed to delete account');
      }
    });
  }

  onLogout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Sound settings methods
  onSoundChange(soundId: string): void {
    this.soundService.setSoundPreference(soundId);
  }

  onPreviewSound(soundId: string): void {
    this.soundService.previewSound(soundId);
  }

  getSoundsByCategory(category: 'chime' | 'notification'): SoundOption[] {
    return this.soundOptions.filter(sound => sound.category === category);
  }
}

