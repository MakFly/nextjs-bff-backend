export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Import dynamique pour éviter les problèmes avec Edge runtime
    const { basePino } = await import('@/lib/logger/server');

    // Remplacer console globalement pour capturer les logs Next.js internes
    const originalConsole = { ...console };

    console.log = (...args: unknown[]) => {
      basePino.info({ type: 'console.log' }, args.join(' '));
      originalConsole.log(...args);
    };

    console.info = (...args: unknown[]) => {
      basePino.info({ type: 'console.info' }, args.join(' '));
      originalConsole.info(...args);
    };

    console.warn = (...args: unknown[]) => {
      basePino.warn({ type: 'console.warn' }, args.join(' '));
      originalConsole.warn(...args);
    };

    console.error = (...args: unknown[]) => {
      basePino.error({ type: 'console.error' }, args.join(' '));
      originalConsole.error(...args);
    };

    console.debug = (...args: unknown[]) => {
      basePino.debug({ type: 'console.debug' }, args.join(' '));
      originalConsole.debug(...args);
    };

    basePino.info('Instrumentation registered');
  }
}
