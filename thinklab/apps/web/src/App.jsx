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

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-ink text-text">
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/games" element={<GameHub />} />
        <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
        <Route path="/games/tic-tac-toe/scan" element={<TicTacToeScan />} />
        <Route path="/games/maze" element={<MazeLab />} />
        <Route path="/games/maze/scan" element={<MazeLabScan />} />
        <Route path="/games/rubik" element={<RubiksCube />} />
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
      <footer className="mt-auto border-t border-hairline px-4 py-5 sm:px-6">
        <p className="mx-auto max-w-6xl text-center font-mono text-[11px] text-text-muted">
          © 2026 CRYPT00 · THINKLAB
        </p>
      </footer>
    </div>
  )
}

export default App
