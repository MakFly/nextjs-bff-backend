import { j as jsxRuntimeExports, r as reactExports } from "../_chunks/_libs/react.mjs";
import { u as useRouter, L as Link } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { B as Button } from "./button-DItiwabu.mjs";
import { I as Input } from "./input-B66ag17B.mjs";
import { L as Label } from "./label-Cp5Wz1sX.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-Br7qobwT.mjs";
import { S as Separator } from "./separator-CIwCB8fT.mjs";
import { u as useAuthStore } from "./router-BarhrSOS.mjs";
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
import "../_chunks/_libs/@radix-ui/react-label.mjs";
import "../_chunks/_libs/@radix-ui/react-primitive.mjs";
import "../_chunks/_libs/@radix-ui/react-separator.mjs";
import "../_chunks/_libs/@tanstack/react-router-devtools.mjs";
import "../_chunks/_libs/@tanstack/react-devtools.mjs";
import "../_chunks/_libs/@tanstack/devtools.mjs";
import "../_libs/next-themes.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "node:async_hooks";
import "../_libs/zustand.mjs";
import "../_libs/lucide-react.mjs";
function OAuthButtons({ onOAuth }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        type: "button",
        onClick: () => onOAuth("google"),
        className: "w-full",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "mr-2 size-4", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z",
                fill: "#4285F4"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
                fill: "#34A853"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
                fill: "#FBBC05"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
                fill: "#EA4335"
              }
            )
          ] }),
          "Google"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        type: "button",
        onClick: () => onOAuth("github"),
        className: "w-full",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "mr-2 size-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" }) }),
          "GitHub"
        ]
      }
    )
  ] });
}
const accounts = [
  { label: "Admin", email: "admin@example.com", password: "Admin1234!" },
  { label: "User", email: "test@test.com", password: "Test1234!" }
];
function TestAccounts({
  onSelect
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: "Quick fill test account" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: accounts.map((account) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        className: "flex-1 text-xs",
        onClick: () => onSelect(account.email, account.password),
        children: account.label
      },
      account.label
    )) })
  ] });
}
function LoginForm() {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const { login, loginWithOAuth, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await login({ email, password });
      router.navigate({ to: "/dashboard" });
    } catch {
    }
  };
  const handleTestAccount = (testEmail, testPassword) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md border-[var(--neon-muted)]/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-mono text-2xl", children: "Welcome back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Sign in to your account" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(OAuthButtons, { onOAuth: (provider) => loginWithOAuth(provider) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground", children: "or" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md bg-destructive/10 p-3 text-sm text-destructive", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "email",
              type: "email",
              placeholder: "you@example.com",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "password",
              type: "password",
              placeholder: "••••••••",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            className: "w-full bg-[var(--neon)] text-black hover:bg-[var(--neon)]/90",
            disabled: isLoading,
            children: isLoading ? "Signing in..." : "Sign In"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TestAccounts, { onSelect: handleTestAccount }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground", children: [
        "Don't have an account?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: "text-[var(--neon)] hover:underline", children: "Sign up" })
      ] })
    ] })
  ] });
}
function LoginPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LoginForm, {});
}
export {
  LoginPage as component
};
