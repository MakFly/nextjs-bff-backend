import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { u as useReactTable, f as flexRender } from "../_chunks/_libs/@tanstack/react-table.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { B as Button } from "./button-DItiwabu.mjs";
import { I as Input } from "./input-B66ag17B.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuLabel, d as DropdownMenuSeparator, g as DropdownMenuCheckboxItem } from "./dropdown-menu-C32ACxU3.mjs";
import { j as Eye, m as ChevronsLeft, n as ChevronLeft, o as ChevronRight, p as ChevronsRight, q as ArrowUp, r as ArrowDown, s as ArrowUpDown } from "../_libs/lucide-react.mjs";
import { g as getFilteredRowModel, a as getSortedRowModel, b as getPaginationRowModel, d as getCoreRowModel } from "../_chunks/_libs/@tanstack/table-core.mjs";
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-muted rounded-md animate-pulse", className),
      ...props
    }
  );
}
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-slot": "table-container", className: "relative w-full overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "table",
    {
      "data-slot": "table",
      className: cn("w-full caption-bottom text-sm", className),
      ...props
    }
  ) });
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0", className),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0", className),
      ...props
    }
  );
}
function DataTable({
  columns,
  data,
  search = {},
  pagination = {},
  columnVisibilityConfig = {},
  rowSelectionConfig = {},
  sort = {},
  actions = {},
  emptyState = {},
  loading = {},
  onPaginationChange,
  onSortingChange,
  onRowSelectionChange,
  className
}) {
  const searchEnabled = search.enabled ?? true;
  const paginationEnabled = pagination.enabled ?? true;
  const columnVisibilityEnabled = columnVisibilityConfig.enabled ?? false;
  const rowSelectionEnabled = rowSelectionConfig.enabled ?? false;
  const sortEnabled = sort.enabled ?? true;
  const loadingEnabled = loading.enabled ?? false;
  const [sorting, setSorting] = reactExports.useState([]);
  const [columnFilters, setColumnFilters] = reactExports.useState(
    []
  );
  const [columnVisibility, setColumnVisibility] = reactExports.useState({});
  const [rowSelection, setRowSelection] = reactExports.useState({});
  const [globalFilter, setGlobalFilter] = reactExports.useState("");
  const pageSize = pagination.pageSize ?? 10;
  const pageSizeOptions = pagination.pageSizeOptions ?? [10, 25, 50, 100];
  const [paginationState, setPaginationState] = reactExports.useState(
    {
      pageIndex: 0,
      pageSize
    }
  );
  const handlePaginationChange = (updater) => {
    const newPagination = typeof updater === "function" ? updater(paginationState) : updater;
    setPaginationState(newPagination);
    onPaginationChange?.(newPagination);
  };
  const handleSortingChange = (updater) => {
    const newSorting = typeof updater === "function" ? updater(sorting) : updater;
    setSorting(newSorting);
    onSortingChange?.(newSorting);
  };
  const handleRowSelectionChange = (updater) => {
    const newSelection = typeof updater === "function" ? updater(rowSelection) : updater;
    setRowSelection(newSelection);
    onRowSelectionChange?.(newSelection);
  };
  const table = useReactTable({
    data,
    columns,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: handlePaginationChange,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: handleRowSelectionChange,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: paginationEnabled ? getPaginationRowModel() : void 0,
    getSortedRowModel: sortEnabled ? getSortedRowModel() : void 0,
    getFilteredRowModel: searchEnabled ? getFilteredRowModel() : void 0,
    globalFilterFn: "includesString",
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: paginationState,
      globalFilter
    }
  });
  reactExports.useEffect(() => {
    if (searchEnabled && search.keys && search.keys.length > 0) {
      const searchValue = globalFilter;
      if (searchValue) {
        table.setPageIndex(0);
      }
    }
  }, [globalFilter, searchEnabled, search.keys, table]);
  const renderSortIcon = (header) => {
    if (!sortEnabled || !header.column.getCanSort()) return null;
    const sorted = header.column.getIsSorted();
    if (sorted === "asc") return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "ml-2 size-4" });
    if (sorted === "desc") return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "ml-2 size-4" });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "ml-2 size-4 opacity-50" });
  };
  const renderLoadingRows = () => {
    const rowCount = loading.rowCount ?? pageSize;
    return Array.from({ length: rowCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: columns.map((_2, colIndex) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, colIndex)) }, i));
  };
  const renderEmptyState = () => {
    const message = emptyState.message ?? "No results found";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: columns.length, className: "h-24 text-center", children: loadingEnabled ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-2", children: renderLoadingRows() }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
      emptyState.icon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: emptyState.icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: message }),
      emptyState.action && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: emptyState.action.onClick,
          children: emptyState.action.label
        }
      )
    ] }) }) });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `space-y-4 ${className ?? ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
      searchEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: search.placeholder ?? "Search...",
          value: globalFilter ?? "",
          onChange: (event) => setGlobalFilter(event.target.value),
          className: columnVisibilityEnabled || actions.enabled ? "max-w-sm" : "max-w-xs"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        columnVisibilityEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "ml-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "mr-2 size-4" }),
            "Columns"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { children: "Toggle columns" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
            table.getAllColumns().filter((column) => column.getCanHide()).map((column) => {
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                DropdownMenuCheckboxItem,
                {
                  className: "capitalize",
                  checked: column.getIsVisible(),
                  onCheckedChange: (value) => column.toggleVisible(!!value),
                  children: column.id
                },
                column.id
              );
            })
          ] })
        ] }),
        actions.enabled && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", children: actions.label ?? "Actions" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuContent, { align: "end", children: actions.items?.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DropdownMenuCheckboxItem,
            {
              onCheckedChange: () => {
              },
              className: item.variant === "destructive" ? "text-destructive" : "",
              children: [
                item.icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: item.icon }),
                item.label
              ]
            },
            index
          )) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: headerGroup.headers.map((header) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: header.isPlaceholder ? null : sortEnabled && header.column.getCanSort() ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "flex items-center",
          onClick: () => header.column.toggleSorting(),
          children: [
            flexRender(
              header.column.columnDef.header,
              header.getContext()
            ),
            renderSortIcon(header)
          ]
        }
      ) : flexRender(
        header.column.columnDef.header,
        header.getContext()
      ) }, header.id)) }, headerGroup.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: loadingEnabled ? renderLoadingRows() : table.getRowModel().rows?.length ? table.getRowModel().rows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TableRow,
        {
          "data-state": row.getIsSelected() && "selected",
          children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: flexRender(
            cell.column.columnDef.cell,
            cell.getContext()
          ) }, cell.id))
        },
        row.id
      )) : renderEmptyState() })
    ] }) }),
    paginationEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        rowSelectionEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
          table.getFilteredSelectedRowModel().rows.length,
          " of",
          " ",
          table.getFilteredRowModel().rows.length,
          " row(s) selected"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
          table.getFilteredRowModel().rows.length,
          " row(s)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Rows per page" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              className: "h-8 w-[70px] rounded-md border border-input bg-background px-2 text-sm",
              value: paginationState.pageSize,
              onChange: (e) => {
                table.setPageSize(Number(e.target.value));
              },
              children: pageSizeOptions.map((size) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: size, children: size }, size))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium", children: [
          paginationState.pageIndex + 1,
          " / ",
          table.getPageCount()
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              className: "size-8",
              onClick: () => table.setPageIndex(0),
              disabled: !table.getCanPreviousPage(),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsLeft, { className: "size-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              className: "size-8",
              onClick: () => table.previousPage(),
              disabled: !table.getCanPreviousPage(),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              className: "size-8",
              onClick: () => table.nextPage(),
              disabled: !table.getCanNextPage(),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              className: "size-8",
              onClick: () => table.setPageIndex(table.getPageCount() - 1),
              disabled: !table.getCanNextPage(),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsRight, { className: "size-4" })
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  DataTable as D
};
