# AI Business Intelligence Platform

## Overview

AI Business Intelligence Platform is a full-stack analytics application designed to automatically analyze CSV datasets and generate business insights.

The platform enables users to upload any CSV dataset and instantly access:

* Dataset profiling
* Data quality analysis
* Correlation analysis
* Outlier detection
* Executive reporting
* AI-generated insights
* Interactive visualizations
* PDF report generation

This project was developed using FastAPI, React, Vite, Recharts, and Tailwind CSS.

---

## Features

### Dashboard

* Executive KPI overview
* Dataset health score
* AI-generated business insights
* Dataset summary

### Upload Data

* CSV file upload
* Drag & Drop support
* Automatic dataset processing

### Dataset Explorer

* Column profiling
* Statistical summaries
* Histograms
* Bar charts
* Top values analysis

### Advanced Analytics

* Correlation analysis
* Correlation matrix
* Outlier detection
* Statistical relationships

### Executive Report

* Automated executive summary
* Dataset quality assessment
* Top correlations
* Top outliers
* AI insights
* PDF export

### AI Assistant

* Automated business intelligence insights
* Dataset interpretation

---

## Screenshots

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Upload Dataset

![Upload](screenshots/upload.png)

### Dataset Explorer

![Explorer](screenshots/explorer.png)

### Advanced Analytics

![Analytics](screenshots/analytics.png)

### Executive Report

![Executive Report](screenshots/executive-report.png)

---

## Technology Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* Recharts
* React Router

### Backend

* FastAPI
* Pandas
* NumPy
* Uvicorn

---

## Architecture

Frontend (React)

↓

REST API

↓

FastAPI Backend

↓

Pandas Data Processing

↓

Analytics & Insights Engine

---

## API Endpoints

| Endpoint                 | Description           |
| ------------------------ | --------------------- |
| /upload                  | Upload CSV dataset    |
| /dashboard               | Dashboard KPIs        |
| /dataset-profile         | Dataset summary       |
| /column-profile/{column} | Column statistics     |
| /column-chart/{column}   | Column visualization  |
| /correlations            | Correlation analysis  |
| /correlation-matrix      | Correlation matrix    |
| /outliers                | Outlier detection     |
| /dataset-health          | Dataset health score  |
| /ai-insights             | AI-generated insights |

---

## Installation

### Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

### Frontend

```bash
npm install

npm run dev
```

---

## Future Improvements

* OpenAI integration
* Natural language dataset querying
* Multi-file analytics
* Predictive modeling
* Machine learning forecasting
* User authentication
* Cloud storage integration

---

## Author

Renato Saletti

Computer Science Graduate | Data Analytics | Business Intelligence | Front-End Development

LinkedIn: Add your profile link

GitHub: Add your GitHub profile link
