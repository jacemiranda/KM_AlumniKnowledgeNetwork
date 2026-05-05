import type { AppRole } from '../../auth/profile-service'
import type { ManagedUser } from '../moderation-service'

type UserRoleView = 'student' | 'alumni' | 'admin'

type UserManagementTableProps = {
  users: ManagedUser[]
  isLoading: boolean
  isAdmin: boolean
  onRoleChange: (userId: string, role: AppRole) => void
  onSuspend: (userId: string) => void
  onBan: (userId: string) => void
  onReinstate: (userId: string) => void
  isMutating: boolean
}

function toRoleView(user: ManagedUser): UserRoleView {
  if (user.role === 'admin' || user.role === 'moderator') {
    return 'admin'
  }

  return user.user_type === 'alumni' ? 'alumni' : 'student'
}

function fromRoleView(roleView: UserRoleView): AppRole {
  if (roleView === 'admin') {
    return 'admin'
  }

  return 'end_user'
}

function RoleBadge({ user }: { user: ManagedUser }) {
  const roleView = toRoleView(user)
  const styles: Record<UserRoleView, string> = {
    student: 'border-blue-300/40 bg-blue-300/10 text-blue-200',
    alumni: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-200',
    admin: 'border-amber-300/40 bg-amber-300/10 text-amber-200',
  }

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${styles[roleView]}`}>
      {roleView}
    </span>
  )
}

function StatusBadge({ status }: { status: ManagedUser['status'] }) {
  const isActive = status === 'active'

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
        isActive
          ? 'border-emerald-300/40 bg-emerald-300/10 text-emerald-200'
          : 'border-red-300/40 bg-red-300/10 text-red-200'
      }`}
    >
      {isActive ? 'Active' : 'Suspended'}
    </span>
  )
}

export function UserManagementTable({
  users,
  isLoading,
  isAdmin,
  onRoleChange,
  onSuspend,
  onBan,
  onReinstate,
  isMutating,
}: UserManagementTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#131b2e]/60 p-6 text-center text-sm text-slate-400 shadow-liquid backdrop-blur-2xl">
        Loading users...
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#131b2e]/60 p-6 text-center text-sm text-slate-400 shadow-liquid backdrop-blur-2xl">
        No users found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#131b2e]/60 shadow-liquid backdrop-blur-2xl">
      <table className="min-w-[760px] w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-[0.14em] text-[#bbcabf]">
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const roleView = toRoleView(user)
            const isActive = user.status === 'active'

            return (
              <tr key={user.id} className="border-b border-white/5 align-top transition-all duration-300 hover:bg-white/[0.03]">
                <td className="px-4 py-3">
                  <p className="font-bold text-[#dae2fd]">{user.name || 'Unnamed'}</p>
                  <p className="text-[10px] text-[#bbcabf]">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  {isAdmin ? (
                    <select
                      aria-label={`Role for ${user.name || user.email}`}
                      value={roleView}
                      onChange={(e) => onRoleChange(user.id, fromRoleView(e.target.value as UserRoleView))}
                      disabled={isMutating}
                      className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#dae2fd] outline-none focus:ring-2 focus:ring-[#4edea3] transition-all duration-300"
                    >
                      <option value="student">Student</option>
                      <option value="alumni">Alumni</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <RoleBadge user={user} />
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {isActive ? (
                      <>
                        <button
                          type="button"
                          aria-label={`Suspend ${user.name || 'user'}`}
                          onClick={() => onSuspend(user.id)}
                          disabled={isMutating}
                          className="rounded-full border border-amber-300/40 bg-transparent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-amber-200 transition-all duration-300 hover:bg-amber-300/10 focus:outline-none focus:ring-2 focus:ring-[#4edea3] disabled:opacity-40"
                        >
                          Suspend
                        </button>
                        <button
                          type="button"
                          aria-label={`Ban ${user.name || 'user'}`}
                          onClick={() => onBan(user.id)}
                          disabled={isMutating}
                          className="rounded-full border border-[#ffb4ab]/40 bg-transparent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#ffb4ab] transition-all duration-300 hover:bg-[#ffb4ab]/10 focus:outline-none focus:ring-2 focus:ring-[#4edea3] disabled:opacity-40"
                        >
                          Ban
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        aria-label={`Reinstate ${user.name || 'user'}`}
                        onClick={() => onReinstate(user.id)}
                        disabled={isMutating}
                        className="rounded-full border border-emerald-300/40 bg-transparent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-200 transition-all duration-300 hover:bg-emerald-300/10 focus:outline-none focus:ring-2 focus:ring-[#4edea3] disabled:opacity-40"
                      >
                        Reinstate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
