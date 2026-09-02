# 🚀 DSA Logic Builder - Deployment Guide

Complete instructions for deploying **DSA Logic Builder** to **Render** or **Vercel**, paired with the Express Backend and MySQL Database.

---

## 🏗️ Architecture Overview

- **Frontend (`/frontend`)**: React 18 + TypeScript + Vite + Tailwind CSS SPA
  - Deployable on **Render** (Static Site) or **Vercel** (Global CDN Edge)
- **Backend (`/backend`)**: Node.js + Express REST API
  - Deployable on **Render** (Web Service), **Railway**, **Fly.io**, or any VPS
- **Database**: MySQL 8.0+
  - Deployable on **Aiven**, **Railway MySQL**, **PlanetScale**, **AWS RDS**, or cloud MySQL

---

# 🟣 Option 1: Deploy Everything on Render (Recommended)

Render can host **both** your Frontend (Static Site - Free) and your Backend (Web Service) from the same repository. A pre-configured [`render.yaml`](./render.yaml) Blueprint is included in this repository.

### Method A: 1-Click Render Blueprint (Fastest)

1. Push your code to **GitHub** or **GitLab**.
2. Go to the [Render Dashboard](https://dashboard.render.com).
3. Click **"New +"** (top right) > **"Blueprint"**.
4. Connect your repository.
5. Render will automatically detect [`render.yaml`](./render.yaml) and configure two services:
   - `dsa-logic-builder-api` (Express Web Service)
   - `dsa-logic-builder-frontend` (Static Site with SPA rewrite rules)
6. Enter your MySQL database environment variables (see below) and click **"Apply"**.

---

### Method B: Manual Render Setup (Step-by-Step)

#### Step 1: Deploy the Backend (Web Service)
1. In Render Dashboard, click **"New +"** > **"Web Service"**.
2. Connect your repository.
3. Configure settings:
   - **Name**: `dsa-logic-builder-api`
   - **Region**: Closest to your users / database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: `Free`
4. Configure **Environment Variables**:
   | Key | Example Value | Description |
   |---|---|---|
   | `PORT` | `10000` | Render port (auto-assigned) |
   | `JWT_SECRET` | `generate-a-strong-random-key` | Secret for user sessions |
   | `MYSQL_HOST` | `your-mysql-host.aivencloud.com` | Database hostname |
   | `MYSQL_PORT` | `3306` | Database port |
   | `MYSQL_USER` | `your-user` | Database user |
   | `MYSQL_PASSWORD` | `your-password` | Database password |
   | `MYSQL_DATABASE` | `dsa_logic_builder` | Database name |
   | `MYSQL_SSL` | `true` | Enable SSL for cloud DBs |
   *(Alternatively, set `DATABASE_URL=mysql://user:pass@host:port/dbname`)*
5. Click **Create Web Service**. Once deployed, copy your backend URL:
   `https://dsa-logic-builder-api.onrender.com`

---

#### Step 2: Deploy the Frontend (Static Site)
1. In Render Dashboard, click **"New +"** > **"Static Site"**.
2. Connect your repository.
3. Configure settings:
   - **Name**: `dsa-logic-builder-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add **Environment Variable**:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://dsa-logic-builder-api.onrender.com` *(from Step 1)* |
5. Configure **Redirects / Rewrites** (Critical for React Router):
   - Scroll to **Redirects/Rewrites** and click **Add Rule**:
     - **Type**: `Rewrite`
     - **Source**: `/*`
     - **Destination**: `/index.html`
6. Click **Create Static Site**.

---

# ▲ Option 2: Deploy Frontend to Vercel

### Method A: Vercel Web Dashboard (Git Integration)

1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** > **"Project"** and select your repository.
4. Choose either:
   - **Zero-Config Monorepo (Default)**: Keep **Root Directory** as `./`. The included [`vercel.json`](./vercel.json) handles building `frontend/dist`.
   - **Subdirectory Option**: Set **Root Directory** to `frontend`. Preset: `Vite`, Build: `npm run build`, Output: `dist`.
5. Under **Environment Variables**, add:
   ```env
   VITE_API_URL=https://your-backend-api.onrender.com
   ```
6. Click **Deploy**.

### Method B: Vercel CLI

```bash
cd frontend
npx vercel
# Follow prompts, then deploy to production:
npx vercel --prod
```

---

## 🗄️ Database Provisioning & Schema Setup

Because the app uses MySQL 8.0+:

1. **Free/Managed MySQL Providers**:
   - [Aiven](https://aiven.io/mysql) (Free MySQL service)
   - [Railway](https://railway.app) (MySQL addon)
   - [PlanetScale](https://planetscale.com)
   - [AWS RDS / Cloud SQL](https://aws.amazon.com/rds/)

2. **Initialize the Database Schema**:
   Run [`backend/schema.sql`](./backend/schema.sql) in your database query console, or execute the local setup script targeting your remote DB:
   ```bash
   DATABASE_URL="mysql://user:pass@host:port/dbname" npm run setup:db
   ```

---

## 🔍 Verification Checklist

- [ ] **Health Endpoint**: Visit `https://your-backend.onrender.com/api/health` -> should return `{"status":"ok"}`.
- [ ] **SPA Route Refresh**: Open `/problems` on your frontend and press browser Refresh. If it loads without 404, rewrites are working.
- [ ] **CORS**: Both `*.onrender.com` and `*.vercel.app` domains are automatically whitelisted in `backend/index.js`.
- [ ] **Registration/Login**: Test user registration to confirm database read/write and JWT creation.
