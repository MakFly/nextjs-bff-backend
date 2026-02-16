import { createFileRoute, redirect } from '@tanstack/react-router'
import { RolesTable } from '@/components/dashboard/roles-table'

export const Route = createFileRoute('/dashboard/roles')({
  beforeLoad: ({ context }) => {
    const isAdmin = context.user?.roles?.some((r) => r.slug === 'admin')
    if (!isAdmin) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RolesPage,
})

function RolesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Roles</h2>
        <p className="text-muted-foreground">Manage roles and permissions.</p>
      </div>
      <RolesTable />
    </div>
  )
}
