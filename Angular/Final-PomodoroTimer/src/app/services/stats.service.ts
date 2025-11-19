import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductivityStats } from '../models/stats.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private readonly apiUrl = `${environment.apiUrl}/pomodoros`;

  stats = signal<ProductivityStats | null>(null);

  constructor(private http: HttpClient) {}

  getStats(): Observable<ProductivityStats> {
    return this.http.get<ProductivityStats>(`${this.apiUrl}/stats`).pipe(
      tap(stats => this.stats.set(stats))
    );
  }

  getTotalFocusHours(): number {
    const stats = this.stats();
    if (!stats) return 0;
    return Math.floor(stats.totalFocusTime / 60);
  }

  getTotalFocusMinutes(): number {
    const stats = this.stats();
    if (!stats) return 0;
    return stats.totalFocusTime % 60;
  }

  getDailyChartData(): { labels: string[], data: number[] } {
    const stats = this.stats();
    if (!stats) return { labels: [], data: [] };

    const entries = Object.entries(stats.dailyPomodoros).sort((a, b) => 
      a[0].localeCompare(b[0])
    );

    return {
      labels: entries.map(([date]) => {
        // Parse as local date to avoid timezone shift
        const [year, month, day] = date.split('-').map(Number);
        const d = new Date(year, month - 1, day);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      data: entries.map(([_, count]) => count)
    };
  }

  getWeeklyChartData(): { labels: string[], data: number[] } {
    const stats = this.stats();
    if (!stats) return { labels: [], data: [] };

    const entries = Object.entries(stats.weeklyPomodoros);
    
    return {
      labels: entries.map(([week]) => week),
      data: entries.map(([_, count]) => count)
    };
  }

  getMonthlyChartData(): { labels: string[], data: number[] } {
    const stats = this.stats();
    if (!stats) return { labels: [], data: [] };

    const entries = Object.entries(stats.monthlyPomodoros);
    
    return {
      labels: entries.map(([month]) => month),
      data: entries.map(([_, count]) => count)
    };
  }

  getHourlyChartData(): { labels: string[], data: number[] } {
    const stats = this.stats();
    if (!stats) return { labels: [], data: [] };

    const labels: string[] = [];
    const data: number[] = [];

    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour === 0 ? '12 AM' :
                     hour < 12 ? `${hour} AM` :
                     hour === 12 ? '12 PM' :
                     `${hour - 12} PM`;
      labels.push(hourStr);
      data.push(stats.hourlyProductivity[hour] || 0);
    }

    return { labels, data };
  }

  getMostProductiveHourFormatted(): string {
    const stats = this.stats();
    if (!stats) return 'N/A';

    const hour = stats.mostProductiveHour;
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  }
}

