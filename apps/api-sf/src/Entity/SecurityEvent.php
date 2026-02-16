<?php

declare(strict_types=1);

namespace App\Entity;

use BetterAuth\Symfony\Model\SecurityEvent as BaseSecurityEvent;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

/**
 * SecurityEvent entity with UUID IDs.
 */
#[ORM\Entity]
#[ORM\Table(name: 'security_events')]
#[ORM\Index(columns: ['user_id'])]
#[ORM\Index(columns: ['event_type'])]
#[ORM\Index(columns: ['severity'])]
#[ORM\Index(columns: ['created_at'])]
class SecurityEvent extends BaseSecurityEvent
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME)]
    protected Uuid $id;

    #[ORM\Column(type: UuidType::NAME)]
    protected Uuid $userId;

    public function __construct()
    {
        parent::__construct();
        $this->id = Uuid::v7();
    }

    public function getId(): string|int|null
    {
        return $this->id->toRfc4122();
    }

    public function setId(string|int $id): static
    {
        $this->id = $id instanceof Uuid ? $id : Uuid::fromString((string) $id);

        return $this;
    }

    public function getUserId(): string|int
    {
        return $this->userId->toRfc4122();
    }

    public function setUserId(string|int $userId): static
    {
        $this->userId = $userId instanceof Uuid ? $userId : Uuid::fromString((string) $userId);

        return $this;
    }
}
