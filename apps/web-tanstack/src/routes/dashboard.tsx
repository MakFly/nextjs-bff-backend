import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppLayout } from '@/components/app-layout'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const context = Route.useRouteContext()

  return (
    <AppLayout user={context.user ?? null}>
      <Outlet />
    </AppLayout>
  )
}
