import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/use-auth'
import {
  createPost,
  deletePost,
  fetchPostById,
  fetchPosts,
  type CreatePostInput,
  type PostFilters,
  type UpdatePostInput,
  updatePost,
} from './post-service'

export const POST_KEYS = {
  all: ['posts'] as const,
  list: (filters: PostFilters) => ['posts', 'list', filters] as const,
  detail: (id: string) => ['posts', 'detail', id] as const,
}

export function usePosts(filters: PostFilters = {}) {
  return useQuery({
    queryKey: POST_KEYS.list(filters),
    queryFn: () => fetchPosts(filters),
  })
}

export function usePost(postId: string) {
  return useQuery({
    queryKey: POST_KEYS.detail(postId),
    queryFn: () => fetchPostById(postId),
    enabled: !!postId,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: (input: CreatePostInput) => {
      if (!session) throw new Error('Must be signed in to create a post.')
      return createPost(session.user.id, input)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: POST_KEYS.all })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: POST_KEYS.all })
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: ({ postId, input }: { postId: string; input: UpdatePostInput }) => {
      if (!session) throw new Error('Must be signed in to update a post.')
      return updatePost(postId, input)
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: POST_KEYS.all })
      void queryClient.invalidateQueries({ queryKey: POST_KEYS.detail(variables.postId) })
    },
  })
}
