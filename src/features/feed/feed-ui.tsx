import type { ReactNode } from 'react'

export function FeedSurface({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[32px] border border-white/10 bg-[#131b2e]/60 p-4 shadow-liquid backdrop-blur-2xl ${className}`}>
      {children}
    </div>
  )
}
