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

  // ----------------------
  // BASIC HELPERS
  // ----------------------

  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  private generateEmptyHours(): HourLog[] {
    return Array.from({ length: 24 }, (_, i) => ({
      time: i.toString().padStart(2, '0') + ':00',
      category: null
    }));
  }

  // ----------------------
  // DAY MANAGEMENT
  // ----------------------

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

  getHours(): HourLog[] {
    return this.days.find(d => d.date === this.currentDate)?.hours || [];
  }

  getAllDays() {
    return this.days;
  }

  // ----------------------
  // CATEGORY
  // ----------------------

  getCategories(): Category[] {
    return this.categories;
  }

  assignCategory(hour: HourLog, category: Category) {
    hour.category = category;
  }

  // ----------------------
  // DAILY ANALYTICS
  // ----------------------

  getDailySummary() {
    const summary: any = {};
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

  // ----------------------
  // WEEKLY ANALYTICS
  // ----------------------

  getWeeklySummary() {
    const summary: any = {};

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

  // ----------------------
  // MONTHLY ANALYTICS
  // ----------------------

  getMonthlySummary(month: string) {
    const summary: any = {};

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

  // ----------------------
  // YEARLY ANALYTICS
  // ----------------------

  getYearlySummary() {
    const summary: any = {};

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



  // ----------------------
  // CATEGORY TREND
  // ----------------------

  getCategoryTrend(category: string) {
    const trend: any[] = [];

    for (const day of this.days) {
      let count = 0;

      for (const hour of day.hours) {
        if (hour.category?.name === category) {
          count++;
        }
      }

      trend.push({
        date: day.date,
        hours: count
      });
    }

    return trend;
  }
}
