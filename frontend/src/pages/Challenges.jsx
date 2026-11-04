import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import {
  Target, Flame, CheckCircle2, ArrowRight, Search,
  Filter, Zap, Trophy, Clock, Sparkles
} from 'lucide-react'

export default function Challenges() {
  const { user } = useAuth()
  const [challenges, setChallenges] = useState([])
  const [daily, setDaily] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [listRes, dailyRes] = await Promise.allSettled([
          api.get('/challenges/'),
          api.get('/challenges/daily')
        ])
        if (listRes.status === 'fulfilled') setChallenges(listRes.value.data.challenges || [])
        if (dailyRes.status === 'fulfilled') setDaily(dailyRes.value.data.challenge)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const categories = ['all', ...new Set(challenges.map(c => c.category).filter(Boolean))]
  const difficulties = ['all', 'easy', 'medium', 'hard']

  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.description.toLowerCase().includes(search.toLowerCase())
    const matchesDiff = difficultyFilter === 'all' || c.difficulty?.toLowerCase() === difficultyFilter
    const matchesCat = categoryFilter === 'all' || c.category === categoryFilter
    return matchesSearch && matchesDiff && matchesCat
  })

  const completedCount = challenges.filter(c => c.completed).length

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
      case 'medium':
        return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
      case 'hard':
        return 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200'
    }
  }

  return (
    <div className="container-custom py-8 md:py-12 space-y-10 page-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-3">
            <Target className="w-3.5 h-3.5" /> Hands-On Green Coding
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            EcoCode Challenges
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl text-base">
            Refactor inefficient code, write green algorithms, and earn EcoPoints while reducing computational carbon footprint.
          </p>
        </div>

        {/* User Progress Stats */}
        <div className="card p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            {challenges.length > 0 ? Math.round((completedCount / challenges.length) * 100) : 0}%
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Challenges Completed</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {completedCount} of {challenges.length} Solved
            </div>
          </div>
        </div>
      </div>

      {/* Daily Challenge Spotlight Banner */}
      {daily && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 md:p-8 shadow-xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
                <Flame className="w-3.5 h-3.5" /> Featured Daily Challenge
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                {daily.title}
              </h2>
              <p className="text-sm text-slate-300 line-clamp-2">
                {daily.description}
              </p>
              <div className="flex items-center gap-4 text-xs font-semibold text-purple-200 pt-1">
                <span>Reward: +{daily.points} EcoPoints</span>
                <span>•</span>
                <span className="capitalize">Difficulty: {daily.difficulty}</span>
              </div>
            </div>

            <Link
              to={`/challenges/${daily.id}`}
              className="btn-primary py-3 px-6 text-sm flex items-center gap-2 whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
            >
              <span>Solve Today's Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="card p-4 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search challenges by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 text-sm py-2"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Difficulty filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Difficulty:</span>
            {difficulties.map(d => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all ${
                  difficultyFilter === d
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Category filter */}
          {categories.length > 2 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 font-medium text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-green-500"
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Challenge Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-400 text-sm font-medium">Loading challenges...</p>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="card p-12 text-center text-slate-400 border border-slate-200 dark:border-slate-800">
          No challenges match the active filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => {
            return (
              <div
                key={challenge.id}
                className="card p-6 border border-slate-200 dark:border-slate-800 hover:border-green-500/50 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border capitalize ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> +{challenge.points} pts
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {challenge.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                    {challenge.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {challenge.completed ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Solved
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">
                      Unsolved
                    </span>
                  )}

                  <Link
                    to={`/challenges/${challenge.id}`}
                    className="btn-secondary py-1.5 px-3.5 text-xs flex items-center gap-1.5 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all"
                  >
                    <span>{challenge.completed ? 'Review Solution' : 'Solve'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
