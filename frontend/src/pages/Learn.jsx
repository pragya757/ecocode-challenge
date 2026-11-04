import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import {
  BookOpen, CheckCircle2, Clock, Sparkles, ArrowRight,
  Code2, AlertTriangle, Zap, Check, X, Search, ChevronRight
} from 'lucide-react'

export default function Learn() {
  const { user } = useAuth()
  const [lessons, setLessons] = useState([])
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [activeModalContent, setActiveModalContent] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [completionMessage, setCompletionMessage] = useState(null)

  const fetchLessons = async () => {
    try {
      setLoading(true)
      const res = await api.get('/lessons/')
      setLessons(res.data.lessons || [])
      if (res.data.lessons?.length > 0 && !selectedLesson) {
        // Parse first lesson content if available
        const first = res.data.lessons[0]
        setSelectedLesson(first)
        try {
          setActiveModalContent(JSON.parse(first.content))
        } catch {
          setActiveModalContent(null)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLessons()
  }, [])

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson)
    setCompletionMessage(null)
    try {
      const parsed = typeof lesson.content === 'string' ? JSON.parse(lesson.content) : lesson.content
      setActiveModalContent(parsed)
    } catch {
      setActiveModalContent(null)
    }
  }

  const handleComplete = async (lessonId) => {
    if (!user) return
    try {
      setCompleting(true)
      const res = await api.post(`/lessons/${lessonId}/complete`)
      setCompletionMessage(res.data)
      // Update local state
      setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, completed: true } : l))
      if (selectedLesson?.id === lessonId) {
        setSelectedLesson(prev => ({ ...prev, completed: true }))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setCompleting(false)
    }
  }

  const filteredLessons = lessons.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.description.toLowerCase().includes(search.toLowerCase())
  )

  const completedCount = lessons.filter(l => l.completed).length

  return (
    <div className="container-custom py-8 md:py-12 page-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" /> Sustainable Curriculum
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Green Coding Lessons
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl text-base">
            Master the core principles of algorithmic efficiency, memory conservation, and sustainable architecture.
          </p>
        </div>

        {/* Overall Progress Indicator */}
        <div className="card p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
            {lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0}%
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Curriculum Progress</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {completedCount} of {lessons.length} Modules Finished
            </div>
          </div>
        </div>
      </div>

      {/* Main Learning Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Lesson List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search topics, algorithms, memory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 text-sm"
            />
          </div>

          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading lessons...</div>
            ) : filteredLessons.length === 0 ? (
              <div className="py-12 text-center text-slate-400">No lessons match your search.</div>
            ) : (
              filteredLessons.map((lesson) => {
                const isSelected = selectedLesson?.id === lesson.id
                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelectLesson(lesson)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                      isSelected
                        ? 'border-green-600 bg-green-50/50 dark:bg-green-950/20 shadow-md ring-2 ring-green-600/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                      lesson.completed
                        ? 'bg-green-600 text-white shadow-sm'
                        : isSelected
                        ? 'bg-green-600/10 text-green-700 dark:text-green-300 font-extrabold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {lesson.completed ? <Check className="w-4 h-4" /> : lesson.order}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
                          +{lesson.points} EcoPoints
                        </span>
                        {lesson.completed && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Done
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {lesson.description}
                      </p>
                    </div>

                    <ChevronRight className={`w-4 h-4 self-center flex-shrink-0 transition-transform ${
                      isSelected ? 'text-green-600 translate-x-1' : 'text-slate-400'
                    }`} />
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Side: Selected Lesson Content Viewer */}
        <div className="lg:col-span-7">
          {selectedLesson ? (
            <div className="card p-6 md:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                    <span>Module {selectedLesson.order}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 5 min read</span>
                    <span>•</span>
                    <span>+{selectedLesson.points} EcoPoints</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                    {selectedLesson.title}
                  </h2>
                </div>

                {selectedLesson.completed ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </div>
                ) : (
                  <button
                    onClick={() => handleComplete(selectedLesson.id)}
                    disabled={completing || !user}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {completing ? 'Completing...' : user ? 'Mark as Completed' : 'Sign in to earn points'}
                  </button>
                )}
              </div>

              {/* Completion Notification */}
              {completionMessage && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    <span>
                      {completionMessage.message} You earned <strong>+{completionMessage.points_earned} EcoPoints</strong>!
                    </span>
                  </div>
                  <Link to="/dashboard" className="text-xs font-bold underline hover:text-emerald-900 dark:hover:text-white">
                    View Dashboard
                  </Link>
                </div>
              )}

              {/* Description & Overview */}
              <div className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                <p className="font-medium text-slate-800 dark:text-slate-200 mb-3">
                  {selectedLesson.description}
                </p>
                {activeModalContent?.explanation && (
                  <p>{activeModalContent.explanation}</p>
                )}
              </div>

              {/* Key Takeaways */}
              {activeModalContent?.key_points && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-green-500" /> Key Principles
                  </h4>
                  <ul className="space-y-2">
                    {activeModalContent.key_points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Code Comparison Spotlight */}
              {activeModalContent?.inefficient_code && (
                <div className="space-y-4 pt-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Code In Action
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Inefficient */}
                    <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10 overflow-hidden">
                      <div className="px-4 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 border-b border-rose-200 dark:border-rose-900/50">
                        <AlertTriangle className="w-3.5 h-3.5" /> High Energy Waste
                      </div>
                      <pre className="p-4 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre">
                        {activeModalContent.inefficient_code}
                      </pre>
                    </div>

                    {/* Optimized */}
                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10 overflow-hidden">
                      <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 border-b border-emerald-200 dark:border-emerald-900/50">
                        <Zap className="w-3.5 h-3.5" /> Green Optimized
                      </div>
                      <pre className="p-4 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre">
                        {activeModalContent.optimized_code}
                      </pre>
                    </div>
                  </div>

                  {activeModalContent?.improvement && (
                    <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-800 dark:text-green-300">
                      <strong>Why this is greener:</strong> {activeModalContent.improvement}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Link
                  to="/code-comparison"
                  className="text-xs font-semibold text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
                >
                  Explore Interactive Code Comparisons <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {!selectedLesson.completed && (
                  <button
                    onClick={() => handleComplete(selectedLesson.id)}
                    disabled={completing || !user}
                    className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Complete Module</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center text-slate-400 border border-slate-200 dark:border-slate-800">
              Select a lesson to begin learning
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
