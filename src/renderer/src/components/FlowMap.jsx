// FlowMap.jsx — pannable overlay popup
import { useState, useRef } from 'react'

// ── Canvas dimensions (inner pannable area) ───────────────────────────────────
const CANVAS_W = 600
const CANVAS_H = 700

// Node positions in pixels within the canvas
const NODES = [
  { x: 300, y: 80  },  // Block 1 — center
  { x: 190, y: 200 },  // Break 1 — left (tighter S-curve, stays visible)
  { x: 300, y: 320 },  // Block 2 — center
]

// Bezier path segments
const SEGMENTS = [
  `M ${NODES[0].x},${NODES[0].y} C 380,120 200,160 ${NODES[1].x},${NODES[1].y}`,
  `M ${NODES[1].x},${NODES[1].y} C 160,260 360,290 ${NODES[2].x},${NODES[2].y}`,
]

const BLOCKS = [
  { id: 1, type: 'focus', status: 'active' },
  { id: 2, type: 'break', status: 'upcoming' },
  { id: 3, type: 'focus', status: 'upcoming' },
]

// Visible area height: total 380 minus header 48px
const VISIBLE_H = 332
const VISIBLE_W = 320

// Initial pan: center the canvas horizontally, start from top
const INITIAL_PAN = { x: -(CANVAS_W - VISIBLE_W) / 2, y: 0 }

function FlowMap({ onClose }) {
  const activeIndex = BLOCKS.findIndex(b => b.status === 'active')
  const [pan, setPan] = useState(INITIAL_PAN)
  const dragRef = useRef(null)

  function onWheel(e) {
    e.preventDefault()
    setPan(prev => ({
      x: prev.x,
      y: Math.min(0, Math.max(VISIBLE_H - CANVAS_H, prev.y - e.deltaY * 0.5)),
    }))
  }

  function onPointerDown(e) {
    dragRef.current = { startX: e.clientX - pan.x, startY: e.clientY - pan.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    if (!dragRef.current) return
    const rawX = e.clientX - dragRef.current.startX
    const rawY = e.clientY - dragRef.current.startY
    setPan({
      x: Math.min(0, Math.max(VISIBLE_W - CANVAS_W, rawX)),
      y: Math.min(0, Math.max(VISIBLE_H - CANVAS_H, rawY)),
    })
  }

  function onPointerUp() {
    dragRef.current = null
  }

  return (
    <div className="absolute inset-0 bg-surface-container-lowest rounded-2xl overflow-hidden flex flex-col border border-white/5 z-50">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="drag-region bg-[#1b1b1b]/80 backdrop-blur-xl flex justify-between items-center px-4 h-12 w-full z-20 border-b border-white/5 shrink-0">
        <div className="no-drag">
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-white transition-colors active:scale-95 p-1 rounded-md hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
        </div>
        <span className="text-sm font-bold tracking-[0.05em] text-white uppercase">Map</span>
        <div className="no-drag">
          <button className="text-on-surface-variant hover:text-white transition-colors active:scale-95 p-1 rounded-md hover:bg-surface-container-high">
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>
        </div>
      </header>

      {/* ── Viewport (clips the canvas) ────────────────────────── */}
      <main
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
      >
        {/* Inner pannable canvas */}
        <div
          className="absolute"
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `translate(${pan.x}px, ${pan.y}px)`,
            willChange: 'transform',
          }}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* SVG paths */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            preserveAspectRatio="none"
          >
            {SEGMENTS.map((d, i) => {
              const isPassed = activeIndex > i
              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={isPassed ? '#6bfdaf' : '#474747'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity={isPassed ? 1 : 0.4}
                  style={isPassed ? { filter: 'drop-shadow(0 0 6px #6bfdaf)' } : undefined}
                />
              )
            })}
          </svg>

          {/* Nodes */}
          {BLOCKS.map((block, i) => {
            const num = BLOCKS.slice(0, i + 1).filter(b => b.type === block.type).length
            const isPast = i < activeIndex
            return (
              <Node
                key={block.id}
                block={block}
                x={NODES[i].x}
                y={NODES[i].y}
                num={num}
                isPast={isPast}
                flipped={NODES[i].y < 150}
              />
            )
          })}
        </div>
      </main>

    </div>
  )
}

// ── Node ──────────────────────────────────────────────────────────────────────
function Node({ block, x, y, num, isPast, flipped }) {
  const [hovered, setHovered] = useState(false)
  const isActive = block.status === 'active'
  const isBreak  = block.type === 'break'

  const size = isActive ? 32 : 24
  const half = size / 2

  const accentText  = isBreak ? 'text-break-accent' : 'text-tertiary'
  const accentBorder = isBreak ? 'border-break-accent/40' : 'border-tertiary/40'
  const accentGlow  = isBreak ? '0 0 14px rgba(241,154,142,0.5)' : '0 0 14px rgba(107,253,175,0.5)'

  const circleCls = isActive
    ? 'bg-primary'
    : isPast
      ? `bg-surface-container-high border ${accentBorder}`
      : 'bg-surface-container-low border border-outline-variant/20'

  const iconCls = isActive
    ? 'text-on-primary text-base'
    : isPast
      ? `${accentText} text-xs`
      : 'text-on-surface-variant/30 text-xs'

  const labelCls = isActive ? 'text-primary'
    : isPast ? `${accentText} opacity-60`
    : 'text-on-surface-variant/20'

  return (
    <div
      className="absolute"
      style={{ left: x, top: y }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Pulse ring — active node only */}
      {isActive && (
        <div
          className={`absolute rounded-full z-10 ${isBreak ? 'node-pulse-break' : 'node-pulse-focus'}`}
          style={{ width: size, height: size, marginLeft: -half, marginTop: -half }}
        />
      )}

      {/* Node circle */}
      <div
        className={`absolute flex items-center justify-center rounded-full z-20 transition-all duration-200 ${circleCls}`}
        style={{
          width: size,
          height: size,
          marginLeft: -half,
          marginTop: -half,
          boxShadow: isActive
            ? '0 0 15px rgba(255,255,255,0.4)'
            : hovered ? accentGlow : 'none',
        }}
      >
        <span
          className={`material-symbols-outlined ${iconCls}`}
          style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
        >
          {isBreak ? 'coffee' : 'timer'}
        </span>
      </div>

      {/* Static label (always visible, small) */}
      <p
        className={`absolute whitespace-nowrap text-[9px] font-bold uppercase transition-all duration-200 ${labelCls}`}
        style={{ left: half + 8, transform: 'translateY(-50%)' }}
      >
        {isBreak ? 'Break' : 'Block'} {num}
      </p>

      {/* Hover card — expands up or down from node like a Maps pin */}
      <div
        className={`absolute z-30 pointer-events-none transition-all duration-200 ${flipped ? 'origin-top' : 'origin-bottom'}`}
        style={{
          left: half + 6,
          ...(flipped
            ? { top: half + 6 }
            : { bottom: half + 6 }
          ),
          transform: hovered
            ? 'scale(1) translateY(0)'
            : flipped ? 'scale(0.7) translateY(-6px)' : 'scale(0.7) translateY(6px)',
          opacity: hovered ? 1 : 0,
        }}
      >
        {/* When flipped: arrow renders ABOVE the card */}
        {flipped && (
          <div
            className={`w-2 h-2 rotate-45 border-t border-l ml-3
              ${isBreak ? 'border-break-accent/30' : 'border-tertiary/30'}
              bg-surface-container-high/90
            `}
            style={{ marginBottom: -4 }}
          />
        )}

        <div
          className={`
            px-2.5 py-1.5 rounded-lg border text-left
            bg-surface-container-high/90 backdrop-blur-sm
            ${isBreak ? 'border-break-accent/30' : 'border-tertiary/30'}
          `}
          style={{
            boxShadow: isBreak
              ? '0 4px 20px rgba(241,154,142,0.15)'
              : '0 4px 20px rgba(107,253,175,0.15)',
          }}
        >
          <p className={`text-[10px] font-black uppercase tracking-widest ${isBreak ? 'text-break-accent' : 'text-tertiary'}`}>
            {isBreak ? 'Break' : 'Focus'}
          </p>
          <p className="text-[11px] font-bold text-primary leading-tight mt-0.5">
            {isBreak ? 'Break' : 'Block'} {num}
          </p>
        </div>

        {/* When NOT flipped: arrow renders BELOW the card */}
        {!flipped && (
          <div
            className={`w-2 h-2 rotate-45 border-b border-r ml-3
              ${isBreak ? 'border-break-accent/30' : 'border-tertiary/30'}
              bg-surface-container-high/90
            `}
            style={{ marginTop: -4 }}
          />
        )}
      </div>

    </div>
  )
}

export default FlowMap
