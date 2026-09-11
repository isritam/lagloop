import { useState } from 'react'
import LessonPage from './pages/LessonPage'
import type { Screen } from './types'

function App() {
  const [screen, setScreen] = useState<Screen>('lesson')

  if (screen === 'lesson') {
    return (
      <LessonPage
        onLostLink={() => setScreen('signal')}
      />
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Next screen coming up</h1>

        <p className="mt-4 text-slate-400">
          We will build the confusion/recovery flow next.
        </p>

        <button
          onClick={() => setScreen('lesson')}
          className="mt-8 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950"
        >
          Back to lesson
        </button>
      </div>
    </main>
  )
}

export default App