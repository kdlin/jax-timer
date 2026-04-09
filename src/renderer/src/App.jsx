// App.jsx — root state + renders MaxiView or MiniView
import { useState } from 'react'
import { useTimer } from './hooks/useTimer'
import MaxiView from './components/MaxiView'

function App() {
  const [mode, setMode] = useState('focus')       // 'focus' | 'break'
  const [isMini, setIsMini] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [focusDuration, setFocusDuration] = useState(25 * 60)
  const [breakDuration, setBreakDuration] = useState(5 * 60)
  const [rippleKey, setRippleKey] = useState(0)

  const duration = mode === 'focus' ? focusDuration : breakDuration

  function handleComplete() {
    const next = mode === 'focus' ? 'break' : 'focus'
    setMode(next)
    setTimeout(() => { timer.start(); triggerBadgeAnim() }, 100)
  }

  const timer = useTimer(duration, handleComplete)

  function triggerBadgeAnim() {
    setRippleKey(k => k + 1)
  }

  function handleModeSwitch(newMode) {
    if (newMode === mode) return
    timer.reset()
    setMode(newMode)
  }

  return (
    <div className="flex items-center justify-center w-full h-screen bg-transparent">
      <MaxiView
        mode={mode}
        timer={timer}
        duration={duration}
        onModeSwitch={handleModeSwitch}
        onSettingsOpen={() => setIsSettingsOpen(true)}
        rippleKey={rippleKey}
        triggerBadgeAnim={triggerBadgeAnim}
      />
    </div>
  )
}

export default App
