import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';

import { Tracking } from '../../services/tracking';
import { HourLog } from '../../models/hour-log.model';
import { Category } from '../../models/category.model';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  hours: HourLog[] = [];
  categories: Category[] = [];

  selectedHour: HourLog | null = null;

  currentStreak = 0;
  longestStreak = 0;

  currentDate = '';

  categoryTrend: any[] = [];
  dailyTotal = 0;
  dailySummary: any = {};
  weeklyTotal = 0;
  weeklySummary: any = {};
  monthlyTotal = 0;
  monthlySummary: any = {};
  topDailyCategory = '';
  topWeeklyCategory = '';
  topMonthlyCategory = '';
  chart: any;
  chartMode: 'daily' | 'weekly' | 'monthly' = 'daily';
  monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  selectedTrendCategory = '';
  weeklyChart: any;

  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipDate = '';
  tooltipHours = 0;

  yearMonths: {
    month: string;
    days: { date: string; total: number }[];
  }[] = [];

  @ViewChild('hourGrid') hourGrid!: ElementRef;


  showChart = false;

  constructor(
    private tracking: Tracking,
    private router: Router
  ) {
    this.init();
  }

  // ---------------- INIT ----------------

  init() {
    this.hours = this.tracking.getHours();
    this.categories = this.tracking.getCategories();
    this.currentDate = this.tracking.getCurrentDate();

    this.refreshAnalytics();
  }

  // ---------------- UI ----------------

  selectHour(hour: HourLog) {
    this.selectedHour = hour;
  }

  assignCategory(cat: Category) {
    if (this.selectedHour) {
      this.tracking.assignCategory(this.selectedHour, cat);
      this.selectedHour = null;
      this.refreshAnalytics();
    }
  }

  loadTrend(category: string) {
    if (!category) return;
    this.categoryTrend = this.tracking.getCategoryTrend(category);
  }

  onDateChange(event: any) {
    const date = event.target.value;

    this.tracking.changeDay(date);
    this.init();
  }

  logout() {
    localStorage.removeItem('lyf_logged');
    this.router.navigate(['/login']);
  }



  // ---------------- ANALYTICS ----------------

  refreshAnalytics() {
    this.dailySummary = this.tracking.getDailySummary();
    this.weeklySummary = this.tracking.getWeeklySummary();
    this.monthlySummary = this.tracking.getMonthlySummary(
      this.currentDate.substring(0, 7)
    );

  // Total hours
    const values = Object.values(this.dailySummary) as number[];
    this.dailyTotal = values.reduce((a, b) => a + b, 0);

  // Top category
    const sorted = Object.entries(this.dailySummary) as [string, number][];
    sorted.sort((a, b) => b[1] - a[1]);
    this.topDailyCategory = sorted.length ? sorted[0][0] : '';

    // Weekly
    const weeklyValues = Object.values(this.weeklySummary) as number[];
    this.weeklyTotal = weeklyValues.reduce((a, b) => a + b, 0);

    const weeklySorted = Object.entries(this.weeklySummary) as [string, number][];
    weeklySorted.sort((a, b) => b[1] - a[1]);
    this.topWeeklyCategory = weeklySorted.length ? weeklySorted[0][0] : '';

    // Monthly
    const monthlyValues = Object.values(this.monthlySummary) as number[];
    this.monthlyTotal = monthlyValues.reduce((a, b) => a + b, 0);

    const monthlySorted = Object.entries(this.monthlySummary) as [string, number][];
    monthlySorted.sort((a, b) => b[1] - a[1]);
    this.topMonthlyCategory = monthlySorted.length ? monthlySorted[0][0] : '';

    this.calculateStreak();
    this.generateYearMonths();
  }

  // ---------------- CHART MODAL ----------------

  openChart(mode: 'daily' | 'weekly' | 'monthly') {
    this.chartMode = mode;
    this.showChart = true;

    setTimeout(() => {
      this.renderChart();
    }, 0);
  }

  closeChart() {
    this.showChart = false;

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  calculateStreak() {
    const days = this.tracking.getAllDays();

    if (!days || days.length === 0) {
      this.currentStreak = 0;
      this.longestStreak = 0;
      return;
    }

    let streak = 0;
    let longest = 0;

    const sorted = [...days].sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    for (const day of sorted) {
      const hasData = day.hours.some(h => h.category !== null);

      if (hasData) {
        streak++;
        longest = Math.max(longest, streak);
      } else {
        streak = 0;
      }
    }

    this.currentStreak = streak;
    this.longestStreak = longest;
  }

  generateYearMonths() {
    const days = this.tracking.getAllDays();
    const map = new Map<string, number>();

    for (const day of days) {
      const total = day.hours.filter(h => h.category).length;
      map.set(day.date, total);
    }

    const year = new Date().getFullYear();
    this.yearMonths = [];

    for (let month = 0; month < 12; month++) {

      const monthName = new Date(year, month)
        .toLocaleString('default', { month: 'short' });

      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const monthDays = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const key = this.formatDateLocal(date);

        monthDays.push({
          date: key,
          total: map.get(key) || 0
        });
      }

      this.yearMonths.push({
        month: monthName,
        days: monthDays
      });
    }
  }

  formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  jumpToDate(date: string) {
    this.tracking.changeDay(date);
    this.currentDate = date;
    this.hours = this.tracking.getHours();
    this.refreshAnalytics();

    setTimeout(() => {
      this.hourGrid.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }

  showTooltip(event: MouseEvent, d: any) {
    this.tooltipVisible = true;
    this.tooltipX = event.pageX + 10;
    this.tooltipY = event.pageY + 10;
    this.tooltipDate = d.date;
    this.tooltipHours = d.total;
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }

  renderChart() {
    let dataSource: any = {};

    if (this.chartMode === 'daily') {
      dataSource = this.dailySummary;
    } else if (this.chartMode === 'weekly') {
      dataSource = this.weeklySummary;
    } else {
      dataSource = this.monthlySummary;
    }

    const labels = Object.keys(dataSource);
    const values = Object.values(dataSource);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('dailyChart', {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: labels.map(l =>
              this.categories.find(c => c.name === l)?.color || '#999'
            )
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: 'white'
            }
          }
        }
      }
    });
  }
}
