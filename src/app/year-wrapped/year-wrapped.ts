import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { Tracking } from '../services/tracking';

@Component({
  selector: 'app-year-wrapped',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './year-wrapped.html',
  styleUrl: './year-wrapped.scss'
})
export class yearWrapped implements AfterViewInit {

  @ViewChild('yearCanvas') yearCanvas!: ElementRef<HTMLCanvasElement>;

  yearlySummary: any = {};
  totalHours = 0;
  topCategory = '';
  avgDailyHours = 0;

  chart: any;

  constructor(private tracking: Tracking) {
    this.generateYearWrapped();
  }

  ngAfterViewInit() {
    this.renderChart();
  }

  generateYearWrapped() {
    const data = this.tracking.getYearlySummary() as Record<string, number>;

    this.yearlySummary = data;

    this.totalHours = Object.values(data).reduce(
      (a: number, b: number) => a + b,
      0
    );

    const sorted = Object.entries(data).sort(
      (a: [string, number], b: [string, number]) => b[1] - a[1]
    );

    this.topCategory = sorted[0]?.[0] || '';

    this.avgDailyHours = Math.round(this.totalHours / 365);
  }

  renderChart() {
    const data = this.tracking.getYearlySummary() as Record<string, number>;

    const labels = Object.keys(data);
    const values = Object.values(data);

    if (!labels.length) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.yearCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: labels.map(l =>
              this.tracking.getCategories().find(c => c.name === l)?.color || '#888'
            )
          }
        ]
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
