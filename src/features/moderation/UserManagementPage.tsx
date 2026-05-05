import { useState } from 'react'
import { useAuth } from '../auth/use-auth'
import type { AppRole } from '../auth/profile-service'
import type { ContentStatus } from '../feed/post-service'
import { AnalyticsSummary } from '../analytics/AnalyticsSummary'
import { ModerationQueue, type ModerationQueueItem } from './components/ModerationQueue'
import { UserManagementTable } from './components/UserManagementTable'
import {
  useAllUsers,
  useAllFields,
  useBlockUser,
  useUnblockUser,
  useUpdateRole,
  useManagedPosts,
  useManagedComments,
  useModeratePost,
  useRestorePost,
  useModerateComment,
  useRestoreComment,
  useToggleField,
  useModerationLog,
  useIsPrivileged,
  type UserFilters,
  type ContentFilters,
} from './use-moderation'

// ── Tab definitions ────────────────────────────────────────────────────

const TABS = ['Users', 'Moderation Queue', 'Fields', 'Analytics', 'Log'] as const
type Tab = (typeof TABS)[number]

// ── Main Page ──────────────────────────────────────────────────────────

export function UserManagementPage() {
  const { session } = useAuth()
  const { isModerator } = useIsPrivileged()
  const [activeTab, setActiveTab] = useState<Tab>('Users')

  if (!session || !isModerator) {
    return (
      <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-8 text-center shadow-liquid backdrop-blur-2xl">
        <p className="text-sm text-red-300">Access denied. This page requires Moderator or Admin privileges.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-liquid backdrop-blur-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">User Management</p>
        <p className="mt-1 text-sm text-slate-400">Moderate content, manage users, and review platform activity.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-2 shadow-liquid backdrop-blur-2xl">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition cursor-pointer ${
              activeTab === tab
                ? 'border border-emerald-300/40 bg-emerald-300/15 text-emerald-100'
                : 'border border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'Users' && <UsersTab />}
      {activeTab === 'Moderation Queue' && <ModerationQueueTab />}
      {activeTab === 'Fields' && <FieldsTab />}
      {activeTab === 'Analytics' && <AnalyticsSummary />}
      {activeTab === 'Log' && <LogTab />}
    </div>
  )
}

// ── Users Tab ──────────────────────────────────────────────────────────

function UsersTab() {
  const { isAdmin } = useIsPrivileged()
  const [filters, setFilters] = useState<UserFilters>({ page: 1, limit: 15 })
  const [search, setSearch] = useState('')
  const { data, isLoading } = useAllUsers({ ...filters, search })
  const blockMut = useBlockUser()
  const unblockMut = useUnblockUser()
  const roleMut = useUpdateRole()
  const users = data?.users ?? []
  const total = data?.total ?? 0

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setFilters((f: UserFilters) => ({ ...f, page: 1 })) }}
          placeholder="Search by name or email..."
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-300/40"
        />
        <select
          value={filters.role ?? ''}
          onChange={(e) => setFilters((f: UserFilters) => ({ ...f, role: (e.target.value || '') as AppRole | '', page: 1 }))}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
        >
          <option value="">All roles</option>
          <option value="end_user">End User</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={filters.status ?? ''}
          onChange={(e) => setFilters((f: UserFilters) => ({ ...f, status: (e.target.value || '') as 'active' | 'blocked' | '', page: 1 }))}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
        >
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <UserManagementTable
        users={users}
        isLoading={isLoading}
        isAdmin={isAdmin}
        onRoleChange={(userId, role) => roleMut.mutate({ targetId: userId, role })}
        onSuspend={(userId) => blockMut.mutate({ targetId: userId })}
        onBan={(userId) => blockMut.mutate({ targetId: userId, reason: 'Banned by administrator' })}
        onReinstate={(userId) => unblockMut.mutate({ targetId: userId })}
        isMutating={blockMut.isPending || unblockMut.isPending || roleMut.isPending}
      />

      {/* Pagination */}
      {total > (filters.limit ?? 15) && (
        <Pagination page={filters.page ?? 1} total={total} limit={filters.limit ?? 15} onChange={(p) => setFilters((f) => ({ ...f, page: p }))} />
      )}
    </div>
  )
}

// ── Moderation Queue Tab ──────────────────────────────────────────────

function moderationReason(status: ContentStatus, kind: 'post' | 'comment') {
  if (status === 'hidden') {
    return kind === 'post' ? 'Flagged for review by moderation policy.' : 'Temporarily hidden after a report.'
  }

  if (status === 'removed') {
    return kind === 'post' ? 'Removed due to guideline violation.' : 'Removed due to repeated reports.'
  }

  return kind === 'post' ? 'Reported as potentially misleading content.' : 'Reported for inappropriate tone.'
}

function ModerationQueueTab() {
  const [contentType, setContentType] = useState<'posts' | 'comments'>('posts')
  const [filters, setFilters] = useState<ContentFilters>({ page: 1, limit: 15 })
  const postsQuery = useManagedPosts(filters)
  const commentsQuery = useManagedComments(filters)
  const modPost = useModeratePost()
  const restPost = useRestorePost()
  const modComment = useModerateComment()
  const restComment = useRestoreComment()

  const queueItems: ModerationQueueItem[] = contentType === 'posts'
    ? (postsQuery.data?.posts ?? []).map((post) => ({
      id: post.id,
      kind: 'post',
      title: post.title,
      content: post.content,
      reason: moderationReason(post.status, 'post'),
      status: post.status,
      byline: `by ${post.author?.name ?? 'Unknown'} · ${new Date(post.created_at).toLocaleDateString()}`,
    }))
    : (commentsQuery.data?.comments ?? []).map((comment) => ({
      id: comment.id,
      kind: 'comment',
      title: 'Reported Comment',
      content: comment.content,
      reason: moderationReason(comment.status, 'comment'),
      status: comment.status,
      byline: `by ${comment.author?.name ?? 'Unknown'} · ${new Date(comment.created_at).toLocaleDateString()}`,
    }))

  const isLoading = contentType === 'posts' ? postsQuery.isLoading : commentsQuery.isLoading
  const isMutating = modPost.isPending || restPost.isPending || modComment.isPending || restComment.isPending

  const total = contentType === 'posts' ? (postsQuery.data?.total ?? 0) : (commentsQuery.data?.total ?? 0)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['posts', 'comments'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setContentType(t); setFilters({ page: 1, limit: 15 }) }}
            className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition cursor-pointer ${
              contentType === t ? 'border border-blue-300/40 bg-blue-300/15 text-blue-100' : 'border border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t === 'posts' ? 'Reported Posts' : 'Reported Comments'}
          </button>
        ))}
        <select
          value={filters.status ?? ''}
          onChange={(e) => setFilters((f: ContentFilters) => ({ ...f, status: (e.target.value || '') as ContentStatus | '', page: 1 }))}
          className="ml-auto rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
        >
          <option value="">All status</option>
          <option value="published">Published</option>
          <option value="hidden">Hidden</option>
          <option value="removed">Removed</option>
        </select>
      </div>

      <ModerationQueue
        items={queueItems}
        isLoading={isLoading}
        isMutating={isMutating}
        onApproveKeep={(item) => {
          if (item.kind === 'post') {
            restPost.mutate({ postId: item.id, reason: 'Approved and kept visible' })
            return
          }

          restComment.mutate({ commentId: item.id, reason: 'Approved and kept visible' })
        }}
        onRemoveDelete={(item) => {
          if (item.kind === 'post') {
            modPost.mutate({ postId: item.id, action: 'removed', reason: 'Removed from moderation queue' })
            return
          }

          modComment.mutate({ commentId: item.id, action: 'removed', reason: 'Removed from moderation queue' })
        }}
      />

      {total > (filters.limit ?? 15) && (
        <Pagination page={filters.page ?? 1} total={total} limit={filters.limit ?? 15} onChange={(p) => setFilters((f) => ({ ...f, page: p }))} />
      )}
    </div>
  )
}

// ── Fields Tab ─────────────────────────────────────────────────────────

function FieldsTab() {
  const { data, isLoading } = useAllFields()
  const toggle = useToggleField()
  const fields = data ?? []

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 shadow-liquid backdrop-blur-2xl">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Field Management</p>
      </div>
      {isLoading ? (
        <div className="p-6 text-center text-sm text-slate-400">Loading...</div>
      ) : (
        <div className="divide-y divide-white/5">
          {fields.map((f) => (
            <div key={f.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-bold text-white">{f.name}</p>
                <p className="text-[10px] text-slate-500">{f.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle.mutate({ fieldId: f.id, isActive: !f.is_active })}
                disabled={toggle.isPending}
                className={`rounded-lg px-3 py-1 text-[10px] font-bold transition cursor-pointer disabled:opacity-40 ${
                  f.is_active
                    ? 'border border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                    : 'border border-red-400/30 bg-red-400/10 text-red-300'
                }`}
              >
                {f.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Log Tab ────────────────────────────────────────────────────────────

function LogTab() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useModerationLog(page)
  const entries = data?.entries ?? []
  const total = data?.total ?? 0

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-white/10 bg-white/5 shadow-liquid backdrop-blur-2xl">
        <div className="border-b border-white/10 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Moderation Log</p>
        </div>
        {isLoading ? (
          <div className="p-6 text-center text-sm text-slate-400">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-400">No moderation actions recorded.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {entries.map((e) => (
              <div key={e.id} className="px-4 py-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-white">{e.actor?.name ?? 'System'}</span>
                  <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-400">{e.action.replace(/_/g, ' ')}</span>
                  <span className="text-[10px] text-slate-500">{e.target_type} · {new Date(e.created_at).toLocaleString()}</span>
                </div>
                {e.reason && <p className="mt-1 text-[10px] text-slate-500">Reason: {e.reason}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
      {total > 30 && <Pagination page={page} total={total} limit={30} onChange={setPage} />}
    </div>
  )
}

// ── Shared components ──────────────────────────────────────────────────

function Pagination({ page, total, limit, onChange }: { page: number; total: number; limit: number; onChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / limit)
  return (
    <div className="flex justify-center gap-3 pt-2">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:opacity-30 cursor-pointer">
        ← Prev
      </button>
      <span className="px-2 py-2 text-xs text-slate-500">Page {page} of {totalPages}</span>
      <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:opacity-30 cursor-pointer">
        Next →
      </button>
    </div>
  )
}
