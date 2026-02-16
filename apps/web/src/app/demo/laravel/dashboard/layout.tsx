import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { getCurrentUserAction } from '@/lib/actions/auth';
import { env } from '@/lib/config/env';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

/**
 * Layout SSR pour le dashboard
 *
 * - Vérifie l'authentification côté serveur (cookie check)
 * - Redirige vers /auth/login si non connecté
 * - Fetch le user côté serveur et le passe à AppSidebar pour éviter le flash
 */
export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Vérifier le cookie d'auth
  const cookieStore = await cookies();
  const authToken = cookieStore.get(env.AUTH_COOKIE_NAME);

  if (!authToken?.value) {
    redirect('/auth/login');
  }

  // Fetch le user côté serveur pour le render initial de la sidebar
  const initialUser = await getCurrentUserAction();

  return (
    <SidebarProvider>
      <AppSidebar initialUser={initialUser} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
