# node-project2
node, maridb, sequilizer backend and react front.

## Install and Run

### Prerequisites
- Node.js (v18+ recommended)
- npm (comes with Node.js)
- MariaDB server (for backend database)

### 1. Install dependencies

#### Backend
```
cd server
npm install
```

#### Frontend
```
cd ../my-react-app
npm install
```

### 2. Configure Database
- Edit `server/src/config/database.js` or `.env` if you need to change DB credentials.
- Make sure MariaDB is running and accessible.

### 3. Running the App

From the `server` directory, run:
```
npm start
```
This will start both the backend (API server) and the frontend (React app) concurrently.

- Backend: [http://localhost:3001](http://localhost:5000) (default)
- Frontend: [http://localhost:3000](http://localhost:3000)
-> /nav
-> /paperbase

### 4. Restore Database from Backup (optional)
To restore the latest backup, run from the project root:
```
bash restore-latest-backup.sh
```

**Note:** The script will also create the appropriate db if does not exist

---
For more details, see the `my-react-app/README.md` for frontend usage and scripts.
