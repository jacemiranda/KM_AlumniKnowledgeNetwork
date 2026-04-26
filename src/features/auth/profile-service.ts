export type AppRole = 'admin' | 'moderator' | 'end_user'
export type UserType = 'student' | 'alumni'
export type ProfileStatus = 'active' | 'blocked'

export type ProfileRow = {
  id: string
  email: string
  role: AppRole
  user_type: UserType | null
  status: ProfileStatus
  is_first_time_setup_complete: boolean
  name: string
  bio: string | null
  profile_picture_url: string | null
  field_id: string | null
}

export type FieldRow = {
  id: string
  name: string
}

export type SkillRow = {
  id: string
  name: string
}

export type AuthProfile = {
  id: string
  email: string
  role: AppRole
  userType: UserType | null
  status: ProfileStatus
  isFirstTimeSetupComplete: boolean
  name: string
  bio: string | null
  profilePictureUrl: string | null
  fieldId: string | null
}

export type CompleteProfileInput = {
  name: string
  bio: string
  userType: UserType
  fieldId: string
  profilePictureUrl: string
  skillIds: string[]
}

type QueryResult<T> = PromiseLike<{ data: T | null; error: { message: string } | null }>

export type SupabaseProfileClient = {
  from: (table: string) => unknown
}

type ProfileTableQuery = {
  select?: (columns?: string) => {
    eq?: (column: string, value: string) => {
      maybeSingle?: () => QueryResult<ProfileRow>
    }
    order?: (column: string) => QueryResult<Array<FieldRow | SkillRow>>
  }
  update?: (values: Record<string, unknown>) => {
    eq: (column: string, value: string) => QueryResult<null>
  }
  delete?: () => {
    eq: (column: string, value: string) => QueryResult<null>
  }
  insert?: (values: Array<Record<string, string>>) => QueryResult<null>
}

function table(client: SupabaseProfileClient, tableName: string) {
  return client.from(tableName) as ProfileTableQuery
}

function assertNoError(error: { message: string } | null, fallback: string) {
  if (error) {
    throw new Error(error.message || fallback)
  }
}

export function mapProfileRow(row: ProfileRow): AuthProfile {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    userType: row.user_type,
    status: row.status,
    isFirstTimeSetupComplete: row.is_first_time_setup_complete,
    name: row.name,
    bio: row.bio,
    profilePictureUrl: row.profile_picture_url,
    fieldId: row.field_id,
  }
}

export async function fetchCurrentProfile(client: SupabaseProfileClient, userId: string) {
  const query = table(client, 'profiles')
    .select?.(
      'id,email,role,user_type,status,is_first_time_setup_complete,name,bio,profile_picture_url,field_id',
    )
    .eq?.('id', userId)
    .maybeSingle?.()

  if (!query) {
    throw new Error('Profiles query is not available.')
  }

  const { data, error } = await query
  assertNoError(error, 'Unable to load profile.')

  return data ? mapProfileRow(data) : null
}

export async function fetchFields(client: SupabaseProfileClient) {
  const query = table(client, 'fields').select?.('id,name').order?.('name')

  if (!query) {
    throw new Error('Fields query is not available.')
  }

  const { data, error } = await query
  assertNoError(error, 'Unable to load fields.')

  return data as FieldRow[]
}

export async function fetchSkills(client: SupabaseProfileClient) {
  const query = table(client, 'skills').select?.('id,name').order?.('name')

  if (!query) {
    throw new Error('Skills query is not available.')
  }

  const { data, error } = await query
  assertNoError(error, 'Unable to load skills.')

  return data as SkillRow[]
}

export async function updateCurrentProfile(
  client: SupabaseProfileClient,
  userId: string,
  input: CompleteProfileInput,
) {
  const updateQuery = table(client, 'profiles')
    .update?.({
      name: input.name,
      bio: input.bio,
      user_type: input.userType,
      field_id: input.fieldId,
      profile_picture_url: input.profilePictureUrl.trim() || null,
      is_first_time_setup_complete: true,
    })
    .eq('id', userId)

  if (!updateQuery) {
    throw new Error('Profile update is not available.')
  }

  const { error: updateError } = await updateQuery
  assertNoError(updateError, 'Unable to update profile.')

  const deleteQuery = table(client, 'profile_skills').delete?.().eq('profile_id', userId)

  if (!deleteQuery) {
    throw new Error('Profile skill delete is not available.')
  }

  const { error: deleteError } = await deleteQuery
  assertNoError(deleteError, 'Unable to update profile skills.')

  if (input.skillIds.length === 0) {
    return
  }

  const insertQuery = table(client, 'profile_skills').insert?.(
    input.skillIds.map((skillId) => ({
      profile_id: userId,
      skill_id: skillId,
    })),
  )

  if (!insertQuery) {
    throw new Error('Profile skill insert is not available.')
  }

  const { error: insertError } = await insertQuery
  assertNoError(insertError, 'Unable to save profile skills.')
}
