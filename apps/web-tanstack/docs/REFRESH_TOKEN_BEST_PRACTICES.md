# TanStack Start – Refresh Token Best Practices

## Ce que TanStack Start recommande

### 1. Sessions HTTP-only plutôt que JWT

Les docs privilégient les **sessions HTTP-only** (cookies) plutôt que JWT. Pour JWT, ils indiquent : *"Consider refresh token rotation"*.

### 2. État côté serveur

- `beforeLoad` pour vérifier l’auth à chaque navigation
- Server functions pour toute la logique sensible
- Pas de pattern officiel pour le refresh token dans TanStack Start

### 3. Pattern TanStack Query (adaptable)

Pour un refresh token centralisé :

- **QueryCache `onError`** : sur 401, déclencher le refresh
- **Flag de concurrence** : éviter plusieurs refresh en parallèle
- **`retry: false`** sur 401/400 : ne pas retenter tant que le refresh n’est pas fait

---

## Recommandations pour notre setup (JWT + Symfony)

| Aspect | Implé actuelle | Recommandation |
|--------|----------------|----------------|
| **Où déclencher le refresh** | Dans `TokenStatus` | Déplacer dans un **provider/hook** global (layout ou root) |
| **Proactif vs réactif** | Proactif (`shouldRefresh`) | Garder le proactif + ajouter un fallback sur 401 |
| **Concurrence** | `useRef` pour éviter les doublons | OK, à conserver |
| **Responsabilité** | `TokenStatus` = affichage + refresh | Séparer : `TokenStatus` = affichage, `useTokenRefresh` = logique de refresh |

---

## Améliorations possibles

1. **Extraire la logique de refresh** dans un hook `useTokenRefresh` ou un provider, et l’utiliser dans le layout root.
2. **Fallback sur 401** : si une Server Function renvoie 401, tenter un refresh puis relancer la requête (ou rediriger vers login si le refresh échoue).
3. **Centraliser** : un seul endroit qui gère le refresh (provider) plutôt que dans un composant d’UI.

---

## Références

- [TanStack Start Auth Guide](https://tanstack.com/start/latest/docs/framework/react/guide/authentication)
- [TanStack Start Auth Overview](https://tanstack.com/start/latest/docs/framework/react/guide/authentication-overview)
- [Better Auth + TanStack](https://better-auth.com/docs/integrations/tanstack)
- [Token refresh avec TanStack Query](https://akhilaariyachandra.com/blog/refreshing-an-authentication-in-token-in-tanstack-query) (pattern `QueryCache.onError`)
