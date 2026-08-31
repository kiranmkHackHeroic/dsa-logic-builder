# 🧠 DSA Logic Builder

<div align="center">

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-Flash%20AI-8E75C2?logo=google&logoColor=white)](https://aistudio.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<br/>

**Transform algorithmic problem-solving from rote memorization into deep, intuitive logic.**  
*A modern full-stack web application designed to guide developers step-by-step through algorithmic thinking, dynamic visual simulations, and AI-powered execution traces.*

[Explore Features](#-key-features) • [7-Step Framework](#-the-7-step-logic-framework) • [Quickstart](#-getting-started) • [API Reference](#-api-endpoints) • [Deployment](#-deployment)

</div>

---

## 🌟 Why DSA Logic Builder?

Most competitive programmers struggle not because they don't know the syntax, but because they **jump straight to code without understanding the underlying thought process**.

**DSA Logic Builder** solves this by enforcing a disciplined **7-step structured problem-solving methodology**, augmented with an **AI Code Dry Run engine powered by Google Gemini**, visual algorithm animations, company interview tracks, and streak analytics.

---

## 🚀 Key Features

### 🧩 1. The 7-Step Logic Framework
Every problem is broken down into structured, bite-sized cognitive stages:
1. **Understand**: Identify inputs, expected outputs, constraints, and edge cases.
2. **Human Thinking**: Walk through the problem manually with concrete pen-and-paper reasoning.
3. **Brute Force**: Formulate the naive solution, determine time/space bounds, and identify bottlenecks.
4. **Optimization**: Discover algorithmic patterns (Two Pointers, Hash Maps, Sliding Window, DP).
5. **Final Approach**: Build pseudocode, state invariants, and step-by-step logic flow.
6. **Code & AI Dry Run**: Implement solutions in Python, JavaScript, Java, or C++ with test runners, auto-save, and instant LeetCode integration.
7. **Visualization**: Watch animated data structure simulations showing pointer movements, arrays, and tree traversals.

### 🤖 2. AI-Powered Code Dry Run (Google Gemini)
- **Live Variable State Inspector**: Real-time snapshot of variables, maps, and pointers at every loop iteration.
- **Line-by-Line Execution Explanation**: Plain-English rationale behind each operation.
- **Asymptotic Complexity**: Instant time ($O$) and space ($O$) complexity calculations.
- **Bug & Edge-Case Detection**: Automated detection of off-by-one errors, infinite loops, and boundary conditions.
- **Smart Fallback Engine**: Works out-of-the-box with algorithmic simulation even when offline.

### 🏢 3. Company-Specific Problem Tracks
- Curated question banks frequently asked at **Google**, **Amazon**, **Meta**, **Microsoft**, **Apple**, and **Uber**.
- Tagged by company frequency, difficulty level, and core algorithmic concepts.

### 📊 4. Progress Tracking & Analytics
- **GitHub-style Activity Heatmap**: Visual log of daily practice consistency.
- **Streak Tracker**: Automatic calculation of current and maximum daily problem-solving streaks.
- **Pattern Mastery Matrix**: Skill radar tracking proficiency across core patterns.
- **Achievements & Badges**: Unlock milestones as you progress.

### ⏱️ 5. Interview & Contest Tools
- **Mock Interview Mode**: Practice under realistic timed constraints without hints.
- **Integrated Pomodoro Timer**: Focused 25-minute problem-solving sprints.
- **Interactive Code Comparison Tool**: Side-by-side comparison of brute-force vs. optimal approaches.
- **Personalized Notes & Bookmarks**: Save custom notes and tag tricky problems for spaced repetition.

---

## 🛠️ Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Vite + React)                  │
│   Tailwind CSS • shadcn/ui • Radix UI • Lucide • TypeScript  │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API (JSON / JWT)
┌──────────────────────────────▼──────────────────────────────┐
│                  Backend (Node.js + Express)                │
│    Helmet Security • Express Rate Limit • JWT Auth • CORS   │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      MySQL Database          │ │     Google Gemini AI       │
│  Users • Progress • Streaks  │ │  gemini-3.6-flash Engine   │
│   Roles • Code Solutions     │ │  Live Execution Simulator  │
└──────────────────────────────┘ └────────────────────────────┘
```

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite | Ultra-fast SPA with reactive state |
| **Styling** | Tailwind CSS, shadcn/ui | Modern, responsive, accessible dark/light UI |
| **Backend** | Node.js, Express.js | Secure RESTful API service |
| **Database** | MySQL 8.0+ | Relational schema with transactional consistency |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs | Secure password hashing (12 salt rounds) |
| **AI Engine** | Google Gemini (`gemini-3.6-flash`) | Context-aware code execution and dry run simulation |

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MySQL**: 8.0+ (local instance or cloud database like Railway/Aiven)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/dsa-logic-builder.git
cd dsa-logic-builder
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

---

### 3. Configure Environment Variables

#### Backend (`server/.env`)
Create `server/.env` (or copy from `server/.env.example`):

```env
# MySQL Database
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=dsa_logic_builder

# Authentication Secret
JWT_SECRET=generate-a-strong-secret-key-for-production

# Server Settings
PORT=3001
CORS_ORIGIN=http://localhost:8080

# Google Gemini AI (Optional - for live AI dry-runs)
# Get a free key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Frontend (`.env.local` - Optional)
```env
VITE_API_URL=http://localhost:3001
```

---

### 4. Initialize the MySQL Database

Run the database setup script to automatically create the database and tables:

```bash
node server/setup-db.js
```

---

### 5. Launch the Application

Run both frontend and backend concurrently:

```bash
npm run dev:all
```

- **Frontend Application**: `http://localhost:8080`
- **Express API Server**: `http://localhost:3001`
- **API Health Check**: `http://localhost:3001/api/health`

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/signup` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate and receive JWT | No |
| `GET` | `/api/auth/me` | Retrieve active user profile | Yes |
| `PUT` | `/api/auth/update-password` | Update current password | Yes |

### Problem Progress (`/api/progress`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/progress` | Get all solved problem records | Yes |
| `GET` | `/api/progress/:problemId` | Get progress for a specific problem | Yes |
| `PUT` | `/api/progress/:problemId` | Save step completion & code solution | Yes |

### AI Dry Run Engine (`/api/ai`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/ai/dryrun` | Perform AI line-by-line simulation & trace | No |

### Streaks & Profiles (`/api/streaks`, `/api/profiles`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/streaks` | Get current user's streak count & history | Yes |
| `POST` | `/api/streaks/checkin` | Record daily activity check-in | Yes |
| `PUT` | `/api/profiles` | Update display name or preferences | Yes |
| `POST` | `/api/profiles/avatar` | Upload profile image (multipart/form-data) | Yes |

---

## 🚀 Deployment

### 1. Deploy MySQL Database & Backend (Railway / Render)
1. Provision a MySQL 8.0 instance on [Railway](https://railway.app) or [Aiven](https://aiven.io).
2. Execute `server/schema.sql` against the database to create all tables.
3. Deploy the `/server` directory to Railway or Render:
   - **Root Directory**: `server`
   - **Start Command**: `node index.js`
   - **Environment Variables**: Add your database credentials, `JWT_SECRET`, `GEMINI_API_KEY`, and set `CORS_ORIGIN` to your frontend domain.

### 2. Deploy Frontend (Vercel)
1. Import your GitHub repository to [Vercel](https://vercel.com).
2. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Environment Variable**: `VITE_API_URL=https://your-backend-api.railway.app`
3. Click **Deploy**.

---

## 📂 Project Structure

```
dsa-logic-builder/
├── public/                 # Static assets and icons
├── server/                 # Express backend
│   ├── middleware/         # JWT authentication and RBAC guards
│   ├── routes/             # Auth, AI Dry Run, Progress, Streaks, Profiles
│   ├── db.js               # MySQL connection pool
│   ├── schema.sql          # Full database schema and indexes
│   ├── setup-db.js         # Automated schema initializer
│   └── index.js            # Express server entry point
├── src/
│   ├── components/
│   │   ├── features/       # Heatmaps, timers, notes, forums, contests
│   │   ├── layout/         # Responsive Navbar, Footer, Page Layouts
│   │   ├── problem/        # 7-Step logic components & DryRunModal
│   │   └── ui/             # Radix UI + Tailwind design components
│   ├── contexts/           # Authentication and subscription state
│   ├── data/               # Curated problems and company tracks
│   ├── hooks/              # Custom hooks (progress, streaks, bookmarks)
│   ├── lib/                # API client, local storage, utilities
│   ├── pages/              # Problem Solving, Dashboard, Analytics, Auth
│   ├── App.tsx             # Route definitions and error boundary
│   └── main.tsx            # Application entry point
├── vercel.json             # Vercel SPA rewrites & security headers
├── tailwind.config.ts      # Design system color tokens and typography
└── vite.config.ts          # Vite build optimization
```

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Built with ❤️ for passionate problem solvers. If you find this project helpful, don't forget to **Star ⭐ this repository**!

</div>
