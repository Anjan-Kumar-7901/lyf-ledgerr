import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';

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
  weeklySummary: any = {};
  monthlySummary: any = {};

  chart: any;
  chartMode: 'daily' | 'weekly' | 'monthly' = 'daily';

  showChart = false;

  constructor(private tracking: Tracking) {
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

  onDateChange(event: any) {
    const date = event.target.value;

    this.tracking.changeDay(date);

    this.hours = this.tracking.getHours();
    this.currentDate = date;

    this.refreshAnalytics();
  }

  // ---------------- ANALYTICS ----------------

  refreshAnalytics() {
    this.dailySummary = this.tracking.getDailySummary();
    this.weeklySummary = this.tracking.getWeeklySummary();
    this.monthlySummary = this.tracking.getMonthlySummary(
      this.currentDate.substring(0, 7)
    );
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
    }
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
