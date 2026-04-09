// FlowMap.jsx — pannable overlay popup
import { useState, useRef, useEffect } from 'react'

// ── Canvas dimensions (inner pannable area) ───────────────────────────────────
const CANVAS_W = 600
const CANVAS_H = 700

// Node positions in pixels within the canvas
const NODES = [
  { x: 300, y: 80  },  // Block 1 — center
  { x: 190, y: 200 },  // Break 1 — left
  { x: 300, y: 320 },  // Block 2 — center
]

// Bezier path segments
const SEGMENTS = [
  `M ${NODES[0].x},${NODES[0].y} C 380,120 200,160 ${NODES[1].x},${NODES[1].y}`,
  `M ${NODES[1].x},${NODES[1].y} C 160,260 360,290 ${NODES[2].x},${NODES[2].y}`,
]

const INITIAL_BLOCKS = [
  { id: 1, type: 'focus', status: 'active',   name: 'Block 1', tasks: [] },
  { id: 2, type: 'break', status: 'upcoming', name: 'Break 1', tasks: [] },
  { id: 3, type: 'focus', status: 'upcoming', name: 'Block 2', tasks: [] },
]

// Visible area height: total 380 minus header 48px
const VISIBLE_H = 332
const VISIBLE_W = 320

// Initial pan: center the canvas horizontally, start from top
const INITIAL_PAN = { x: -(CANVAS_W - VISIBLE_W) / 2, y: 0 }

// ── FlowMap ───────────────────────────────────────────────────────────────────
function FlowMap({ onClose }) {
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS)
  const [editingId, setEditingId] = useState(null)
  const [pan, setPan] = useState(INITIAL_PAN)
  const dragRef = useRef(null)

  const activeIndex = blocks.findIndex(b => b.status === 'active')

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

  function handleSave(id, updates) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
    setEditingId(null)
  }

  const editingBlock = editingId !== null ? blocks.find(b => b.id === editingId) : null

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
          {blocks.map((block, i) => {
            const num = blocks.slice(0, i + 1).filter(b => b.type === block.type).length
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
                onEdit={() => setEditingId(block.id)}
              />
            )
          })}
        </div>

      </main>

      {/* ── Edit panel — covers entire FlowMap including header ── */}
      {editingBlock && (
        <NodeEditPanel
          block={editingBlock}
          onSave={handleSave}
          onClose={() => setEditingId(null)}
        />
      )}

    </div>
  )
}

// ── Node ──────────────────────────────────────────────────────────────────────
function Node({ block, x, y, num, isPast, flipped, onEdit }) {
  const [hovered, setHovered] = useState(false)
  const leaveTimer = useRef(null)

  function handleEnter() {
    clearTimeout(leaveTimer.current)
    setHovered(true)
  }

  function handleLeave() {
    leaveTimer.current = setTimeout(() => setHovered(false), 120)
  }
  const isActive = block.status === 'active'
  const isBreak  = block.type === 'break'

  const size = isActive ? 32 : 24
  const half = size / 2

  const accentText   = isBreak ? 'text-break-accent' : 'text-tertiary'
  const accentBorder = isBreak ? 'border-break-accent/40' : 'border-tertiary/40'
  const accentGlow   = isBreak ? '0 0 14px rgba(241,154,142,0.5)' : '0 0 14px rgba(107,253,175,0.5)'

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

  const visibleTasks = block.tasks.slice(0, 4)

  return (
    <div
      className="absolute"
      style={{ left: x, top: y }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      // Stop propagation so clicking a node doesn't start canvas panning
      onPointerDown={e => e.stopPropagation()}
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
        className={`absolute flex items-center justify-center rounded-full z-20 transition-all duration-200 cursor-pointer ${circleCls}`}
        style={{
          width: size,
          height: size,
          marginLeft: -half,
          marginTop: -half,
          boxShadow: isActive
            ? '0 0 15px rgba(255,255,255,0.4)'
            : hovered ? accentGlow : 'none',
        }}
        onClick={onEdit}
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
        {block.name}
      </p>

      {/* Hover card */}
      <div
        className={`absolute z-30 transition-all duration-200 ${flipped ? 'origin-top' : 'origin-bottom'}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          left: half + 6,
          ...(flipped ? { top: half + 6 } : { bottom: half + 6 }),
          transform: hovered
            ? 'scale(1) translateY(0)'
            : flipped ? 'scale(0.7) translateY(-6px)' : 'scale(0.7) translateY(6px)',
          opacity: hovered ? 1 : 0,
        }}
      >
        {flipped && (
          <div
            className={`w-2 h-2 rotate-45 border-t border-l ml-3
              ${isBreak ? 'border-break-accent/30' : 'border-tertiary/30'}
              bg-surface-container-high/90`}
            style={{ marginBottom: -4 }}
          />
        )}

        <div
          className={`
            px-2.5 py-1.5 rounded-lg border text-left min-w-[90px]
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
            {block.name}
          </p>

          {/* Task preview */}
          {visibleTasks.length > 0 && (
            <ul className="mt-1.5 space-y-0.5">
              {visibleTasks.map(t => (
                <li
                  key={t.id}
                  className={`text-[9px] flex items-center gap-1 ${t.done ? 'line-through opacity-30' : 'text-on-surface-variant/60'}`}
                >
                  <span>{t.done ? '✓' : '○'}</span>
                  <span>{t.text}</span>
                </li>
              ))}
              {block.tasks.length > 4 && (
                <li
                  className="text-[9px] text-on-surface-variant/40 hover:text-on-surface-variant/80 cursor-pointer transition-colors"
                  onClick={onEdit}
                >
                  +{block.tasks.length - 4} more
                </li>
              )}
            </ul>
          )}
        </div>

        {!flipped && (
          <div
            className={`w-2 h-2 rotate-45 border-b border-r ml-3
              ${isBreak ? 'border-break-accent/30' : 'border-tertiary/30'}
              bg-surface-container-high/90`}
            style={{ marginTop: -4 }}
          />
        )}
      </div>

    </div>
  )
}

// ── NodeEditPanel ─────────────────────────────────────────────────────────────
function NodeEditPanel({ block, onSave, onClose }) {
  const isBreak = block.type === 'break'
  const accent  = isBreak ? 'text-break-accent' : 'text-tertiary'
  const accentBorder = isBreak ? 'border-break-accent/30' : 'border-tertiary/30'
  const accentBg     = isBreak ? 'bg-break-accent/10' : 'bg-tertiary/10'

  const [name, setName]       = useState(block.name)
  const [tasks, setTasks]     = useState(block.tasks)
  const [leaving, setLeaving] = useState(new Set())
  const dragIdx   = useRef(null)
  const lastAdded = useRef(null)
  const inputRefs = useRef({})

  // Focus the newly added task input after render
  useEffect(() => {
    if (lastAdded.current && inputRefs.current[lastAdded.current]) {
      inputRefs.current[lastAdded.current].focus()
      lastAdded.current = null
    }
  }, [tasks])

  function addTask() {
    const id = Date.now()
    lastAdded.current = id
    setTasks(prev => [...prev, { id, text: '', done: false }])
  }

  function updateTask(id, field, value) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  function toggleDone(id) {
    const task = tasks.find(t => t.id === id)
    if (!task.done) {
      // Checking off: mark done, animate, then reorder
      setTasks(prev => prev.map(t => t.id === id ? { ...t, done: true } : t))
      setLeaving(prev => new Set([...prev, id]))
      setTimeout(() => {
        setLeaving(prev => { const s = new Set(prev); s.delete(id); return s })
        setTasks(prev => [...prev.filter(t => !t.done), ...prev.filter(t => t.done)])
      }, 340)
    } else {
      // Unchecking: instant float back to top
      setTasks(prev => {
        const updated = prev.map(t => t.id === id ? { ...t, done: false } : t)
        return [...updated.filter(t => !t.done), ...updated.filter(t => t.done)]
      })
    }
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  // ── Drag-to-reorder ──────────────────────────────────────────────────────
  function onDragStart(i) {
    dragIdx.current = i
  }

  function onDragOver(e, i) {
    e.preventDefault()
    if (dragIdx.current === null || dragIdx.current === i) return
    setTasks(prev => {
      const next = [...prev]
      const [moved] = next.splice(dragIdx.current, 1)
      next.splice(i, 0, moved)
      dragIdx.current = i
      return next
    })
  }

  function onDragEnd() {
    dragIdx.current = null
  }

  return (
    // Backdrop — dims everything behind, blocks pointer events to map/header
    <div
      className="absolute inset-0 z-40 bg-black/60 backdrop-blur-[2px] flex items-center justify-center"
      onPointerDown={e => e.stopPropagation()}
    >
      {/* Card */}
      <div className={`
        relative w-[260px] max-h-[300px] flex flex-col rounded-2xl overflow-hidden
        bg-surface-container border border-white/[0.03]
        shadow-[0_24px_48px_rgba(0,0,0,0.6)]
      `}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 h-11 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-[16px] ${accent}`}
            style={{ fontVariationSettings: "'FILL' 1" }}>
            {isBreak ? 'coffee' : 'timer'}
          </span>
          <span className={`text-[11px] font-black uppercase tracking-widest ${accent}`}>
            Edit {isBreak ? 'Break' : 'Block'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-on-surface-variant hover:text-white transition-colors p-1 rounded-md hover:bg-surface-container-high active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 space-y-4">

        {/* Name field */}
        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/50 block mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className={`
              w-full bg-surface-container-high border rounded-lg px-3 py-1.5
              text-[12px] font-bold text-white placeholder-on-surface-variant/30
              outline-none focus:border-opacity-80 transition-colors
              ${accentBorder}
            `}
            placeholder={block.name}
          />
        </div>

        {/* Tasks */}
        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/50 block mb-2">
            Tasks
          </label>

          <ul className="space-y-1.5">
            {tasks.map((task, i) => (
              <li
                key={task.id}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={e => onDragOver(e, i)}
                onDragEnd={onDragEnd}
                className={`flex items-center gap-2 group ${leaving.has(task.id) ? 'task-pop-away' : ''}`}
              >
                {/* Drag handle */}
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant/20 cursor-grab group-hover:text-on-surface-variant/50 transition-colors shrink-0">
                  drag_indicator
                </span>

                {/* Checkbox */}
                <button
                  onClick={() => toggleDone(task.id)}
                  className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors
                    ${task.done
                      ? `${accentBg} ${accentBorder} border`
                      : 'border-outline-variant/30 hover:border-outline-variant/60'
                    }`}
                >
                  {task.done && (
                    <span className={`material-symbols-outlined text-[10px] ${accent}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}>
                      check
                    </span>
                  )}
                </button>

                {/* Text input */}
                <input
                  type="text"
                  ref={el => inputRefs.current[task.id] = el}
                  value={task.text}
                  onChange={e => updateTask(task.id, 'text', e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTask() } }}
                  placeholder="Task name..."
                  className={`
                    flex-1 bg-transparent border-b border-outline-variant/20
                    text-[11px] text-white placeholder-on-surface-variant/25
                    outline-none focus:border-outline-variant/50 transition-colors py-0.5
                    ${task.done ? 'line-through opacity-40' : ''}
                  `}
                />

                {/* Delete */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="shrink-0 text-on-surface-variant/20 hover:text-red-400/70 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Add task */}
          <button
            onClick={addTask}
            className="mt-2 flex items-center gap-1.5 text-on-surface-variant/40 hover:text-on-surface-variant/80 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            <span className="text-[10px] uppercase tracking-wider">Add task</span>
          </button>
        </div>
      </div>

      {/* Footer — Save */}
      <div className="px-4 py-3 border-t border-white/5 shrink-0">
        <button
          onClick={() => onSave(block.id, { name: name.trim() || block.name, tasks })}
          className={`
            w-full py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest
            transition-all active:scale-95
            ${isBreak
              ? 'bg-break-accent/15 text-break-accent border border-break-accent/30 hover:bg-break-accent/25'
              : 'bg-tertiary/15 text-tertiary border border-tertiary/30 hover:bg-tertiary/25'
            }
          `}
        >
          Save
        </button>
      </div>

      </div>{/* end card */}
    </div>
  )
}

export default FlowMap
