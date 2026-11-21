import html
from datetime import datetime, timezone, timedelta
from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, UserBadge, Badge, UserPoints, LessonProgress, QuizAttempt, ChallengeSubmission, UserStreak

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

    # 365-day Activity Heatmap calculation
    now = datetime.now(timezone.utc)
    one_year_ago = now - timedelta(days=365)
    
    heatmap_counts = {}
    
    for p in UserPoints.query.filter(UserPoints.user_id == user_id, UserPoints.earned_at >= one_year_ago).all():
        if p.earned_at:
            d_str = p.earned_at.strftime('%Y-%m-%d')
            heatmap_counts[d_str] = heatmap_counts.get(d_str, 0) + 1
            
    for q in QuizAttempt.query.filter(QuizAttempt.user_id == user_id, QuizAttempt.completed_at >= one_year_ago).all():
        if q.completed_at:
            d_str = q.completed_at.strftime('%Y-%m-%d')
            heatmap_counts[d_str] = heatmap_counts.get(d_str, 0) + 1

    for c in ChallengeSubmission.query.filter(ChallengeSubmission.user_id == user_id, ChallengeSubmission.submitted_at >= one_year_ago).all():
        if c.submitted_at:
            d_str = c.submitted_at.strftime('%Y-%m-%d')
            heatmap_counts[d_str] = heatmap_counts.get(d_str, 0) + 1
            
    for l in LessonProgress.query.filter(LessonProgress.user_id == user_id, LessonProgress.completed == True).all():
        completed_at = getattr(l, 'completed_at', None) or getattr(l, 'updated_at', None)
        if completed_at:
            d_str = completed_at.strftime('%Y-%m-%d')
            heatmap_counts[d_str] = heatmap_counts.get(d_str, 0) + 1

    # Streaks record
    streak_rec = UserStreak.query.filter_by(user_id=user_id).first()
    current_streak = streak_rec.current_streak if streak_rec else user.streak
    longest_streak = streak_rec.longest_streak if streak_rec else user.streak
    
    # Total contributions in past 365 days
    total_contributions = sum(heatmap_counts.values())
    if total_contributions == 0 and user.total_points > 0:
        today_str = now.strftime('%Y-%m-%d')
        heatmap_counts[today_str] = max(1, min(5, user.total_points // 30))
        total_contributions = heatmap_counts[today_str]

    heatmap_data = {
        'activity_map': heatmap_counts,
        'total_contributions': total_contributions,
        'current_streak': current_streak,
        'longest_streak': longest_streak,
        'active_days': len(heatmap_counts)
    }

    return jsonify({
        'user': user.to_dict(),
        'badges': badges_info,
        'activity_heatmap': heatmap_data,
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


def render_shield_badge_svg(user):
    name = html.escape(user.full_name)
    level = user.level or 1
    points = user.total_points or 0

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="280" height="28" viewBox="0 0 280 28" fill="none">
  <defs>
    <linearGradient id="shield_left" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <linearGradient id="shield_right" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <clipPath id="pill_clip">
    <rect width="280" height="28" rx="6" />
  </clipPath>
  <g clip-path="url(#pill_clip)">
    <rect x="0" y="0" width="100" height="28" fill="url(#shield_left)" />
    <rect x="100" y="0" width="180" height="28" fill="url(#shield_right)" />
    <!-- Leaf Icon -->
    <path d="M12 17.5C12 17.5 13.5 12 19 10C19 10 19 14.5 15.5 16.5C13.5 17.8 12 17.5 12 17.5Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M12 17.5L16 13.5" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />
    <text x="25" y="18" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="700">EcoCode</text>
    <text x="112" y="18" fill="#a7f3d0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="600">Level {level}</text>
    <circle cx="160" cy="14" r="1.5" fill="#64748b" />
    <text x="169" y="18" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="600">{points} pts</text>
    <text x="236" y="18" fill="#34d399" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="10" font-weight="700">🌱</text>
  </g>
</svg>"""


def render_card_badge_svg(user):
    name = html.escape(user.full_name)
    level = user.level or 1
    points = user.total_points or 0
    streak = user.streak or 0

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="460" height="150" viewBox="0 0 460 150" fill="none">
  <defs>
    <linearGradient id="bg_grad" x1="0" y1="0" x2="460" y2="150" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#091424" />
      <stop offset="60%" stop-color="#020617" />
      <stop offset="100%" stop-color="#061e16" />
    </linearGradient>
    <linearGradient id="emerald_line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="50%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#a3e635" />
    </linearGradient>
    <linearGradient id="icon_grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
  </defs>

  <!-- Background Box -->
  <rect x="0.5" y="0.5" width="459" height="149" rx="16" fill="url(#bg_grad)" stroke="#1e293b" stroke-width="1"/>
  <!-- Top Ambient Glow -->
  <rect x="1" y="1" width="458" height="3" fill="url(#emerald_line)" rx="1.5" />

  <!-- Logo and Platform Brand -->
  <rect x="24" y="22" width="30" height="30" rx="8" fill="url(#icon_grad)"/>
  <path d="M33 39C33 39 34.5 33 40 31C40 31 40 35.5 36.5 37.5C34.5 38.8 33 39 33 39Z" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M33 39L37.5 34.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />

  <text x="64" y="36" fill="#10b981" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" letter-spacing="0.5">ECOCODE CHALLENGE</text>
  <text x="64" y="49" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600">VERIFIED GREEN SOFTWARE DEVELOPER</text>

  <!-- Developer Name -->
  <text x="24" y="80" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800">{name}</text>

  <!-- Stat Pills -->
  <!-- Level Pill -->
  <rect x="24" y="96" width="90" height="26" rx="7" fill="#0f172a" stroke="#334155" stroke-width="1"/>
  <text x="36" y="113" fill="#34d399" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700">Level {level}</text>

  <!-- Points Pill -->
  <rect x="122" y="96" width="130" height="26" rx="7" fill="#0f172a" stroke="#334155" stroke-width="1"/>
  <circle cx="134" cy="109" r="3.5" fill="#10b981"/>
  <text x="144" y="113" fill="#f1f5f9" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700">{points} EcoPoints</text>

  <!-- Streak Pill -->
  <rect x="260" y="96" width="105" height="26" rx="7" fill="#0f172a" stroke="#334155" stroke-width="1"/>
  <text x="272" y="113" fill="#f59e0b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700">🔥 {streak}d Streak</text>

  <!-- Footer Watermark -->
  <text x="436" y="136" text-anchor="end" fill="#475569" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="600">Built with 💚 by Pragya</text>
</svg>"""


@profile_bp.route('/badge/<int:user_id>', methods=['GET'])
def get_user_badge_svg(user_id):
    user = User.query.get_or_404(user_id)
    style = request.args.get('style', 'card').lower()

    if style == 'shield':
        svg = render_shield_badge_svg(user)
    else:
        svg = render_card_badge_svg(user)

    response = Response(svg, mimetype='image/svg+xml')
    response.headers['Cache-Control'] = 'no-cache, max-age=60, s-maxage=120'
    return response


@profile_bp.route('/badge/<int:user_id>/shield', methods=['GET'])
def get_user_badge_shield(user_id):
    user = User.query.get_or_404(user_id)
    svg = render_shield_badge_svg(user)
    response = Response(svg, mimetype='image/svg+xml')
    response.headers['Cache-Control'] = 'no-cache, max-age=60, s-maxage=120'
    return response


@profile_bp.route('/badge/<int:user_id>/card', methods=['GET'])
def get_user_badge_card(user_id):
    user = User.query.get_or_404(user_id)
    svg = render_card_badge_svg(user)
    response = Response(svg, mimetype='image/svg+xml')
    response.headers['Cache-Control'] = 'no-cache, max-age=60, s-maxage=120'
    return response

