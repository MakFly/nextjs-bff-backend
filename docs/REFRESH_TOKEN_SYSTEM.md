# Système Unifié de Refresh Token

> Documentation complète du système de gestion automatique des tokens d'authentification.

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Flow de rafraîchissement](#flow-de-rafraîchissement)
- [Configuration](#configuration)
- [Fichiers impliqués](#fichiers-impliqués)
- [Séquences détaillées](#séquences-détaillées)
- [Sécurité](#sécurité)
- [Tests](#tests)

---

## Vue d'ensemble

Le système implémente une stratégie **Dual Token + Refresh Proactif** :

| Caractéristique | Valeur |
|-----------------|--------|
| Access Token | 1 heure (JWT) |
| Refresh Token | 30 jours |
| Refresh Proactif | < 5 minutes avant expiration |
| Rotation | Obligatoire (ancien token invalidé) |
| Stockage | Cookies HttpOnly (sécurisé) |

### Principes clés

1. **Tokens uniformes** : Tous les backends (Laravel, Symfony, Hono) émettent le même format
2. **Stockage sécurisé** : Cookies HttpOnly côté BFF (pas de localStorage)
3. **Refresh proactif** : Le BFF rafraîchit AVANT expiration (pas d'attente 401)
4. **401 Interceptor** : Backup si le proactif échoue
5. **Transparence** : Le client ne voit jamais les tokens

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              NAVIGATEUR                                      │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  Cookies visibles :                                                  │   │
│   │  └── token_expires_at (ISO timestamp) ← Pour indicateur UX          │   │
│   │                                                                      │   │
│   │  Cookies HttpOnly (invisibles au JS) :                              │   │
│   │  ├── auth_token      ← Access token JWT                             │   │
│   │  └── refresh_token   ← Refresh token                                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                       │
│                          fetch('/api/v1/...')                               │
│                                      │                                       │
└──────────────────────────────────────┼───────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS BFF (port 3000)                              │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                         MIDDLEWARE (Edge)                            │   │
│   │                                                                      │   │
│   │   1. Lit auth_token du cookie                                       │   │
│   │   2. Décode JWT (sans vérif signature) → extrait exp                │   │
│   │   3. Calcule temps restant                                          │   │
│   │   4. Si < 5 min → Ajoute header: x-bff-refresh-needed: true         │   │
│   │   5. Si expiré → Ajoute header: x-bff-refresh-needed: expired       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                       │
│                                      ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    ROUTE HANDLER (/api/v1/[...path])                 │   │
│   │                                                                      │   │
│   │   ┌─────────────────────────────────────────────────────────────┐   │   │
│   │   │  REFRESH PROACTIF                                            │   │   │
│   │   │                                                              │   │   │
│   │   │  Si header x-bff-refresh-needed présent :                   │   │   │
│   │   │  1. POST /auth/refresh vers backend                         │   │   │
│   │   │  2. Stocke nouveaux tokens en cookies                       │   │   │
│   │   │  3. Utilise nouveau token pour la requête                   │   │   │
│   │   └─────────────────────────────────────────────────────────────┘   │   │
│   │                              │                                       │   │
│   │                              ▼                                       │   │
│   │   ┌─────────────────────────────────────────────────────────────┐   │   │
│   │   │  PROXY VERS BACKEND                                          │   │   │
│   │   │                                                              │   │   │
│   │   │  → Authorization: Bearer {auth_token}                       │   │   │
│   │   │  → Headers HMAC (Laravel uniquement)                        │   │   │
│   │   └─────────────────────────────────────────────────────────────┘   │   │
│   │                              │                                       │   │
│   │                              ▼                                       │   │
│   │   ┌─────────────────────────────────────────────────────────────┐   │   │
│   │   │  401 INTERCEPTOR (backup)                                    │   │   │
│   │   │                                                              │   │   │
│   │   │  Si réponse 401 ET refresh_token existe :                   │   │   │
│   │   │  1. POST /auth/refresh vers backend                         │   │   │
│   │   │  2. Stocke nouveaux tokens                                  │   │   │
│   │   │  3. RETRY la requête originale                              │   │   │
│   │   │  4. Si échec refresh → Clear cookies + return 401           │   │   │
│   │   └─────────────────────────────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                       │
└──────────────────────────────────────┼───────────────────────────────────────┘
                                       │
           ┌───────────────────────────┼───────────────────────────┐
           │                           │                           │
           ▼                           ▼                           ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│   LARAVEL (8000)    │   │   SYMFONY (8002)    │   │    HONO (8003)      │
│                     │   │                     │   │                     │
│  ┌───────────────┐  │   │  ┌───────────────┐  │   │  ┌───────────────┐  │
│  │ Passport JWT  │  │   │  │  BetterAuth   │  │   │  │   jose JWT    │  │
│  │ access: 1h    │  │   │  │  Paseto V4    │  │   │  │  access: 1h   │  │
│  └───────────────┘  │   │  │  access: 1h   │  │   │  └───────────────┘  │
│                     │   │  └───────────────┘  │   │                     │
│  ┌───────────────┐  │   │                     │   │  ┌───────────────┐  │
│  │refresh_tokens │  │   │  ┌───────────────┐  │   │  │refresh_tokens │  │
│  │ table (30j)   │  │   │  │   sessions    │  │   │  │ table (30j)   │  │
│  │ + rotation    │  │   │  │    (30j)      │  │   │  │ + rotation    │  │
│  └───────────────┘  │   │  └───────────────┘  │   │  └───────────────┘  │
│                     │   │                     │   │                     │
│  SQLite / PgSQL     │   │  SQLite / MySQL     │   │  SQLite (Drizzle)   │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
```

---

## Flow de rafraîchissement

### 1. Login Initial

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │   BFF    │          │ Backend  │
└────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │
     │  POST /api/v1/auth/login                  │
     │  {email, password}  │                     │
     │────────────────────>│                     │
     │                     │                     │
     │                     │  POST /auth/login   │
     │                     │  + HMAC headers     │
     │                     │────────────────────>│
     │                     │                     │
     │                     │   {                 │
     │                     │     user,           │
     │                     │     access_token,   │
     │                     │     refresh_token,  │
     │                     │     expires_in      │
     │                     │   }                 │
     │                     │<────────────────────│
     │                     │                     │
     │  Set-Cookie:        │                     │
     │  - auth_token       │                     │
     │  - refresh_token    │                     │
     │  - token_expires_at │                     │
     │                     │                     │
     │  { user }           │                     │
     │<────────────────────│                     │
     │                     │                     │
```

### 2. Requête Normale (token valide > 5 min)

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │   BFF    │          │ Backend  │
└────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │
     │  GET /api/v1/users  │                     │
     │  Cookie: auth_token │                     │
     │────────────────────>│                     │
     │                     │                     │
     │          Middleware: token OK (> 5 min)   │
     │                     │                     │
     │                     │  GET /users         │
     │                     │  Bearer: auth_token │
     │                     │────────────────────>│
     │                     │                     │
     │                     │   { users: [...] }  │
     │                     │<────────────────────│
     │                     │                     │
     │   { users: [...] }  │                     │
     │<────────────────────│                     │
     │                     │                     │
```

### 3. Refresh Proactif (token expire dans < 5 min)

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │   BFF    │          │ Backend  │
└────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │
     │  GET /api/v1/users  │                     │
     │  Cookie: auth_token │                     │
     │────────────────────>│                     │
     │                     │                     │
     │    Middleware: token expire dans 3 min!   │
     │    → Header: x-bff-refresh-needed: true   │
     │                     │                     │
     │                     │  POST /auth/refresh │
     │                     │  {refresh_token}    │
     │                     │────────────────────>│
     │                     │                     │
     │                     │   {                 │
     │                     │     access_token,   │  ← Nouveau token
     │                     │     refresh_token,  │  ← Nouveau (rotation)
     │                     │     expires_in      │
     │                     │   }                 │
     │                     │<────────────────────│
     │                     │                     │
     │                     │  GET /users         │
     │                     │  Bearer: NEW_TOKEN  │  ← Utilise le nouveau
     │                     │────────────────────>│
     │                     │                     │
     │                     │   { users: [...] }  │
     │                     │<────────────────────│
     │                     │                     │
     │  Set-Cookie:        │                     │
     │  - auth_token (new) │                     │
     │  - refresh_token    │                     │
     │  - token_expires_at │                     │
     │                     │                     │
     │   { users: [...] }  │                     │
     │<────────────────────│                     │
     │                     │                     │

    ✨ Le client reçoit les données ET les nouveaux tokens
       sans interruption de service !
```

### 4. 401 Interceptor (token expiré, backup du proactif)

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │   BFF    │          │ Backend  │
└────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │
     │  GET /api/v1/users  │                     │
     │  Cookie: auth_token │                     │
     │────────────────────>│                     │
     │                     │                     │
     │                     │  GET /users         │
     │                     │  Bearer: EXPIRED    │
     │                     │────────────────────>│
     │                     │                     │
     │                     │   401 Unauthorized  │
     │                     │<────────────────────│
     │                     │                     │
     │         401 Interceptor activé!           │
     │                     │                     │
     │                     │  POST /auth/refresh │
     │                     │  {refresh_token}    │
     │                     │────────────────────>│
     │                     │                     │
     │                     │   { new tokens }    │
     │                     │<────────────────────│
     │                     │                     │
     │                     │  GET /users         │  ← RETRY
     │                     │  Bearer: NEW_TOKEN  │
     │                     │────────────────────>│
     │                     │                     │
     │                     │   { users: [...] }  │
     │                     │<────────────────────│
     │                     │                     │
     │  Set-Cookie: (new)  │                     │
     │   { users: [...] }  │                     │
     │<────────────────────│                     │
     │                     │                     │

    ✨ Le client ne voit jamais le 401 !
```

### 5. Session Expirée (refresh token invalide)

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │   BFF    │          │ Backend  │
└────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │
     │  GET /api/v1/users  │                     │
     │────────────────────>│                     │
     │                     │                     │
     │                     │  401 Unauthorized   │
     │                     │<────────────────────│
     │                     │                     │
     │                     │  POST /auth/refresh │
     │                     │────────────────────>│
     │                     │                     │
     │                     │  401 Invalid token  │  ← Refresh expiré
     │                     │<────────────────────│
     │                     │                     │
     │  Clear-Cookie:      │                     │
     │  - auth_token       │                     │
     │  - refresh_token    │                     │
     │  - token_expires_at │                     │
     │                     │                     │
     │  401 Session expired│                     │
     │  "Please log in"    │                     │
     │<────────────────────│                     │
     │                     │                     │

    → Le client doit se reconnecter
```

---

## Configuration

### Durées des tokens

| Token | Durée | Constante |
|-------|-------|-----------|
| Access Token | 1 heure | `TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE = 3600` |
| Refresh Token | 30 jours | `TOKEN_CONFIG.REFRESH_TOKEN_MAX_AGE = 2592000` |
| Seuil proactif | 5 minutes | `TOKEN_CONFIG.REFRESH_THRESHOLD = 300` |
| Seuil warning UX | 2 minutes | `TOKEN_CONFIG.WARNING_THRESHOLD = 120` |

### Cookies

| Cookie | HttpOnly | Usage |
|--------|----------|-------|
| `auth_token` | ✅ Oui | Access token JWT |
| `refresh_token` | ✅ Oui | Refresh token |
| `token_expires_at` | ❌ Non | Timestamp ISO pour UX client |

### Variables d'environnement

**BFF (Next.js)** - `apps/web/.env.local`
```env
AUTH_BACKEND=laravel|symfony|node
LARAVEL_API_URL=http://localhost:8000
SYMFONY_API_URL=http://localhost:8002
NODE_API_URL=http://localhost:8003
```

**Laravel** - `apps/api/.env`
```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

**Hono** - `apps/api-hono/.env`
```env
JWT_ACCESS_EXPIRES_IN=3600      # 1 heure
JWT_REFRESH_EXPIRES_IN=2592000  # 30 jours
```

---

## Fichiers impliqués

### BFF (Next.js)

| Fichier | Rôle |
|---------|------|
| `src/lib/services/token-service.ts` | Service de gestion des tokens (décodage JWT, calcul expiration) |
| `src/middleware.ts` | Détection proactive du besoin de refresh |
| `src/app/api/v1/[...path]/route.ts` | 401 interceptor + refresh proactif |
| `src/lib/adapters/base-adapter.ts` | Stockage cookies avec bonnes durées |
| `src/lib/adapters/proxy-config.ts` | Routes publiques (dont /refresh) |

### Laravel

| Fichier | Rôle |
|---------|------|
| `database/migrations/2026_01_30_*_create_refresh_tokens_table.php` | Table refresh_tokens |
| `app/Models/RefreshToken.php` | Model avec rotation |
| `app/Http/Controllers/Auth/RefreshTokenController.php` | Endpoint /refresh public |
| `app/Http/Controllers/Auth/AuthController.php` | Login/Register retournent refresh_token |
| `routes/api.php` | Route /auth/refresh (publique avec HMAC) |

### Hono

| Fichier | Rôle |
|---------|------|
| `src/services/auth.service.ts` | Service auth avec rotation refresh |
| `src/lib/jwt.ts` | Génération JWT avec bonnes durées |
| `src/routes/auth.routes.ts` | Routes auth |
| `.env` | Configuration durées tokens |

---

## Séquences détaillées

### Token Service (BFF)

```typescript
// apps/web/src/lib/services/token-service.ts

// Décode JWT sans vérification de signature
// (sécuritaire car on fait confiance au backend)
function decodeJwtPayload(token: string): JwtPayload | null

// Vérifie si refresh nécessaire
function shouldRefreshToken(token: string): boolean {
  const info = getTokenExpiration(token);
  return info?.remainingSeconds < TOKEN_CONFIG.REFRESH_THRESHOLD;
}
```

### Middleware (Edge Runtime)

```typescript
// apps/web/src/middleware.ts

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (shouldRefreshProactively(token)) {
    // Signal au route handler
    response.headers.set('x-bff-refresh-needed', 'true');
  }

  return response;
}
```

### Route Handler (401 Interceptor)

```typescript
// apps/web/src/app/api/v1/[...path]/route.ts

async function proxyRequest(...) {
  // 1. Check proactive refresh
  if (request.headers.get('x-bff-refresh-needed')) {
    const newTokens = await attemptTokenRefresh(config, backend, refreshToken);
    if (newTokens) authToken = newTokens.accessToken;
  }

  // 2. Make request
  const response = await fetch(backendUrl, { headers: { Authorization: `Bearer ${authToken}` } });

  // 3. 401 Interceptor
  if (response.status === 401 && refreshToken) {
    const newTokens = await attemptTokenRefresh(...);
    if (newTokens) {
      // Retry request
      response = await fetch(backendUrl, { headers: { Authorization: `Bearer ${newTokens.accessToken}` } });
      storeTokensInResponse(nextResponse, newTokens);
    }
  }
}
```

### Rotation Refresh Token (Laravel)

```php
// app/Models/RefreshToken.php

public static function rotate(string $oldRawToken): ?array
{
    $oldToken = self::findValidByToken($oldRawToken);
    if (!$oldToken) return null;

    $user = $oldToken->user;

    // Invalide l'ancien
    $oldToken->delete();

    // Crée un nouveau
    return self::createForUser($user);
}
```

---

## Sécurité

### Protection des tokens

| Mesure | Implémentation |
|--------|----------------|
| **Tokens invisibles** | Cookies HttpOnly (pas de JS access) |
| **CSRF Protection** | SameSite=Lax sur tous les cookies |
| **HTTPS** | Secure=true en production |
| **Rotation obligatoire** | Chaque refresh invalide l'ancien token |
| **Expiration courte** | Access token 1h max |
| **Cleanup automatique** | Tokens expirés supprimés de la DB |

### Stockage sécurisé

```
❌ localStorage/sessionStorage  → XSS vulnérable
❌ Cookie JS-accessible         → XSS vulnérable
✅ Cookie HttpOnly              → Protégé contre XSS
```

### HMAC (Laravel uniquement)

```
BFF → Laravel requiert signature HMAC :
- X-BFF-Id: identifiant du BFF
- X-BFF-Timestamp: horodatage
- X-BFF-Signature: HMAC-SHA256(timestamp:method:path:body_hash)
```

---

## Tests

### Tester le flow complet

```bash
# 1. Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  -c cookies.txt

# 2. Requête authentifiée
curl http://localhost:3000/api/v1/me \
  -b cookies.txt

# 3. Refresh manuel (pour test)
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

### Vérifier les cookies

```javascript
// Dans la console navigateur
document.cookie
// Devrait montrer uniquement: token_expires_at=2024-...
// auth_token et refresh_token sont HttpOnly (invisibles)
```

### Simuler expiration

```bash
# Modifier le token manuellement pour tester le 401 interceptor
# Ou attendre 55+ minutes pour tester le refresh proactif
```

---

## Troubleshooting

### Le refresh ne fonctionne pas

1. Vérifier que `/auth/refresh` est dans `publicRoutes` (proxy-config.ts)
2. Vérifier que le backend retourne `refresh_token` au login
3. Vérifier les logs BFF : `Token refresh failed`

### 401 en boucle

1. Le refresh_token est invalide/expiré
2. Vérifier la table `refresh_tokens` en DB
3. Clear les cookies et re-login

### Cookies non définis

1. Vérifier `sameSite: 'lax'` (pas 'strict' pour cross-origin)
2. Vérifier `secure: true` uniquement en HTTPS
3. Vérifier que le backend retourne les tokens dans le bon format

---

## Évolutions futures

- [ ] **Sliding session** : Étendre la durée à chaque activité
- [ ] **Multi-device** : Gestion des sessions par device
- [ ] **Revocation webhook** : Notifier le client en temps réel
- [ ] **Rate limiting** : Limiter les appels /refresh
- [ ] **Audit log** : Tracer les refresh pour détection d'anomalies
