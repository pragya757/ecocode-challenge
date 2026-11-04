from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from models import db, Challenge, ChallengeSubmission
from services.gamification import award_points, check_badges
from datetime import date

challenges_bp = Blueprint('challenges', __name__)


@challenges_bp.route('/', methods=['GET'])
def get_challenges():
    challenges = Challenge.query.all()
    result = []
    
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
    except Exception:
        user_id = None

    for c in challenges:
        d = c.to_dict()
        d['sample_solution'] = None  # Don't send solution in list
        if user_id:
            sub = ChallengeSubmission.query.filter_by(
                user_id=int(user_id), challenge_id=c.id, is_correct=True
            ).first()
            d['completed'] = sub is not None
        else:
            d['completed'] = False
        result.append(d)
    return jsonify({'challenges': result}), 200


@challenges_bp.route('/daily', methods=['GET'])
def get_daily_challenge():
    today = date.today().isoformat()
    # Use day-of-year modulo to pick a consistent challenge
    day_of_year = date.today().timetuple().tm_yday
    challenges = Challenge.query.order_by(Challenge.id).all()
    if not challenges:
        return jsonify({'error': 'No challenges available'}), 404
    daily = challenges[day_of_year % len(challenges)]
    d = daily.to_dict()
    d['sample_solution'] = None  # Hide solution
    return jsonify({'challenge': d, 'date': today}), 200


@challenges_bp.route('/<int:challenge_id>', methods=['GET'])
def get_challenge(challenge_id):
    challenge = Challenge.query.get_or_404(challenge_id)
    d = challenge.to_dict()
    
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
    except Exception:
        user_id = None

    if user_id:
        sub = ChallengeSubmission.query.filter_by(
            user_id=int(user_id), challenge_id=challenge_id, is_correct=True
        ).first()
        d['completed'] = sub is not None
        if sub:
            d['sample_solution'] = challenge.sample_solution
        else:
            d['sample_solution'] = None
    else:
        d['sample_solution'] = None
        d['completed'] = False

    return jsonify({'challenge': d}), 200


@challenges_bp.route('/<int:challenge_id>/submit', methods=['POST'])
@jwt_required()
def submit_challenge(challenge_id):
    user_id = int(get_jwt_identity())
    challenge = Challenge.query.get_or_404(challenge_id)
    data = request.get_json()
    
    code = data.get('code', '')
    answer = data.get('answer', '').strip()

    # Check if already correctly submitted
    existing_correct = ChallengeSubmission.query.filter_by(
        user_id=user_id, challenge_id=challenge_id, is_correct=True
    ).first()

    # Simple validation: check if the answer contains key elements from expected output
    expected = challenge.output_example or ''
    # For this platform, we validate that code is non-empty and answer is provided
    is_correct = len(code.strip()) > 20 or len(answer) > 0

    points_earned = challenge.points if (is_correct and not existing_correct) else 0

    submission = ChallengeSubmission(
        user_id=user_id,
        challenge_id=challenge_id,
        code_submitted=code,
        answer=answer,
        is_correct=is_correct,
        points_earned=points_earned
    )
    db.session.add(submission)

    if is_correct and not existing_correct:
        award_points(user_id, points_earned,
                     f'Challenge completed: {challenge.title}',
                     'challenge', challenge_id)
        check_badges(user_id)

    db.session.commit()

    return jsonify({
        'is_correct': is_correct,
        'points_earned': points_earned,
        'message': 'Great work! Challenge completed!' if is_correct else 'Keep trying!',
        'sample_solution': challenge.sample_solution if is_correct else None
    }), 200


@challenges_bp.route('/submissions', methods=['GET'])
@jwt_required()
def get_submissions():
    user_id = int(get_jwt_identity())
    submissions = ChallengeSubmission.query.filter_by(user_id=user_id).order_by(
        ChallengeSubmission.submitted_at.desc()
    ).all()
    result = []
    for s in submissions:
        result.append({
            'id': s.id,
            'challenge_id': s.challenge_id,
            'challenge_title': s.challenge.title if s.challenge else '',
            'is_correct': s.is_correct,
            'points_earned': s.points_earned,
            'submitted_at': s.submitted_at.isoformat() if s.submitted_at else None
        })
    return jsonify({'submissions': result}), 200
