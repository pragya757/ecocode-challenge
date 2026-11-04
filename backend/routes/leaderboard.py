from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, UserBadge, Badge, UserPoints
from sqlalchemy import func

leaderboard_bp = Blueprint('leaderboard', __name__)


@leaderboard_bp.route('/', methods=['GET'])
def get_leaderboard():
    users = User.query.order_by(User.total_points.desc()).limit(50).all()
    result = []
    for rank, user in enumerate(users, 1):
        badge_count = UserBadge.query.filter_by(user_id=user.id).count()
        from routes.challenges import ChallengeSubmission
        from models import ChallengeSubmission as CS
        challenges_done = CS.query.filter_by(user_id=user.id, is_correct=True).count()
        result.append({
            'rank': rank,
            'id': user.id,
            'full_name': user.full_name,
            'total_points': user.total_points,
            'level': user.level,
            'badges': badge_count,
            'challenges_completed': challenges_done,
        })
    return jsonify({'leaderboard': result}), 200


@leaderboard_bp.route('/my-rank', methods=['GET'])
@jwt_required()
def get_my_rank():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    rank = User.query.filter(User.total_points > user.total_points).count() + 1
    return jsonify({'rank': rank, 'total_points': user.total_points}), 200
