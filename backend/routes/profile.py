from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, UserBadge, Badge, UserPoints, LessonProgress, QuizAttempt, ChallengeSubmission

profile_bp = Blueprint('profile', __name__)


@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)

    badges = []
    for ub in user.badges:
        b = ub.badge
        if b:
            badges.append({
                'id': b.id,
                'name': b.name,
                'icon': b.icon,
                'description': b.description,
                'earned_at': ub.earned_at.isoformat() if ub.earned_at else None
            })

    points_history = UserPoints.query.filter_by(user_id=user_id).order_by(
        UserPoints.earned_at.desc()).limit(20).all()

    quiz_history = QuizAttempt.query.filter_by(user_id=user_id).order_by(
        QuizAttempt.completed_at.desc()).limit(10).all()

    challenge_history = ChallengeSubmission.query.filter_by(user_id=user_id).order_by(
        ChallengeSubmission.submitted_at.desc()).limit(10).all()

    lesson_history = LessonProgress.query.filter_by(
        user_id=user_id, completed=True).all()

    # All badges (for progress display)
    all_badges = Badge.query.all()
    earned_badge_ids = {ub.badge_id for ub in user.badges}

    badges_info = []
    for b in all_badges:
        badges_info.append({
            **b.to_dict(),
            'earned': b.id in earned_badge_ids,
            'earned_at': next((ub.earned_at.isoformat() for ub in user.badges if ub.badge_id == b.id), None)
        })

    return jsonify({
        'user': user.to_dict(),
        'badges': badges_info,
        'points_history': [
            {'points': p.points, 'reason': p.reason, 'earned_at': p.earned_at.isoformat() if p.earned_at else None}
            for p in points_history
        ],
        'quiz_history': [
            {
                'quiz_title': a.quiz.title if a.quiz else '',
                'score': a.score,
                'total': a.total_questions,
                'points': a.points_earned,
                'date': a.completed_at.isoformat() if a.completed_at else None
            }
            for a in quiz_history
        ],
        'challenge_history': [
            {
                'title': s.challenge.title if s.challenge else '',
                'is_correct': s.is_correct,
                'points': s.points_earned,
                'date': s.submitted_at.isoformat() if s.submitted_at else None
            }
            for s in challenge_history
        ],
        'lessons_completed': len(lesson_history)
    }), 200


@profile_bp.route('/update', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if 'full_name' in data and data['full_name'].strip():
        user.full_name = data['full_name'].strip()
    if 'bio' in data:
        user.bio = data['bio']

    db.session.commit()
    return jsonify({'message': 'Profile updated', 'user': user.to_dict()}), 200
