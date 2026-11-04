# 🌱 EcoCode Challenge – Gamified Green Coding Platform

> **Code Smarter. Think Greener.**  
> An interactive educational web application that teaches developers how to write energy-efficient, environmentally responsible software.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20TailwindCSS-10b981)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Backend-Python%20Flask%20%7C%20SQLAlchemy-059669)](https://flask.palletsprojects.com/)

---

## 🌟 Overview

Data centers consume approximately 1–2% of global electricity, and software architecture directly dictates the computational energy needed to execute tasks. **EcoCode Challenge** turns sustainable software engineering into an engaging, gamified experience.

Developers can:
- 📚 **Study Green Coding Lessons**: 8 structured modules covering memory conservation, CPU throttling, database query optimization, and carbon-aware computing.
- ⚡ **Side-by-Side Code Diagnostics**: Compare inefficient antipatterns with green-optimized code and run live benchmark simulations.
- 🎯 **Daily Green Challenges**: Solve real algorithmic challenges, benchmark solutions, and unlock expert reference implementations.
- 🧪 **Interactive Knowledge Quizzes**: Test knowledge across fundamental and advanced green software principles with bonus point thresholds.
- 🏆 **Gamification & Badges**: Unlock 7 achievement badges, advance across 8 developer levels, and climb the global leaderboard.
- 📊 **Developer Dashboard**: Track 7-day EcoPoints activity with visual charts and monitor estimated CO₂ offset metrics.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS with bespoke dark/light mode design system
- **Charts**: Recharts (Activity visualization & EcoPoints tracking)
- **Icons**: Lucide React
- **HTTP Client**: Axios with JWT interceptors

### Backend
- **Framework**: Python Flask RESTful API
- **Database**: SQLite with SQLAlchemy ORM
- **Auth**: Flask-JWT-Extended + Werkzeug security hashing
- **Gamification Engine**: Automated streak tracking, level calculations, and badge condition triggers

---

## 📂 Project Structure

```text
ecocode-challenge/
├── backend/
│   ├── app.py                # Flask server entry point & Blueprint registration
│   ├── models/               # SQLAlchemy models (User, Lesson, Challenge, Quiz, Badge)
│   ├── routes/               # API routes (auth, challenges, lessons, quizzes, leaderboard)
│   ├── services/             # Gamification logic & badge awarding
│   ├── database/             # Database seeding scripts
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Footer, UI components
│   │   ├── context/          # AuthContext & ThemeContext
│   │   ├── pages/            # Home, Learn, Challenges, Quizzes, Leaderboard, Dashboard
│   │   ├── services/         # Axios API instance
│   │   ├── App.jsx           # Routing & protected routes
│   │   └── main.jsx          # React DOM entry
│   ├── index.html            # SEO metadata & Google Fonts
│   ├── tailwind.config.js    # Theme tokens & custom animations
│   ├── vite.config.js        # Vite dev server & API proxy
│   └── package.json          # Frontend dependencies & scripts
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- Python (3.9+)

### 1. Setup Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python database/seed.py      # Seeds lessons, challenges, quizzes, and badges
python app.py                # Runs on http://localhost:8080
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev                  # Runs on http://localhost:5174
```

Open `http://localhost:5174` in your browser.

---

## 🚢 Deploying to Production

### Deploy Frontend (Vercel / Netlify)
1. Push this repository to GitHub.
2. Import repository on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Set the Root Directory to `frontend`.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Set Environment Variable: `VITE_API_URL=https://your-backend-url.onrender.com/api`

### Deploy Backend (Render / Railway / Fly.io)
1. Create a Web Service on [Render](https://render.com) pointing to the `backend/` directory.
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `gunicorn -w 2 -b 0.0.0.0:$PORT app:app`
4. Set Environment Variables:
   - `SECRET_KEY=your_production_secret`
   - `JWT_SECRET_KEY=your_production_jwt_secret`
   - `FLASK_ENV=production`

---

## 📜 License
MIT License. Built for a sustainable, energy-efficient digital future.
