import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type DemoLayoutProps = {
  children: React.ReactNode;
};

/**
 * Layout for demo pages
 *
 * Provides a consistent navigation header for backend demos
 */
export default function DemoLayout({ children }: DemoLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </Link>
              <div className="h-4 w-px bg-border" />
              <span className="text-sm font-medium">Backend Demos</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/demo/laravel"
                className="text-sm text-muted-foreground hover:text-red-600 transition-colors"
              >
                Laravel
              </Link>
              <Link
                href="/demo/symfony"
                className="text-sm text-muted-foreground hover:text-violet-600 transition-colors"
              >
                Symfony
              </Link>
              <Link
                href="/demo/hono"
                className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors"
              >
                Hono
              </Link>
              <div className="h-4 w-px bg-border" />
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard principal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
