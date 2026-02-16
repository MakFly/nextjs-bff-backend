<?php

declare(strict_types=1);

namespace App\Controller\Api\V1;

use BetterAuth\Providers\PasswordResetProvider\PasswordResetProvider;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Password management controller.
 *
 * Endpoints:
 * - POST /api/v1/auth/password/forgot - Request password reset
 * - POST /api/v1/auth/password/reset - Reset password with token
 * - POST /api/v1/auth/password/verify-token - Verify reset token validity
 */
#[Route('/api/v1/auth/password', name: 'api_v1_auth_password_')]
class PasswordController extends AbstractController
{
    public function __construct(
        private readonly PasswordResetProvider $passwordResetProvider,
        private readonly ?LoggerInterface $logger = null,
        #[Autowire(env: 'FRONTEND_URL')]
        private readonly string $frontendUrl = 'http://localhost:3000',
    ) {
    }

    #[Route('/forgot', name: 'forgot', methods: ['POST'])]
    public function forgot(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true) ?? [];
            $email = $data['email'] ?? null;

            if (!$email) {
                return $this->json(['error' => 'Email is required'], 400);
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return $this->json(['error' => 'Invalid email format'], 422);
            }

            $callbackUrl = rtrim($this->frontendUrl, '/') . '/reset-password';
            $this->passwordResetProvider->sendResetEmail($email, $callbackUrl);

            $this->logger?->info('Password reset requested', ['email' => $email]);

            // Always return success to prevent email enumeration
            return $this->json([
                'message' => 'If an account exists with this email, a password reset link has been sent.',
                'expiresIn' => 3600,
            ]);
        } catch (\Exception $e) {
            $this->logger?->error('Password reset request failed', [
                'email' => $data['email'] ?? 'unknown',
                'error' => $e->getMessage(),
            ]);

            // Don't expose internal errors for security
            return $this->json([
                'message' => 'If an account exists with this email, a password reset link has been sent.',
            ]);
        }
    }

    #[Route('/reset', name: 'reset', methods: ['POST'])]
    public function reset(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true) ?? [];

            $token = $data['token'] ?? null;
            $password = $data['newPassword'] ?? $data['password'] ?? null;

            if (!$token || !$password) {
                return $this->json(['error' => 'Token and new password are required'], 400);
            }

            if (strlen($password) < 8) {
                return $this->json(['error' => 'Password must be at least 8 characters long'], 400);
            }

            $result = $this->passwordResetProvider->resetPassword($token, $password);

            if (!$result['success']) {
                $this->logger?->warning('Password reset failed - invalid token');

                return $this->json([
                    'error' => $result['error'] ?? 'Invalid or expired reset token',
                ], 400);
            }

            $this->logger?->info('Password reset successful');

            return $this->json([
                'message' => 'Password has been reset successfully',
                'success' => true,
            ]);
        } catch (\Exception $e) {
            $this->logger?->error('Password reset failed', ['error' => $e->getMessage()]);

            return $this->json(['error' => 'Invalid or expired reset token'], 400);
        }
    }

    #[Route('/verify-token', name: 'verify_token', methods: ['POST'])]
    public function verifyToken(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true) ?? [];
            $token = $data['token'] ?? null;

            if (!$token) {
                return $this->json(['error' => 'Token is required'], 400);
            }

            $result = $this->passwordResetProvider->verifyResetToken($token);

            if (!$result['valid']) {
                return $this->json([
                    'valid' => false,
                    'error' => 'Invalid or expired token',
                ], 400);
            }

            return $this->json([
                'valid' => true,
                'email' => $result['email'] ?? null,
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'valid' => false,
                'error' => 'Invalid or expired token',
            ], 400);
        }
    }
}
