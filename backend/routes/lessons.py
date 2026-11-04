from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from models import db, Lesson, LessonProgress, User, UserPoints, UserBadge, Badge
from datetime import datetime, timezone
from services.gamification import award_points, check_badges

lessons_bp = Blueprint('lessons', __name__)


@lessons_bp.route('/', methods=['GET'])
def get_lessons():
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
    except Exception:
        user_id = None

    lessons = Lesson.query.order_by(Lesson.order).all()
    result = []
    for lesson in lessons:
        d = lesson.to_dict()
        if user_id:
            progress = LessonProgress.query.filter_by(
                user_id=int(user_id), lesson_id=lesson.id
            ).first()
            d['completed'] = progress.completed if progress else False
        else:
            d['completed'] = False
        result.append(d)
    return jsonify({'lessons': result}), 200


@lessons_bp.route('/<int:lesson_id>', methods=['GET'])
def get_lesson(lesson_id):
    lesson = Lesson.query.get_or_404(lesson_id)
    return jsonify({'lesson': lesson.to_dict()}), 200


@lessons_bp.route('/<int:lesson_id>/complete', methods=['POST'])
@jwt_required()
def complete_lesson(lesson_id):
    user_id = int(get_jwt_identity())
    lesson = Lesson.query.get_or_404(lesson_id)

    existing = LessonProgress.query.filter_by(user_id=user_id, lesson_id=lesson_id).first()
    if existing and existing.completed:
        return jsonify({'message': 'Already completed', 'points_earned': 0}), 200

    if existing:
        existing.completed = True
        existing.completed_at = datetime.now(timezone.utc)
    else:
        progress = LessonProgress(
            user_id=user_id, lesson_id=lesson_id,
            completed=True, completed_at=datetime.now(timezone.utc)
        )
        db.session.add(progress)

    points = award_points(user_id, lesson.points, f'Completed lesson: {lesson.title}', 'lesson', lesson_id)
    check_badges(user_id)
    db.session.commit()

    return jsonify({'message': 'Lesson completed!', 'points_earned': points}), 200
