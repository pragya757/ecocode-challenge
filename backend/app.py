import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from models import db
from routes.auth import auth_bp
from routes.lessons import lessons_bp
from routes.quizzes import quizzes_bp
from routes.challenges import challenges_bp
from routes.leaderboard import leaderboard_bp
from routes.profile import profile_bp
from routes.dashboard import dashboard_bp

load_dotenv()


def create_app():
    app = Flask(__name__)

    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-prod')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-change-in-prod')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///ecocode.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # Tokens don't expire for dev

    # Extensions
    db.init_app(app)
    JWTManager(app)
    CORS(app, origins=['http://localhost:5173', 'http://localhost:3000', '*'],
         supports_credentials=True)

    # Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(lessons_bp, url_prefix='/api/lessons')
    app.register_blueprint(quizzes_bp, url_prefix='/api/quizzes')
    app.register_blueprint(challenges_bp, url_prefix='/api/challenges')
    app.register_blueprint(leaderboard_bp, url_prefix='/api/leaderboard')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

    @app.route('/api/health')
    def health():
        return jsonify({'status': 'ok', 'message': 'EcoCode Challenge API running'}), 200

    # Initialize DB
    with app.app_context():
        db.create_all()
        # Seed data
        try:
            from database.seed import seed_all
            seed_all()
        except Exception as e:
            print(f"Seeding note: {e}")

    return app


app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(debug=True, port=port, host='0.0.0.0')
