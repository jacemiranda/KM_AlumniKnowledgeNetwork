import { useState } from 'react'
import { useAuth } from '../auth/use-auth'
import type { AppRole } from '../auth/profile-service'
import type { ContentStatus } from '../feed/post-service'
import { AnalyticsSummary } from '../analytics/AnalyticsSummary'
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

const TABS = ['Users', 'Content', 'Fields', 'Analytics', 'Log'] as const
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
      {activeTab === 'Content' && <ContentTab />}
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

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 shadow-liquid backdrop-blur-2xl">
        {isLoading ? (
          <div className="p-6 text-center text-sm text-slate-400">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-400">No users found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Posts</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <p className="font-bold text-white">{u.name || 'Unnamed'}</p>
                    <p className="text-[10px] text-slate-500">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    {isAdmin ? (
                      <select
                        value={u.role}
                        onChange={(e) => roleMut.mutate({ targetId: u.id, role: e.target.value as AppRole })}
                        disabled={roleMut.isPending}
                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-slate-300 outline-none cursor-pointer"
                      >
                        <option value="end_user">end_user</option>
                        <option value="moderator">moderator</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      <RoleBadge role={u.role} />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-400">{u.post_count}</td>
                  <td className="px-4 py-3">
                    {u.status === 'active' ? (
                      <button
                        type="button"
                        onClick={() => blockMut.mutate({ targetId: u.id })}
                        disabled={blockMut.isPending}
                        className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-1 text-[10px] font-bold text-red-300 transition hover:bg-red-400/20 cursor-pointer disabled:opacity-40"
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => unblockMut.mutate({ targetId: u.id })}
                        disabled={unblockMut.isPending}
                        className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold text-emerald-300 transition hover:bg-emerald-400/20 cursor-pointer disabled:opacity-40"
                      >
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {total > (filters.limit ?? 15) && (
        <Pagination page={filters.page ?? 1} total={total} limit={filters.limit ?? 15} onChange={(p) => setFilters((f) => ({ ...f, page: p }))} />
      )}
    </div>
  )
}

// ── Content Tab ────────────────────────────────────────────────────────

function ContentTab() {
  const [contentType, setContentType] = useState<'posts' | 'comments'>('posts')
  const [filters, setFilters] = useState<ContentFilters>({ page: 1, limit: 15 })

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
            {t}
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

      {contentType === 'posts' ? <PostsSubTab filters={filters} setFilters={setFilters} /> : <CommentsSubTab filters={filters} setFilters={setFilters} />}
    </div>
  )
}

function PostsSubTab({ filters, setFilters }: { filters: ContentFilters; setFilters: React.Dispatch<React.SetStateAction<ContentFilters>> }) {
  const { data, isLoading } = useManagedPosts(filters)
  const modPost = useModeratePost()
  const restPost = useRestorePost()
  const posts = data?.posts ?? []
  const total = data?.total ?? 0

  return (
    <div className="space-y-3">
      {isLoading && <div className="p-6 text-center text-sm text-slate-400">Loading...</div>}
      {!isLoading && posts.length === 0 && <div className="p-6 text-center text-sm text-slate-400">No posts found.</div>}
      {posts.map((p) => (
        <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white truncate">{p.title}</p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                by {p.author?.name} · {p.field?.name} · {new Date(p.created_at).toLocaleDateString()}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-slate-400">{p.content}</p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <ContentStatusBadge status={p.status} />
              {p.status === 'published' && (
                <>
                  <ActionBtn label="Hide" color="amber" onClick={() => modPost.mutate({ postId: p.id, action: 'hidden' })} disabled={modPost.isPending} />
                  <ActionBtn label="Remove" color="red" onClick={() => modPost.mutate({ postId: p.id, action: 'removed' })} disabled={modPost.isPending} />
                </>
              )}
              {p.status !== 'published' && (
                <ActionBtn label="Restore" color="emerald" onClick={() => restPost.mutate({ postId: p.id })} disabled={restPost.isPending} />
              )}
            </div>
          </div>
        </div>
      ))}
      {total > (filters.limit ?? 15) && (
        <Pagination page={filters.page ?? 1} total={total} limit={filters.limit ?? 15} onChange={(p) => setFilters((f) => ({ ...f, page: p }))} />
      )}
    </div>
  )
}

function CommentsSubTab({ filters, setFilters }: { filters: ContentFilters; setFilters: React.Dispatch<React.SetStateAction<ContentFilters>> }) {
  const { data, isLoading } = useManagedComments(filters)
  const modComment = useModerateComment()
  const restComment = useRestoreComment()
  const comments = data?.comments ?? []
  const total = data?.total ?? 0

  return (
    <div className="space-y-3">
      {isLoading && <div className="p-6 text-center text-sm text-slate-400">Loading...</div>}
      {!isLoading && comments.length === 0 && <div className="p-6 text-center text-sm text-slate-400">No comments found.</div>}
      {comments.map((c) => (
        <div key={c.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400 line-clamp-2">{c.content}</p>
              <p className="mt-1 text-[10px] text-slate-500">by {c.author?.name} · {new Date(c.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <ContentStatusBadge status={c.status} />
              {c.status === 'published' && (
                <>
                  <ActionBtn label="Hide" color="amber" onClick={() => modComment.mutate({ commentId: c.id, action: 'hidden' })} disabled={modComment.isPending} />
                  <ActionBtn label="Remove" color="red" onClick={() => modComment.mutate({ commentId: c.id, action: 'removed' })} disabled={modComment.isPending} />
                </>
              )}
              {c.status !== 'published' && (
                <ActionBtn label="Restore" color="emerald" onClick={() => restComment.mutate({ commentId: c.id })} disabled={restComment.isPending} />
              )}
            </div>
          </div>
        </div>
      ))}
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

function RoleBadge({ role }: { role: AppRole }) {
  const styles: Record<AppRole, string> = {
    admin: 'border-purple-300/40 bg-purple-300/10 text-purple-200',
    moderator: 'border-blue-300/40 bg-blue-300/10 text-blue-200',
    end_user: 'border-white/10 bg-white/5 text-slate-400',
  }
  return <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${styles[role]}`}>{role.replace('_', ' ')}</span>
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${
      status === 'active' ? 'border-emerald-300/40 bg-emerald-300/10 text-emerald-200' : 'border-red-300/40 bg-red-300/10 text-red-200'
    }`}>
      {status}
    </span>
  )
}

function ContentStatusBadge({ status }: { status: ContentStatus }) {
  const map: Record<ContentStatus, string> = {
    published: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-200',
    hidden: 'border-amber-300/40 bg-amber-300/10 text-amber-200',
    removed: 'border-red-300/40 bg-red-300/10 text-red-200',
  }
  return <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${map[status]}`}>{status}</span>
}

function ActionBtn({ label, color, onClick, disabled }: { label: string; color: 'emerald' | 'amber' | 'red'; onClick: () => void; disabled: boolean }) {
  const styles: Record<string, string> = {
    emerald: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20',
    amber: 'border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20',
    red: 'border-red-400/30 bg-red-400/10 text-red-300 hover:bg-red-400/20',
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`rounded-lg border px-3 py-1 text-[10px] font-bold transition cursor-pointer disabled:opacity-40 ${styles[color]}`}>
      {label}
    </button>
  )
}

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
