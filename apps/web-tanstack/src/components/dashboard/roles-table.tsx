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
  EditIcon,
  ShieldIcon,
} from 'lucide-react'

export interface Role {
  id: number
  name: string
  slug: string
  permissions: number
  description?: string
}

const mockRoles: Role[] = [
  {
    id: 1,
    name: 'Admin',
    slug: 'admin',
    permissions: 12,
    description: 'Full access to all features',
  },
  {
    id: 2,
    name: 'Moderator',
    slug: 'moderator',
    permissions: 8,
    description: 'Can manage content and users',
  },
  {
    id: 3,
    name: 'User',
    slug: 'user',
    permissions: 3,
    description: 'Basic access to the platform',
  },
  {
    id: 4,
    name: 'Editor',
    slug: 'editor',
    permissions: 5,
    description: 'Can create and edit content',
  },
  {
    id: 5,
    name: 'Viewer',
    slug: 'viewer',
    permissions: 2,
    description: 'Read-only access',
  },
  {
    id: 6,
    name: 'Super Admin',
    slug: 'superadmin',
    permissions: 15,
    description: 'Root access',
  },
  {
    id: 7,
    name: 'Contributor',
    slug: 'contributor',
    permissions: 4,
    description: 'Can contribute content',
  },
  {
    id: 8,
    name: 'Analyst',
    slug: 'analyst',
    permissions: 6,
    description: 'Access to analytics',
  },
]

export const roleColumns: ColumnDef<Role>[] = [
  {
    accessorKey: 'name',
    header: 'Role',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => <Badge variant="outline">{row.original.slug}</Badge>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.permissions}</Badge>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const role = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log('View', role.id)}>
              <EyeIcon className="mr-2 size-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Edit', role.id)}>
              <EditIcon className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => console.log('Delete', role.id)}
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

export function RolesTable() {
  return (
    <DataTable
      columns={roleColumns}
      data={mockRoles}
      search={{
        enabled: true,
        placeholder: 'Search roles...',
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
        message: 'No roles found',
      }}
    />
  )
}
