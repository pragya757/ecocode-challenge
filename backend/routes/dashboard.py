from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, LessonProgress, QuizAttempt, ChallengeSubmission, UserBadge, UserPoints, UserStreak, Badge
from datetime import datetime, timezone, timedelta
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)


def calculate_level(points):
    if points < 100:
        return 1
    elif points < 300:
        return 2
    elif points < 600:
        return 3
    elif points < 1000:
        return 4
    elif points < 1500:
        return 5
    elif points < 2200:
        return 6
    elif points < 3000:
        return 7
    else:
        return 8


@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    lessons_done = LessonProgress.query.filter_by(user_id=user_id, completed=True).count()
    quizzes_done = QuizAttempt.query.filter_by(user_id=user_id).count()
    challenges_done = ChallengeSubmission.query.filter_by(user_id=user_id, is_correct=True).count()
    badges_earned = UserBadge.query.filter_by(user_id=user_id).count()
    streak_rec = UserStreak.query.filter_by(user_id=user_id).first()
    streak = streak_rec.current_streak if streak_rec else 0

    level = calculate_level(user.total_points)
    user.level = level
    db.session.commit()

    # Points history (last 7 days)
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
    daily_points = []
    for i in range(7):
        day = datetime.now(timezone.utc) - timedelta(days=6 - i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        pts = db.session.query(func.sum(UserPoints.points)).filter(
            UserPoints.user_id == user_id,
            UserPoints.earned_at >= day_start,
            UserPoints.earned_at < day_end
        ).scalar() or 0
        daily_points.append({'day': day.strftime('%a'), 'points': pts})

    return jsonify({
        'total_points': user.total_points,
        'level': level,
        'streak': streak,
        'lessons_completed': lessons_done,
        'quizzes_completed': quizzes_done,
        'challenges_completed': challenges_done,
        'badges_earned': badges_earned,
        'daily_points': daily_points
    }), 200


@dashboard_bp.route('/platform-stats', methods=['GET'])
def get_platform_stats():
    total_users = User.query.count()
    total_challenges = ChallengeSubmission.query.filter_by(is_correct=True).count()
    total_quizzes = QuizAttempt.query.count()
    total_points = db.session.query(func.sum(User.total_points)).scalar() or 0
    return jsonify({
        'total_learners': total_users,
        'challenges_completed': total_challenges,
        'quizzes_attempted': total_quizzes,
        'total_points_earned': total_points
    }), 200
