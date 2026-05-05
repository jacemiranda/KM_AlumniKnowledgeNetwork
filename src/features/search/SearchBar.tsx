import { useCallback, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type SearchBarProps = {
  /** Initial query (e.g. from URL param) */
  initialQuery?: string
  /** Called when the debounced query changes */
  onSearch?: (query: string) => void
  /** Placeholder text */
  placeholder?: string
  /** If true, navigates to /search?q=... on submit instead of calling onSearch */
  navigateOnSubmit?: boolean
  /** Compact variant for the header */
  compact?: boolean
}

export function SearchBar({
  initialQuery = '',
  onSearch,
  placeholder = 'Search people, posts, fields, skills...',
  navigateOnSubmit = false,
  compact = false,
}: SearchBarProps) {
  const [value, setValue] = useState(initialQuery)
  const navigate = useNavigate()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setValue(initialQuery)
  }, [initialQuery])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value
      setValue(next)

      if (!navigateOnSubmit && onSearch) {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => onSearch(next), 300)
      }
    },
    [navigateOnSubmit, onSearch],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = value.trim()
      if (trimmed.length < 1) return

      if (navigateOnSubmit) {
        navigate(`/search?q=${encodeURIComponent(trimmed)}`)
      } else {
        onSearch?.(trimmed)
      }
    },
    [navigate, navigateOnSubmit, onSearch, value],
  )

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        {/* Search icon */}
        <svg
          className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 ${compact ? 'h-4 w-4' : 'h-5 w-5'}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>

        <input
          id="search-bar-input"
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full border border-white/10 bg-white/5 pl-10 pr-4 text-slate-100 placeholder-slate-500 backdrop-blur-2xl transition focus:border-emerald-300/40 focus:outline-none focus:ring-1 focus:ring-emerald-300/30 ${
            compact
              ? 'rounded-xl py-2 text-sm'
              : 'rounded-2xl py-3 text-base shadow-liquid'
          }`}
        />

        {value.trim() && (
          <button
            type="button"
            onClick={() => {
              setValue('')
              onSearch?.('')
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-500 transition hover:text-slate-300"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  )
}
