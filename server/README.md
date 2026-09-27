# 🚀 SportPulse REST API & MongoDB Database Engine

The backend for **SportPulse**, an athletic tournament and sports management platform. Built with **Node.js, Express.js, and MongoDB (via Mongoose ODM)**, providing persistent data storage, real-time match scoring, participant ticket generation, and automated seeding.

---

## 🛠️ Architecture & Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB (Local MongoDB Community Server & MongoDB Atlas Cloud)
- **ODM**: Mongoose 8.x
- **Middleware**: CORS, Morgan (HTTP request logger), Dotenv

---

## 📡 REST API Endpoints

### 🩺 Health & Diagnostics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns server health, MongoDB connection state, cluster host, and collection counts |
| `POST` | `/api/seed` | Reseeds database collections with fresh sports tournament records (`{ "force": true }`) |

### 🏆 Tournaments
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tournaments` | Query all tournaments with optional filters: `?sport=football&status=Live&search=cup` |
| `GET` | `/api/tournaments/:id` | Fetch detailed single tournament record |
| `POST` | `/api/tournaments` | Create new tournament (auto-generates unique ID, rules array, registration limits) |
| `PUT` | `/api/tournaments/:id` | Update tournament information or publication status |
| `DELETE` | `/api/tournaments/:id` | Delete tournament and cascade delete associated fixtures/registrations |

### ⚔️ Fixtures & Bracket Scores
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/fixtures` | Get all knockout brackets mapped by tournament ID |
| `GET` | `/api/fixtures/:tournamentId` | Get tournament-specific bracket fixtures |
| `PUT` | `/api/fixtures/:tournamentId/match` | Update match scorecard in MongoDB (`stage`, `matchId`, `score1`, `score2`, `winnerName`) |

### 📝 Registrations & Digital Passes
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/registrations` | Fetch registrations with optional `?tournamentId=&email=` filters |
| `POST` | `/api/registrations` | Register participant, increment tournament count, generate digital pass ticket code |
| `PUT` | `/api/registrations/:id/status` | Update approval or payment status |

### 🏅 Leaderboard & Notifications & Stats
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/leaderboard` | Get athlete rankings, wins, match stats, and badges |
| `GET` | `/api/notifications` | Fetch system and match alerts |
| `PUT` | `/api/notifications/:id/read` | Mark alert as read |
| `GET` | `/api/stats` | Aggregated metrics for Admin dashboard (revenue, participants, active leagues) |

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sportpulse_db
NODE_ENV=development
```

For production deployment on **MongoDB Atlas**:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/sportpulse_db?retryWrites=true&w=majority
```
