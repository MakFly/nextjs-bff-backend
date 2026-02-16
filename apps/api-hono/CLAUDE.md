# API Hono - Backend Node.js

## Vue d'ensemble

Backend API REST construit avec **Hono** et **Bun**, conçu pour fonctionner avec le BFF Next.js via l'adapter `NodeAdapter`.

## Stack technique

- **Runtime**: Bun
- **Framework**: Hono
- **ORM**: Drizzle ORM
- **Base de données**: SQLite (Bun native)
- **Auth**: JWT avec jose
- **Validation**: Zod
- **Hashing**: Bun native bcrypt

## Architecture

```
src/
├── index.ts              # Point d'entrée serveur
├── types/                # Types TypeScript
├── db/                   # Base de données
│   ├── index.ts          # Connexion (bun:sqlite)
│   ├── schema.ts         # Schéma Drizzle
│   └── seed.ts           # Données initiales
├── lib/                  # Utilitaires
│   ├── hash.ts           # Hashing mots de passe
│   └── jwt.ts            # Génération/vérification JWT
├── repositories/         # Accès données (DAL)
│   ├── user.repository.ts
│   └── token.repository.ts
├── services/             # Logique métier
│   └── auth.service.ts
├── middleware/           # Middlewares Hono
│   └── auth.ts           # Auth JWT
├── handlers/             # Handlers de requêtes
│   ├── schemas.ts        # Schémas Zod
│   └── auth.handler.ts
└── routes/               # Définition des routes
    └── auth.routes.ts
```

## Commandes

```bash
# Développement
bun run dev               # Serveur avec hot-reload (port 8003)
bun run start             # Démarrer sans hot-reload

# Base de données
bun run db:generate       # Générer migration
bun run db:migrate        # Appliquer migrations
bun run db:push           # Push direct (dev only)
bun run db:seed           # Seed données initiales
bun run db:studio         # Interface Drizzle Studio

# Tests
bun test                  # Lancer tous les tests
bun test --watch          # Mode watch

# Qualité
bun run typecheck         # Vérification TypeScript
```

## Endpoints API

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Non | Health check |
| GET | `/health` | Non | Status |
| POST | `/api/v1/auth/register` | Non | Inscription |
| POST | `/api/v1/auth/login` | Non | Connexion |
| GET | `/api/v1/auth/me` | Oui | User courant |
| POST | `/api/v1/auth/refresh` | Non | Refresh token |
| POST | `/api/v1/auth/logout` | Oui | Déconnexion |
| GET | `/api/v1/auth/oauth/providers` | Non | SSO providers (Google, GitHub...) |

## Format des réponses

### Auth Response (login/register/refresh)

```json
{
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerifiedAt": null,
    "avatarUrl": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "roles": [{ "id": 1, "name": "User", "slug": "user" }]
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

**Note**: Les champs sont disponibles en camelCase ET snake_case pour compatibilité avec différents clients.

### Error Response

```json
{
  "error": "Message d'erreur",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `PORT` | Port du serveur | `8003` |
| `NODE_ENV` | Environnement | `development` |
| `DATABASE_URL` | Chemin SQLite | `./data.db` |
| `JWT_SECRET` | Secret JWT | (requis en prod) |
| `JWT_ACCESS_EXPIRES_IN` | Expiration access token (sec) | `3600` |
| `JWT_REFRESH_EXPIRES_IN` | Expiration refresh token (sec) | `604800` |
| `FRONTEND_URL` | URL frontend (CORS) | `http://localhost:3000` |

## Intégration avec Next.js BFF

Ce backend est conçu pour fonctionner avec l'adapter `NodeAdapter` du BFF Next.js.

### Configuration côté Next.js

```env
AUTH_BACKEND=node
NODE_API_URL=http://localhost:8003
NODE_AUTH_PREFIX=/api/v1/auth
```

### Mapping des endpoints

| BFF Path | API Hono Path |
|----------|---------------|
| `/api/v1/auth/login` | `/api/v1/auth/login` |
| `/api/v1/auth/register` | `/api/v1/auth/register` |
| `/api/v1/me` | `/api/v1/auth/me` |
| `/api/v1/auth/refresh` | `/api/v1/auth/refresh` |
| `/api/v1/auth/logout` | `/api/v1/auth/logout` |

## Tests

Les tests utilisent le test runner natif de Bun.

```bash
# Tous les tests
bun test

# Tests spécifiques
bun test src/tests/unit/        # Tests unitaires
bun test src/tests/integration/ # Tests d'intégration

# Avec coverage
bun test --coverage
```

## Migrations

**Important**: Toujours utiliser les migrations en production.

```bash
# 1. Modifier src/db/schema.ts
# 2. Générer la migration
bun run db:generate

# 3. Vérifier le SQL généré dans drizzle/
# 4. Appliquer
bun run db:migrate
```

## OAuth / SSO (Single Sign-On)

L'endpoint `/api/v1/auth/oauth/providers` retourne la liste des providers SSO disponibles.

### Providers supportés (à implémenter)

| Provider | Description |
|----------|-------------|
| `google` | Google OAuth 2.0 |
| `github` | GitHub OAuth |
| `apple` | Apple Sign In |
| `microsoft` | Microsoft / Azure AD |
| `facebook` | Facebook Login |

### Flow OAuth

1. `GET /api/v1/auth/oauth/providers` → Liste des providers disponibles
2. `GET /api/v1/auth/oauth/{provider}` → Redirige vers le provider (à implémenter)
3. `GET /api/v1/auth/oauth/{provider}/callback` → Callback après auth (à implémenter)

### Configuration (exemple)

```env
# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# GitHub OAuth
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
```

## Sécurité

- Mots de passe hashés avec bcrypt (cost 12)
- JWT signés avec HS256
- Refresh tokens stockés en DB et révocables
- CORS configuré pour le frontend uniquement
- Secure headers via middleware Hono
