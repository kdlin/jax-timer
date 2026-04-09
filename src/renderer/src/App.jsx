// App.jsx — Step 5: useTimer hook verification
import { useState } from 'react'
import { useTimer } from './hooks/useTimer'

function App() {
  const [mode, setMode] = useState('focus') // 'focus' | 'break'
  const focusDuration = 25 * 60  // 1500 seconds
  const breakDuration = 5 * 60   // 300 seconds

  const duration = mode === 'focus' ? focusDuration : breakDuration

  function handleComplete() {
    // Auto-switch: focus → break, break → focus
    const next = mode === 'focus' ? 'break' : 'focus'
    setMode(next)
    // Timer will auto-reset via the duration useEffect in useTimer
    // then we start it again
    setTimeout(() => timer.start(), 100)
  }

  const timer = useTimer(duration, handleComplete)

  // Format seconds → MM:SS string
  function fmt(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-surface gap-4">

      {/* Mode badge */}
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border border-outline-variant/20 bg-surface-container-highest ${mode === 'focus' ? 'text-tertiary' : 'text-break-accent'}`}>
        {mode}
      </span>

      {/* Timer display */}
      <p className="text-7xl font-extrabold tracking-tighter text-primary leading-none">
        {fmt(timer.timeLeft)}
      </p>

      {/* Controls */}
      <div className="flex gap-4 no-drag">
        <button
          onClick={timer.reset}
          className="text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">refresh</span>
        </button>

        <button
          onClick={timer.isRunning ? timer.pause : timer.start}
          className="w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {timer.isRunning ? 'pause' : 'play_arrow'}
          </span>
        </button>

        {/* Manual mode switch */}
        <button
          onClick={() => setMode(m => m === 'focus' ? 'break' : 'focus')}
          className="text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">coffee</span>
        </button>
      </div>

      <p className="text-[10px] text-on-surface-variant tracking-widest uppercase">
        {timer.isRunning ? 'running' : 'paused'}
      </p>

    </div>
  )
}

export default App
