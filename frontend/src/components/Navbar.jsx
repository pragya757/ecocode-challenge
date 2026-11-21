import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Logo from './Logo'
import { Menu, X, Sun, Moon, Leaf, ChevronDown, LogOut, User, LayoutDashboard, Trophy } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { dark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/learn', label: 'Learn' },
    { to: '/code-comparison', label: 'Code Comparison' },
    { to: '/challenges', label: 'Challenges' },
    { to: '/quizzes', label: 'Quizzes' },
    { to: '/carbon-inspector', label: 'Carbon Inspector', badge: 'New' },
    { to: '/leaderboard', label: 'Leaderboard' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded-lg text-sm flex items-center ${isActive ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : ''}`
                }
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-black uppercase rounded-full bg-emerald-500 text-white shadow-xs">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {dark
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4 text-slate-500" />
              }
            </button>

            {user ? (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow">
                    {user.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {user.full_name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 card shadow-xl py-2 border border-slate-200 dark:border-slate-700 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.full_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-xs font-bold text-green-600">⚡ {user.total_points} EcoPoints</span>
                      </div>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link
                      to="/leaderboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <Trophy className="w-4 h-4" /> Leaderboard
                    </Link>
                    <hr className="my-1 border-slate-100 dark:border-slate-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Get Started</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 py-4 space-y-1 animate-fade-in">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-green-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Dashboard</Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">Sign Out</button>
                </>
              ) : (
                <div className="flex gap-2 px-4">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 btn-secondary text-center text-sm py-2">Sign In</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 btn-primary text-center text-sm py-2">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </nav>
  )
}
