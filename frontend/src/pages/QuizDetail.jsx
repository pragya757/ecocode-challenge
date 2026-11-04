import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import {
  Zap, ArrowLeft, ArrowRight, CheckCircle2, XCircle,
  Trophy, RotateCcw, Award, Sparkles, HelpCircle, AlertCircle
} from 'lucide-react'

export default function QuizDetail() {
  const { id } = useParams()
  const { user } = useAuth()

  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({}) // { [qId]: 'a' | 'b' | 'c' | 'd' }
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/quizzes/${id}`)
        setQuiz(res.data.quiz)
        setQuestions(res.data.questions || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [id])

  const handleSelectOption = (questionId, optionKey) => {
    if (results) return // locked after submission
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionKey
    }))
  }

  const handleSubmit = async () => {
    if (!user) return
    try {
      setSubmitting(true)
      const res = await api.post(`/quizzes/${id}/submit`, {
        answers: selectedAnswers
      })
      setResults(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRestart = () => {
    setSelectedAnswers({})
    setResults(null)
    setCurrentIndex(0)
  }

  if (loading) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-slate-400 text-sm font-medium">Loading quiz questions...</p>
      </div>
    )
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="container-custom py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Quiz Not Found</h2>
        <Link to="/quizzes" className="btn-primary text-sm inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Quizzes
        </Link>
      </div>
    )
  }

  const currentQ = questions[currentIndex]
  const isAnswered = selectedAnswers[currentQ?.id] !== undefined
  const allAnswered = questions.every(q => selectedAnswers[q.id] !== undefined)
  const answeredCount = Object.keys(selectedAnswers).length

  return (
    <div className="container-custom py-8 md:py-12 max-w-4xl space-y-8 page-enter">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/quizzes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Quizzes
        </Link>

        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {quiz.category || 'Green Assessment'}
        </span>
      </div>

      {/* Results View */}
      {results ? (
        <div className="card p-6 md:p-10 border border-slate-200 dark:border-slate-800 space-y-8 animate-fade-in">
          {/* Header Score Card */}
          <div className="text-center space-y-4 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-3xl font-black shadow-lg ${
              results.passed
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-amber-500 text-white shadow-amber-500/20'
            }`}>
              {results.percentage}%
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                {results.passed ? 'Assessment Passed! 🌱' : 'Quiz Completed'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                You scored {results.score} out of {results.total} questions correctly.
              </p>
            </div>

            {/* Points Earned Banner */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>+{results.points_earned} EcoPoints Earned</span>
              {results.bonus_earned > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-black">
                  Includes +{results.bonus_earned} bonus
                </span>
              )}
            </div>
          </div>

          {/* Breakdown Review of Each Question */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Answer Review & Green Principles
            </h3>

            {results.results?.map((res, i) => {
              const qObj = questions.find(q => q.id === res.question_id)
              return (
                <div
                  key={res.question_id}
                  className={`p-5 rounded-2xl border transition-all ${
                    res.is_correct
                      ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10'
                      : 'border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {res.is_correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    )}

                    <div className="space-y-2 flex-1">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {i + 1}. {qObj?.text}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className={`p-2.5 rounded-xl border ${
                          res.is_correct
                            ? 'bg-emerald-100/50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                            : 'bg-rose-100/50 dark:bg-rose-900/30 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                        }`}>
                          <span className="font-semibold">Your Answer: </span>
                          <span className="uppercase font-bold">({res.selected})</span> {qObj?.[`option_${res.selected}`]}
                        </div>

                        {!res.is_correct && (
                          <div className="p-2.5 rounded-xl border bg-emerald-100/50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200">
                            <span className="font-semibold">Correct Answer: </span>
                            <span className="uppercase font-bold">({res.correct})</span> {qObj?.[`option_${res.correct}`]}
                          </div>
                        )}
                      </div>

                      {res.explanation && (
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 mt-2">
                          <strong className="text-slate-800 dark:text-slate-100">Why this matters:</strong> {res.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={handleRestart}
              className="btn-secondary py-2.5 px-5 text-xs flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Retake Quiz
            </button>

            <Link
              to="/quizzes"
              className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2"
            >
              <span>Back to Quizzes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* Active Quiz Taking Interface */
        <div className="card p-6 md:p-10 border border-slate-200 dark:border-slate-800 space-y-8">
          {/* Progress Indicator */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{answeredCount} / {questions.length} Answered</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Question */}
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
              {currentQ.text}
            </h2>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 gap-3">
              {['a', 'b', 'c', 'd'].map((optKey) => {
                const optText = currentQ[`option_${optKey}`]
                if (!optText) return null
                const isSelected = selectedAnswers[currentQ.id] === optKey

                return (
                  <button
                    key={optKey}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, optKey)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-center gap-4 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100 ring-2 ring-amber-500/30 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center flex-shrink-0 uppercase ${
                      isSelected
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {optKey}
                    </div>
                    <span className="text-sm font-medium leading-relaxed">
                      {optText}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5 disabled:opacity-40"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !user || !allAnswered}
                className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{submitting ? 'Scoring...' : user ? 'Submit Quiz Answers' : 'Sign in to Submit'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
