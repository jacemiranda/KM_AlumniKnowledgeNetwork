import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../auth/use-auth'
import { BadgeDisplay } from '../badges/BadgeDisplay'
import { useUserBadges, useCheckBadges } from '../badges/use-badges'
import { useProfileMetrics } from './use-profile-metrics'
import { PostComposer } from '../feed/PostComposer'
import { usePosts } from '../feed/use-posts'
import { PostCard } from '../feed/PostCard'
import { useUserComments } from '../feed/use-comments'
import { EditProfileForm } from './EditProfileForm'

function initials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatUserType(userType: string | null) {
  if (!userType) return 'Profile'
  return userType.charAt(0).toUpperCase() + userType.slice(1)
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-2xl font-black tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
    </div>
  )
}

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const { session } = useAuth()
  const profileId = userId ?? session?.user.id ?? ''
  const { data: profile, isLoading, error } = useProfileMetrics(profileId)
  const { data: userBadges } = useUserBadges(profileId)
  const checkBadges = useCheckBadges()
  
  const [showAskModal, setShowAskModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'tagged'>('posts')

  const { data: postsData, isLoading: isLoadingPosts } = usePosts({ authorId: profileId })
  const { data: taggedPostsData, isLoading: isLoadingTagged } = usePosts({ taggedAlumniId: profileId })
  const { data: comments, isLoading: isLoadingComments } = useUserComments(profileId)

  const [isEditing, setIsEditing] = useState(false)

  // Auto-check and award eligible badges when profile loads
  useEffect(() => {
    if (profileId && profile) {
      checkBadges.mutate(profileId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId, profile?.id])

  if (!session) {
    return null
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-liquid backdrop-blur-2xl">
        <p className="text-sm text-slate-400">Loading profile...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-liquid backdrop-blur-2xl">
        <p className="text-sm text-red-300">
          {error instanceof Error ? error.message : 'Profile not found.'}
        </p>
        <Link
          to="/alumni"
          className="mt-3 inline-block text-sm font-bold text-emerald-200 transition-colors hover:text-emerald-100"
        >
          Back to alumni
        </Link>
      </div>
    )
  }

  const isOwnProfile = session.user.id === profile.id

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-liquid backdrop-blur-2xl">
        <div className="border-b border-white/10 bg-white/[0.03] p-6 sm:p-8">
          {isEditing ? (
            <div className="max-w-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">Edit Profile</h2>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
              <EditProfileForm
                initialValues={{
                  name: profile.name,
                  bio: profile.bio,
                  fieldId: profile.field?.id || '',
                  profilePictureUrl: profile.profile_picture_url,
                  skills: profile.skills?.map(s => s.id) || [],
                }}
                onSuccess={() => setIsEditing(false)}
                isEditing={true}
              />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-4">
                  {profile.profile_picture_url ? (
                    <img
                      src={profile.profile_picture_url}
                      alt={profile.name}
                      className="h-20 w-20 flex-shrink-0 rounded-full object-cover ring-2 ring-white/10"
                    />
                  ) : (
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-emerald-300/15 text-xl font-black text-emerald-100 ring-2 ring-white/10">
                      {initials(profile.name)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                      {formatUserType(profile.user_type)}
                    </p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                      {profile.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">{profile.email}</p>
                    {profile.field && (
                      <p className="mt-2 text-sm font-semibold text-emerald-200">
                        {profile.field.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:flex-col sm:justify-start">
                  {!isOwnProfile && profile.user_type === 'alumni' && (
                    <div className="mt-1 flex sm:justify-end">
                      <button
                        type="button"
                        onClick={() => setShowAskModal(true)}
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-cyan-200 transition-colors hover:bg-cyan-300/20 sm:w-auto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                          <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                        </svg>
                        Ask Question
                      </button>
                    </div>
                  )}

                  {isOwnProfile && (
                    <div className="mt-1 flex sm:justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10 sm:w-auto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                          <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
                        </svg>
                        Edit Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {profile.bio && (
                <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-300">
                  {profile.bio}
                </p>
              )}

          {profile.skills.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}
            </>
          )}
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
          <MetricCard label="Authority score" value={profile.authority_score} />
          <MetricCard label="Posts created" value={profile.post_count} />
          <MetricCard label="Tagged in posts" value={profile.posts_tagged_in} />
          <MetricCard label="Comments" value={profile.comment_count} />
        </div>

        {/* Earned badges */}
        {(userBadges ?? []).length > 0 && (
          <div className="border-t border-white/10 p-6 sm:p-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Earned Badges
            </p>
            <BadgeDisplay badges={userBadges ?? []} />
          </div>
        )}
      </section>

      {/* Tabs */}
      <section className="space-y-5">
        <div className="flex gap-4 border-b border-white/10 pb-1">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-2 text-sm font-bold uppercase tracking-[0.12em] transition-colors hover:text-white ${
              activeTab === 'posts' ? 'border-b-2 border-emerald-400 text-white' : 'text-slate-400 border-b-2 border-transparent'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-2 text-sm font-bold uppercase tracking-[0.12em] transition-colors hover:text-white ${
              activeTab === 'comments' ? 'border-b-2 border-emerald-400 text-white' : 'text-slate-400 border-b-2 border-transparent'
            }`}
          >
            Comments
          </button>
          <button
            onClick={() => setActiveTab('tagged')}
            className={`pb-2 text-sm font-bold uppercase tracking-[0.12em] transition-colors hover:text-white ${
              activeTab === 'tagged' ? 'border-b-2 border-emerald-400 text-white' : 'text-slate-400 border-b-2 border-transparent'
            }`}
          >
            Tagged In
          </button>
        </div>

        <div className="min-h-[300px]">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {isLoadingPosts ? (
                <p className="text-sm text-slate-400">Loading posts...</p>
              ) : postsData?.posts.length ? (
                postsData.posts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <p className="text-sm text-slate-500">No posts authored by this user.</p>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              {isLoadingComments ? (
                <p className="text-sm text-slate-400">Loading comments...</p>
              ) : comments?.length ? (
                comments.map((comment) => (
                  <div key={comment.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-liquid backdrop-blur-2xl">
                    <p className="text-sm text-slate-300">{comment.content}</p>
                    <div className="mt-3 flex gap-2">
                       <Link to={`/post/${comment.post_id}`} className="text-xs font-bold text-emerald-200 transition-colors hover:text-emerald-100">
                         View Source Post →
                       </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No comments made by this user.</p>
              )}
            </div>
          )}

          {activeTab === 'tagged' && (
            <div className="space-y-4">
              {isLoadingTagged ? (
                <p className="text-sm text-slate-400">Loading tagged posts...</p>
              ) : taggedPostsData?.posts.length ? (
                taggedPostsData.posts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <p className="text-sm text-slate-500">Not tagged in any posts.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Ask Modal */}
      {showAskModal && profile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6" onClick={() => setShowAskModal(false)}>
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-ink-950 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Ask an Expert</h3>
              <button
                type="button"
                onClick={() => setShowAskModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
            <PostComposer
              initialTaggedAlumni={{ id: profile.id, name: profile.name }}
              initialPostType="question"
              onSuccess={() => setShowAskModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
