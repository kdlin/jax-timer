// App.jsx — Step 2: Tailwind color verification
function App() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-surface gap-3 p-6">

      {/* Typography check */}
      <p className="text-xs font-bold tracking-[0.05em] uppercase text-on-surface-variant">
        Design Token Check
      </p>

      {/* Surface layers */}
      <div className="flex gap-2">
        <Swatch bg="bg-surface"                   label="surface" />
        <Swatch bg="bg-surface-container-low"     label="low" />
        <Swatch bg="bg-surface-container"         label="container" />
        <Swatch bg="bg-surface-container-high"    label="high" />
        <Swatch bg="bg-surface-container-highest" label="highest" />
      </div>

      {/* Accent colors */}
      <div className="flex gap-2">
        <Swatch bg="bg-primary"      label="primary" dark />
        <Swatch bg="bg-tertiary"     label="tertiary" dark />
        <Swatch bg="bg-break-accent" label="break" dark />
        <Swatch bg="bg-error"        label="error" dark />
        <Swatch bg="bg-secondary"    label="secondary" dark />
      </div>

      {/* Font check */}
      <p className="text-4xl font-extrabold tracking-tighter text-primary leading-none mt-2">
        25:00
      </p>

      {/* Badge check */}
      <div className="flex gap-2">
        <span className="bg-surface-container-highest border border-outline-variant/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest text-tertiary uppercase">
          Focus
        </span>
        <span className="bg-surface-container-highest border border-outline-variant/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase text-break-accent">
          Break
        </span>
      </div>

      {/* Material icon check */}
      <span className="material-symbols-outlined text-on-surface-variant">timer</span>

    </div>
  )
}

function Swatch({ bg, label, dark = false }) {
  return (
    <div className={`${bg} w-12 h-12 rounded-lg flex items-end justify-center pb-1`}>
      <span className={`text-[8px] font-bold tracking-wide ${dark ? 'text-on-primary' : 'text-on-surface-variant'}`}>
        {label}
      </span>
    </div>
  )
}

export default App
