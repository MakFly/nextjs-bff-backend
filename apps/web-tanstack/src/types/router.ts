import type { User } from '@rbac/types'
import type { QueryClient } from '@tanstack/react-query'

export type RouterContext = {
  user: User | null
  expiresIn?: number | null
  queryClient?: QueryClient
}
