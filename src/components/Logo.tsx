import eralinkLogo from './eralink.ico';

export function Logo({ className = "h-8", showText = true }: { className?: string, showText?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img src={eralinkLogo} alt="EraLink Logo" className="h-full w-auto drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
      {showText && <span className="text-3xl font-black tracking-tight text-emerald-400">EraLink</span>}
    </div>
  )
}
