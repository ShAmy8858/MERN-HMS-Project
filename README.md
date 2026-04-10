# PulseCare Hospital Appointment Management

PulseCare is a full-stack hospital appointment platform built with React, Express, and MongoDB. The application delivers a Material UI-driven experience for staff while providing administrators with secure tools for managing appointments and user accounts.

## Key Features

- **JWT authentication** with remember-device support, stored securely in browser storage.
- **Role-aware routing** that restricts the admin dashboard to administrators only.
- **Comprehensive appointment workflow** including creation, status changes, editing, and deletion.
- **Team management** for admin users to onboard additional staff members.
- **MongoDB persistence** for users and appointments with seeded demo accounts.

## Tech Stack

- Frontend: React 18, Vite 5, React Router DOM 6, Material UI 5.
- Backend: Node.js 18, Express 4, MongoDB 7 (via Mongoose 7), JSON Web Tokens, bcrypt.
- Tooling: ESLint (optional), Nodemon for backend development.

## Repository Structure

```
.
├── index.html
├── package.json          # Frontend dependencies
├── server/               # Express API (separate package.json)
├── src/                  # React application source
└── vite.config.js
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or Atlas). MongoDB Compass works with the provided URI.

## Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Update `.env` with your MongoDB connection string and a strong `JWT_SECRET`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/pulsecare
JWT_SECRET=replace-with-secure-value
PORT=4000
```

Start the API (defaults to http://localhost:4000):

```bash
npm run dev
```

The server seeds two demo accounts on first launch:

| Role  | Email               | Password  |
| ----- | ------------------- | --------- |
| Admin | admin@pulsecare.com | Admin@123 |
| Staff | staff@pulsecare.com | Staff@123 |

## Frontend Setup

From the repository root:

```bash
npm install
```

Create a `.env` file (or `.env.local`) and point the UI to the API base URL if different from the default:

```
VITE_API_BASE_URL=http://localhost:4000/api
```

Run the Vite development server:

```bash
npm run dev
```

To build or preview the production bundle:

```bash
npm run build
npm run preview
```

## Routing Overview

- `/login` – authentication entry point with remember-device toggle and credential hints.
- `/appointments` – protected route for staff and admins to monitor schedules and filter records.
- `/admin` – admin-only workspace for managing appointments and provisioning users.

## Database Collections

- `users` – stores staff/admin accounts with hashed passwords and role metadata.
- `appointments` – tracks patient details, scheduled times, status updates, and ownership.

## VS Code Task

`.vscode/tasks.json` contains an `npm: dev` task that launches the Vite development server directly from VS Code.

## Testing & Linting

No automated tests are bundled. Before deployment, consider adding Jest/React Testing Library suites and running `npm audit` to review dependency advisories.
