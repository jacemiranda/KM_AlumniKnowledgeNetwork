import { PropsWithChildren, useMemo, useState } from 'react'
import {
  clearStoredSession,
  MockSession,
  readStoredSession,
  SessionUser,
  writeStoredSession,
} from './storage'
import { AuthContext, AuthContextValue } from './context'

const defaultMockUser: SessionUser = {
  id: 'dev-alumni',
  name: 'Jordan Reyes',
  email: 'jordan@example.com',
  role: 'end_user',
  userType: 'alumni',
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<MockSession | null>(() => readStoredSession())

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      signInWithMockGoogle: () => {
        const nextSession = { user: defaultMockUser }
        writeStoredSession(nextSession)
        setSession(nextSession)
      },
      signOut: () => {
        clearStoredSession()
        setSession(null)
      },
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
