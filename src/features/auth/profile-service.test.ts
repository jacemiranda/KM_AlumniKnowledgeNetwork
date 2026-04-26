import { describe, expect, it, vi } from 'vitest'
import {
  mapProfileRow,
  type ProfileRow,
  updateCurrentProfile,
} from './profile-service'

describe('profile service', () => {
  it('maps Supabase profile columns into auth profile state', () => {
    const row: ProfileRow = {
      id: 'user-1',
      email: 'casey@example.com',
      role: 'end_user',
      user_type: 'student',
      status: 'active',
      is_first_time_setup_complete: false,
      name: 'Casey Diaz',
      bio: 'Learner',
      profile_picture_url: null,
      field_id: 'field-1',
    }

    expect(mapProfileRow(row)).toEqual({
      id: 'user-1',
      email: 'casey@example.com',
      role: 'end_user',
      userType: 'student',
      status: 'active',
      isFirstTimeSetupComplete: false,
      name: 'Casey Diaz',
      bio: 'Learner',
      profilePictureUrl: null,
      fieldId: 'field-1',
    })
  })

  it('updates profile setup and replaces selected skills', async () => {
    const deleteEq = vi.fn().mockResolvedValue({ error: null })
    const deleteFrom = vi.fn(() => ({ eq: deleteEq }))
    const insert = vi.fn().mockResolvedValue({ error: null })
    const updateEq = vi.fn().mockResolvedValue({ error: null })
    const update = vi.fn(() => ({ eq: updateEq }))
    const from = vi.fn((table: string) => {
      if (table === 'profiles') {
        return { update }
      }

      return {
        delete: deleteFrom,
        insert,
      }
    })

    await updateCurrentProfile(
      { from },
      'user-1',
      {
        name: 'Casey Diaz',
        bio: 'Building a portfolio',
        userType: 'student',
        fieldId: 'field-1',
        profilePictureUrl: '',
        skillIds: ['skill-1', 'skill-2'],
      },
    )

    expect(update).toHaveBeenCalledWith({
      name: 'Casey Diaz',
      bio: 'Building a portfolio',
      user_type: 'student',
      field_id: 'field-1',
      profile_picture_url: null,
      is_first_time_setup_complete: true,
    })
    expect(updateEq).toHaveBeenCalledWith('id', 'user-1')
    expect(deleteEq).toHaveBeenCalledWith('profile_id', 'user-1')
    expect(insert).toHaveBeenCalledWith([
      { profile_id: 'user-1', skill_id: 'skill-1' },
      { profile_id: 'user-1', skill_id: 'skill-2' },
    ])
  })
})
