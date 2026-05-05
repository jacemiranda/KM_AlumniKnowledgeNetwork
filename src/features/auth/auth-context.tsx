import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import { getSupabaseClient } from '../../lib/supabase'
import { AuthContext, type AppSession, type AuthContextValue, type AuthStatus } from './context'
import {
  fetchCurrentProfile,
  type AuthProfile,
  type CompleteProfileInput,
  type SupabaseProfileClient,
  updateCurrentProfile,
} from './profile-service'

type SupabaseAuthSession = {
  user: {
    id: string
    email?: string | null
  }
}

export type AuthSupabaseClient = SupabaseProfileClient & {
  auth: {
    getSession: () => Promise<{
      data: { session: SupabaseAuthSession | null }
      error: { message: string } | null
    }>
    onAuthStateChange: (
      callback: (event: string, session: SupabaseAuthSession | null) => void,
    ) => {
      data: {
        subscription: {
          unsubscribe: () => void
        }
      }
    }
    signInWithOAuth: (input: {
      provider: 'google'
      options: { redirectTo: string }
    }) => Promise<{ error: { message: string } | null }>
    signOut: () => Promise<{ error: { message: string } | null }>
  }
}

type AuthProviderProps = PropsWithChildren<{
  client?: AuthSupabaseClient
}>

function buildAppSession(
  supabaseSession: SupabaseAuthSession | null,
  profile: AuthProfile | null,
): AppSession | null {
  if (!supabaseSession) {
    return null
  }

  return {
    user: {
      id: supabaseSession.user.id,
      email: profile?.email ?? supabaseSession.user.email ?? '',
      name: profile?.name || supabaseSession.user.email || 'Alumni Network User',
      role: profile?.role ?? 'end_user',
      userType: profile?.userType ?? null,
      profileCompleted: profile?.isFirstTimeSetupComplete ?? false,
    },
  }
}

function getAuthErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Authentication failed.'
}

const IDLE_TIMEOUT_MS = 15 * 60 * 1000 // 15 minutes

export function AuthProvider({ children, client }: AuthProviderProps) {
  const [supabaseClient] = useState<AuthSupabaseClient>(() =>
    client ?? (getSupabaseClient() as unknown as AuthSupabaseClient),
  )
  const [supabaseSession, setSupabaseSession] = useState<SupabaseAuthSession | null>(null)
  const [profile, setProfile] = useState<AuthProfile | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [error, setError] = useState<string | null>(null)

  const loadProfile = useCallback(
    async (nextSession: SupabaseAuthSession | null) => {
      if (!nextSession) {
        setSupabaseSession(null)
        setProfile(null)
        setStatus('unauthenticated')
        return
      }

      setSupabaseSession(nextSession)
      const nextProfile = await fetchCurrentProfile(supabaseClient, nextSession.user.id)
      setProfile(nextProfile)
      setStatus('authenticated')
    },
    [supabaseClient],
  )

  useEffect(() => {
    let isMounted = true

    async function initializeSession() {
      try {
        setStatus('loading')
        const { data, error: sessionError } = await supabaseClient.auth.getSession()

        if (sessionError) {
          throw new Error(sessionError.message)
        }

        if (isMounted) {
          await loadProfile(data.session)
        }
      } catch (authError) {
        if (isMounted) {
          setError(getAuthErrorMessage(authError))
          setStatus('error')
        }
      }
    }

    void initializeSession()

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
      void loadProfile(nextSession).catch((authError) => {
        setError(getAuthErrorMessage(authError))
        setStatus('error')
      })
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [loadProfile, supabaseClient])

  const refreshProfile = useCallback(async () => {
    await loadProfile(supabaseSession)
  }, [loadProfile, supabaseSession])

  const signInWithGoogle = useCallback(async () => {
    setError(null)
    const { error: signInError } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (signInError) {
      setError(signInError.message)
      setStatus('error')
    }
  }, [supabaseClient])

  const completeProfile = useCallback(
    async (input: CompleteProfileInput) => {
      if (!supabaseSession) {
        throw new Error('You must be signed in to complete setup.')
      }

      setError(null)
      await updateCurrentProfile(supabaseClient, supabaseSession.user.id, input)
      await loadProfile(supabaseSession)
    },
    [loadProfile, supabaseClient, supabaseSession],
  )

  const signOut = useCallback(async () => {
    const { error: signOutError } = await supabaseClient.auth.signOut()

    if (signOutError) {
      setError(signOutError.message)
      setStatus('error')
      return
    }

    setSupabaseSession(null)
    setProfile(null)
    setStatus('unauthenticated')
  }, [supabaseClient])

  // Inactivity timeout
  useEffect(() => {
    if (status !== 'authenticated') return

    let timeoutId: number

    function resetTimer() {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log('User signed out due to inactivity')
        void signOut()
      }, IDLE_TIMEOUT_MS)
    }

    const events = ['mousemove', 'keydown', 'wheel', 'click', 'touchstart']
    
    for (const event of events) {
      window.addEventListener(event, resetTimer, { passive: true })
    }

    resetTimer()

    return () => {
      window.clearTimeout(timeoutId)
      for (const event of events) {
        window.removeEventListener(event, resetTimer)
      }
    }
  }, [status, signOut])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      error,
      session: buildAppSession(supabaseSession, profile),
      profile,
      refreshProfile,
      signInWithGoogle,
      completeProfile,
      signOut,
    }),
    [completeProfile, error, profile, refreshProfile, signInWithGoogle, signOut, status, supabaseSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
