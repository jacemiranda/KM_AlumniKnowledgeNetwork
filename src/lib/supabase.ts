import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type SupabaseEnv = {
  VITE_SUPABASE_URL?: string
  VITE_SUPABASE_ANON_KEY?: string
}

type SupabaseConfig = {
  url: string
  anonKey: string
}

let browserClient: SupabaseClient | null = null

export function getSupabaseConfig(
  env: SupabaseEnv = import.meta.env as unknown as SupabaseEnv,
): SupabaseConfig {
  const url = env.VITE_SUPABASE_URL?.trim()
  const anonKey = env.VITE_SUPABASE_ANON_KEY?.trim()

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are required for OAuth sign-in.')
  }

  return { url, anonKey }
}

export function getSupabaseClient() {
  if (!browserClient) {
    const config = getSupabaseConfig()
    browserClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }

  return browserClient
}
