import { createContext } from 'react'
import type { AuthProfile, CompleteProfileInput, UserType } from './profile-service'

export type SessionUser = {
  id: string
  name: string
  email: string
  role: 'admin' | 'moderator' | 'end_user'
  userType: UserType | null
  profileCompleted: boolean
}

export type AppSession = {
  user: SessionUser
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error'

export type AuthContextValue = {
  status: AuthStatus
  error: string | null
  session: AppSession | null
  profile: AuthProfile | null
  refreshProfile: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  completeProfile: (input: CompleteProfileInput) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
