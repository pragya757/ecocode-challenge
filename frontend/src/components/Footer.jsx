import { Link } from 'react-router-dom'
import Logo from './Logo'
import { Leaf, Github, Twitter, Linkedin, Mail, Code2, BookOpen, Trophy, Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-300 mt-auto">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Code Smarter. Think Greener. Build a Sustainable Future. 
              An educational platform for environmentally responsible developers.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/pragya757/ecocode-challenge" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="mailto:hello@ecocode.dev"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Learn */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-green-400" /> Learn
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/learn" className="hover:text-green-400 transition-colors">Green Coding Lessons</Link></li>
              <li><Link to="/code-comparison" className="hover:text-green-400 transition-colors">Code Comparison</Link></li>
              <li><Link to="/quizzes" className="hover:text-green-400 transition-colors">Quizzes</Link></li>
              <li><Link to="/challenges" className="hover:text-green-400 transition-colors">Coding Challenges</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-lime-400" /> Platform
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/carbon-inspector" className="hover:text-green-400 transition-colors">Carbon Inspector</Link></li>
              <li><Link to="/leaderboard" className="hover:text-green-400 transition-colors">Leaderboard</Link></li>
              <li><Link to="/dashboard" className="hover:text-green-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/profile" className="hover:text-green-400 transition-colors">Profile</Link></li>
              <li><Link to="/register" className="hover:text-green-400 transition-colors">Join Free</Link></li>
            </ul>
          </div>

          {/* Green Coding Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" /> Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://greensoftware.foundation" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">Green Software Foundation</a></li>
              <li><a href="https://principles.green" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">Principles of Green Software</a></li>
              <li><a href="https://github.com/pragya757/ecocode-challenge" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">GitHub Repository</a></li>
            </ul>

            <div className="mt-6 p-3 rounded-xl bg-green-900/20 border border-green-800/30">
              <p className="text-xs text-green-400 font-medium mb-1">🌱 Platform Impact</p>
              <p className="text-xs text-slate-400">Teaching developers to write greener code one lesson at a time.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 EcoCode Challenge. Built with 💚 by <span className="text-emerald-400 font-bold hover:underline cursor-default">Pragya</span> for a greener internet.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              API Online
            </span>
            <span>Crafted by <strong className="text-slate-300 font-semibold">Pragya</strong> for sustainable developers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
