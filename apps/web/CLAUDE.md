# Next.js Web App (BFF)

## Description

Application Next.js 15 avec App Router servant de BFF (Backend For Frontend) pour les APIs Laravel et Symfony.

## Stack technique

- **Framework** : Next.js 15 (App Router)
- **UI** : shadcn/ui + Tailwind CSS
- **State** : Zustand
- **Icônes** : lucide-react
- **Logger** : Pino (server) / Console (client/edge)

## Commandes

```bash
bun install          # Installer les dépendances
bun run build        # Build production (SEULEMENT si demandé)
bun run lint         # Linter le code
```

## Structure

```
src/
├── app/              # Routes App Router
│   ├── api/v1/       # BFF Route Handlers (proxy)
│   └── auth/         # Pages d'authentification
├── components/       # Composants React
│   └── ui/           # shadcn/ui components
├── lib/
│   ├── adapters/     # Adapters pour backends (Laravel, Symfony)
│   ├── api/          # Server Actions
│   └── logger/       # Système de logging Pino
├── stores/           # Zustand stores
└── middleware.ts     # Auth middleware (Edge)
```

## Logging

```typescript
import { createLogger } from '@/lib/logger';

const log = createLogger('mon-module');
log.info('Message', { context: 'valeur' });
log.error('Erreur', { error: err.message });
```

- **Server** : Pino avec pretty-print (dev) / JSON (prod)
- **Edge** : Logger JSON custom
- **Client** : Console uniquement

## Règles

Voir `.claude/rules/` pour les règles locales :

- `typescript-types-over-interfaces.md` - Préférer `type` à `interface`
- `data-fetching-strategy.md` - Server Actions par défaut, TanStack Query opt-in
- `server-actions-bff-client.md` - **CRITIQUE** : Toujours utiliser `bff-client.ts`

Voir aussi les règles du monorepo parent dans `../../.claude/rules/` :

- `nextjs-server-actions-cookies.md` - Gestion des cookies dans les Server Actions
