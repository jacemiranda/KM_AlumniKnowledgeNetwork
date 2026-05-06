import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/use-auth'
import { fetchFields, fetchSkills, type FieldRow, type SkillRow } from '../auth/profile-service'
import { getSupabaseClient } from '../../lib/supabase'
import { EditProfileForm } from '../profile/EditProfileForm'

type UserType = 'student' | 'alumni'

export function SetupPage() {
  const { session, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [userType, setUserType] = useState<UserType>(profile?.userType ?? 'student')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fields, setFields] = useState<FieldRow[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [skills, setSkills] = useState<SkillRow[]>([])
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadSetupOptions() {
      try {
        const client = getSupabaseClient()
        const [nextFields, nextSkills] = await Promise.all([
          fetchFields(client),
          fetchSkills(client),
        ])

        if (isMounted) {
          setFields(nextFields)
          setSkills(nextSkills)
        }
      } catch {
        if (isMounted) {
          setLoadError(true)
        }
      }
    }

    void loadSetupOptions()

    return () => {
      isMounted = false
    }
  }, [])

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (session.user.profileCompleted) {
    return <Navigate to="/" replace />
  }

  async function handleExit() {
    await signOut()
    navigate('/login', { replace: true })
  }

  async function handleProfileFormSuccess() {
    try {
      if (!session?.user?.id) {
        throw new Error('User not authenticated')
      }

      const client = getSupabaseClient()
      await client
        .from('profiles')
        .update({ user_type: userType, is_first_time_setup_complete: true })
        .eq('id', session.user.id)

      navigate('/', { replace: true })
    } catch (error) {
      console.error('Failed to complete setup:', error)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      <section className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-liquid backdrop-blur-2xl sm:p-8 lg:p-10">
        <button
          type="button"
          onClick={() => { void handleExit() }}
          aria-label="Exit setup and sign out"
          className="absolute right-4 top-4 text-slate-400 transition-colors hover:text-white"
        >
          <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Complete Your Profile</h1>
        <p className="mt-2 text-sm text-slate-300 sm:text-base">
          Finalize your profile so the feed can match your field, skills, and SECI-aligned contributions.
        </p>

        <div className="mt-8 space-y-7">
          {/* User Type Selection - Setup Only */}
          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
              I am a...
            </legend>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setUserType('student')}
                className={`rounded-2xl border px-5 py-4 text-left transition ${
                  userType === 'student'
                    ? 'border-emerald-300/70 bg-emerald-300/15 text-white'
                    : 'border-white/10 bg-ink-900/45 text-slate-300 hover:border-white/20'
                }`}
              >
                <p className="text-lg font-bold">Student</p>
                <p className="text-sm">Currently enrolled</p>
              </button>
              <button
                type="button"
                onClick={() => setUserType('alumni')}
                className={`rounded-2xl border px-5 py-4 text-left transition ${
                  userType === 'alumni'
                    ? 'border-emerald-300/70 bg-emerald-300/15 text-white'
                    : 'border-white/10 bg-ink-900/45 text-slate-300 hover:border-white/20'
                }`}
              >
                <p className="text-lg font-bold">Alumni</p>
                <p className="text-sm">Graduated contributor</p>
              </button>
            </div>
          </fieldset>

          {/* Profile Form */}
          {loadError && (
            <div className="rounded-2xl border border-rose-300/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              Failed to load profile setup options. Please refresh and try again.
            </div>
          )}

          {!loadError && (
            <EditProfileForm
              initialValues={{
                name: profile?.name || session?.user.name || '',
                bio: profile?.bio || '',
                fieldId: profile?.fieldId || '',
                profilePictureUrl: profile?.profilePictureUrl || '',
                skills: [],
              }}
              onSuccess={handleProfileFormSuccess}
              isEditing={false}
            />
          )}
        </div>
      </section>
    </main>
  )
}
