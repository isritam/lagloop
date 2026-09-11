import { useState } from 'react'
import LessonPage from './pages/LessonPage'
import SignalPage from './pages/SignalPage'
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

  if (screen === 'signal') {
    return (
      <SignalPage
        onBack={() => setScreen('lesson')}
        onFindLink={() => {
          alert('Recovery screen coming next!')
        }}
      />
    )
  }

  return null
}

export default App