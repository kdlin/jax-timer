// FlowMap.jsx — pannable overlay popup
import { useState, useRef, useCallback } from 'react'

// ── Canvas dimensions (inner pannable area) ───────────────────────────────────
const CANVAS_W = 600
const CANVAS_H = 700

// Node positions in pixels within the canvas
const NODES = [
  { x: 300, y: 80  },  // Block 1 — center top
  { x: 130, y: 200 },  // Break 1 — left middle
  { x: 300, y: 320 },  // Block 2 — center lower
]

// Bezier path segments connecting each pair of nodes
const SEGMENTS = [
  `M ${NODES[0].x},${NODES[0].y} C 500,120 100,160 ${NODES[1].x},${NODES[1].y}`,
  `M ${NODES[1].x},${NODES[1].y} C 100,260 500,290 ${NODES[2].x},${NODES[2].y}`,
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
  const [scale, setScale] = useState(1)
  const dragRef = useRef(null)

  function onWheel(e) {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.03 : 0.03
    setScale(s => Math.min(2, Math.max(0.4, s + delta)))
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
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center center',
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
              />
            )
          })}
        </div>
      </main>

    </div>
  )
}

// ── Node ──────────────────────────────────────────────────────────────────────
function Node({ block, x, y, num, isPast }) {
  const isActive  = block.status === 'active'
  const isBreak   = block.type === 'break'

  const size = isActive ? 32 : 24
  const half = size / 2

  const circleCls = isActive
    ? 'bg-primary shadow-[0_0_15px_rgba(255,255,255,0.4)]'
    : isPast
      ? 'bg-surface-container-high border border-tertiary/40'
      : 'bg-surface-container-low border border-outline-variant/20'

  const iconCls = isActive
    ? 'text-on-primary text-base'
    : isPast
      ? 'text-tertiary text-xs'
      : 'text-on-surface-variant/30 text-xs'

  const labelCls = isActive
    ? 'text-primary'
    : isPast
      ? 'text-tertiary/60'
      : 'text-on-surface-variant/20'

  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <div
        className={`absolute flex items-center justify-center rounded-full z-20 transition-all ${circleCls}`}
        style={{ width: size, height: size, marginLeft: -half, marginTop: -half }}
      >
        <span
          className={`material-symbols-outlined ${iconCls}`}
          style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
        >
          {isBreak ? 'coffee' : 'timer'}
        </span>
      </div>
      <p
        className={`absolute whitespace-nowrap text-[9px] font-bold uppercase ${labelCls}`}
        style={{ left: half + 8, transform: 'translateY(-50%)' }}
      >
        {isBreak ? 'Break' : 'Block'} {num}
      </p>
    </div>
  )
}

export default FlowMap
