export const MOCK_SESSION_STORAGE_KEY = 'akn.mock-session'

export type SessionUser = {
  id: string
  name: string
  email: string
  role: 'admin' | 'moderator' | 'end_user'
  userType: 'student' | 'alumni'
}

export type MockSession = {
  user: SessionUser
}

export function readStoredSession(): MockSession | null {
  const storedValue = window.localStorage.getItem(MOCK_SESSION_STORAGE_KEY)

  if (!storedValue) {
    return null
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Partial<MockSession>
    const user = parsedValue.user

    if (
      !user ||
      typeof user.id !== 'string' ||
      typeof user.name !== 'string' ||
      typeof user.email !== 'string' ||
      (user.role !== 'admin' &&
        user.role !== 'moderator' &&
        user.role !== 'end_user') ||
      (user.userType !== 'student' && user.userType !== 'alumni')
    ) {
      window.localStorage.removeItem(MOCK_SESSION_STORAGE_KEY)
      return null
    }

    return { user }
  } catch {
    window.localStorage.removeItem(MOCK_SESSION_STORAGE_KEY)
    return null
  }
}

export function writeStoredSession(session: MockSession) {
  window.localStorage.setItem(MOCK_SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function clearStoredSession() {
  window.localStorage.removeItem(MOCK_SESSION_STORAGE_KEY)
}
