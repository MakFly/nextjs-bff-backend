import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import type { RouterContext } from './types/router'

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: {
      user: null,
    } satisfies RouterContext,
  })

  return router
}
