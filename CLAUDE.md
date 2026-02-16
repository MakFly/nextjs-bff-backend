# Laravel + Next.js + Symfony RBAC

## MCP - Codebase Search

**TOUJOURS utiliser les outils MCP `mcp__codebase__*` pour rechercher dans la codebase** :

- `codebase_search_code` - Rechercher du code (plus rapide que grep)
- `codebase_file_info` - Infos fichier (symbols, imports)
- `codebase_project_overview` - Vue d'ensemble du projet

Ces outils sont plus performants que grep/glob sur les grands projets.

## Architecture

Ce projet utilise une architecture **BFF (Backend For Frontend)** :

```
Navigateur → Next.js (BFF) → Laravel API
                          → Symfony API (BetterAuth)
```

- **Frontend** : Next.js App Router (`apps/web/`)
- **Backend Laravel** : Laravel avec Sanctum (`apps/api/`)
- **Backend Symfony** : Symfony 8 avec BetterAuth (`apps/api-sf/`)
- **Communication** : HMAC-signed requests entre BFF et backends

## Structure du projet

```
apps/
├── web/                    # Next.js App Router
│   └── src/
│       ├── app/api/v1/     # BFF Route Handlers (proxy vers backends)
│       └── lib/api/        # Server Actions pour l'auth
├── api/                    # Laravel API (port 8000)
└── api-sf/                 # Symfony API avec BetterAuth (port 8002)
```

## Commandes

```bash
# Monorepo
bun install                 # Installer les dépendances
bun run build               # Build tous les packages

# Web (Next.js)
bun run --filter @rbac/web dev      # Dev server (port 3000)
bun run --filter @rbac/web build    # Production build

# API Laravel (port 8000)
cd apps/api && php artisan serve

# API Symfony (port 8002)
cd apps/api-sf && symfony server:start --port=8002 --no-tls
```

## Authentification

### Laravel (Sanctum)

L'authentification utilise des **cookies HttpOnly** pour sécuriser les tokens.

### Symfony (BetterAuth)

Authentification stateless avec **tokens Paseto V4**.

Endpoints disponibles :

- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `GET /auth/me` - Utilisateur courant
- `POST /auth/refresh` - Rafraîchir le token
- `POST /auth/logout` - Déconnexion
- `GET /auth/2fa/status` - Statut 2FA
- `POST /auth/2fa/setup` - Configuration 2FA
- `GET /auth/oauth/providers` - Providers OAuth disponibles

### Flow d'authentification (Laravel)

1. Login via Server Action → BFF → Laravel
2. Laravel retourne `access_token`
3. BFF stocke le token dans un cookie HttpOnly `auth_token`
4. Les requêtes suivantes lisent le cookie et l'envoient à Laravel

### Flow d'authentification (Symfony)

1. Login via `POST /auth/login`
2. Symfony retourne `access_token` et `refresh_token`
3. Client stocke les tokens (localStorage ou cookie)
4. Les requêtes suivantes envoient le token via `Authorization: Bearer <token>`

## Fichiers clés

- `apps/web/src/app/api/v1/[...path]/route.ts` - BFF Proxy
- `apps/web/src/lib/api/auth.ts` - Server Actions auth
- `apps/api-sf/config/packages/better_auth.yaml` - Config BetterAuth

## Règles importantes

Voir `.claude/rules/` pour les règles détaillées :

- @.claude/rules/nextjs-server-actions-cookies.md

## Variables d'environnement

```env
# Web (.env.local)
NEXT_PUBLIC_APP_URL=http://localhost:3000
LARAVEL_API_URL=http://localhost:8000
SYMFONY_API_URL=http://localhost:8002
BFF_SECRET=xxx              # Pour HMAC signing

# API Laravel (.env)
APP_URL=http://localhost:8000
SANCTUM_STATEFUL_DOMAINS=localhost:3000

# API Symfony (.env)
APP_ENV=dev
DATABASE_URL="sqlite:///%kernel.project_dir%/var/data_dev.db"
BETTER_AUTH_SECRET=change_me_in_production
FRONTEND_URL=http://localhost:3000
```

## Tests

```bash
# Tests Symfony (api-sf)
cd apps/api-sf && php bin/phpunit

# Tests spécifiques auth
cd apps/api-sf && php bin/phpunit tests/Functional/Auth/
```
