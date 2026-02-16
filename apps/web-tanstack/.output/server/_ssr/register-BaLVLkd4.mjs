import { j as jsxRuntimeExports, r as reactExports } from "../_chunks/_libs/react.mjs";
import { u as useRouter, L as Link } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { B as Button } from "./button-DItiwabu.mjs";
import { I as Input } from "./input-B66ag17B.mjs";
import { L as Label } from "./label-Cp5Wz1sX.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-Br7qobwT.mjs";
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
import "../_chunks/_libs/@tanstack/react-router-devtools.mjs";
import "../_chunks/_libs/@tanstack/react-devtools.mjs";
import "../_chunks/_libs/@tanstack/devtools.mjs";
import "../_libs/next-themes.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "node:async_hooks";
import "../_libs/zustand.mjs";
import "../_libs/lucide-react.mjs";
function RegisterForm() {
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [passwordConfirmation, setPasswordConfirmation] = reactExports.useState("");
  const { register, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await register({ name, email, password, password_confirmation: passwordConfirmation });
      router.navigate({ to: "/dashboard" });
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md border-[var(--neon-muted)]/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-mono text-2xl", children: "Create account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Get started with RBAC Panel" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md bg-destructive/10 p-3 text-sm text-destructive", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "name",
              type: "text",
              placeholder: "John Doe",
              value: name,
              onChange: (e) => setName(e.target.value),
              required: true
            }
          )
        ] }),
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
              required: true,
              minLength: 8
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password_confirmation", children: "Confirm Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "password_confirmation",
              type: "password",
              placeholder: "••••••••",
              value: passwordConfirmation,
              onChange: (e) => setPasswordConfirmation(e.target.value),
              required: true,
              minLength: 8
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            className: "w-full bg-[var(--neon)] text-black hover:bg-[var(--neon)]/90",
            disabled: isLoading,
            children: isLoading ? "Creating account..." : "Create Account"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-center text-sm text-muted-foreground", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-[var(--neon)] hover:underline", children: "Sign in" })
      ] })
    ] })
  ] });
}
function RegisterPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RegisterForm, {});
}
export {
  RegisterPage as component
};
