import { z } from 'zod'

// Allowed image types and size (1MB = 1048576 bytes)
const MAX_FILE_SIZE = 1048576
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png']

export const editProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name cannot be empty.')
    .max(100, 'Name must be at most 100 characters.'),
  bio: z
    .string()
    .max(500, 'Bio must be at most 500 characters.')
    .optional()
    .nullable(),
  fieldId: z
    .string()
    .uuid('Please select a valid field.')
    .min(1, 'Please select a field.'),
  profilePictureFile: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `Image must be under 1MB (max ${MAX_FILE_SIZE} bytes).`
    )
    .refine(
      (file) => ALLOWED_MIME_TYPES.includes(file.type),
      'Only JPG and PNG files allowed.'
    )
    .optional()
    .nullable(),
  skills: z
    .array(z.string().uuid())
    .max(20, 'You can select up to 20 skills.')
    .optional()
    .default([]),
})

export type EditProfileFormValues = z.infer<typeof editProfileSchema>

/**
 * Schema for validating profile updates to be sent to the server.
 * The server will receive the picture URL after upload, not the File object.
 */
export const updateProfileInputSchema = z.object({
  name: z
    .string()
    .min(1, 'Name cannot be empty.')
    .max(100, 'Name must be at most 100 characters.'),
  bio: z
    .string()
    .max(500, 'Bio must be at most 500 characters.')
    .optional()
    .nullable(),
  fieldId: z.string().uuid(),
  profilePictureUrl: z.string().url().optional().nullable(),
  skills: z.array(z.string().uuid()).optional().default([]),
})

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>
