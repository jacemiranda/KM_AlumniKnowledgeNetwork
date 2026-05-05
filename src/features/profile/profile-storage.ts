import { getSupabaseClient } from '../../lib/supabase'

// Constants
const BUCKET_NAME = 'profile-pictures'
const MAX_FILE_SIZE = 1048576 // 1MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png']

// ── Types ──────────────────────────────────────────────────────────────

export type UploadError = {
  code: string
  message: string
}

// ── Error Messages ────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getUserFriendlyMessage(error: any): string {
  const message = error?.message || ''

  // File size errors
  if (message.includes('payload too large') || message.includes('413')) {
    return 'Image is too large. Maximum size is 1MB.'
  }

  // File type errors
  if (message.includes('invalid content type') || message.includes('Invalid content')) {
    return 'Invalid file type. Only JPG and PNG files are allowed.'
  }

  // Storage bucket errors
  if (message.includes('bucket not found')) {
    return 'Upload service is not configured. Please contact support.'
  }

  // Permission errors
  if (message.includes('Permission denied') || message.includes('403')) {
    return 'You do not have permission to upload images. Please try again.'
  }

  // Network errors
  if (message.includes('network') || message.includes('offline')) {
    return 'Network error. Please check your connection and try again.'
  }

  // Default
  return 'Failed to upload image. Please try again.'
}

// ── Validation ────────────────────────────────────────────────────────

/**
 * Validate a file before upload
 */
function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided.' }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `Image must be under 1MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB).` }
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: `Invalid file type: ${file.type}. Only JPG and PNG files allowed.` }
  }

  return { valid: true }
}

// ── Upload Functions ───────────────────────────────────────────────────

/**
 * Upload a profile picture to Supabase storage
 * Returns the public URL of the uploaded file
 */
export async function uploadProfilePicture(userId: string, file: File): Promise<string> {
  // Validate file
  const validation = validateFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const supabase = getSupabaseClient()

  // Generate unique filename: {userId}_{timestamp}.{ext}
  const timestamp = Date.now()
  const extension = file.type === 'image/jpeg' ? 'jpg' : 'png'
  const filename = `${userId}_${timestamp}.${extension}`
  const filePath = `${userId}/${filename}`

  try {
    // Upload file to Supabase storage
    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      throw uploadError
    }

    if (!data) {
      throw new Error('Upload returned no data.')
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      throw new Error('Failed to generate public URL for uploaded image.')
    }

    return urlData.publicUrl
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const friendlyMessage = getUserFriendlyMessage(error)
    const errorMessage = typeof error?.message === 'string' ? error.message.trim() : ''

    if (friendlyMessage === 'Failed to upload image. Please try again.' && errorMessage) {
      throw new Error(`Failed to upload image. ${errorMessage}`)
    }

    throw new Error(friendlyMessage)
  }
}

/**
 * Delete a profile picture from Supabase storage
 */
export async function deleteProfilePicture(userId: string, filename: string): Promise<void> {
  const supabase = getSupabaseClient()
  const filePath = `${userId}/${filename}`

  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      throw error
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Log error but don't throw - deletion failures shouldn't block profile updates
    console.warn(`Failed to delete old profile picture: ${error.message}`)
  }
}

/**
 * Delete all pictures for a user (when deleting account)
 */
export async function deleteUserProfilePictures(userId: string): Promise<void> {
  const supabase = getSupabaseClient()

  try {
    const { data, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(userId, {
        limit: 100,
        offset: 0,
      })

    if (listError) throw listError

    if (data && data.length > 0) {
      const filesToDelete = data.map((file) => `${userId}/${file.name}`)
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(filesToDelete)

      if (deleteError) throw deleteError
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.warn(`Failed to delete user profile pictures: ${error.message}`)
  }
}
