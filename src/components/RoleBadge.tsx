export function RoleBadge({ role }: { role: string }) {
  if (role === 'admin') {
    return (
      <span
        title="Administrator"
        className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-300/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200 transition hover:bg-amber-300/20 cursor-help"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
          <path fillRule="evenodd" d="M10 1c3.866 0 7 1.79 7 4s-3.134 4-7 4-7-1.79-7-4 3.134-4 7-4Zm5.694 8.13c.464-.264.91-.583 1.306-.952V10c0 2.21-3.134 4-7 4s-7-1.79-7-4V8.178c.396.37.842.688 1.306.953C5.838 10.006 7.854 10.5 10 10.5s4.162-.494 5.694-1.37ZM3 13.179V15c0 2.21 3.134 4 7 4s7-1.79 7-4v-1.822c-.396.37-.842.688-1.306.953-1.532.875-3.548 1.369-5.694 1.369s-4.162-.494-5.694-1.37A7.009 7.009 0 0 1 3 13.179Z" clipRule="evenodd" />
        </svg>
        Admin
      </span>
    )
  }

  if (role === 'moderator') {
    return (
      <span
        title="Moderator"
        className="inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-300/20 cursor-help"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
          <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C4.906 2.333 4 2.42 4 2.42v6.623c0 3.75 3.518 7.228 5.765 8.825a.39.39 0 0 0 .47 0C12.482 16.27 16 12.793 16 9.043V2.42s-.906-.087-.93-.09A44.316 44.316 0 0 0 10 2Z" clipRule="evenodd" />
        </svg>
        Mod
      </span>
    )
  }

  return null
}
