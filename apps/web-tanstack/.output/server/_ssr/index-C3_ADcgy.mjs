import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { G as GrainOverlay } from "./grain-overlay-DVLKdIXO.mjs";
import { L as Link } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { B as Button } from "./button-DItiwabu.mjs";
import { T as ThemeToggle } from "./theme-toggle-DH8P8Mck.mjs";
import { B as Badge } from "./badge-D2nuHzhh.mjs";
import { S as Shield, b as ShieldCheck, A as ArrowRight, U as Users, K as Key, d as Lock } from "../_libs/lucide-react.mjs";
import "../_libs/tiny-warning.mjs";
import "../_chunks/_libs/@tanstack/router-core.mjs";
import "../_chunks/_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "node:stream/web";
import "node:stream";
import "../_chunks/_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_chunks/_libs/@radix-ui/react-slot.mjs";
import "../_chunks/_libs/@radix-ui/react-compose-refs.mjs";
import "../_libs/next-themes.mjs";
import "./dropdown-menu-C32ACxU3.mjs";
import "../_chunks/_libs/@radix-ui/react-dropdown-menu.mjs";
import "../_chunks/_libs/@radix-ui/primitive.mjs";
import "../_chunks/_libs/@radix-ui/react-context.mjs";
import "../_chunks/_libs/@radix-ui/react-use-controllable-state.mjs";
import "../_chunks/_libs/@radix-ui/react-use-layout-effect.mjs";
import "../_chunks/_libs/@radix-ui/react-primitive.mjs";
import "../_chunks/_libs/@radix-ui/react-menu.mjs";
import "../_chunks/_libs/@radix-ui/react-collection.mjs";
import "../_chunks/_libs/@radix-ui/react-direction.mjs";
import "../_chunks/_libs/@radix-ui/react-dismissable-layer.mjs";
import "../_chunks/_libs/@radix-ui/react-use-callback-ref.mjs";
import "../_chunks/_libs/@radix-ui/react-use-escape-keydown.mjs";
import "../_chunks/_libs/@radix-ui/react-focus-guards.mjs";
import "../_chunks/_libs/@radix-ui/react-focus-scope.mjs";
import "../_chunks/_libs/@radix-ui/react-popper.mjs";
import "../_chunks/_libs/@floating-ui/react-dom.mjs";
import "../_chunks/_libs/@floating-ui/dom.mjs";
import "../_chunks/_libs/@floating-ui/core.mjs";
import "../_chunks/_libs/@floating-ui/utils.mjs";
import "../_chunks/_libs/@radix-ui/react-arrow.mjs";
import "../_chunks/_libs/@radix-ui/react-use-size.mjs";
import "../_chunks/_libs/@radix-ui/react-portal.mjs";
import "../_chunks/_libs/@radix-ui/react-presence.mjs";
import "../_chunks/_libs/@radix-ui/react-roving-focus.mjs";
import "../_chunks/_libs/@radix-ui/react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/tslib.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
function LandingNavbar() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed top-0 z-40 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "size-6 text-[var(--neon)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-lg font-bold tracking-tight", children: "RBAC Panel" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Sign In" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "bg-[var(--neon)] text-black hover:bg-[var(--neon)]/90", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", children: "Get Started" }) })
    ] })
  ] }) });
}
function HeroSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative flex min-h-[90vh] flex-col items-center justify-center px-6 pt-16 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--neon)]/20 bg-[var(--neon)]/5 px-4 py-1.5 text-sm text-[var(--neon)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4" }),
      "Role-Based Access Control"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "h1",
      {
        className: "animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both max-w-4xl font-mono text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl",
        style: { textShadow: "0 0 40px var(--neon-glow)" },
        children: [
          "Secure your app with",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--neon)]", children: "fine-grained" }),
          " ",
          "permissions"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both mt-6 max-w-2xl text-lg text-muted-foreground", children: "A production-ready boilerplate with multi-backend authentication, role-based access control, and a modern dark-first dashboard." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both mt-10 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "lg",
          className: "bg-[var(--neon)] text-black font-semibold hover:bg-[var(--neon)]/90 hover:shadow-[0_0_24px_var(--neon-glow)]",
          asChild: true,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/register", children: [
            "Get Started",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 size-4" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "lg", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Sign In" }) })
    ] })
  ] });
}
const features = [
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Define roles with granular permissions. Admin, moderator, user — fully customizable."
  },
  {
    icon: Users,
    title: "Multi-Backend Auth",
    description: "Swap between Laravel, Symfony, or Node.js backends with a single env variable."
  },
  {
    icon: Key,
    title: "Secure by Default",
    description: "HttpOnly cookies, HMAC-signed requests, CSRF protection built-in."
  },
  {
    icon: Lock,
    title: "BFF Architecture",
    description: "Backend-for-Frontend pattern keeps tokens server-side. Zero exposure to the client."
  }
];
function FeaturesGrid() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-6xl px-6 py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-12 text-center font-mono text-3xl font-bold tracking-tight", children: [
      "Built for ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--neon)]", children: "security" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 sm:grid-cols-2", children: features.map((feature) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "group rounded-xl border border-[var(--neon-muted)]/20 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-[var(--neon-muted)]/40 hover:shadow-[0_0_24px_var(--neon-glow)]",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(feature.icon, { className: "mb-4 size-8 text-[var(--neon)] transition-transform group-hover:scale-110" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2 font-mono text-lg font-semibold", children: feature.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: feature.description })
        ]
      },
      feature.title
    )) })
  ] });
}
const techs = [
  "TanStack Start",
  "React 19",
  "Vite 7",
  "TypeScript",
  "Tailwind CSS v4",
  "shadcn/ui",
  "Zustand",
  "Laravel",
  "Symfony",
  "Nitro SSR"
];
function TechStack() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-6xl px-6 pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-8 text-center font-mono text-2xl font-bold tracking-tight", children: "Tech Stack" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center justify-center gap-3", children: techs.map((tech, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "outline",
          className: "border-[var(--neon-muted)]/30 bg-[var(--neon)]/5 px-3 py-1 text-sm",
          children: tech
        }
      ),
      i < techs.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--neon)]/40 text-xs", children: "•" })
    ] }, tech)) })
  ] });
}
function LandingPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[var(--background-deep,var(--background))]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GrainOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LandingNavbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeroSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FeaturesGrid, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TechStack, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-white/5 py-8 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "RBAC Panel — Open Source Boilerplate" }) })
  ] });
}
export {
  LandingPage as component
};
