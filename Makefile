.PHONY: help api api-reset api-sf api-sf-reset api-sf-user api-hono api-hono-reset api-hono-user

help:
	@echo "Available commands:"
	@echo "  make api             - Start Laravel API server (port 8000)"
	@echo "  make api-reset      - Reset Laravel API database + seed"
	@echo "  make api-sf         - Start Symfony API server (port 8002)"
	@echo "  make api-sf-reset   - Reset Symfony API database + create users"
	@echo "  make api-sf-user    - Create test user in Symfony API"
	@echo "  make api-hono      - Start Hono API server (port 8003)"
	@echo "  make api-hono-reset - Reset Hono API database + seed"

# Laravel API (port 8000) - Test users: admin@example.com / password
api:
	cd apps/api && php artisan serve --port=8000

api-reset:
	cd apps/api && php artisan migrate:fresh --seed
	@echo ""
	@echo "Test accounts (password: 'password'):"
	@echo "  - admin@example.com (admin)"
	@echo "  - mod@example.com (moderator)"
	@echo "  - user@example.com (user)"

# Symfony API (port 8002) - Test users: admin@example.com / Admin1234!
api-sf:
	cd apps/api-sf && composer install --ignore-platform-req=ext-gmp
	cd apps/api-sf && symfony server:start --port=8002 --no-tls

api-sf-reset:
	cd apps/api-sf && php bin/console doctrine:database:drop --force || true
	cd apps/api-sf && php bin/console doctrine:database:create
	cd apps/api-sf && php bin/console doctrine:schema:create
	@echo ""
	@echo "Creating test users..."
	cd apps/api-sf && curl -s -X POST http://localhost:8002/auth/register \
		-H "Content-Type: application/json" \
		-d '{"email":"admin@example.com","password":"Admin1234!","name":"Admin"}' > /dev/null
	cd apps/api-sf && curl -s -X POST http://localhost:8002/auth/register \
		-H "Content-Type: application/json" \
		-d '{"email":"test@test.com","password":"Test1234!","name":"Test User"}' > /dev/null
	@echo "Setting admin role..."
	cd apps/api-sf && php -r "\
		\$pdo = new PDO('sqlite:var/data_dev.db');\
		\$pdo->exec(\"UPDATE users SET roles = '\".json_encode(['ROLE_ADMIN','ROLE_USER']).\"' WHERE email = 'admin@example.com'\");\
	"
	@echo "Test accounts:"
	@echo "  - admin@example.com / Admin1234! (ADMIN)"
	@echo "  - test@test.com / Test1234!"

api-sf-user:
	@echo "Creating test user in Symfony API..."
	cd apps/api-sf && curl -s -X POST http://localhost:8002/auth/register \
		-H "Content-Type: application/json" \
		-d '{"email":"admin@example.com","password":"Admin1234!","name":"Admin"}' > /dev/null
	@echo "admin@example.com / Admin1234!"

# Hono API (port 8003) - No auth users in seed (only roles/permissions)
api-hono:
	cd apps/api-hono && bun run dev

api-hono-reset:
	cd apps/api-hono && rm -f data.db
	cd apps/api-hono && bun run db:push
	cd apps/api-hono && bun run db:seed
	@echo ""
	@echo "Note: Hono API seed only creates roles/permissions, no test users."
	@echo "Auth must be implemented separately (no BetterAuth)."
