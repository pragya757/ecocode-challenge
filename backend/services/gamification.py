from models import db, User, UserPoints, UserBadge, Badge, LessonProgress, QuizAttempt, ChallengeSubmission, UserStreak


def award_points(user_id, points, reason, source_type, source_id=None):
    """Award points to a user and update their total."""
    if points <= 0:
        return 0
    user = User.query.get(user_id)
    if not user:
        return 0

    record = UserPoints(
        user_id=user_id,
        points=points,
        reason=reason,
        source_type=source_type,
        source_id=source_id
    )
    db.session.add(record)
    user.total_points += points
    user.level = calculate_level(user.total_points)
    return points


def calculate_level(points):
    if points < 100: return 1
    elif points < 300: return 2
    elif points < 600: return 3
    elif points < 1000: return 4
    elif points < 1500: return 5
    elif points < 2200: return 6
    elif points < 3000: return 7
    else: return 8


def check_badges(user_id):
    """Check and award any earned badges."""
    user = User.query.get(user_id)
    if not user:
        return

    earned_ids = {ub.badge_id for ub in UserBadge.query.filter_by(user_id=user_id).all()}

    lessons_done = LessonProgress.query.filter_by(user_id=user_id, completed=True).count()
    quizzes_passed = QuizAttempt.query.filter(
        QuizAttempt.user_id == user_id,
        QuizAttempt.score * 1.0 / QuizAttempt.total_questions >= 0.8
    ).count()
    challenges_done = ChallengeSubmission.query.filter_by(user_id=user_id, is_correct=True).count()
    streak_rec = UserStreak.query.filter_by(user_id=user_id).first()
    streak = streak_rec.current_streak if streak_rec else 0

    criteria_map = {
        'lessons_completed': lessons_done,
        'quizzes_passed': quizzes_passed,
        'challenges_completed': challenges_done,
        'total_points': user.total_points,
        'streak': streak,
    }

    badges = Badge.query.all()
    for badge in badges:
        if badge.id in earned_ids:
            continue
        value = criteria_map.get(badge.criteria_type, 0)
        if value >= badge.criteria_value:
            ub = UserBadge(user_id=user_id, badge_id=badge.id)
            db.session.add(ub)
