import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { HourLog } from '../models/hour-log.model';
import { DayLog } from '../models/day-log.model';

@Injectable({
  providedIn: 'root'
})
export class Tracking {

  private categories: Category[] = [
    { name: 'Sleep', color: '#a371f7' },
    { name: 'Work', color: '#00fff5' },
    { name: 'Exercise', color: '#39ff14' },
    { name: 'Leisure', color: '#ff2fdc' },
    { name: 'Family', color: '#ff9f1c' }
  ];

  private days: DayLog[] = [];
  private currentDay!: DayLog;

  constructor() {
    this.createToday();
  }

  private createToday() {
    const today = new Date().toISOString().split('T')[0];
    this.createDay(today);
  }

  private createDay(date: string) {
    const hours: HourLog[] = [];

    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      hours.push({
        time: hour,
        category: null
      });
    }

    const day: DayLog = {
      date,
      hours
    };

    this.days.push(day);
    this.currentDay = day;
  }

  getHours(): HourLog[] {
    return this.currentDay.hours;
  }

  getCategories(): Category[] {
    return this.categories;
  }

  getCurrentDate(): string {
    return this.currentDay.date;
  }

  changeDay(date: string) {
    const existing = this.days.find(d => d.date === date);

    if (existing) {
      this.currentDay = existing;
    } else {
      this.createDay(date);
    }
  }

  assignCategory(hour: HourLog, category: Category) {
    hour.category = category;
  }

  getDailySummary() {
    const summary: { [key: string]: number } = {};

    this.currentDay.hours.forEach(h => {
      if (h.category) {
        const name = h.category.name;
        summary[name] = (summary[name] || 0) + 1;
      }
    });

    return summary;
  }

  getWeeklySummary() {
    const summary: { [key: string]: number } = {};

    this.days.forEach(day => {
      day.hours.forEach(h => {
        if (h.category) {
          const name = h.category.name;
          summary[name] = (summary[name] || 0) + 1;
        }
      });
    });

    return summary;
  }

  getMonthlySummary(month: string) {
    const summary: { [key: string]: number } = {};

    this.days
      .filter(d => d.date.startsWith(month))
      .forEach(day => {
        day.hours.forEach(h => {
          if (h.category) {
            const name = h.category.name;
            summary[name] = (summary[name] || 0) + 1;
          }
        });
      });
    return summary;
  }

}
