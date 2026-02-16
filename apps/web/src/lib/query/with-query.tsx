'use client';

import { QueryProvider } from './provider';

export function WithQuery({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
