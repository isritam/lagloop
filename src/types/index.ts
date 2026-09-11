export type Lesson = {
  title: string
  subtitle: string
  duration: string
  transcript: string
  timestamp: string
}

export type Screen = 'lesson' | 'signal' | 'recovery' | 'closed'