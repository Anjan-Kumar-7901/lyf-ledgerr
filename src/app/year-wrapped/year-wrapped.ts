import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tracking } from '../services/tracking';
import html2canvas  from 'html2canvas';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-year-wrapped',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './year-wrapped.html',
  styleUrl: './year-wrapped.scss'
})
export class yearWrapped implements OnInit {

  yearlySummary: any = {};
  totalHours = 0;
  topCategory = '';
  avgDailyHours = 0;
  bestDay = '';
  bestDayHours = 0;
  productivityScore = 0;



  constructor(private tracking: Tracking) {}

  ngOnInit() {
    this.generateYearWrapped();
  }

  exportImage() {
  const element = document.getElementById('wrappedCapture');

  if (!element) return;

  html2canvas(element).then(canvas => {
    const link = document.createElement('a');
    link.download = 'Lyf-Ledgerr-Year-Wrapped.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

  generateYearWrapped() {
    const yearly = this.tracking.getYearlySummary() as Record<string, number>;

    this.yearlySummary = yearly;

    // ---- TOTAL HOURS ----
    this.totalHours = Object.values(yearly).reduce(
      (a: number, b: number) => a + b,
      0
    );

    // ---- TOP CATEGORY ----
    const sorted = Object.entries(yearly).sort(
      (a, b) => b[1] - a[1]
    );

    this.topCategory = sorted.length ? sorted[0][0] : '';

    // ---- AVERAGE DAILY HOURS ----
    const days: any[] = (this.tracking as any).days || [];

    for (const d of days) {
      const count = d.hours.filter((h: any) => h.category).length;
      if (count > this.bestDayHours) {
        this.bestDayHours = count;
        this.bestDay = d.date;
      }
    }

    const daysWithData = days.filter(d =>
      d.hours.some((h: any) => h.category)
    ).length;

    this.avgDailyHours = daysWithData
      ? Math.round(this.totalHours / daysWithData)
      : 0;

    const productiveCategories = ['Work', 'Exercise'];

    let productiveHours = 0;

    for (const [key, value] of Object.entries(yearly)) {
      if (productiveCategories.includes(key)) {
        productiveHours += value;
      }
    }

    this.productivityScore = this.totalHours
      ? Math.round((productiveHours / this.totalHours) * 100)
      : 0;
  }
}
