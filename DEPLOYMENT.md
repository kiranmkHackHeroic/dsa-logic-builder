# 🚀 Deployment Guide

## Architecture Overview

- **Frontend**: React + Vite SPA (deployable on Vercel, Netlify, or any static host)
- **Backend**: Node.js + Express REST API (deployable on Railway, Render, Fly.io, or VPS)
- **Database**: MySQL 8.0+ (AWS RDS, PlanetScale, Railway, or managed MySQL)

---

## 1. Backend & Database Deployment (e.g. Railway / Render)

1. **Deploy MySQL Database**:
   - Provision a MySQL 8.0+ instance.
   - Note the connection host, port, user, password, and database name.
   - Run the initial schema from `server/schema.sql`.

2. **Deploy Express Server** (`/server` directory):
   - Set the root directory for the service to `server`.
   - Set start command: `node index.js`.
   - Configure Environment Variables:
     ```env
     MYSQL_HOST=your-mysql-host
     MYSQL_PORT=3306
     MYSQL_USER=your-mysql-user
     MYSQL_PASSWORD=your-mysql-password
     MYSQL_DATABASE=dsa_logic_builder
     JWT_SECRET=use-a-strong-random-secret-key
     PORT=3001
     CORS_ORIGIN=https://your-frontend-domain.vercel.app
     ```

---

## 2. Frontend Deployment (Vercel)

1. Import the repository into Vercel.
2. Build Settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Configure Environment Variables:
   ```env
   VITE_API_URL=https://your-backend-api-domain.com
   ```
4. Deploy!
