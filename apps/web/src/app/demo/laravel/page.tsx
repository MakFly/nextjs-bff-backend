import { redirect } from 'next/navigation';

/**
 * Laravel demo index - redirect to dashboard
 */
export default function LaravelDemoPage() {
  redirect('/demo/laravel/dashboard');
}
