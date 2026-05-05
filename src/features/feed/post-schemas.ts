import { z } from 'zod'

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters.')
    .max(200, 'Title must be at most 200 characters.'),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters.')
    .max(5000, 'Content must be at most 5000 characters.'),
  fieldId: z.string().uuid('Please select a field.'),
  postType: z.enum(['information', 'question'], {
    message: 'Please select a post type.',
  }),
  tagNames: z
    .array(z.string().min(1).max(50))
    .max(10, 'You can add up to 10 tags.')
    .default([]),
  taggedAlumniId: z.string().uuid().nullable().optional(),
})

export type CreatePostFormValues = z.infer<typeof createPostSchema>

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty.')
    .max(2000, 'Comment must be at most 2000 characters.'),
})

export type CreateCommentFormValues = z.infer<typeof createCommentSchema>
