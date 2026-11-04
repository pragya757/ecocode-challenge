import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import {
  Leaf, Trophy, Flame, Zap, BookOpen, Target, Award,
  ArrowRight, CheckCircle2, TrendingUp, Sparkles, AlertCircle
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [dailyChallenge, setDailyChallenge] = useState(null)
  const [myRank, setMyRank] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsRes, dailyRes, rankRes] = await Promise.allSettled([
          api.get('/dashboard/stats'),
          api.get('/challenges/daily'),
          api.get('/leaderboard/my-rank')
        ])

        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data)
        if (dailyRes.status === 'fulfilled') setDailyChallenge(dailyRes.value.data.challenge)
        if (rankRes.status === 'fulfilled') setMyRank(rankRes.value.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container-custom py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Loading your green dashboard...</p>
      </div>
    )
  }

  // Level thresholds for progress calculation
  const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 5000]
  const currentLvl = stats?.level || 1
  const prevLvlPts = levelThresholds[currentLvl - 1] || 0
  const nextLvlPts = levelThresholds[currentLvl] || 5000
  const progressPercent = Math.min(
    100,
    Math.max(0, (((stats?.total_points || 0) - prevLvlPts) / (nextLvlPts - prevLvlPts)) * 100)
  )

  // Estimated carbon saved calculation (fictional gamified metric)
  const estimatedCo2Saved = ((stats?.total_points || 0) * 1.8).toFixed(1)

  return (
    <div className="container-custom py-8 md:py-12 space-y-8 page-enter">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 text-white p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-green-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Eco-Developer Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Developer'}! 🌱
            </h1>
            <p className="text-emerald-100/90 text-sm md:text-base max-w-xl">
              Keep coding efficiently. Your current streak and contributions help cultivate sustainable software architecture.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10">
              <Flame className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs text-slate-300">Streak</div>
                <div className="text-base font-bold text-white">{stats?.streak || 0} Days</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-xs text-slate-300">Rank</div>
                <div className="text-base font-bold text-white">#{myRank?.rank || '—'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex justify-between items-center text-xs font-semibold text-emerald-200 mb-2">
            <span>Level {currentLvl} Developer</span>
            <span>{stats?.total_points || 0} / {nextLvlPts} EcoPoints to Level {currentLvl + 1}</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-3 p-0.5 overflow-hidden backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-emerald-400 to-lime-400 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="card p-5 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.total_points || 0}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total EcoPoints
            </div>
          </div>
        </div>

        <div className="card p-5 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.challenges_completed || 0}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Challenges Solved
            </div>
          </div>
        </div>

        <div className="card p-5 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.quizzes_completed || 0}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Quizzes Taken
            </div>
          </div>
        </div>

        <div className="card p-5 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.badges_earned || 0}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Badges Unlocked
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Activity Chart & Daily Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 card p-6 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                7-Day Activity & EcoPoints
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                EcoPoints gained across daily coding and learning
              </p>
            </div>
            <div className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
              ~{estimatedCo2Saved}g CO₂ Offset
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.daily_points || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pointsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="points" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#pointsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Challenge Highlight */}
        <div className="card p-6 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="badge badge-accent">Daily Focus</span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> +{dailyChallenge?.points || 50} pts
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {dailyChallenge?.title || 'Daily EcoCode Challenge'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
              {dailyChallenge?.description || 'Test and refine your algorithmic efficiency in today’s curated challenge.'}
            </p>

            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Difficulty</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                  {dailyChallenge?.difficulty || 'Medium'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Category</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {dailyChallenge?.category || 'Algorithm Optimization'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to={dailyChallenge ? `/challenges/${dailyChallenge.id}` : '/challenges'}
              className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
            >
              <span>Solve Today's Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Navigation */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Explore Learning Tracks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/learn"
            className="card p-6 border border-slate-100 dark:border-slate-800 hover:border-green-500/50 transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-green-600 dark:group-hover:text-green-400">
              Interactive Lessons
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Explore 8 comprehensive guides covering CPU, memory, data structures, and database optimization.
            </p>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
              Start Learning <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            to="/code-comparison"
            className="card p-6 border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Code Comparison Tool
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Side-by-side analysis of inefficient code vs green optimized implementations.
            </p>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              Compare Code <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            to="/quizzes"
            className="card p-6 border border-slate-100 dark:border-slate-800 hover:border-amber-500/50 transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400">
              Knowledge Quizzes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Test your knowledge on energy-efficient data structures, loops, caching, and algorithms.
            </p>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              Take Quiz <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
