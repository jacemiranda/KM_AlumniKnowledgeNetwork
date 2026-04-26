import { describe, expect, it } from 'vitest'
import { getSupabaseConfig } from './supabase'

describe('Supabase configuration', () => {
  it('returns the configured project URL and anon key', () => {
    expect(
      getSupabaseConfig({
        VITE_SUPABASE_URL: 'https://example.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'public-anon-key',
      }),
    ).toEqual({
      url: 'https://example.supabase.co',
      anonKey: 'public-anon-key',
    })
  })

  it('reports missing configuration without falling back to mock auth', () => {
    expect(() =>
      getSupabaseConfig({
        VITE_SUPABASE_URL: '',
        VITE_SUPABASE_ANON_KEY: '',
      }),
    ).toThrow(/Supabase environment variables are required/)
  })
})
