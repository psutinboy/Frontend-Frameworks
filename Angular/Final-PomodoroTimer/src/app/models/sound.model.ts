export interface SoundOption {
  id: string;
  name: string;
  description: string;
  category: 'chime' | 'notification';
  path: string;
}

export const SOUND_OPTIONS: SoundOption[] = [
  {
    id: 'default',
    name: 'Default Beep',
    description: 'Classic timer beep',
    category: 'notification',
    path: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZTRQPV6zn77BdGAg+ltrzxXIoBSh+zPLaizsIGGS57OihUhELTKXh8bllHAU2jdXzzn0vBSh+zPLaizsIGGS57OihUhELTKXh8bllHAU2jdXzzn0vBSh+zPLaizsIGGS57OihUhELTKXh8bllHAU2jdXzzn0vBSh+zPLaizsIGGS57OihUhELTKXh8bllHAU2jdXzzn0vBSh+zPLaizsIGGS57OihUhELTKXh8bllHAU2jdXzzn0vBSh+zPLaizsIGGS57OihUhELTKXh8bllHAU2jdXzzn0vBSh+zPLaizsIGGS57OihUhELTKXh8bllHAU2jdXzzn0vBSh+zPLaizsIGGS57OihUhELTKXh8bllHAU2jdXzzn0vBQ=='
  },
  {
    id: 'soft-bell',
    name: 'Soft Bell',
    description: 'Gentle single bell tone',
    category: 'chime',
    path: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
  },
  {
    id: 'wind-chime',
    name: 'Wind Chime',
    description: 'Light, airy chime sound',
    category: 'chime',
    path: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
  },
  {
    id: 'crystal-chime',
    name: 'Crystal Chime',
    description: 'Clear, crisp chime',
    category: 'chime',
    path: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
  },
  {
    id: 'gentle-ding',
    name: 'Gentle Ding',
    description: 'Simple notification sound',
    category: 'notification',
    path: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
  },
  {
    id: 'success-ping',
    name: 'Success Ping',
    description: 'Upbeat notification tone',
    category: 'notification',
    path: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
  }
];

