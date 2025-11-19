import { Injectable, signal } from '@angular/core';
import { SOUND_OPTIONS, SoundOption } from '../models/sound.model';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private readonly SOUND_PREFERENCE_KEY = 'timer_sound';
  private readonly VOLUME_PREFERENCE_KEY = 'timer_volume';
  private audio: HTMLAudioElement | null = null;

  // Signal for current sound preference
  currentSound = signal<string>(this.getSoundPreference());

  // Volume control signals
  volume = signal<number>(this.getVolumePreference());
  isMuted = signal<boolean>(false);
  private previousVolume: number = this.getVolumePreference();

  constructor() {
    this.audio = new Audio();
    this.updateAudioVolume();
  }

  /**
   * Get all available sound options
   */
  getSoundOptions(): SoundOption[] {
    return SOUND_OPTIONS;
  }

  /**
   * Get sound options filtered by category
   */
  getSoundsByCategory(category: 'chime' | 'notification'): SoundOption[] {
    return SOUND_OPTIONS.filter((sound) => sound.category === category);
  }

  /**
   * Get the currently selected sound preference from localStorage
   */
  getSoundPreference(): string {
    return localStorage.getItem(this.SOUND_PREFERENCE_KEY) || 'next-ding';
  }

  /**
   * Set the sound preference in localStorage
   */
  setSoundPreference(soundId: string): void {
    localStorage.setItem(this.SOUND_PREFERENCE_KEY, soundId);
    this.currentSound.set(soundId);
  }

  /**
   * Get the volume preference from localStorage
   */
  getVolumePreference(): number {
    const saved = localStorage.getItem(this.VOLUME_PREFERENCE_KEY);
    return saved ? parseInt(saved, 10) : 70;
  }

  /**
   * Set the volume level (0-100)
   */
  setVolume(level: number): void {
    const clampedLevel = Math.max(0, Math.min(100, level));
    this.volume.set(clampedLevel);
    localStorage.setItem(this.VOLUME_PREFERENCE_KEY, clampedLevel.toString());

    // If setting volume while muted, unmute
    if (this.isMuted() && clampedLevel > 0) {
      this.isMuted.set(false);
    }

    this.updateAudioVolume();
  }

  /**
   * Toggle mute state
   */
  toggleMute(): void {
    const currentlyMuted = this.isMuted();

    if (currentlyMuted) {
      // Unmute: restore previous volume
      this.isMuted.set(false);
      this.volume.set(this.previousVolume);
    } else {
      // Mute: remember current volume and set to 0
      this.previousVolume = this.volume();
      this.isMuted.set(true);
    }

    this.updateAudioVolume();
  }

  /**
   * Update the audio element's volume based on current state
   */
  private updateAudioVolume(): void {
    if (this.audio) {
      if (this.isMuted()) {
        this.audio.volume = 0;
      } else {
        this.audio.volume = this.volume() / 100;
      }
    }
  }

  /**
   * Get sound option by ID
   */
  getSoundById(soundId: string): SoundOption | undefined {
    return SOUND_OPTIONS.find((sound) => sound.id === soundId);
  }

  /**
   * Get the path for a sound ID
   */
  getSoundPath(soundId: string): string {
    const sound = this.getSoundById(soundId);
    return sound?.path || SOUND_OPTIONS[0].path;
  }

  /**
   * Play a sound by ID
   */
  playSound(soundId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.audio) {
        this.audio = new Audio();
      }

      const soundPath = this.getSoundPath(soundId);
      this.audio.src = soundPath;

      // Apply current volume settings
      this.updateAudioVolume();

      this.audio
        .play()
        .then(() => resolve())
        .catch((err) => {
          console.error('Error playing sound:', err);
          reject(err);
        });
    });
  }

  /**
   * Preview a sound (play it once)
   */
  previewSound(soundId: string): void {
    this.playSound(soundId).catch((err) => {
      console.log('Preview sound failed:', err);
    });
  }

  /**
   * Play the currently selected notification sound
   */
  playNotificationSound(): void {
    const currentSoundId = this.getSoundPreference();
    this.playSound(currentSoundId).catch((err) => {
      console.log('Notification sound failed:', err);
    });
  }

  /**
   * Stop any currently playing sound
   */
  stopSound(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }
}
