import { createFileRoute, redirect } from '@tanstack/react-router'
import { UsersTable } from '@/components/dashboard/users-table'

export const Route = createFileRoute('/dashboard/users')({
  beforeLoad: ({ context }) => {
    const isAdmin = context.user?.roles?.some((r) => r.slug === 'admin')
    if (!isAdmin) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: UsersPage,
})

function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">Manage user accounts and roles.</p>
      </div>
      <UsersTable />
    </div>
  )
}
