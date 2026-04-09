// MaxiView.jsx — full 320x380 HUD (focus + break states)
// Props: mode, timer, duration, onModeSwitch, onSettingsOpen, rippleKey, triggerBadgeAnim

function MaxiView({ mode, timer, duration, onModeSwitch, onSettingsOpen, rippleKey, triggerBadgeAnim }) {

  const isFocus = mode === 'focus'

  // Accent color tokens based on mode
  const accentText  = isFocus ? 'text-tertiary'     : 'text-break-accent'
  const rippleClass = isFocus ? 'badge-focus-ripple' : 'badge-break-ripple'

  // Format seconds → MM:SS
  function fmt(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // Progress: how much of the duration has elapsed (0 → 1)
  const progress = (duration - timer.timeLeft) / duration

  // Elapsed time label (left side of progress bar)
  const elapsed = duration - timer.timeLeft

  return (
    <div className="relative w-[320px] h-[380px] bg-surface rounded-2xl overflow-hidden shadow-[0_40px_60px_rgba(0,0,0,0.5)] border border-outline-variant/20 flex flex-col">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="drag-region bg-[#131313]/80 backdrop-blur-xl flex items-center justify-between px-4 h-12 w-full rounded-t-2xl z-10 shrink-0">
        <div />
        <div className="no-drag flex items-center gap-3">
          <button className="text-on-surface-variant hover:text-white transition-colors active:scale-95">
            <span className="material-symbols-outlined text-[18px]">history</span>
          </button>
          <button
            onClick={onSettingsOpen}
            className="text-on-surface-variant hover:text-white transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6">

        {/* Badge */}
        <div className="mb-6">
          <span
            key={rippleKey}
            className={`
              bg-surface-container-highest border border-outline-variant/20
              px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase
              ${accentText}
              ${rippleKey > 0 ? `badge-ripple ${rippleClass}` : ''}
            `}
          >
            {isFocus ? 'FOCUS' : 'BREAK'}
          </span>
        </div>

        {/* Timer */}
        <div className="text-white text-7xl font-extrabold tracking-tighter mb-8 font-headline">
          {fmt(timer.timeLeft)}
        </div>

        {/* Controls — reset + play/pause only */}
        <div className="no-drag flex items-center gap-8 mb-4">
          <button
            onClick={timer.reset}
            className="text-on-surface-variant hover:text-white transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>

          <button
            onClick={() => {
              if (timer.isRunning) {
                timer.pause()
              } else {
                timer.start()
                triggerBadgeAnim()
              }
            }}
            className="w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <span
              className="material-symbols-outlined text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {timer.isRunning ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Placeholder for future log icon — same size as reset to keep layout balanced */}
          <div className="w-6 h-6" />
        </div>

        {/* Paused label */}
        {!timer.isRunning && timer.timeLeft < duration && (
          <p className="text-[10px] text-on-surface-variant tracking-widest uppercase">
            paused
          </p>
        )}

        {/* Ambient glow */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center -z-10 opacity-20 pointer-events-none">
          <div className={`w-48 h-48 rounded-full blur-[80px] ${isFocus ? 'bg-tertiary/10' : 'bg-break-accent/10'}`} />
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="flex flex-col w-full shrink-0">

        {/* Spotify-style progress bar */}
        <div className="w-full px-4 mb-2">
          <div className="h-[2px] w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-1000"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] text-on-surface-variant font-medium tracking-wider">
              {fmt(elapsed)}
            </span>
            <span className="text-[9px] text-on-surface-variant font-medium tracking-wider">
              {fmt(duration)}
            </span>
          </div>
        </div>

        {/* Bottom nav */}
        <nav className="no-drag bg-[#131313]/80 backdrop-blur-xl border-t border-[#474747]/20 flex justify-around items-center w-full h-14 rounded-b-2xl">

          {/* Focus tab */}
          <button
            onClick={() => onModeSwitch('focus')}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all active:scale-95
              ${isFocus
                ? 'bg-surface-container-highest/50 text-white'
                : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: isFocus ? "'FILL' 1" : "'FILL' 0" }}
            >
              timer
            </span>
            <span className="text-[10px] uppercase tracking-[0.05em] mt-0.5">Focus</span>
          </button>

          {/* Break tab */}
          <button
            onClick={() => onModeSwitch('break')}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all active:scale-95
              ${!isFocus
                ? 'bg-surface-container-highest/50 text-break-accent'
                : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: !isFocus ? "'FILL' 1" : "'FILL' 0" }}
            >
              coffee
            </span>
            <span className="text-[10px] uppercase tracking-[0.05em] mt-0.5">Break</span>
          </button>

        </nav>
      </footer>

      {/* Ambient screen glow */}
      <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-tertiary/5 rounded-full blur-[160px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px]" />
      </div>

    </div>
  )
}

export default MaxiView
