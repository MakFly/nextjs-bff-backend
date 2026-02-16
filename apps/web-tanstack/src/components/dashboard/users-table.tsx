'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from 'lucide-react'
import { EditIcon } from 'lucide-react'

export interface User {
  id: number
  name: string
  email: string
  roles: string[]
  status?: 'active' | 'inactive'
}

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    roles: ['admin'],
    status: 'active',
  },
  {
    id: 2,
    name: 'Moderator',
    email: 'moderator@example.com',
    roles: ['moderator'],
    status: 'active',
  },
  {
    id: 3,
    name: 'Regular User',
    email: 'user@example.com',
    roles: ['user'],
    status: 'inactive',
  },
  {
    id: 4,
    name: 'John Doe',
    email: 'john@example.com',
    roles: ['user'],
    status: 'active',
  },
  {
    id: 5,
    name: 'Jane Smith',
    email: 'jane@example.com',
    roles: ['editor'],
    status: 'active',
  },
  {
    id: 6,
    name: 'Bob Wilson',
    email: 'bob@example.com',
    roles: ['user'],
    status: 'inactive',
  },
  {
    id: 7,
    name: 'Alice Brown',
    email: 'alice@example.com',
    roles: ['moderator'],
    status: 'active',
  },
  {
    id: 8,
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    roles: ['editor'],
    status: 'active',
  },
]

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'roles',
    header: 'Roles',
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.roles.map((role) => (
          <Badge key={role} variant="secondary" className="text-xs">
            {role}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'default' : 'outline'}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log('View', user.id)}>
              <EyeIcon className="mr-2 size-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Edit', user.id)}>
              <EditIcon className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => console.log('Delete', user.id)}
            >
              <TrashIcon className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function UsersTable() {
  return (
    <DataTable
      columns={userColumns}
      data={mockUsers}
      search={{
        enabled: true,
        placeholder: 'Search users...',
      }}
      pagination={{
        enabled: true,
        pageSize: 5,
        pageSizeOptions: [5, 10, 25, 50],
      }}
      sort={{
        enabled: true,
      }}
      columnVisibilityConfig={{
        enabled: true,
      }}
      emptyState={{
        message: 'No users found',
      }}
    />
  )
}
