import { beforeEach, describe, expect, it, vi } from 'vitest'
import { uploadProfilePicture } from './profile-storage'

const upload = vi.fn()
const getPublicUrl = vi.fn()
const from = vi.fn()

vi.mock('../../lib/supabase', () => ({
  getSupabaseClient: () => ({
    storage: {
      from,
    },
  }),
}))

describe('profile storage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-05T12:00:00.000Z'))

    upload.mockReset()
    getPublicUrl.mockReset()
    from.mockReset()

    from.mockReturnValue({
      upload,
      getPublicUrl,
      remove: vi.fn(),
      list: vi.fn(),
    })

    getPublicUrl.mockReturnValue({
      data: {
        publicUrl: 'https://example.supabase.co/storage/v1/object/public/profile-pictures/user-1/user-1_1777982400000.jpg',
      },
    })
  })

  it('retries jpeg uploads with a compatible storage mime type', async () => {
    const file = new File(['jpeg bytes'], 'avatar.jpg', { type: 'image/jpeg' })

    upload
      .mockResolvedValueOnce({ data: null, error: new Error('mime type image/jpeg is not supported') })
      .mockResolvedValueOnce({ data: { path: 'user-1/user-1_1777982400000.jpg' }, error: null })

    const url = await uploadProfilePicture('user-1', file)

    expect(url).toBe('https://example.supabase.co/storage/v1/object/public/profile-pictures/user-1/user-1_1777982400000.jpg')
    expect(upload).toHaveBeenCalledTimes(2)
    expect(upload).toHaveBeenNthCalledWith(
      1,
      'user-1/user-1_1777982400000.jpg',
      file,
      expect.objectContaining({ contentType: 'image/jpeg' }),
    )
    expect(upload).toHaveBeenNthCalledWith(
      2,
      'user-1/user-1_1777982400000.jpg',
      file,
      expect.objectContaining({ contentType: 'image/jpg' }),
    )
  })
})
