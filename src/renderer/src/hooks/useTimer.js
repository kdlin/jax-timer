// useTimer.js — countdown logic for the Pomodoro timer
// Inputs:  duration (seconds), onComplete (callback fired when timer hits 0)
// Outputs: timeLeft, isRunning, start(), pause(), reset()

import { useState, useEffect, useRef } from 'react'

export function useTimer(duration, onComplete) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)

  // useRef stores the interval ID so we can clear it later
  // We use a ref (not state) because changing it shouldn't re-render the component
  const intervalRef = useRef(null)

  // ─── Reset timer when duration changes (e.g. settings update) ──────────────
  useEffect(() => {
    pause()
    setTimeLeft(duration)
  }, [duration])

  // ─── Countdown tick ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (isRunning) {
      // Start a tick every 1000ms (1 second)
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer hit 0 — stop and fire the onComplete callback
            clearInterval(intervalRef.current)
            setIsRunning(false)
            onComplete?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    // Cleanup: clear the interval when isRunning turns false or component unmounts
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  // ─── Controls ───────────────────────────────────────────────────────────────
  function start() {
    if (timeLeft > 0) setIsRunning(true)
  }

  function pause() {
    setIsRunning(false)
    clearInterval(intervalRef.current)
  }

  function reset(newDuration) {
    pause()
    setTimeLeft(typeof newDuration === 'number' ? newDuration : duration)
  }

  return { timeLeft, isRunning, start, pause, reset }
}
