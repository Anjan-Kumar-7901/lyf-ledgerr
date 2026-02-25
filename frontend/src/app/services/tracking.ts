import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { HourLog } from '../models/hour-log.model';
import { DayLog } from '../models/day-log.model';

@Injectable({
  providedIn: 'root'
})
export class Tracking {

  private days: DayLog[] = [];
  private currentDate = this.getToday();

  private categories: Category[] = [
    { name: 'Sleep', color: '#9b6cff' },
    { name: 'Work', color: '#00ffff' },
    { name: 'Exercise', color: '#39ff14' },
    { name: 'Family', color: '#ffa500' },
    { name: 'Leisure', color: '#ff3cff' }
  ];

  constructor() {
    this.loadDay(this.currentDate);
  }

  // ---------------- BASIC HELPERS ----------------

  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  private generateEmptyHours(): HourLog[] {
    return Array.from({ length: 24 }, (_, i) => ({
      time: i.toString().padStart(2, '0') + ':00',
      category: null
    }));
  }

  // ---------------- DAY MANAGEMENT ----------------

  private loadDay(date: string) {
    let day = this.days.find(d => d.date === date);

    if (!day) {
      day = {
        date,
        hours: this.generateEmptyHours()
      };
      this.days.push(day);
    }

    this.currentDate = date;
  }

  changeDay(date: string) {
    this.loadDay(date);
  }

  getCurrentDate(): string {
    return this.currentDate;
  }

  getDays(): DayLog[] {
    return this.days;
  }

  getHours(): HourLog[] {
    return this.days.find(d => d.date === this.currentDate)!.hours;
  }

  // ---------------- CATEGORY ----------------

  getCategories(): Category[] {
    return this.categories;
  }

  assignCategory(hour: HourLog, category: Category) {
    hour.category = category;
  }

  // ---------------- DAILY SUMMARY ----------------

  getDailySummary() {
    const summary: Record<string, number> = {};
    const day = this.days.find(d => d.date === this.currentDate);

    if (!day) return summary;

    for (const hour of day.hours) {
      if (hour.category) {
        summary[hour.category.name] =
          (summary[hour.category.name] || 0) + 1;
      }
    }

    return summary;
  }

  // ---------------- WEEKLY SUMMARY ----------------

  getWeeklySummary() {
    const summary: Record<string, number> = {};

    for (const day of this.days) {
      for (const hour of day.hours) {
        if (hour.category) {
          summary[hour.category.name] =
            (summary[hour.category.name] || 0) + 1;
        }
      }
    }

    return summary;
  }

  // ---------------- MONTHLY SUMMARY ----------------

  getMonthlySummary(month: string) {
    const summary: Record<string, number> = {};

    for (const day of this.days) {
      if (!day.date.startsWith(month)) continue;

      for (const hour of day.hours) {
        if (hour.category) {
          summary[hour.category.name] =
            (summary[hour.category.name] || 0) + 1;
        }
      }
    }

    return summary;
  }

  // ---------------- YEARLY SUMMARY ----------------

  getYearlySummary() {
    const summary: Record<string, number> = {};

    for (const day of this.days) {
      for (const hour of day.hours) {
        if (hour.category) {
          summary[hour.category.name] =
            (summary[hour.category.name] || 0) + 1;
        }
      }
    }

    return summary;
  }

  // ---------------- STREAK ----------------

  getStreakData() {
    let current = 0;
    let max = 0;

    const sorted = [...this.days].sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    for (const day of sorted) {
      const hasData = day.hours.some(h => h.category !== null);

      if (hasData) {
        current++;
        max = Math.max(max, current);
      } else {
        current = 0;
      }
    }

    return { current, max };
  }
}
