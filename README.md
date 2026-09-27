# 🏅 SportPulse — Comprehensive Sports Tournament & Athletic Operations Platform

**SportPulse** is an enterprise-grade athletic tournament management platform built with React, designed for universities, sports academies, athletic directors, and competitive leagues. It unifies public fan engagement, participant athlete portals, and organizer admin consoles into a seamless, real-time experience.

---

## 📌 Project Overview

Managing modern sports tournaments involves complex logistics: multi-sport registrations, bracket generation, referee scoring, fee payments, and athlete tracking. 

**SportPulse** solves this with a 3-tier modular architecture:
1. **Public Portal (Guest View)**: Live scores, featured tournaments, event schedules, championship leaderboards, and spectator updates.
2. **Participant Portal (Athlete Hub)**: Personal schedule, digital tournament passes with QR codes, victory logs, and payment status tracking.
3. **Admin Operations Console**: 5-step tournament creation wizard, bracket manager, live referee scoring console, athlete approval registry, and analytics.

---

## ✨ Key Features & Capabilities

### 1. Multi-Sport Management
Supports multi-discipline sports and competitive gaming:
- ⚽ **Football / Soccer** (Halves, goals, yellow/red cards, penalty shootouts)
- 🏏 **Cricket** (Runs, wickets, overs, and net run rates)
- 🏀 **Basketball** (Quarters, 3-pointers, timeouts, and fouls)
- 🎮 **Esports** (Rounds, maps, and series formats)
- 🎾 **Tennis & Racket Sports** (Sets, games, and rally points)

### 2. Role-Based Portals
- **Public / Spectator View**:
  - Browse open, ongoing, and completed tournaments with sport-specific filter chips.
  - Interactive match center featuring live commentary, venue assignments, and score counters.
  - Comprehensive leaderboards (Top Athletes, Championship Teams, Fair Play rankings).
- **Athlete / Participant Dashboard**:
  - Digital entry pass cards with unique ticket codes (e.g. `SP-CRK-9921`) and download options.
  - Match calendar and notification center for schedule changes.
  - Personal career stats (Victories, tournament participation, badges).
- **Admin & Organizer Console**:
  - **5-Step Tournament Wizard**: Basic Info ➔ Format & Rules ➔ Schedule ➔ Pricing ➔ Instant Publish.
  - **Elimination Bracket Generator**: Visual tree rendering of Quarterfinals ➔ Semifinals ➔ Grand Championship Final with live advancement.
  - **Live Score Console**: Real-time score adjusters (`+1` / `-1`) and instant live commentary publishing feed.
  - **Registration Management**: Approve/reject team applications, manage participant caps, and track payments.
  - **Analytics & Revenue**: Visual charts for registrations, active leagues, and revenue generated.

### 3. Modern Design System & Themes
- Built with high-performance responsive components.
- Seamless **Dark Mode** and **Light Mode** support with smooth color token transitions.
- Interactive charts powered by `Chart.js` & `react-chartjs-2`.
- Celebration effects with `canvas-confetti` upon championship victories.

---

## 🔄 Tournament Lifecycle Workflow

```text
[ Admin: 5-Step Wizard ] ──► Define Sport, Rules, Slots, Fees & Schedule
                                        │
                                        ▼
[ Participant Registration ] ──► Athlete signs up & receives QR Entry Pass
                                        │
                                        ▼
[ Automated Brackets ]   ──► Generates Single/Double Elimination trees
                                        │
                                        ▼
[ Live Referee Console ] ──► Real-time scores & live commentary broadcast
                                        │
                                        ▼
[ Standings & Victory ]  ──► Points auto-calculate; Confetti celebration
```

---

## 🛠️ Technology Stack (Full-Stack MERN Architecture)

- **Frontend**: React 19, Vite, Modern CSS Design Tokens (Dark/Light mode), Lucide Icons
- **Backend API**: Node.js & Express.js RESTful API
- **Database**: MongoDB (Local Community Server & MongoDB Atlas Cloud)
- **Object Data Modeling (ODM)**: Mongoose 8.x with schemas, indexes, and virtuals
- **Data Visualization**: Chart.js & React-Chartjs-2
- **Interactive FX**: Canvas Confetti
- **Deployment**: Vercel (Frontend), Render (Express Backend Web Service), MongoDB Atlas (Cloud Database)

---

## 🗄️ Database Architecture & Schemas

The database layer runs on **MongoDB** with strongly typed Mongoose schemas:

1. **`Tournament`**:
   - `id`, `name`, `sport`, `category`, `format` (Knockout/Round Robin/Swiss), `status`, `startDate`, `endDate`, `venue`, `entryFee`, `prizePool`, `maxParticipants`, `registeredCount`, `rules`, `bannerImage`, `featured`.
   - Indexed on `id`, `sport`, `status`, and `featured` for rapid search and multi-criteria filtering.
2. **`Fixture`**:
   - Nested elimination stages (`quarterFinals`, `semiFinals`, `final`).
   - Match sub-documents: `team1`, `score1`, `team2`, `score2`, `winner`, `status` (`Live`, `Completed`, `Scheduled`), `time`, `court`.
3. **`Registration`**:
   - Athlete registration records, auto-generated digital ticket code (e.g., `SP-CRK-9921`), payment status, team affiliations.
4. **`Leaderboard`**:
   - Competitive athlete statistics: rank, points, wins, matches played, win rate, and performance badges.
5. **`Notification`**:
   - Real-time tournament alert feed and status notifications.

---

## 🚀 Quick Start (Local Development)

### 1. Start the MongoDB Backend Server
```bash
cd server
npm install
npm start
# Server boots on http://localhost:5000 and auto-seeds initial tournaments to MongoDB
```

### 2. Start the React Frontend
```bash
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🌐 Free Cloud Deployment Guide

### Step 1: Create Free MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a free **M0 Sandbox Cluster** (select any nearby region, e.g. AWS Mumbai or Frankfurt).
3. Under **Database Access**, create a database user (username & password).
4. Under **Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Click **Connect** ➔ **Drivers** ➔ Copy the Connection String URI:
   `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/sportpulse_db?retryWrites=true&w=majority`

### Step 2: Deploy Backend to Render (Free)
1. Push your repository to GitHub.
2. Go to [Render.com](https://render.com) and create a new **Web Service**.
3. Select your repository:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add:
   - `MONGODB_URI`: *(Paste your MongoDB Atlas connection string from Step 1)*
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
5. Click **Deploy Web Service**. Render provides a public URL (e.g. `https://sportpulse-api.onrender.com`).

### Step 3: Deploy Frontend to Vercel or Netlify (Free)
1. Go to [Vercel.com](https://vercel.com) and import your GitHub repository.
2. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://sportpulse-api.onrender.com/api`
3. Click **Deploy**. Your full-stack sports platform is now live on the internet!

---

## 💼 Resume Bullet Points

You can include this project in your resume under **Projects** or **Full-Stack Development**:

- **SportPulse — Full-Stack Sports Tournament & Athletic Operations Platform (MERN Stack)**
  - *Tech Stack*: MongoDB, Express.js, React 19, Node.js, Mongoose ODM, Chart.js, Vite.
  - Engineered a full-stack tournament management platform featuring public spectator portals, an athlete pass generator with unique digital tickets, and an administrative console with a 5-step tournament wizard.
  - Designed and deployed RESTful micro-endpoints using Express.js and MongoDB Atlas, managing relational-like tournament trees, participant registrations, and multi-stage knockout brackets.
  - Built real-time referee scorekeeper console enabling live match score updates, automated winner advancement in single/double elimination brackets, and recalculation of league standings.
  - Implemented resilient client-side API state synchronization with automated fallback, health check diagnostics, and container-ready deployment on Render and Vercel.

