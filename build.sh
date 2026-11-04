#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "📦 1/3: Installing frontend dependencies and building production bundle..."
cd frontend
npm install
npm run build
cd ..

echo "🐍 2/3: Installing backend Python dependencies..."
cd backend
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

echo "🌱 3/3: Initializing and seeding database..."
PYTHONPATH=. python3 database/seed.py || echo "Database initialized on app startup."
cd ..

echo "✅ Build complete! Ready to start gunicorn."
