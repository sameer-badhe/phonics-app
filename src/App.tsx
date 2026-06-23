import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LearnLetters from './pages/LearnLetters'
import WordPractice from './pages/WordPractice'
import Quiz from './pages/Quiz'
import Progress from './pages/Progress'

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<LearnLetters />} />
        <Route path="/words" element={<WordPractice />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </div>
  )
}
