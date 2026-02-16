import { Button } from '@/components/ui/button'

const accounts = [
  { label: 'Admin', email: 'admin@example.com', password: 'Admin1234!' },
  { label: 'User', email: 'test@test.com', password: 'Test1234!' },
  {
    label: 'Refresh Test (10s)',
    email: 'refresh-test@example.com',
    password: 'Refresh1234!',
  },
]

export function TestAccounts({
  onSelect,
}: {
  onSelect: (email: string, password: string) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-center text-xs text-muted-foreground">
        Quick fill test account
      </p>
      <div className="flex gap-2">
        {accounts.map((account) => (
          <Button
            key={account.label}
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => onSelect(account.email, account.password)}
          >
            {account.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
