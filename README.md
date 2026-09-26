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

## 🛠️ Technology Stack

- **Framework**: React 19 (Vite)
- **Styling**: Modern CSS Design System (Custom Tokens, Dark/Light Themes)
- **Icons**: Lucide React
- **Data Visualization**: Chart.js & React-Chartjs-2
- **Interactive FX**: Canvas Confetti
- **State Management**: React Context & Hooks
