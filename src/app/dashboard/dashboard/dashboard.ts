import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';

import { Tracking } from '../../services/tracking';
import { HourLog } from '../../models/hour-log.model';
import { Category } from '../../models/category.model';
import { ProfileDropdown } from '../../shared/profile-dropdown/profile-dropdown';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  // ----------- CORE DATA -----------

  hours: HourLog[] = [];
  categories: Category[] = [];
  selectedHour: HourLog | null = null;
  currentDate = '';

  // ----------- STREAK + TOTAL -----------

  currentStreak = 0;
  longestStreak = 0;
  totalHours = 0;

  // ----------- SUMMARY DATA -----------

  dailySummary: Record<string, number> = {};
  weeklySummary: Record<string, number> = {};
  monthlySummary: Record<string, number> = {};

  dailyTotal = 0;
  weeklyTotal = 0;
  monthlyTotal = 0;

  topDailyCategory = '';
  topWeeklyCategory = '';
  topMonthlyCategory = '';

  // ----------- CHART STATE -----------

  chart: Chart | null = null;
  chartMode: 'daily' | 'weekly' | 'monthly' = 'daily';
  showChart = false;

  // ----------- PROFILE -----------

  showProfile = false;

  // ----------- TOOLTIP -----------

  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipDate = '';
  tooltipHours = 0;

  // ----------- YEAR MONTH GRID -----------

  yearMonths: {
    month: string;
    days: { date: string; total: number }[];
  }[] = [];

  @ViewChild('hourGrid') hourGrid!: ElementRef;

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
    if (!this.selectedHour) return;

    this.tracking.assignCategory(this.selectedHour, cat);
    this.selectedHour = null;
    this.refreshAnalytics();
  }

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.value) return;

    this.tracking.changeDay(input.value);
    this.init();
  }

  toggleProfile() {
    this.showProfile = !this.showProfile;
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

    this.dailyTotal = this.sumValues(this.dailySummary);
    this.weeklyTotal = this.sumValues(this.weeklySummary);
    this.monthlyTotal = this.sumValues(this.monthlySummary);

    this.topDailyCategory = this.getTopCategory(this.dailySummary);
    this.topWeeklyCategory = this.getTopCategory(this.weeklySummary);
    this.topMonthlyCategory = this.getTopCategory(this.monthlySummary);

    this.totalHours = this.sumValues(this.dailySummary);
    this.calculateStreak();
    this.generateYearMonths();
  }

  private sumValues(summary: Record<string, number>): number {
    return Object.values(summary)
      .reduce((a, b) => a + Number(b), 0);
  }

  private getTopCategory(summary: Record<string, number>): string {
    const entries = Object.entries(summary);
    if (!entries.length) return '';
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  }

  // ---------------- YEAR MONTH GRID ----------------

  generateYearMonths() {
    const days = this.tracking.getDays(); // <-- IMPORTANT FIX
    const map = new Map<string, number>();

    for (const day of days) {
      const total = day.hours.filter(h => h.category !== null).length;
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

  private formatDateLocal(date: Date): string {
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
      this.hourGrid?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }

  // ---------------- TOOLTIP ----------------

  showTooltip(event: MouseEvent, d: { date: string; total: number }) {
    this.tooltipVisible = true;
    this.tooltipX = event.pageX + 10;
    this.tooltipY = event.pageY + 10;
    this.tooltipDate = d.date;
    this.tooltipHours = d.total;
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }

  private calculateStreak() {
    const days = this.tracking.getDays();

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

  // ---------------- CHART ----------------

  openChart(mode: 'daily' | 'weekly' | 'monthly') {
    this.chartMode = mode;
    this.showChart = true;
    setTimeout(() => this.renderChart(), 0);
  }

  closeChart() {
    this.showChart = false;
    this.chart?.destroy();
    this.chart = null;
  }

  renderChart() {
    const dataSource =
      this.chartMode === 'daily'
        ? this.dailySummary
        : this.chartMode === 'weekly'
        ? this.weeklySummary
        : this.monthlySummary;

    const labels = Object.keys(dataSource);
    const values = Object.values(dataSource).map(v => Number(v));

    this.chart?.destroy();

    this.chart = new Chart('dailyChart', {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: labels.map(
            l => this.categories.find(c => c.name === l)?.color || '#777'
          )
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: 'white' }
          }
        }
      }
    });
  }
}
