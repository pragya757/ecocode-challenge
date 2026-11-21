import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import api from '../services/api'
import Editor from '@monaco-editor/react'
import { fireCelebrationConfetti } from '../utils/confetti'
import {
  Target, ArrowLeft, CheckCircle2, AlertCircle, Play,
  RotateCcw, Lightbulb, Sparkles, Code2, Award, Zap, Check, Settings2
} from 'lucide-react'

export default function ChallengeDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { dark } = useTheme()

  const [challenge, setChallenge] = useState(null)
  const [code, setCode] = useState('')
  const [answer, setAnswer] = useState('')
  const [language, setLanguage] = useState('python')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/challenges/${id}`)
        setChallenge(res.data.challenge)
        setCode(res.data.challenge.initial_code || '# Write your green optimized code here\n')
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchChallenge()
  }, [id])

  const handleReset = () => {
    if (challenge) {
      setCode(challenge.initial_code || '')
      setAnswer('')
      setResult(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    try {
      setSubmitting(true)
      const res = await api.post(`/challenges/${id}/submit`, { code, answer })
      setResult(res.data)
      if (res.data.is_correct) {
        fireCelebrationConfetti()
        setChallenge(prev => ({
          ...prev,
          completed: true,
          sample_solution: res.data.sample_solution || prev.sample_solution
        }))
      }
    } catch (err) {
      setResult({
        is_correct: false,
        message: err.response?.data?.error || 'Submission failed. Please try again.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-slate-400 text-sm font-medium">Loading challenge details...</p>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="container-custom py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Challenge Not Found</h2>
        <Link to="/challenges" className="btn-primary text-sm inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Challenges
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-8 md:py-12 space-y-8 page-enter">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/challenges"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Challenges
        </Link>

        {challenge.completed && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Solved
          </div>
        )}
      </div>

      {/* Main Grid: Problem Description & Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Problem Briefing */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card p-6 md:p-7 border border-slate-200 dark:border-slate-800 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                <span>{challenge.category || 'Green Algorithm'}</span>
                <span>•</span>
                <span className="capitalize">{challenge.difficulty}</span>
                <span>•</span>
                <span>+{challenge.points} EcoPoints</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {challenge.title}
              </h1>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {challenge.description}
            </div>

            {/* Input / Output Examples */}
            {(challenge.input_example || challenge.output_example) && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Expected Execution
                </h4>
                {challenge.input_example && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Input / Setup:</span>
                    <pre className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto mt-1">
                      {challenge.input_example}
                    </pre>
                  </div>
                )}
                {challenge.output_example && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Expected Output / Efficiency:</span>
                    <pre className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto mt-1">
                      {challenge.output_example}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Hint Accordion */}
            {challenge.hint && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold"
                >
                  <span className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" /> Need a Green Hint?
                  </span>
                  <span>{showHint ? 'Hide' : 'Reveal'}</span>
                </button>
                {showHint && (
                  <div className="mt-2 p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/60 dark:border-amber-900/20 text-xs text-amber-900 dark:text-amber-200 animate-fade-in leading-relaxed">
                    {challenge.hint}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sample Solution Card (Visible if already solved or just passed) */}
          {(challenge.sample_solution || result?.sample_solution) && (
            <div className="card p-6 border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-500" /> Reference Green Solution
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
                {challenge.sample_solution || result.sample_solution}
              </pre>
            </div>
          )}
        </div>

        {/* Right Column: Code Editor & Submission */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="card p-6 md:p-7 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Green Solution Code Editor
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="text-slate-400 text-[11px] font-medium">Lang:</span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>

            {/* Monaco Code Editor */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
              <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                  <span className="ml-2 font-mono text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                    {language === 'python' ? 'solution.py' : 'solution.js'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                  <Sparkles className="w-3 h-3" /> Monaco Pro Editor
                </div>
              </div>
              <Editor
                height="380px"
                language={language}
                theme={dark ? "vs-dark" : "light"}
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  padding: { top: 12, bottom: 12 },
                  fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
                  fontLigatures: true,
                  bracketPairColorization: { enabled: true },
                  lineNumbersMinChars: 3,
                }}
              />
            </div>

            {/* Explanation / Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Explanation & Algorithmic Notes (Optional)
              </label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Briefly describe how your solution saves energy..."
                className="input-field text-xs"
              />
            </div>

            {/* Feedback / Result Banner */}
            {result && (
              <div className={`p-4 rounded-xl border flex items-start gap-3 animate-fade-in ${
                result.is_correct
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              }`}>
                {result.is_correct ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="text-xs">
                  <div className="font-bold">{result.message}</div>
                  {result.points_earned > 0 && (
                    <div className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      +{result.points_earned} EcoPoints awarded to your profile!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {user ? 'Ready to benchmark and submit?' : 'Sign in to submit your solution.'}
              </span>

              <button
                type="submit"
                disabled={submitting || !user}
                className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>{submitting ? 'Evaluating...' : 'Submit & Benchmark'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
