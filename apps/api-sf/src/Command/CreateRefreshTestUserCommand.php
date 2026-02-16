<?php

declare(strict_types=1);

namespace App\Command;

use BetterAuth\Core\AuthManager;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:create-refresh-test-user',
    description: 'Create the refresh-test@example.com user for testing token refresh (10s expiry)',
)]
class CreateRefreshTestUserCommand extends Command
{
    private const EMAIL = 'refresh-test@example.com';
    private const PASSWORD = 'Refresh1234!';

    public function __construct(
        private readonly AuthManager $authManager,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $email = self::EMAIL;
        $password = self::PASSWORD;

        try {
            $this->authManager->signUp($email, $password, ['name' => 'Refresh Test']);
            $io->success("User {$email} created with password: {$password}");
        } catch (\Exception $e) {
            if (str_contains($e->getMessage(), 'already exists')) {
                $io->note("User {$email} already exists. Password unchanged.");
            } else {
                $io->error($e->getMessage());
                return Command::FAILURE;
            }
        }

        $io->writeln('Use "Refresh Test (10s)" in quick login to test token refresh flow.');

        return Command::SUCCESS;
    }
}
