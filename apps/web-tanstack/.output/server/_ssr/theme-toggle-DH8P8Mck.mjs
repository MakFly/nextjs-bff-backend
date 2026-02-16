import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { z } from "../_libs/next-themes.mjs";
import { B as Button } from "./button-DItiwabu.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, f as DropdownMenuItem } from "./dropdown-menu-C32ACxU3.mjs";
import { e as Sun, M as Moon, f as Monitor } from "../_libs/lucide-react.mjs";
function ThemeToggle() {
  const { setTheme } = z();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "icon", className: "size-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Toggle theme" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setTheme("light"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "mr-2 size-4" }),
        "Light"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setTheme("dark"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "mr-2 size-4" }),
        "Dark"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setTheme("system"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: "mr-2 size-4" }),
        "System"
      ] })
    ] })
  ] });
}
export {
  ThemeToggle as T
};
