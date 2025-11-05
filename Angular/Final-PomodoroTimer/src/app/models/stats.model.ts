export interface ProductivityStats {
  totalFocusTime: number; // in minutes
  dailyPomodoros: { [key: string]: number };
  weeklyPomodoros: { [key: string]: number };
  monthlyPomodoros: { [key: string]: number };
  hourlyProductivity: { [key: number]: number };
  mostProductiveHour: number;
  taskCompletionRate: number;
  streak: number;
  totalPomodoros: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

