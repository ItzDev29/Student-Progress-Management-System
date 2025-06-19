# 🚀 Codeforces Student Tracker

A full-stack web application to track student progress on [Codeforces](https://codeforces.com), enabling reminders, visual analytics, and performance insights.

## 📁 Folder Structure

```
project-root/
│
├── Backend/                 # Express.js backend
│   ├── models/              # Mongoose schemas
│   ├── routes/              # REST API routes
│   ├── controllers/         # Logic for API endpoints
│   ├── services/            # External API logic (e.g., Codeforces)
│   ├── utils/               # Utility functions (e.g., email scheduler)
│   └── server.js            # Entry point for backend server
│
├── Frontend/                # React frontend (CRA)
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page-level views (Home, StudentProfile)
│   ├── App.jsx              # Main app component with routing and theme
│   └── main.jsx             # Frontend entry point
│
├── README.md                # Project documentation (this file)
└── package.json             # Root config (optional if separate frontend/backend)
```
### 🔍 Screenshots

#### 1. Add/Edit Modal (Dark Mode)

![Screenshot 2025-06-19 202005](https://github.com/user-attachments/assets/67749f23-e53a-4d43-8716-73e1ed5147ea)

#### 2. Student Profile (Contest & Problem Stats)

![Screenshot 2025-06-19 202032](https://github.com/user-attachments/assets/971c7894-319e-44ef-8115-2e605cd7a140)

#### 3. Main Dashboard Table

![Screenshot 2025-06-19 201936](https://github.com/user-attachments/assets/f1c1f77d-7ad9-4dee-b776-d951b77ad295)


## 🌟 Features

- 🔍 **Student Table**
  - List all students with Codeforces handle, rating, reminders sent
  - Toggle email reminders (on/off)
  - Export data as CSV
  - Edit/delete students

- 📊 **Student Profile Page**
  - Rating history (line graph)
  - Contest performance (list + filtering by date range)
  - Problem-solving stats with bar chart
  - Yearly submission heatmap like GitHub

- 🧠 **Codeforces Integration**
  - Pulls latest rating, contest, and submission data
  - Auto-syncs and tracks each student’s performance

- 📧 **Reminder Scheduler**
  - Daily job checks for inactive students
  - Sends email reminders (via Resend API)

- 🌗 **Dark/Light Mode**
  - Toggle between light and dark themes

## ⚙️ Tech Stack

### 🖥 Frontend
- **React.js** (with Hooks)
- **Tailwind CSS** for styling
- **Recharts** for graphs
- **React Router** for routing
- **Headless UI + Toast** for modals and notifications

### 🌐 Backend
- **Node.js + Express**
- **MongoDB + Mongoose**
- **Axios** for API calls
- **node-cron** for scheduling
- **Resend Email API** for sending alerts

## 🔌 API Overview

**Backend Base URL: `http://localhost:5000/api`**

| Endpoint | Description |
|----------|-------------|
| `GET /students` | Get all students |
| `POST /students` | Add new student |
| `PUT /students/:id` | Update a student |
| `DELETE /students/:id` | Remove a student |
| `PATCH /students/:id/toggle-email` | Toggle email reminder |
| `POST /students/:id/refresh` | Refresh CF data |
| `GET /students/:id/profile` | Detailed CF stats |

## 📦 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/codeforces-tracker.git
cd codeforces-tracker
```

### 2. Start the Backend

```bash
cd Backend
npm install
node server.js
```

### 3. Start the Frontend

```bash
cd ../Frontend
npm install
npm run dev  # Or npm start if using CRA
```

## 🛠 Environment Variables

Create `.env` in your backend folder with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
RESEND_API_KEY=your_resend_key
```

## 📌 TODO (Future Enhancements)

- Add user authentication (JWT)
- Support other coding platforms (Leetcode, AtCoder)
- Generate performance reports in PDF
- Add leaderboard view

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
