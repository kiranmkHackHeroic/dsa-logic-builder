# 🧠 DSA Logic Builder

<div align="center">

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend%20on-Render-46E3B7?logo=render&logoColor=white)](https://render.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-3.6%20Flash-8E75C2?logo=google&logoColor=white)](https://aistudio.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<br/>

**Transform algorithmic problem-solving from rote memorization into deep, intuitive logic.**  
*A modern full-stack web application designed to guide developers step-by-step through algorithmic thinking, dynamic visual simulations, and AI-powered execution traces.*

<br/>

<p align="center">
  <img src="./docs/screenshots/problem_flow_7step.png" alt="7-Step DSA Problem Flow" width="880" style="border-radius: 12px; box-shadow: 0 12px 36px rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.1);" />
</p>

<br/>

[🌟 7-Step Framework](#-feature-spotlight-1-the-7-step-dsa-mastery-framework) • [🤖 AI Dry Run](#-feature-spotlight-2-ai-powered-code-dry-run-engine) • [💻 Local Setup](#-local-development-setup) • [📡 API Reference](#-api-endpoints) • [🗄️ Database Schema](#️-database-schema)

</div>

---

## 🌟 Why DSA Logic Builder?

Most competitive programmers and interview candidates struggle not because they lack programming syntax, but because they **jump straight to code without understanding the underlying thought process**.

When faced with an unseen problem in high-stakes technical interviews, rushing into syntax causes:
- ❌ **Syntax panic** and blanking out under interview pressure.
- ❌ **Off-by-one errors** and unhandled boundary edge cases.
- ❌ **Suboptimal brute-force solutions** that trigger Time Limit Exceeded (TLE).

**DSA Logic Builder** systematically dismantles these pain points through:
1. **The 7-Step Problem-Solving Ladder** — A disciplined, sequential thinking framework that builds rock-solid algorithmic intuition before writing syntax.
2. **AI-Powered Code Dry Run (Google Gemini)** — Real-time line-by-line simulation of your code showing live variable mutations, automatic bug detection, and complexity analysis.
3. **Interactive Visualizer** — Dynamic step-by-step array and pointer animation engine.
4. **Cloud-Synced Progress** — Multi-device state persistence, daily streak tracking, activity heatmaps, and personal problem notes backed by MySQL.

---

## 🎯 Feature Spotlight 1: The 7-Step DSA Mastery Framework

Every single problem is broken down into structured, bite-sized cognitive stages:

<p align="center">
  <img src="./docs/screenshots/problem_flow_7step.png" alt="7-Step Problem Flow View" width="880" style="border-radius: 12px; box-shadow: 0 12px 36px rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.1);" />
</p>

| Step | Stage Name | What Happens | Why It Matters |
| :---: | :--- | :--- | :--- |
| **1** | **Understand the Problem** | Extract input/output data types, boundary constraints, and restate the problem in your own words. | Prevents solving the wrong problem or missing crucial numeric edge cases. |
| **2** | **Human Thinking** | Walk through small examples manually using pen-and-paper logic. | Uncovers the natural human intuition behind the pattern. |
| **3** | **Brute Force** | Formulate the naive solution, determine theoretical bounds ($O(n^2)$ / $O(2^n)$), and identify bottlenecks. | Provides a guaranteed baseline and highlights redundant operations. |
| **4** | **Optimization** | Discover optimal algorithmic patterns (Two Pointers, Sliding Window, Monotonic Stack, DP). | Builds pattern recognition across 15+ core algorithmic archetypes. |
| **5** | **Final Approach** | Write structured pseudocode, establish loop invariants, and confirm final time/space complexity. | Creates an airtight algorithmic blueprint before touching code syntax. |
| **6** | **Coding & AI Dry Run** | Implement in Python 3, JavaScript, Java, or C++ with live test cases and Gemini AI dry-run execution. | Produces clean, verified code with immediate bug and off-by-one detection. |
| **7** | **Visualization** | Watch animated data structure simulations showing pointer movements, arrays, and trees. | Solidifies spatial memory of dynamic algorithmic execution. |

---

## 🤖 Feature Spotlight 2: AI-Powered Code Dry Run Engine

Writing code is only half the battle — understanding *how it executes line-by-line* is where mastery happens. The **AI Dry Run** feature simulates your code in real-time using **Google Gemini AI (`gemini-3.6-flash`)**.

<p align="center">
  <img src="./docs/screenshots/ai_dryrun.png" alt="AI Code Dry Run in Action" width="880" style="border-radius: 12px; box-shadow: 0 12px 36px rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.1);" />
</p>

### Key Capabilities:
- **📊 Live State Snapshot Table**: Real-time inspection of all variables, pointers (`left`, `right`, `mid`), counters, and hash maps at each step.
- **⏯️ Interactive Step Player**: Step through execution with **Previous Step**, **Next Step**, **Auto-Play**, and **Reset** controls.
- **🚨 Automated Bug & Edge-Case Detection**:
  - Automatically identifies unfulfilled stubs, missing returns, infinite loops, and array out-of-bounds indexing.
  - Displays a prominent **`Bug Detected`** badge with specific, actionable remediation steps.
- **⚡ Complexity Verification**: Real-time evaluation of both **Time Complexity** ($O$) and **Space Complexity** ($O$) based on your code's loops and allocations.
- **💡 Plain-English Explanations**: Details what each line accomplishes and why variable values changed.
- **🚀 One-Click LeetCode Export**: Copies your verified solution to clipboard and opens the exact LeetCode problem page in a new tab.

---

## 🛠️ Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                 Frontend SPA (React 18 + Vite)              │
│       Hosted on Vercel Global Edge CDN (Auto SSL / SPA)     │
│   Tailwind CSS • shadcn/ui • Radix UI • Lucide • TypeScript │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS REST API (JSON / JWT)
┌──────────────────────────────▼──────────────────────────────┐
│              Backend REST API (Node.js + Express)           │
│              Hosted on Render (0.0.0.0 Port 10000)          │
│    Helmet Security • Express Rate Limit • JWT Auth • CORS   │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      Cloud MySQL Database    │ │     Google Gemini AI       │
│  Hosted on Aiven / Railway   │ │  gemini-3.6-flash Engine   │
│  Users • Progress • Streaks  │ │  Live Execution Simulator  │
│   Roles • Code Solutions     │ │  Bug & Complexity Analysis │
└──────────────────────────────┘ └────────────────────────────┘
```

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Host** | **Vercel** | Ultra-fast Global Edge CDN with automated SPA rewrites |
| **Frontend Framework** | **React 18 + Vite + TypeScript** | Client-side Single Page Application with shadcn/ui and Tailwind |
| **Backend Host** | **Render** | Persistent Node.js Web Service with automatic deploys from Git |
| **Backend Framework** | **Express.js 4.x** | Secure REST API with Helmet, JWT auth, rate limiting, and CORS |
| **Database** | **MySQL 8.0+** | Relational database (hosted on Aiven or Railway) |
| **AI Engine** | **Google Gemini (`gemini-3.6-flash`)** | Code execution simulation, variable tracing, and complexity checks |

---

## 📂 Project Structure

```
dsa-logic-builder/
├── frontend/                     # React 18, TypeScript, Tailwind, Vite SPA
│   ├── src/
│   │   ├── components/           # 7-Step logic ladder, visualizers, navigation
│   │   ├── contexts/             # AuthContext, SubscriptionContext
│   │   ├── data/                 # Curated problem banks & company question tracks
│   │   ├── hooks/                # Custom hooks (streaks, progress, bookmarks, roles)
│   │   ├── lib/                  # apiClient, auth tokens, progressStorage
│   │   └── pages/                # ProblemSolving, Dashboard, Analytics, Auth, Admin
│   ├── public/                   # Favicons, icons, and static assets
│   ├── vercel.json               # Vercel SPA rewrites (/* -> /index.html) & headers
│   ├── vite.config.ts            # Vite configuration & path aliases
│   ├── tailwind.config.ts        # Tailwind theme tokens & design system
│   └── package.json              # Frontend dependencies and build scripts
│
├── backend/                      # Node.js, Express, MySQL REST API Server
│   ├── routes/
│   │   ├── auth.js               # Sign up, login, user verification, password change
│   │   ├── dryrun.js             # Gemini AI dry-run code execution endpoint
│   │   ├── progress.js           # Problem step completion & code persistence
│   │   ├── streaks.js            # Daily activity streak & check-in logic
│   │   ├── profiles.js           # Display name, preferences, avatar upload
│   │   └── roles.js              # Role-based access control (RBAC)
│   ├── middleware/
│   │   └── auth.js               # JWT verification & route guards
│   ├── db.js                     # MySQL2 connection pool with auto-database routing
│   ├── schema.sql                # Complete relational schema (tables & triggers)
│   ├── setup-db.js               # Automated database migration & schema runner
│   ├── package.json              # Backend dependencies (express, mysql2, helmet, etc.)
│   └── index.js                  # Express app entry point bound to 0.0.0.0
│
├── docs/                         # Screenshots and architecture diagrams
│   └── screenshots/
├── render.yaml                   # Render Blueprint for automated cloud deployment
├── package.json                  # Root monorepo scripts (dev, build, test, install)
├── .gitignore                    # Git exclusions (node_modules, dist, secrets)
├── LICENSE                       # MIT License
└── README.md                     # Comprehensive project documentation
```

---

## 💻 Local Development Setup

Follow these steps to run the entire stack on your local machine:

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MySQL**: 8.0+ installed locally or cloud connection

### 1. Clone the Repository
```bash
git clone https://github.com/kiranmkHackHeroic/dsa-logic-builder.git
cd dsa-logic-builder
```

### 2. Install All Dependencies
```bash
# Installs root, frontend, and backend packages in one step:
npm run install:all
```

### 3. Configure Local Environment Variables

**Backend (`backend/.env`)**:
```env
PORT=3001
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=dsa_logic_builder
JWT_SECRET=development-jwt-secret-key-12345
CORS_ORIGIN=http://localhost:8080
GEMINI_API_KEY=your_gemini_api_key_here
```

**Frontend (`frontend/.env.local`)**:
```env
VITE_API_URL=http://localhost:3001
```

### 4. Initialize the Local Database
```bash
npm run setup:db
```

### 5. Launch the Development Servers
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:8080`
- **Backend API**: `http://localhost:3001`
- **API Health Check**: `http://localhost:3001/api/health`

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/signup` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | No |
| `GET` | `/api/auth/me` | Fetch currently authenticated user | Yes |
| `PUT` | `/api/auth/update-password` | Update current user password | Yes |

### Problem Progress (`/api/progress`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/progress` | Retrieve all solved problems for user | Yes |
| `GET` | `/api/progress/:problemId` | Fetch progress details for a problem | Yes |
| `PUT` | `/api/progress/:problemId` | Save step completion and code solution | Yes |

### AI Dry Run Engine (`/api/ai`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/ai/dryrun` | Run Gemini AI line-by-line simulation | No |

### Streaks & Profiles (`/api/streaks`, `/api/profiles`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/streaks` | Get active streak count & streak calendar | Yes |
| `POST` | `/api/streaks/checkin` | Record daily activity check-in | Yes |
| `PUT` | `/api/profiles` | Update display name or preferences | Yes |
| `POST` | `/api/profiles/avatar` | Upload profile image (multipart/form-data) | Yes |

---

## 🗄️ Database Schema

The database consists of 6 primary tables created via [`backend/schema.sql`](backend/schema.sql):

- **`users`**: User identities, bcrypt password hashes, display names, avatars, and timestamps.
- **`problem_progress`**: 7-step progression records, step answers, score, code solution, and time spent.
- **`user_streaks`**: Current streak, longest streak, last check-in date, and activity tracking.
- **`user_bookmarks`**: Bookmarked problems for revision and spaced repetition.
- **`user_notes`**: Markdown-enabled personal notes stored per problem.
- **`interview_history`**: Mock interview session records, questions, and scores.

---

## 🤝 Contributing

Contributions make the developer community an amazing place to learn and build. Any contributions you make are **greatly appreciated**!

1. Fork the Project.
2. Create your Feature Branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your Changes:
   ```bash
   git commit -m 'feat: Add AmazingFeature'
   ```
4. Push to the Branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

Built with ❤️ for developers mastering algorithmic problem-solving.  
**If you found this project helpful, please consider giving it a Star ⭐!**

</div>
