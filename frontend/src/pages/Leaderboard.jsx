import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import {
  Trophy, Medal, Award, Target, Sparkles, Search,
  Users, Leaf, Flame, Shield, ArrowUp
} from 'lucide-react'

export default function Leaderboard() {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [myRank, setMyRank] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [boardRes, rankRes] = await Promise.allSettled([
          api.get('/leaderboard/'),
          user ? api.get('/leaderboard/my-rank') : Promise.resolve({ data: null })
        ])

        if (boardRes.status === 'fulfilled') setLeaderboard(boardRes.value.data.leaderboard || [])
        if (rankRes.status === 'fulfilled' && rankRes.value.data) setMyRank(rankRes.value.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const filtered = leaderboard.filter(item =>
    item.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  const top3 = leaderboard.slice(0, 3)

  return (
    <div className="container-custom py-8 md:py-12 space-y-10 page-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3">
            <Trophy className="w-3.5 h-3.5" /> Global Standings
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            EcoDeveloper Leaderboard
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl text-base">
            Honoring developers who continuously write efficient algorithms and build sustainable software ecosystems worldwide.
          </p>
        </div>

        {user && myRank && (
          <div className="card p-4 border border-emerald-500/40 bg-emerald-500/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
              #{myRank.rank}
            </div>
            <div>
              <div className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">Your Standing</div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {myRank.total_points} EcoPoints
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Podium for Top 3 (if available) */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Rank 2 - Silver */}
          {top3[1] && (
            <div className="card p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center relative order-2 md:order-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-black text-xl mb-3 shadow-inner">
                🥈
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Rank #2</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-full">
                {top3[1].full_name}
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Level {top3[1].level} Developer</div>
              <div className="mt-4 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm">
                {top3[1].total_points} EcoPoints
              </div>
            </div>
          )}

          {/* Rank 1 - Gold (Elevated) */}
          {top3[0] && (
            <div className="card p-8 border-2 border-yellow-500/60 bg-gradient-to-b from-yellow-500/10 via-amber-500/5 to-transparent flex flex-col items-center text-center relative order-1 md:order-2 shadow-xl -translate-y-2">
              <div className="absolute -top-3 px-3 py-1 rounded-full bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-widest shadow-md">
                Eco Champion
              </div>
              <div className="w-20 h-20 rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center font-black text-3xl mb-4 shadow-lg shadow-yellow-500/30">
                🥇
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400 mb-1">Rank #1</div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white truncate max-w-full">
                {top3[0].full_name}
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Level {top3[0].level} Master Developer</div>
              <div className="mt-4 px-5 py-2 rounded-full bg-yellow-400 text-slate-950 font-black text-base shadow-sm">
                {top3[0].total_points} EcoPoints
              </div>
            </div>
          )}

          {/* Rank 3 - Bronze */}
          {top3[2] && (
            <div className="card p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center relative order-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full bg-amber-700/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-black text-xl mb-3">
                🥉
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">Rank #3</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-full">
                {top3[2].full_name}
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Level {top3[2].level} Developer</div>
              <div className="mt-4 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm">
                {top3[2].total_points} EcoPoints
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search and Table */}
      <div className="space-y-4">
        <div className="card p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter ranking by developer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 text-sm py-2"
            />
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
            Showing top {filtered.length} contributors
          </div>
        </div>

        {/* Full Table */}
        <div className="card overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4 w-16 text-center">Rank</th>
                  <th className="p-4">Developer</th>
                  <th className="p-4 text-center">Level</th>
                  <th className="p-4 text-center">Badges</th>
                  <th className="p-4 text-center">Challenges Solved</th>
                  <th className="p-4 text-right">Total EcoPoints</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400">
                      Loading leaderboard rankings...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400">
                      No developers match the filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => {
                    const isCurrentUser = user && item.id === user.id
                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isCurrentUser
                            ? 'bg-emerald-500/10 dark:bg-emerald-950/30 font-semibold'
                            : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                        }`}
                      >
                        <td className="p-4 text-center font-bold">
                          {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                              {item.full_name?.charAt(0) || 'D'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {item.full_name}
                                {isCurrentUser && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                            Lvl {item.level}
                          </span>
                        </td>
                        <td className="p-4 text-center font-semibold text-slate-600 dark:text-slate-400">
                          {item.badges}
                        </td>
                        <td className="p-4 text-center font-semibold text-slate-600 dark:text-slate-400">
                          {item.challenges_completed}
                        </td>
                        <td className="p-4 text-right font-black text-emerald-600 dark:text-emerald-400">
                          {item.total_points} pts
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
