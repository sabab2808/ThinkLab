import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Landing from './pages/Landing.jsx'
import GameHub from './pages/GameHub.jsx'
import TicTacToe from './pages/games/TicTacToe.jsx'
import TicTacToeScan from './pages/games/TicTacToeScan.jsx'
import MazeLab from './pages/games/MazeLab.jsx'
import MazeLabScan from './pages/games/MazeLabScan.jsx'
import RubiksCube from './pages/games/RubiksCube.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

// Lazy-loaded: this page pulls in a ~190k-word dictionary (~2MB) via
// @thinklab/word-search. Splitting it into its own chunk means nobody
// pays that download cost unless they actually open the game.
const WordSearch = lazy(() => import('./pages/games/WordSearch.jsx'))

function PageLoading() {
  return <p className="mx-auto max-w-6xl px-4 py-16 font-mono text-sm text-text-muted sm:px-6">Loading…</p>
}

function App() {
  return (
    <div className="min-h-screen bg-ink text-text">
      <Nav />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/games" element={<GameHub />} />
          <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/games/tic-tac-toe/scan" element={<TicTacToeScan />} />
          <Route path="/games/maze" element={<MazeLab />} />
          <Route path="/games/maze/scan" element={<MazeLabScan />} />
          <Route path="/games/rubik" element={<RubiksCube />} />
          <Route path="/games/word-search" element={<WordSearch />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
