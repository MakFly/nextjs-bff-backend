import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { D as DataTable } from "./data-table-CTr9HqVh.mjs";
import { B as Badge } from "./badge-D2nuHzhh.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuLabel, f as DropdownMenuItem, d as DropdownMenuSeparator } from "./dropdown-menu-C32ACxU3.mjs";
import { B as Button } from "./button-DItiwabu.mjs";
import { E as Ellipsis, j as Eye, k as SquarePen, l as Trash } from "../_libs/lucide-react.mjs";
import "../_chunks/_libs/@tanstack/react-table.mjs";
import "../_chunks/_libs/@tanstack/table-core.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./input-B66ag17B.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_chunks/_libs/@radix-ui/react-slot.mjs";
import "../_chunks/_libs/@radix-ui/react-compose-refs.mjs";
import "../_chunks/_libs/@radix-ui/react-dropdown-menu.mjs";
import "../_chunks/_libs/@radix-ui/primitive.mjs";
import "../_chunks/_libs/@radix-ui/react-context.mjs";
import "../_chunks/_libs/@radix-ui/react-use-controllable-state.mjs";
import "../_chunks/_libs/@radix-ui/react-use-layout-effect.mjs";
import "../_chunks/_libs/@radix-ui/react-primitive.mjs";
import "../_chunks/_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
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
const mockRoles = [
  {
    id: 1,
    name: "Admin",
    slug: "admin",
    permissions: 12,
    description: "Full access to all features"
  },
  {
    id: 2,
    name: "Moderator",
    slug: "moderator",
    permissions: 8,
    description: "Can manage content and users"
  },
  {
    id: 3,
    name: "User",
    slug: "user",
    permissions: 3,
    description: "Basic access to the platform"
  },
  {
    id: 4,
    name: "Editor",
    slug: "editor",
    permissions: 5,
    description: "Can create and edit content"
  },
  {
    id: 5,
    name: "Viewer",
    slug: "viewer",
    permissions: 2,
    description: "Read-only access"
  },
  {
    id: 6,
    name: "Super Admin",
    slug: "superadmin",
    permissions: 15,
    description: "Root access"
  },
  {
    id: 7,
    name: "Contributor",
    slug: "contributor",
    permissions: 4,
    description: "Can contribute content"
  },
  {
    id: 8,
    name: "Analyst",
    slug: "analyst",
    permissions: 6,
    description: "Access to analytics"
  }
];
const roleColumns = [
  {
    accessorKey: "name",
    header: "Role"
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: row.original.slug })
  },
  {
    accessorKey: "description",
    header: "Description"
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: row.original.permissions })
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const role = row.original;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "size-8 p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { children: "Actions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => console.log("View", role.id), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "mr-2 size-4" }),
            "View"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => console.log("Edit", role.id), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "mr-2 size-4" }),
            "Edit"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DropdownMenuItem,
            {
              className: "text-destructive",
              onClick: () => console.log("Delete", role.id),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "mr-2 size-4" }),
                "Delete"
              ]
            }
          )
        ] })
      ] });
    }
  }
];
function RolesTable() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DataTable,
    {
      columns: roleColumns,
      data: mockRoles,
      search: {
        enabled: true,
        placeholder: "Search roles..."
      },
      pagination: {
        enabled: true,
        pageSize: 5,
        pageSizeOptions: [5, 10, 25, 50]
      },
      sort: {
        enabled: true
      },
      columnVisibilityConfig: {
        enabled: true
      },
      emptyState: {
        message: "No roles found"
      }
    }
  );
}
function RolesPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Roles" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Manage roles and permissions." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RolesTable, {})
  ] });
}
export {
  RolesPage as component
};
