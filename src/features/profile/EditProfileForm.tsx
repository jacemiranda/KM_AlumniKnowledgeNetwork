import { useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { editProfileSchema, type EditProfileFormValues } from './profile-schemas'
import { uploadProfilePicture } from './profile-storage'
import { useUpdateProfile, useFieldsList, useSkillsList } from './use-profile'
import { useAuth } from '../auth/use-auth'

type EditProfileFormProps = {
  initialValues?: {
    name: string
    bio: string | null
    fieldId: string
    profilePictureUrl: string | null
    skills: string[]
  }
  onSuccess?: () => void
  isEditing?: boolean
}

export function EditProfileForm({
  initialValues,
  onSuccess,
  isEditing = true,
}: EditProfileFormProps) {
  const { session } = useAuth()
  const updateProfile = useUpdateProfile()
  const { data: fields } = useFieldsList()
  const { data: skillsData } = useSkillsList()
  const availableSkills = skillsData

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues?.profilePictureUrl || null
  )
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const imageInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<EditProfileFormValues>({
    defaultValues: {
      name: initialValues?.name || '',
      bio: initialValues?.bio || '',
      fieldId: initialValues?.fieldId || '',
      profilePictureFile: null,
      skills: initialValues?.skills || [],
    },
  })

  const selectedSkills = useWatch({ control, name: 'skills' })

  // Handle image selection and preview
  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate and show preview
    if (file.size > 1048576) {
      alert('Image must be under 1MB')
      return
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Only JPG and PNG files allowed')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Set file in form
    setValue('profilePictureFile', file)
  }

  // Toggle skill selection
  const [skillInput, setSkillInput] = useState('')
  const [customSkillNames, setCustomSkillNames] = useState<string[]>([])

  function addSkill(skillName: string) {
    const trimmed = skillName.trim()
    if (!trimmed) return

    const current = selectedSkills || []
    const totalCount = current.length + customSkillNames.length
    if (totalCount >= 20) {
      setSkillInput('')
      return
    }

    const skill = availableSkills?.find((s) => s.name.toLowerCase() === trimmed.toLowerCase())
    if (skill) {
      if (!current.includes(skill.id)) {
        setValue('skills', [...current, skill.id])
      }
    } else {
      // Custom skill — allow free-text entry
      if (!customSkillNames.includes(trimmed)) {
        setCustomSkillNames((prev) => [...prev, trimmed])
      }
    }
    setSkillInput('')
  }

  function handleSkillKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const terms = skillInput.split(',').map((t) => t.trim()).filter(Boolean)
      terms.forEach(term => addSkill(term))
      if (terms.length === 0) {
        addSkill(skillInput)
      }
    }
  }

  function removeSkill(skillId: string) {
    const current = selectedSkills || []
    setValue('skills', current.filter((id) => id !== skillId))
  }

  function removeCustomSkill(name: string) {
    setCustomSkillNames((prev) => prev.filter((n) => n !== name))
  }

  async function onSubmit(data: EditProfileFormValues) {
    try {
      setValidationErrors({})

      if (!session?.user?.id) {
        throw new Error('User not authenticated')
      }

      // Validate form data
      const validation = editProfileSchema.safeParse(data)
      if (!validation.success) {
        const errors: Record<string, string> = {}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validation.error.issues.forEach((issue: any) => {
          const path = issue.path[0] as string
          errors[path] = issue.message
        })
        setValidationErrors(errors)
        return
      }

      setIsUploadingImage(true)

      // Upload image if a new file was selected
      let profilePictureUrl: string | null = initialValues?.profilePictureUrl || null

      if (data.profilePictureFile) {
        profilePictureUrl = await uploadProfilePicture(session.user.id, data.profilePictureFile)
      }

      setIsUploadingImage(false)

      // Update profile
      await updateProfile.mutateAsync({
        name: data.name,
        bio: data.bio || null,
        fieldId: data.fieldId,
        profilePictureUrl,
        skillIds: data.skills || [],
        customSkillNames,
      })

      onSuccess?.()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsUploadingImage(false)
      console.error('Profile update error:', error)
      setValidationErrors({ general: error.message || 'Failed to update profile' })
    }
  }

  if (!session) return null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Profile Picture */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">Profile Picture</label>
        <div className="flex items-end gap-4">
          {/* Image Preview */}
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-300/10 ring-1 ring-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-3xl text-slate-400">📷</div>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex-1">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={isUploadingImage || isSubmitting}
              className="w-full rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-emerald-300/40 hover:bg-emerald-300/10 transition disabled:opacity-50"
            >
              {isUploadingImage ? 'Uploading...' : 'Choose Image (1MB max)'}
            </button>
            {validationErrors.profilePictureFile && (
              <p className="mt-1 text-xs text-red-400">{validationErrors.profilePictureFile}</p>
            )}
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
          Name
        </label>
        <input
          {...register('name')}
          id="name"
          type="text"
          placeholder="Your full name"
          className="w-full rounded-2xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300/30 focus:outline-none"
        />
        {validationErrors.name && (
          <p className="mt-1 text-xs text-red-400">{validationErrors.name}</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-semibold text-white mb-2">
          Bio (Optional)
        </label>
        <textarea
          {...register('bio')}
          id="bio"
          rows={3}
          placeholder="Tell us about yourself..."
          className="w-full resize-none rounded-2xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300/30 focus:outline-none"
        />
        {validationErrors.bio && (
          <p className="mt-1 text-xs text-red-400">{validationErrors.bio}</p>
        )}
      </div>

      {/* Field */}
      <div>
        <label htmlFor="fieldId" className="block text-sm font-semibold text-white mb-2">
          Field
        </label>
        <select
          {...register('fieldId')}
          id="fieldId"
          className="custom-select w-full rounded-2xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-white focus:border-emerald-300/30 focus:outline-none"
        >
          <option value="">Select a field...</option>
          {(fields || []).map((field) => (
            <option key={field.id} value={field.id}>
              {field.name}
            </option>
          ))}
        </select>
        {validationErrors.fieldId && (
          <p className="mt-1 text-xs text-red-400">{validationErrors.fieldId}</p>
        )}
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Skills (Optional - up to 20)
        </label>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-ink-900/60 px-4 py-2">
          {(selectedSkills || []).map((skillId) => {
            const skill = availableSkills?.find((s) => s.id === skillId)
            if (!skill) return null
            return (
              <span
                key={skillId}
                className="flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200"
              >
                {skill.name}
                <button
                  type="button"
                  onClick={() => removeSkill(skillId)}
                  className="ml-1 text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </span>
            )
          })}
          {customSkillNames.map((name) => (
            <span
              key={`custom-${name}`}
              className="flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200"
            >
              {name}
              <button
                type="button"
                onClick={() => removeCustomSkill(name)}
                className="ml-1 text-slate-400 hover:text-white"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder={(selectedSkills || []).length + customSkillNames.length === 0 ? 'Type a skill and press Enter or comma...' : ''}
            className="min-w-[150px] flex-1 bg-transparent py-1 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            list="skill-suggestions"
            disabled={isSubmitting || isUploadingImage || (selectedSkills || []).length + customSkillNames.length >= 20}
          />
          <datalist id="skill-suggestions">
            {(availableSkills || [])
              .filter((s) => !(selectedSkills || []).includes(s.id))
              .map((s) => (
                <option key={s.id} value={s.name} />
              ))}
          </datalist>
        </div>
        
        {/* Suggested Skills */}
        {(availableSkills || []).filter((s) => !(selectedSkills || []).includes(s.id)).length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 max-h-32 overflow-y-auto">
            <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Suggested:
            </span>
            {(availableSkills || [])
              .filter((s) => !(selectedSkills || []).includes(s.id))
              .filter((s) => !skillInput || s.name.toLowerCase().includes(skillInput.toLowerCase()))
              .slice(0, 15)
              .map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => addSkill(s.name)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-slate-300 transition hover:border-emerald-300/30 hover:bg-emerald-300/10 hover:text-emerald-200 cursor-pointer"
                >
                  + {s.name}
                </button>
              ))}
          </div>
        )}

        {validationErrors.skills && (
          <p className="mt-1 text-xs text-red-400">{validationErrors.skills}</p>
        )}
      </div>

      {/* Error Messages */}
      {(validationErrors.general || updateProfile.error) && (
        <div className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3">
          <p className="text-xs text-red-400">
            {validationErrors.general ||
              (updateProfile.error instanceof Error
                ? updateProfile.error.message
                : 'Failed to update profile')}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 border-t border-white/10 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || isUploadingImage || updateProfile.isPending}
          className="flex-1 rounded-full border border-emerald-300/40 bg-emerald-300/15 px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-100 transition hover:bg-emerald-300/25 disabled:opacity-50"
        >
          {isSubmitting || isUploadingImage || updateProfile.isPending
            ? 'Saving...'
            : isEditing
            ? 'Save Changes'
            : 'Complete Setup'}
        </button>
      </div>
    </form>
  )
}
