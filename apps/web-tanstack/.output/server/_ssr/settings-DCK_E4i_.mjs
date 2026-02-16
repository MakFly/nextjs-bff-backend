import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { B as Button } from "./button-DItiwabu.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-Br7qobwT.mjs";
import { I as Input } from "./input-B66ag17B.mjs";
import { L as Label } from "./label-Cp5Wz1sX.mjs";
import { u as useAuthStore } from "./router-BarhrSOS.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_chunks/_libs/@radix-ui/react-slot.mjs";
import "../_chunks/_libs/@radix-ui/react-compose-refs.mjs";
import "../_chunks/_libs/@radix-ui/react-label.mjs";
import "../_chunks/_libs/@radix-ui/react-primitive.mjs";
import "../_chunks/_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_chunks/_libs/@tanstack/router-core.mjs";
import "../_chunks/_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "node:stream/web";
import "node:stream";
import "../_chunks/_libs/@tanstack/react-router.mjs";
import "../_libs/tiny-warning.mjs";
import "../_libs/isbot.mjs";
import "../_chunks/_libs/@tanstack/react-router-devtools.mjs";
import "../_chunks/_libs/@tanstack/react-devtools.mjs";
import "../_chunks/_libs/@tanstack/devtools.mjs";
import "../_libs/next-themes.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "node:async_hooks";
import "../_libs/zustand.mjs";
import "../_libs/lucide-react.mjs";
function SettingsForm() {
  const user = useAuthStore((s) => s.user);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Update your personal information." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", defaultValue: user?.name ?? "" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", defaultValue: user?.email ?? "", disabled: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "bg-[var(--neon)] text-black hover:bg-[var(--neon)]/90", children: "Save Changes" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Security" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Update your password." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "current_password", children: "Current Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "current_password", type: "password" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "new_password", children: "New Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "new_password", type: "password" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "confirm_password", children: "Confirm New Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "confirm_password", type: "password" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Update Password" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-destructive/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-destructive", children: "Danger Zone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Irreversible actions." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", children: "Delete Account" }) })
    ] })
  ] });
}
function SettingsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Manage your account settings." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsForm, {})
  ] });
}
export {
  SettingsPage as component
};
