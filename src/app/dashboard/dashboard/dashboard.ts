import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js';

import { Tracking } from '../../services/tracking';
import { HourLog } from '../../models/hour-log.model';
import { Category } from '../../models/category.model';

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
  currentDate = '';
  dailySummary: any = {};
  chart: any;
  weeklySummary: any = {};
  monthlySummary: any = {};


  constructor(private tracking: Tracking) {
    this.hours = this.tracking.getHours();
    this.categories = this.tracking.getCategories();
    this.currentDate = this.tracking.getCurrentDate();
    this.dailySummary = this.tracking.getDailySummary();
    this.renderChart
  }

  selectHour(hour: HourLog) {
    this.selectedHour = hour;
  }

  assignCategory(cat: Category) {
    if (this.selectedHour) {
      this.tracking.assignCategory(this.selectedHour, cat);
      this.selectedHour = null;
      this.dailySummary = this.tracking.getDailySummary();
      this.renderChart();
    }
  }


  onDateChange(event: any) {
    const date = event.target.value;
    this.tracking.changeDay(date);
    this.hours = this.tracking.getHours();
    this.currentDate = date;
    this.dailySummary = this.tracking.getDailySummary();
    this.renderChart();
  }

  renderChart() {
  const labels = Object.keys(this.dailySummary);
  const values = Object.values(this.dailySummary);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('dailyChart', {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: labels.map(l =>
            this.categories.find(c => c.name === l)?.color || '#999'
          )
        }]
      }
    });
  }

  loadWeekly() {
   this.weeklySummary = this.tracking.getWeeklySummary();
  }

  loadMonthly(month: string) {
   this.monthlySummary = this.tracking.getMonthlySummary(month);
  }

}
