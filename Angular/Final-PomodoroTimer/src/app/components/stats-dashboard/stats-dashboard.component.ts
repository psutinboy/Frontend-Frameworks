import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../services/stats.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-stats-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-dashboard.component.html',
  styleUrl: './stats-dashboard.component.css'
})
export class StatsDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('dailyChart') dailyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('weeklyChart') weeklyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthlyChart') monthlyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('hourlyChart') hourlyChartRef!: ElementRef<HTMLCanvasElement>;

  public statsService = inject(StatsService);
  stats = this.statsService.stats;
  isLoading = signal(true);

  private dailyChart?: Chart;
  private weeklyChart?: Chart;
  private monthlyChart?: Chart;
  private hourlyChart?: Chart;

  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {
    // Charts will be initialized after stats are loaded
  }

  loadStats(): void {
    this.isLoading.set(true);
    this.statsService.getStats().subscribe({
      next: () => {
        this.isLoading.set(false);
        setTimeout(() => this.initializeCharts(), 100);
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.isLoading.set(false);
      }
    });
  }

  getTotalFocusTime(): string {
    const hours = this.statsService.getTotalFocusHours();
    const minutes = this.statsService.getTotalFocusMinutes();
    return `${hours}h ${minutes}m`;
  }

  private initializeCharts(): void {
    this.initializeDailyChart();
    this.initializeWeeklyChart();
    this.initializeMonthlyChart();
    this.initializeHourlyChart();
  }

  private initializeDailyChart(): void {
    if (!this.dailyChartRef) return;

    const data = this.statsService.getDailyChartData();
    const ctx = this.dailyChartRef.nativeElement.getContext('2d');
    
    if (!ctx) return;

    if (this.dailyChart) {
      this.dailyChart.destroy();
    }

    this.dailyChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Pomodoros Completed',
          data: data.data,
          backgroundColor: 'rgba(102, 126, 234, 0.8)',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Daily Pomodoros (Last 7 Days)',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  private initializeWeeklyChart(): void {
    if (!this.weeklyChartRef) return;

    const data = this.statsService.getWeeklyChartData();
    const ctx = this.weeklyChartRef.nativeElement.getContext('2d');
    
    if (!ctx) return;

    if (this.weeklyChart) {
      this.weeklyChart.destroy();
    }

    this.weeklyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Pomodoros',
          data: data.data,
          backgroundColor: 'rgba(52, 211, 153, 0.2)',
          borderColor: 'rgba(52, 211, 153, 1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: 'rgba(52, 211, 153, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Weekly Pomodoros (Last 4 Weeks)',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  private initializeMonthlyChart(): void {
    if (!this.monthlyChartRef) return;

    const data = this.statsService.getMonthlyChartData();
    const ctx = this.monthlyChartRef.nativeElement.getContext('2d');
    
    if (!ctx) return;

    if (this.monthlyChart) {
      this.monthlyChart.destroy();
    }

    this.monthlyChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Pomodoros',
          data: data.data,
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Monthly Pomodoros (Last 6 Months)',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  private initializeHourlyChart(): void {
    if (!this.hourlyChartRef) return;

    const data = this.statsService.getHourlyChartData();
    const ctx = this.hourlyChartRef.nativeElement.getContext('2d');
    
    if (!ctx) return;

    if (this.hourlyChart) {
      this.hourlyChart.destroy();
    }

    this.hourlyChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Pomodoros',
          data: data.data,
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          borderColor: 'rgba(245, 158, 11, 1)',
          borderWidth: 2,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Productivity by Hour of Day',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    });
  }
}

