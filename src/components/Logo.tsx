export function Logo({ className = "h-8", showText = true }: { className?: string, showText?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/eralink.ico"
        alt="EraLink"
        className="h-full w-auto drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
      />
      {showText && <span className="text-2xl font-black tracking-tight text-emerald-400">EraLink</span>}
    </div>
  )
}
