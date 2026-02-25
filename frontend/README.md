# 🎯 Lyf Ledgerr

**Lyf Ledgerr** is a personal life logging and analytics app built with **Angular**.  
It lets users track every hour of their day, assign categories, and visualize insights over time (daily, weekly, monthly).  
Designed with a dark, high-contrast interface and a focus on meaningful self-reflection and analytics.

---

## 🌟 Features

### 📅 Core Tracking
- Track every hour of the day with activity categories
- Multi-day logs with persistent state
- Date navigation to review past entries

### 📊 Analytics
- Daily summaries
- Weekly aggregated summaries
- Monthly aggregated summaries
- Data visualization using charts (Chart.js)

### 🎨 UI & Theming
- Dark, high-contrast “Neon Terminal” theme
- JetBrains Mono typography for a clean, technical feel
- Responsive interactive elements

---

## 📂 Project Structure

lyf-ledgerr/
├── src/
│ ├── app/
│ │ ├── dashboard/
│ │ │ ├── dashboard.ts
│ │ │ ├── dashboard.html
│ │ │ ├── dashboard.scss
│ │ ├── services/
│ │ │ └── tracking.ts
│ │ ├── models/
│ │ │ ├── category.model.ts
│ │ │ ├── hour-log.model.ts
│ │ │ └── day-log.model.ts
│ ├── styles.scss
├── angular.json
├── package.json
└── README.md

---

## 🚀 Getting Started

To run the project locally:

### 🧰 Requirements
- Node.js (LTS recommended)
- Angular CLI

---

### 1. Install dependencies

```bash
npm install
