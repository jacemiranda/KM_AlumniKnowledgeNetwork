import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/use-auth'
import { createComment, deleteComment, fetchComments, fetchUserComments } from './comment-service'
import { POST_KEYS } from './use-posts'

export const COMMENT_KEYS = {
  all: ['comments'] as const,
  list: (postId: string) => ['comments', postId] as const,
  userList: (userId: string) => ['comments', 'user', userId] as const,
}

export function useComments(postId: string) {
  return useQuery({
    queryKey: COMMENT_KEYS.list(postId),
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
  })
}

export function useUserComments(userId: string) {
  return useQuery({
    queryKey: COMMENT_KEYS.userList(userId),
    queryFn: () => fetchUserComments(userId),
    enabled: !!userId,
  })
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient()
  const { session } = useAuth()

  return useMutation({
    mutationFn: (content: string) => {
      if (!session) throw new Error('Must be signed in to comment.')
      return createComment(session.user.id, postId, content)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.list(postId) })
      // Also refresh the post detail to update comment count
      void queryClient.invalidateQueries({ queryKey: POST_KEYS.detail(postId) })
      void queryClient.invalidateQueries({ queryKey: POST_KEYS.all })
    },
  })
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.list(postId) })
      void queryClient.invalidateQueries({ queryKey: POST_KEYS.detail(postId) })
      void queryClient.invalidateQueries({ queryKey: POST_KEYS.all })
    },
  })
}
