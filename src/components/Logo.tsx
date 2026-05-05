export function Logo({ className = "h-8", showText = true }: { className?: string, showText?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-full w-auto text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4 L34 12 L34 28 L20 36 L6 28 L6 12 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M20 4 L20 20 M6 12 L20 20 M34 12 L20 20 M6 28 L20 20 M34 28 L20 20 M20 36 L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 4"/>
        <circle cx="20" cy="20" r="3.5" fill="currentColor" />
        <circle cx="20" cy="4" r="2" fill="currentColor" />
        <circle cx="34" cy="12" r="2" fill="currentColor" />
        <circle cx="34" cy="28" r="2" fill="currentColor" />
        <circle cx="20" cy="36" r="2" fill="currentColor" />
        <circle cx="6" cy="28" r="2" fill="currentColor" />
        <circle cx="6" cy="12" r="2" fill="currentColor" />
      </svg>
      {showText && <span className="text-2xl font-black tracking-tight text-emerald-400">EraLink</span>}
    </div>
  )
}
