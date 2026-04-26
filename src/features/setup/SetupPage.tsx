import { FormEvent, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/use-auth'
import { fetchFields, fetchSkills, type FieldRow, type SkillRow } from '../auth/profile-service'
import { getSupabaseClient } from '../../lib/supabase'

type SetupState = 'idle' | 'submitting' | 'error'

type UserType = 'student' | 'alumni'

export function SetupPage() {
  const { session, profile, completeProfile } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(profile?.name || session?.user.name || '')
  const [userType, setUserType] = useState<UserType>(profile?.userType ?? 'student')
  const [fieldId, setFieldId] = useState(profile?.fieldId ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [profilePictureUrl, setProfilePictureUrl] = useState(profile?.profilePictureUrl ?? '')
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([])
  const [fields, setFields] = useState<FieldRow[]>([])
  const [skills, setSkills] = useState<SkillRow[]>([])
  const [state, setState] = useState<SetupState>('idle')

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
          setState('error')
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim() || !fieldId.trim()) {
      setState('error')
      return
    }

    setState('submitting')

    try {
      await completeProfile({
        name: name.trim(),
        bio: bio.trim(),
        userType,
        fieldId,
        profilePictureUrl,
        skillIds: selectedSkillIds,
      })
      navigate('/')
    } catch {
      setState('error')
    }
  }

  const toggleSkill = (skillId: string) => {
    setSelectedSkillIds((current) =>
      current.includes(skillId)
        ? current.filter((selectedSkillId) => selectedSkillId !== skillId)
        : [...current, skillId],
    )
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      <section className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-liquid backdrop-blur-2xl sm:p-8 lg:p-10">
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Complete Your Profile</h1>
        <p className="mt-2 text-sm text-slate-300 sm:text-base">
          Finalize your profile so the feed can match your field, skills, and SECI-aligned contributions.
        </p>

        <form className="mt-8 space-y-7" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-[128px_1fr] md:items-start">
            <button
              type="button"
              className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-white/15 bg-ink-900/50 text-emerald-200 transition hover:border-emerald-300/60"
              aria-label="Upload profile picture"
            >
              <span className="text-4xl">+</span>
            </button>

            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-300" htmlFor="full-name">
                Full Name
              </label>
              <input
                id="full-name"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-ink-900/60 px-5 py-3 text-base text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                required
              />
              <label className="mt-4 block text-xs font-bold uppercase tracking-[0.18em] text-slate-300" htmlFor="profile-picture-url">
                Profile Picture URL
              </label>
              <input
                id="profile-picture-url"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-ink-900/60 px-5 py-3 text-base text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                value={profilePictureUrl}
                onChange={(event) => setProfilePictureUrl(event.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">I am a...</legend>
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

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-300" htmlFor="field">
                Academic Field
              </label>
              <select
                id="field"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-ink-900/60 px-5 py-3 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                value={fieldId}
                onChange={(event) => setFieldId(event.target.value)}
                required
              >
                <option value="">Select your field of study...</option>
                {fields.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-300" htmlFor="bio">
                Short Bio
              </label>
              <textarea
                id="bio"
                className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-ink-900/60 px-5 py-3 text-base text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Tell the network about your interests and goals"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Core Skills and Interests</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <label
                  key={skill.id}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition ${
                    selectedSkillIds.includes(skill.id)
                      ? 'border-emerald-300/50 bg-emerald-300/15 text-emerald-100'
                      : 'border-white/15 bg-white/5 text-slate-300'
                  }`}
                >
                  <input
                    className="sr-only"
                    type="checkbox"
                    checked={selectedSkillIds.includes(skill.id)}
                    onChange={() => toggleSkill(skill.id)}
                  />
                  {skill.name}
                </label>
              ))}
            </div>
          </div>

          {state === 'error' ? (
            <div className="rounded-2xl border border-rose-300/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              Please provide your full name and academic field before continuing.
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500 px-8 py-3 text-sm font-extrabold uppercase tracking-[0.18em] text-ink-950 shadow-[0_10px_26px_rgba(70,222,163,0.36)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(70,222,163,0.48)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 md:w-auto"
              disabled={state === 'submitting'}
            >
              {state === 'submitting' ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
