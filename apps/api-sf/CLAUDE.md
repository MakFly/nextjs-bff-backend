# Symfony API avec BetterAuth

## Vue d'ensemble

API Symfony 8 utilisant **BetterAuth** pour l'authentification stateless avec tokens Paseto V4.

## Stack technique

- **Symfony** : 8.0
- **BetterAuth** : dev-main (authentification)
- **Doctrine ORM** : Base de données
- **API Platform** : Documentation OpenAPI (préfixe `/api/v1`)
- **Nelmio CORS** : Gestion CORS

## Commandes

```bash
# Serveur de développement (port 8002)
symfony server:start --port=8002 --no-tls

# Tests
php bin/phpunit
php bin/phpunit tests/Functional/Auth/

# Cache
php bin/console cache:clear

# Base de données
php bin/console doctrine:schema:create
php bin/console doctrine:migrations:migrate

# BetterAuth - Ajouter des contrôleurs
php bin/console better-auth:add-controller --list
php bin/console better-auth:add-controller auth
```

## Configuration BetterAuth

Fichier : `config/packages/better_auth.yaml`

```yaml
better_auth:
    mode: api                    # Stateless avec tokens Paseto V4
    secret: '%env(BETTER_AUTH_SECRET)%'
    token:
        lifetime: 3600           # Access token: 1 heure
        refresh_lifetime: 2592000 # Refresh token: 30 jours
    two_factor:
        enabled: true
    magic_link:
        enabled: true
    email_verification:
        enabled: true
    password_reset:
        enabled: true
```

## Endpoints d'authentification

### Routes BetterAuth natives (`/auth/*`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Inscription |
| POST | `/auth/login` | Connexion |
| GET | `/auth/me` | Utilisateur courant (token requis) |
| POST | `/auth/refresh` | Rafraîchir le token |
| POST | `/auth/logout` | Déconnexion |
| GET | `/auth/2fa/status` | Statut 2FA |
| POST | `/auth/2fa/setup` | Configurer 2FA |
| POST | `/auth/password/forgot` | Demande reset password |
| POST | `/auth/password/reset` | Reset password |
| GET | `/auth/oauth/providers` | Providers OAuth disponibles |

### Routes personnalisées (`/api/v1/auth/*`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/auth/register` | Inscription |
| POST | `/api/v1/auth/login` | Connexion |
| POST | `/api/v1/auth/login/2fa` | Login avec 2FA |
| GET | `/api/v1/auth/me` | Utilisateur courant |
| POST | `/api/v1/auth/refresh` | Rafraîchir le token |
| POST | `/api/v1/auth/logout` | Déconnexion |
| POST | `/api/v1/auth/revoke-all` | Révoquer toutes les sessions |
| POST | `/api/v1/auth/password/forgot` | Demande reset password |
| POST | `/api/v1/auth/password/reset` | Reset password |
| POST | `/api/v1/auth/password/verify-token` | Vérifier token reset |

## Format des requêtes/réponses

### Register
```bash
curl -X POST http://localhost:8002/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!","name":"User"}'
```

### Login
```bash
curl -X POST http://localhost:8002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!"}'
```

Réponse :
```json
{
  "user": {"id": "...", "email": "user@example.com", "name": "User"},
  "access_token": "v4.public.xxx",
  "refresh_token": "xxx",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

### Requête authentifiée
```bash
curl -X GET http://localhost:8002/api/v1/auth/me \
  -H "Authorization: Bearer v4.public.xxx"
```

### Refresh token
```bash
curl -X POST http://localhost:8002/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"xxx"}'
```

## Structure des fichiers

```
apps/api-sf/
├── config/
│   ├── packages/
│   │   ├── better_auth.yaml    # Config BetterAuth
│   │   ├── api_platform.yaml   # API Platform (prefix: /api/v1)
│   │   ├── doctrine.yaml       # Config Doctrine
│   │   ├── nelmio_cors.yaml    # Config CORS
│   │   └── security.yaml       # Config Security
│   └── routes/
│       └── api_platform.yaml   # Routes API Platform
├── src/
│   ├── Controller/
│   │   └── Api/
│   │       └── V1/
│   │           ├── AuthController.php      # Auth personnalisé
│   │           └── PasswordController.php  # Password reset
│   └── Entity/                 # Entités Doctrine (générées par BetterAuth)
│       ├── User.php
│       ├── Session.php
│       ├── RefreshToken.php
│       └── ...
├── tests/
│   └── Functional/
│       └── Auth/
│           ├── AuthenticationTest.php    # Tests auth natifs
│           ├── ApiV1AuthTest.php         # Tests /api/v1/auth/*
│           ├── PasswordResetTest.php     # Tests password reset
│           └── EndpointAccessTest.php    # Tests accessibilité
└── var/
    └── data_dev.db             # SQLite (développement)
```

## Création de contrôleurs personnalisés

**IMPORTANT** : Symfony utilise l'auto-discovery des contrôleurs via `config/routes.yaml`.
Ne pas créer de fichier yaml séparé pour les routes - les attributs `#[Route]` suffisent.

### Exemple de contrôleur

```php
// src/Controller/Api/V1/MonController.php
namespace App\Controller\Api\V1;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/v1/mon-endpoint', name: 'api_v1_mon_')]
class MonController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return $this->json(['data' => []]);
    }
}
```

**Note** : Le préfixe `/api/v1` doit être dans l'attribut `#[Route]` du contrôleur, pas dans un fichier yaml séparé.

## Variables d'environnement

```env
APP_ENV=dev
APP_SECRET=xxx
DATABASE_URL="sqlite:///%kernel.project_dir%/var/data_dev.db"
BETTER_AUTH_SECRET=change_me_in_production_32_chars_min
FRONTEND_URL=http://localhost:3000
MAILER_DSN=null://null
```

## Tests

52 tests fonctionnels couvrent l'authentification :

- Registration (valid, duplicate, invalid email, weak password)
- Login (valid, invalid password, non-existent user, 2FA)
- Token verification (valid, invalid, missing)
- Refresh token
- Logout
- Revoke all sessions
- Password forgot/reset/verify-token
- 2FA status
- OAuth providers

```bash
# Tous les tests
php bin/phpunit

# Tests auth uniquement
php bin/phpunit tests/Functional/Auth/

# Test spécifique
php bin/phpunit --filter=testLoginWithValidCredentials

# Tests API v1
php bin/phpunit --filter=ApiV1AuthTest
```

## Sécurité

- **Tokens Paseto V4** : Cryptographiquement sécurisés, non-JWT
- **Firewalls** :
  - Routes `/auth/*` publiques (BetterAuth natif)
  - Routes `/api/v1/auth/(register|login|password|refresh)` publiques
  - Routes `/api/*` protégées (IS_AUTHENTICATED_FULLY)
- **CORS** : Configuré pour `http://localhost:3000`
- **Password hashing** : Argon2id (auto)

## Notes importantes

1. **Mode API** : Pas de sessions côté serveur, tout est basé sur les tokens
2. **Refresh token** : Le body attend `refreshToken` (camelCase), pas `refresh_token`
3. **Response format** : Les tokens sont retournés en snake_case (`access_token`, `refresh_token`)
4. **Routes** : Symfony auto-découvre les contrôleurs, pas besoin de yaml pour les routes personnalisées
