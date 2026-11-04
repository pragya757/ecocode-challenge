import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import {
  Zap, HelpCircle, Trophy, ArrowRight, Award,
  CheckCircle2, Clock, Sparkles, History
} from 'lucide-react'

export default function Quizzes() {
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [quizRes, attemptRes] = await Promise.allSettled([
          api.get('/quizzes/'),
          user ? api.get('/quizzes/attempts') : Promise.resolve({ data: { attempts: [] } })
        ])

        if (quizRes.status === 'fulfilled') setQuizzes(quizRes.value.data.quizzes || [])
        if (attemptRes.status === 'fulfilled') setAttempts(attemptRes.value.data.attempts || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  return (
    <div className="container-custom py-8 md:py-12 space-y-10 page-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5" /> Interactive Assessments
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Knowledge Quizzes
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl text-base">
            Test your understanding of energy efficiency, carbon intensity, software architecture, and green software engineering.
          </p>
        </div>

        {user && attempts.length > 0 && (
          <div className="card p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Attempts Logged</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {attempts.length} Quizzes Completed
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quizzes Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-400 text-sm font-medium">Loading quizzes...</p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="card p-12 text-center text-slate-400 border border-slate-200 dark:border-slate-800">
          No quizzes available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            const userAttempts = attempts.filter(a => a.quiz_id === quiz.id)
            const highestScore = userAttempts.length > 0
              ? Math.max(...userAttempts.map(a => Math.round((a.score / a.total_questions) * 100)))
              : null

            return (
              <div
                key={quiz.id}
                className="card p-6 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {quiz.category || 'Curriculum Quiz'}
                    </span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> +{quiz.points_per_correct * (quiz.question_count || 5) + quiz.bonus_points} max pts
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {quiz.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                    {quiz.description}
                  </p>

                  <div className="space-y-1.5 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Questions</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{quiz.question_count || 8} Questions</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pass Requirement</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.round((quiz.pass_threshold || 0.8) * 100)}% for bonus</span>
                    </div>
                    {highestScore !== null && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span>Your Best Score</span>
                        <span>{highestScore}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to={`/quizzes/${quiz.id}`}
                    className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20"
                  >
                    <span>{highestScore !== null ? 'Retake Quiz' : 'Start Quiz'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* User Attempts Table (if logged in and has history) */}
      {user && attempts.length > 0 && (
        <div className="space-y-4 pt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500" /> Recent Quiz Activity
          </h2>

          <div className="card overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Quiz Title</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Points Earned</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {attempts.slice(0, 5).map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">{att.quiz_title}</td>
                      <td className="p-4">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {att.score} / {att.total_questions}
                        </span>{' '}
                        ({Math.round((att.score / att.total_questions) * 100)}%)
                      </td>
                      <td className="p-4 font-bold text-amber-600 dark:text-amber-400">+{att.points_earned} pts</td>
                      <td className="p-4 text-slate-400">
                        {att.completed_at ? new Date(att.completed_at).toLocaleDateString() : 'Recent'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
