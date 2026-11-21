import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import EcoChatBot from './components/EcoChatBot'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Learn from './pages/Learn'
import CodeComparison from './pages/CodeComparison'
import Challenges from './pages/Challenges'
import ChallengeDetail from './pages/ChallengeDetail'
import Quizzes from './pages/Quizzes'
import QuizDetail from './pages/QuizDetail'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import CarbonInspector from './pages/CarbonInspector'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/code-comparison" element={<CodeComparison />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenges/:id" element={<ChallengeDetail />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/quizzes/:id" element={<QuizDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/carbon-inspector" element={<CarbonInspector />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="*" element={
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
              <div className="text-8xl">🌿</div>
              <h1 className="text-4xl font-black text-slate-800 dark:text-white">Page Not Found</h1>
              <p className="text-slate-500">The page you're looking for doesn't exist.</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
      <EcoChatBot />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}
