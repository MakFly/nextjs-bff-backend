import { p as redirect } from "../_chunks/_libs/@tanstack/router-core.mjs";
import { c as createRouter, a as createRootRouteWithContext, b as createFileRoute, l as lazyRouteComponent, O as Outlet, H as HeadContent, S as Scripts } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_chunks/_libs/react.mjs";
import { T as TanStackRouterDevtoolsPanel } from "../_chunks/_libs/@tanstack/react-router-devtools.mjs";
import { T as TanStackDevtools } from "../_chunks/_libs/@tanstack/react-devtools.mjs";
import { J, z } from "../_libs/next-themes.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./index.mjs";
import { c as create } from "../_libs/zustand.mjs";
import { L as LoaderCircle, O as OctagonX, T as TriangleAlert, I as Info, C as CircleCheck } from "../_libs/lucide-react.mjs";
import "../_chunks/_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/tiny-warning.mjs";
import "../_chunks/_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_chunks/_libs/@tanstack/devtools.mjs";
import "node:async_hooks";
const appCss = "/assets/styles-CebSr2dU.css";
const Toaster = ({ ...props }) => {
  const { theme = "system", resolvedTheme } = z();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      theme: resolvedTheme ?? theme,
      className: "toaster group",
      richColors: true,
      icons: {
        success: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }),
        info: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-4" }),
        warning: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4" }),
        error: /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonX, { className: "size-4" }),
        loading: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" })
      },
      style: {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)"
      },
      toastOptions: {
        classNames: {
          toast: "cn-toast"
        }
      },
      ...props
    }
  );
};
function ThemeProvider({
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    J,
    {
      attribute: "class",
      defaultTheme: "dark",
      enableSystem: true,
      disableTransitionOnChange: true,
      storageKey: "ui-theme",
      ...props,
      children
    }
  );
}
const createSsrRpc = (functionId, importer) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    const serverFn = await getServerFnById(functionId);
    return serverFn(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const loginFn = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(createSsrRpc("c833b877e95a830e50a8701ab1f8d7e4ee0d91d0ff26c91b9d2a6d517510dc99"));
const registerFn = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(createSsrRpc("45280bcad0cbaef0249b9266840e3e84186ba9c130d7fd65c23401620db41dc9"));
const logoutFn = createServerFn({
  method: "POST"
}).handler(createSsrRpc("11187666f1dc17722763bd44c34030ba5781e256f7e5d4089eb6d560714404b9"));
const getCurrentUserFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("52b278cd5f2cd78059dd8070825943e5d7231514ed87d25bb929795cc5caff4a"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("781d51dc057199d9ddf12871dc6144ddd9ec4a84e0b4ba2055cea3a022e3ea89"));
const getOAuthUrlFn = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(createSsrRpc("cba48e5dfb9016e9b2d8c03f0636ce8582b3a98d31652ab501f25b9043fab876"));
function hasPermission(user, resource, action) {
  return user.permissions.some((p) => p.resource === resource && (p.action === action || p.action === "manage"));
}
function hasRole(user, roleSlug) {
  return user.roles.some((r) => r.slug === roleSlug);
}
function isAdmin(user) {
  return hasRole(user, "admin");
}
const useAuthStore = create((set, get) => ({
  user: null,
  isHydrated: false,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  hydrate: (user) => set({ user, isHydrated: true }),
  login: async (credentials) => {
    set({ error: null, isLoading: true });
    try {
      const response = await loginFn({ data: credentials });
      set({ user: response.user, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      set({ error: message, isLoading: false });
      throw err;
    }
  },
  register: async (data) => {
    set({ error: null, isLoading: true });
    try {
      const response = await registerFn({ data });
      set({ user: response.user, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      set({ error: message, isLoading: false });
      throw err;
    }
  },
  logout: async () => {
    set({ error: null, isLoading: true });
    try {
      await logoutFn();
      set({ user: null, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      set({ error: message, user: null, isLoading: false });
    }
  },
  refreshUser: async () => {
    set({ error: null });
    try {
      const user = await getCurrentUserFn();
      set({ user });
    } catch (err) {
      set({ user: null });
      const message = err instanceof Error ? err.message : "Failed to refresh user";
      set({ error: message });
      throw err;
    }
  },
  loginWithOAuth: async (provider) => {
    try {
      const { url } = await getOAuthUrlFn({ data: { provider } });
      window.location.href = url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "OAuth redirect failed";
      set({ error: message });
      throw err;
    }
  },
  clearError: () => set({ error: null }),
  isAuthenticated: () => !!get().user,
  hasPermission: (resource, action) => {
    const { user } = get();
    if (!user) return false;
    return hasPermission(user, resource, action);
  },
  hasRole: (roleSlug) => {
    const { user } = get();
    if (!user) return false;
    return hasRole(user, roleSlug);
  },
  isAdmin: () => {
    const { user } = get();
    if (!user) return false;
    return isAdmin(user);
  }
}));
const Route$9 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RBAC Panel" }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  beforeLoad: async () => {
    try {
      const user = await getCurrentUserFn();
      return { user };
    } catch {
      return { user: null };
    }
  },
  shellComponent: RootDocument,
  component: RootComponent,
  notFoundComponent: NotFound
});
function NotFound() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen gap-4 p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-mono text-6xl font-bold text-[var(--neon)]", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Page not found" })
  ] });
}
function RootComponent() {
  const context = Route$9.useRouteContext();
  const hydrate = useAuthStore((s) => s.hydrate);
  reactExports.useEffect(() => {
    hydrate(context.user);
  }, [context.user, hydrate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
}
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('ui-theme');
                  var theme = stored || 'dark';
                  if (theme === 'system') {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              })();
            `
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(ThemeProvider, { children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TanStackDevtools,
          {
            config: { position: "bottom-right" },
            plugins: [
              {
                name: "Tanstack Router",
                render: /* @__PURE__ */ jsxRuntimeExports.jsx(TanStackRouterDevtoolsPanel, {})
              }
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$8 = () => import("./dashboard-D2UrLkii.mjs");
const Route$8 = createFileRoute("/dashboard")({
  beforeLoad: ({
    context,
    location
  }) => {
    if (!context.user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href
        }
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./_auth-yP_Aw4YS.mjs");
const Route$7 = createFileRoute("/_auth")({
  beforeLoad: ({
    context
  }) => {
    if (context.user) {
      throw redirect({
        to: "/dashboard"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./index-C3_ADcgy.mjs");
const Route$6 = createFileRoute("/")({
  beforeLoad: ({
    context
  }) => {
    if (context.user) {
      throw redirect({
        to: "/dashboard"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./index-BCb2xhl-.mjs");
const Route$5 = createFileRoute("/dashboard/")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./users-brHvZSd9.mjs");
const Route$4 = createFileRoute("/dashboard/users")({
  beforeLoad: ({
    context
  }) => {
    const isAdmin2 = context.user?.roles?.some((r) => r.slug === "admin");
    if (!isAdmin2) {
      throw redirect({
        to: "/dashboard"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./settings-DCK_E4i_.mjs");
const Route$3 = createFileRoute("/dashboard/settings")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./roles-BIQEawe7.mjs");
const Route$2 = createFileRoute("/dashboard/roles")({
  beforeLoad: ({
    context
  }) => {
    const isAdmin2 = context.user?.roles?.some((r) => r.slug === "admin");
    if (!isAdmin2) {
      throw redirect({
        to: "/dashboard"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./register-BaLVLkd4.mjs");
const Route$1 = createFileRoute("/_auth/register")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./login-Bdi-nfhj.mjs");
const Route = createFileRoute("/_auth/login")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const DashboardRoute = Route$8.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$9
});
const AuthRoute = Route$7.update({
  id: "/_auth",
  getParentRoute: () => Route$9
});
const IndexRoute = Route$6.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$9
});
const DashboardIndexRoute = Route$5.update({
  id: "/",
  path: "/",
  getParentRoute: () => DashboardRoute
});
const DashboardUsersRoute = Route$4.update({
  id: "/users",
  path: "/users",
  getParentRoute: () => DashboardRoute
});
const DashboardSettingsRoute = Route$3.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => DashboardRoute
});
const DashboardRolesRoute = Route$2.update({
  id: "/roles",
  path: "/roles",
  getParentRoute: () => DashboardRoute
});
const AuthRegisterRoute = Route$1.update({
  id: "/register",
  path: "/register",
  getParentRoute: () => AuthRoute
});
const AuthLoginRoute = Route.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => AuthRoute
});
const AuthRouteChildren = {
  AuthLoginRoute,
  AuthRegisterRoute
};
const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren);
const DashboardRouteChildren = {
  DashboardRolesRoute,
  DashboardSettingsRoute,
  DashboardUsersRoute,
  DashboardIndexRoute
};
const DashboardRouteWithChildren = DashboardRoute._addFileChildren(
  DashboardRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AuthRoute: AuthRouteWithChildren,
  DashboardRoute: DashboardRouteWithChildren
};
const routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: {
      user: null
    }
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$8 as R,
  router as r,
  useAuthStore as u
};
