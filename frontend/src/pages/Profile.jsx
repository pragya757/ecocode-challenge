import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import CertificateModal from '../components/CertificateModal'
import GreenHeatmap from '../components/GreenHeatmap'
import GithubBadgeGenerator from '../components/GithubBadgeGenerator'
import { fireBadgeConfetti } from '../utils/confetti'
import {
  User, Award, Flame, Leaf, Trophy, Edit3, Check,
  Save, History, Sparkles, BookOpen, Target, CheckCircle2,
  Lock, Calendar, LogOut, Github
} from 'lucide-react'

export default function Profile() {
  const { user, refreshUser, logout } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ full_name: '', bio: '' })
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('badges') // 'badges' | 'points' | 'history'
  const [showCert, setShowCert] = useState(false)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await api.get('/profile/')
      setProfileData(res.data)
      setEditForm({
        full_name: res.data.user.full_name || '',
        bio: res.data.user.bio || ''
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await api.put('/profile/update', editForm)
      await refreshUser()
      setIsEditing(false)
      setSaveSuccess(true)
      fetchProfile()
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-slate-400 text-sm font-medium">Loading your profile & achievements...</p>
      </div>
    )
  }

  const u = profileData?.user || user

  return (
    <div className="container-custom py-8 md:py-12 space-y-10 page-enter">
      {/* Header Profile Identity Card */}
      <div className="card p-6 md:p-10 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-green-400 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              {u?.full_name?.charAt(0) || 'U'}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                  {u?.full_name}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                  Level {u?.level || 1}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{u?.email}</p>
              {u?.bio && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-lg italic">
                  "{u.bio}"
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                fireBadgeConfetti()
                setShowCert(true)
              }}
              className="btn-primary py-2 px-3 text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 shadow-sm"
              title="View Official Certificate"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certificate</span>
            </button>
            <button
              onClick={() => setActiveTab('github-badge')}
              className={`py-2 px-3 text-xs rounded-xl font-bold flex items-center gap-1.5 transition-all border ${
                activeTab === 'github-badge'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-500'
              }`}
              title="Generate GitHub README Badge"
            >
              <Github className="w-3.5 h-3.5 text-emerald-500" />
              <span>README Badge</span>
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary py-2 px-3.5 text-xs flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Modal */}
        {showCert && <CertificateModal user={u} onClose={() => setShowCert(false)} />}

        {/* Edit Form Drawer */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bio / Philosophy
                </label>
                <input
                  type="text"
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="e.g. Passionate about green software architecture & efficient algorithms"
                  className="input-field text-xs"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </form>
        )}

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" /> Profile updated successfully!
          </div>
        )}

        {/* Stats Row */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {u?.total_points || 0}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">EcoPoints</div>
          </div>
          <div>
            <div className="text-xl font-black text-amber-500">
              {u?.streak || 0} Days
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Active Streak</div>
          </div>
          <div>
            <div className="text-xl font-black text-purple-600 dark:text-purple-400">
              {profileData?.challenge_history?.filter(c => c.is_correct)?.length || 0}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Challenges Solved</div>
          </div>
          <div>
            <div className="text-xl font-black text-blue-600 dark:text-blue-400">
              {profileData?.lessons_completed || 0}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Lessons Completed</div>
          </div>
        </div>
      </div>

      {/* Green Contribution Heatmap */}
      <GreenHeatmap
        activityData={profileData?.activity_heatmap}
        streak={u?.streak}
        longestStreak={profileData?.activity_heatmap?.longest_streak}
      />

      {/* Tabs Navigation */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-4 sm:gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('badges')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'badges'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Award className="w-4 h-4" /> Badges & Achievements
        </button>

        <button
          onClick={() => setActiveTab('github-badge')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'github-badge'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Github className="w-4 h-4" /> GitHub README Badge
        </button>

        <button
          onClick={() => setActiveTab('points')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'points'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-4 h-4" /> EcoPoints Ledger
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'history'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <History className="w-4 h-4" /> Activity History
        </button>
      </div>

      {/* Tab 1: Badges Grid */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {profileData?.badges?.map((badge) => {
            return (
              <div
                key={badge.id}
                className={`card p-6 border transition-all flex items-start gap-4 ${
                  badge.earned
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 opacity-60 bg-white/40 dark:bg-slate-900/40'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm ${
                  badge.earned
                    ? 'bg-gradient-to-tr from-emerald-500 to-green-400 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  {badge.earned ? (badge.icon || '🌱') : <Lock className="w-6 h-6" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {badge.name}
                    </h3>
                    {badge.earned && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                        Unlocked
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                    {badge.description}
                  </p>

                  {badge.earned_at && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Earned on {new Date(badge.earned_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tab 2: EcoPoints Ledger */}
      {activeTab === 'points' && (
        <div className="card overflow-hidden border border-slate-200 dark:border-slate-800 animate-fade-in">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Points Earned</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {profileData?.points_history?.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No points activity recorded yet.</div>
            ) : (
              profileData?.points_history?.map((p, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{p.reason}</div>
                    <div className="text-slate-400 text-[11px]">
                      {p.earned_at ? new Date(p.earned_at).toLocaleString() : 'Recent'}
                    </div>
                  </div>
                  <div className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                    +{p.points} pts
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: History (Quizzes & Challenges) */}
      {activeTab === 'history' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* Challenges history */}
          <div className="card p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" /> Challenge Submissions
            </h3>
            <div className="space-y-3">
              {profileData?.challenge_history?.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">No challenge submissions yet.</p>
              ) : (
                profileData?.challenge_history?.map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{c.title}</div>
                      <div className="text-slate-400 text-[11px]">{c.date ? new Date(c.date).toLocaleDateString() : ''}</div>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold ${c.is_correct ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {c.is_correct ? `+${c.points} pts` : 'Attempted'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quizzes history */}
          <div className="card p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Quiz Attempts
            </h3>
            <div className="space-y-3">
              {profileData?.quiz_history?.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">No quiz attempts yet.</p>
              ) : (
                profileData?.quiz_history?.map((q, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{q.quiz_title}</div>
                      <div className="text-slate-400 text-[11px]">Score: {q.score}/{q.total} • {q.date ? new Date(q.date).toLocaleDateString() : ''}</div>
                    </div>
                    <div className="font-bold text-amber-600 dark:text-amber-400">
                      +{q.points} pts
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: GitHub README Badge Generator */}
      {activeTab === 'github-badge' && (
        <div className="animate-fade-in">
          <GithubBadgeGenerator user={u} />
        </div>
      )}
    </div>
  )
}
