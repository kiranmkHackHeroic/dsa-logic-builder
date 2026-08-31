# DSA Logic Builder

DSA Logic Builder helps learners practice problem-solving by focusing on thinking patterns, logic breakdown, and visual simulation, not just final code.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend API**: Node.js, Express, JWT Authentication, bcryptjs
- **Database**: MySQL (`dsa_logic_builder`)

## Local Development

### 1) Install dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 2) Configure Environment

Check `server/.env`:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=dsa_logic_builder
JWT_SECRET=dev-secret-key-change-in-production
PORT=3001
CORS_ORIGIN=http://localhost:8080
```

### 3) Database Setup

Initialize the MySQL database and schema:

```bash
node server/setup-db.js
```

### 4) Run the Application

Run both the Vite frontend and Express API simultaneously:

```bash
npm run dev:all
```

- **Frontend**: http://localhost:8080
- **API Server**: http://localhost:3001

### 5) Production Build

```bash
npm run build
```
