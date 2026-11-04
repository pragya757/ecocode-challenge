import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import {
  Leaf, Zap, Trophy, BookOpen, Code2, Target, ArrowRight,
  Users, CheckCircle, Award, Star, ChevronRight, Globe2,
  TrendingUp, Shield, Cpu, Database, Flame, LayoutDashboard
} from 'lucide-react'

const Counter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (end === 0) return
    const step = end / (duration / 16)
    let current = 0
    const timer = setInterval(() => {
      current += step
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [end, duration])
  return <span>{count.toLocaleString()}{suffix}</span>
}

export default function Home() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ total_learners: 0, challenges_completed: 0, quizzes_attempted: 0, total_points_earned: 0 })

  useEffect(() => {
    api.get('/dashboard/platform-stats')
      .then(res => setStats(res.data))
      .catch(() => {})
  }, [])

  const features = [
    { icon: BookOpen, title: 'Green Coding Lessons', desc: '8 in-depth lessons on sustainable programming practices, from basics to advanced techniques.', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
    { icon: Code2, title: 'Code Comparison', desc: 'Side-by-side analysis of inefficient vs optimized code with algorithmic explanations.', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
    { icon: Target, title: 'Daily Challenges', desc: 'Fresh coding challenges every day. Write greener algorithms and earn EcoPoints.', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
    { icon: Zap, title: 'Interactive Quizzes', desc: '40+ questions across 5 categories. Test your sustainable coding knowledge.', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
    { icon: Trophy, title: 'Badges & Levels', desc: 'Earn 7 unique eco-badges and climb through 8 experience levels.', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
    { icon: Globe2, title: 'Global Leaderboard', desc: 'Compete with developers worldwide. Track your EcoPoints ranking in real time.', color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' },
  ]

  const steps = [
    { n: '01', title: 'Sign Up Free', desc: 'Create your account in seconds and start your green coding journey.', icon: Users },
    { n: '02', title: 'Learn Green Coding', desc: 'Explore 8 curated lessons on sustainable programming practices.', icon: BookOpen },
    { n: '03', title: 'Complete Challenges', desc: 'Solve daily green coding challenges and test your skills.', icon: Target },
    { n: '04', title: 'Earn Points & Badges', desc: 'Collect EcoPoints and unlock achievement badges as you progress.', icon: Award },
    { n: '05', title: 'Climb the Leaderboard', desc: 'Compete with the global community of green developers.', icon: Trophy },
  ]

  const testimonials = [
    { name: 'Alex Chen', role: 'Senior Backend Engineer', text: 'EcoCode Challenge completely changed how I think about algorithm efficiency. The code comparisons are eye-opening!', stars: 5, avatar: 'AC' },
    { name: 'Sarah Kumar', role: 'Full Stack Developer', text: 'I never realized how much energy bad database queries waste. The quizzes here are both fun and genuinely educational.', stars: 5, avatar: 'SK' },
    { name: 'Marcus Osei', role: 'Software Architect', text: 'The daily challenges keep me sharp. I love that this platform connects coding skills with real environmental impact.', stars: 5, avatar: 'MO' },
  ]

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="hero-gradient dots-pattern relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay:'1s'}}></div>
        </div>

        <div className="container-custom py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/40 border border-green-700/50 text-green-400 text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in">
              <Leaf className="w-4 h-4" />
              <span>Join the Green Coding Revolution</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight animate-slide-up">
              Every Line of Code<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400">
                Can Make a Difference.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay:'0.2s'}}>
              Learn to write energy-efficient code. Understand how developers reduce unnecessary computation,
              lower carbon emissions, and build a more sustainable digital world.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{animationDelay:'0.4s'}}>
              {user ? (
                <>
                  <Link to="/dashboard" className="btn-primary flex items-center gap-2 px-8 py-4 text-base">
                    <LayoutDashboard className="w-5 h-5" /> Go to Dashboard
                  </Link>
                  <Link to="/challenges" className="btn-secondary flex items-center gap-2 px-8 py-4 text-base border-green-400 text-green-400 hover:bg-green-700 hover:text-white hover:border-green-700">
                    <Target className="w-5 h-5" /> Explore Challenges
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-primary flex items-center gap-2 px-8 py-4 text-base glow-green">
                    <Leaf className="w-5 h-5" /> Start Coding Greener
                  </Link>
                  <Link to="/challenges" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/20 hover:border-green-400 hover:text-green-400 transition-all duration-200 text-base">
                    <Target className="w-5 h-5" /> Explore Challenges
                  </Link>
                </>
              )}
            </div>

            {/* Hero Visual */}
            <div className="mt-16 relative max-w-3xl mx-auto animate-fade-in" style={{animationDelay:'0.6s'}}>
              <div className="terminal glow-green">
                <div className="terminal-header">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-xs text-slate-400">green_code.py</span>
                </div>
                <div className="terminal-body text-left">
                  <div className="space-y-1">
                    <p><span className="text-purple-400"># ❌ Inefficient: O(n²) energy waste</span></p>
                    <p><span className="text-red-400">result</span> <span className="text-white">= []</span></p>
                    <p><span className="text-blue-400">for</span> <span className="text-white">i</span> <span className="text-blue-400">in</span> <span className="text-yellow-400">range</span><span className="text-white">(</span><span className="text-yellow-400">len</span><span className="text-white">(numbers)):</span></p>
                    <p className="ml-4"><span className="text-white">result.</span><span className="text-yellow-400">append</span><span className="text-white">(numbers[i] * </span><span className="text-orange-400">2</span><span className="text-white">)</span></p>
                    <p className="mt-3"><span className="text-green-400"># ✅ Optimized: O(n) list comprehension</span></p>
                    <p><span className="text-green-300">result</span> <span className="text-white">= [n *</span> <span className="text-orange-400">2</span> <span className="text-blue-400">for</span> <span className="text-white">n</span> <span className="text-blue-400">in</span> <span className="text-white">numbers]</span></p>
                    <p className="mt-2 text-green-400 text-xs">⚡ Cleaner, more readable, optimized bytecode</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-navy-800 border-b border-slate-100 dark:border-slate-700/50">
        <div className="container-custom py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Registered Learners', value: stats.total_learners, suffix: '+', icon: Users, color: 'text-green-600' },
              { label: 'Challenges Completed', value: stats.challenges_completed, suffix: '+', icon: CheckCircle, color: 'text-emerald-600' },
              { label: 'Quizzes Attempted', value: stats.quizzes_attempted, suffix: '+', icon: Zap, color: 'text-blue-600' },
              { label: 'EcoPoints Earned', value: stats.total_points_earned, suffix: '+', icon: Star, color: 'text-amber-500' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                <div className="stat-number">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section bg-slate-50 dark:bg-navy-900">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="badge-green mb-3">Platform Features</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-3">
              Everything You Need to Code <span className="gradient-text">Greener</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto">
              A complete learning platform combining education, gamification, and community to teach sustainable coding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card-hover p-6 group">
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section bg-white dark:bg-navy-800">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="badge-green mb-3">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-3">
              How <span className="gradient-text">EcoCode</span> Works
            </h2>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-200 dark:via-green-800 to-transparent"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {steps.map((step, i) => (
                <div key={i} className="text-center relative">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-700 to-emerald-500 mx-auto flex items-center justify-center shadow-lg mb-4 relative z-10">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 md:left-auto md:right-0 w-6 h-6 bg-lime-400 text-navy-900 rounded-full text-xs font-black flex items-center justify-center z-20">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section bg-gradient-to-r from-green-700 to-emerald-600">
        <div className="container-custom text-center text-white">
          <Flame className="w-12 h-12 mx-auto mb-4 text-lime-300" />
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Ready to Code Greener?
          </h2>
          <p className="text-green-100 mb-8 max-w-lg mx-auto">
            Join thousands of developers learning to write energy-efficient, sustainable code.
          </p>
          {user ? (
            <Link to="/challenges" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-all duration-200 hover:scale-105 shadow-xl">
              Start a Challenge <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-all duration-200 hover:scale-105 shadow-xl">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-slate-50 dark:bg-navy-900">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="badge-green mb-3">Community</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-3">
              What Developers <span className="gradient-text">Say</span>
            </h2>
            <p className="text-xs text-slate-400 mt-2">* Testimonials represent typical user experiences (demo content)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-center gap-1 mb-3">
                  {Array(t.stars).fill(0).map((_, si) => (
                    <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

