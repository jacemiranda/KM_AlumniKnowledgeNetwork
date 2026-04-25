import { createContext } from 'react'
import { MockSession } from './storage'

export type AuthContextValue = {
  session: MockSession | null
  signInWithMockGoogle: () => void
  completeMockProfile: (next: { name: string; userType: 'student' | 'alumni' }) => void
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
