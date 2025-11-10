export interface SoundOption {
  id: string;
  name: string;
  description: string;
  category: 'chime' | 'notification';
  path: string;
}

export const SOUND_OPTIONS: SoundOption[] = [
  {
    id: 'next-ding',
    name: 'Next Ding',
    description: 'Clear notification ding',
    category: 'notification',
    path: '/sounds/next-ding.mp3'
  },
  {
    id: 'analog-timer',
    name: 'Analog Timer',
    description: 'Classic analog timer bell',
    category: 'notification',
    path: '/sounds/analog-timer.mp3'
  },
  {
    id: 'kitchen-timer',
    name: 'Kitchen Timer',
    description: 'Traditional kitchen timer sound',
    category: 'notification',
    path: '/sounds/kitchen-timer.mp3'
  },
  {
    id: 'single-chime',
    name: 'Single Chime',
    description: 'Gentle single chime tone',
    category: 'chime',
    path: '/sounds/single-chime.mp3'
  }
];

