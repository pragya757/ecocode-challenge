from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Quiz, Question, QuizAttempt, User
from services.gamification import award_points, check_badges
import json

quizzes_bp = Blueprint('quizzes', __name__)


@quizzes_bp.route('/', methods=['GET'])
def get_quizzes():
    quizzes = Quiz.query.all()
    return jsonify({'quizzes': [q.to_dict() for q in quizzes]}), 200


@quizzes_bp.route('/<int:quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    questions = [q.to_dict(include_answer=False) for q in
                 sorted(quiz.questions, key=lambda x: x.order)]
    return jsonify({
        'quiz': quiz.to_dict(),
        'questions': questions
    }), 200


@quizzes_bp.route('/<int:quiz_id>/submit', methods=['POST'])
@jwt_required()
def submit_quiz(quiz_id):
    user_id = int(get_jwt_identity())
    quiz = Quiz.query.get_or_404(quiz_id)
    data = request.get_json()
    answers = data.get('answers', {})  # {question_id: selected_option}

    questions = quiz.questions
    score = 0
    total = len(questions)
    results = []

    for q in questions:
        selected = answers.get(str(q.id), '').lower()
        correct = q.correct_option.lower()
        is_correct = selected == correct
        if is_correct:
            score += 1
        results.append({
            'question_id': q.id,
            'selected': selected,
            'correct': correct,
            'is_correct': is_correct,
            'explanation': q.explanation
        })

    score_pct = score / total if total > 0 else 0
    base_points = score * quiz.points_per_correct
    bonus = quiz.bonus_points if score_pct >= quiz.pass_threshold else 0
    total_points = base_points + bonus

    attempt = QuizAttempt(
        user_id=user_id,
        quiz_id=quiz_id,
        score=score,
        total_questions=total,
        points_earned=total_points,
        answers=json.dumps(answers)
    )
    db.session.add(attempt)

    award_points(user_id, total_points,
                 f'Quiz: {quiz.title} ({score}/{total} correct)',
                 'quiz', quiz_id)
    # Also award flat quiz completion points (20 pts per quiz)
    award_points(user_id, 20, f'Completed quiz: {quiz.title}', 'quiz_completion', quiz_id)
    check_badges(user_id)
    db.session.commit()

    return jsonify({
        'score': score,
        'total': total,
        'percentage': round(score_pct * 100, 1),
        'points_earned': total_points + 20,
        'bonus_earned': bonus,
        'passed': score_pct >= quiz.pass_threshold,
        'results': results
    }), 200


@quizzes_bp.route('/attempts', methods=['GET'])
@jwt_required()
def get_attempts():
    user_id = int(get_jwt_identity())
    attempts = QuizAttempt.query.filter_by(user_id=user_id).order_by(
        QuizAttempt.completed_at.desc()).all()
    result = []
    for a in attempts:
        result.append({
            'id': a.id,
            'quiz_id': a.quiz_id,
            'quiz_title': a.quiz.title if a.quiz else '',
            'score': a.score,
            'total_questions': a.total_questions,
            'points_earned': a.points_earned,
            'completed_at': a.completed_at.isoformat() if a.completed_at else None
        })
    return jsonify({'attempts': result}), 200
