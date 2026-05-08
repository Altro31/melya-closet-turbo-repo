"use client";

import * as React from "react";

import {
  type Column,
  type ColumnDef,
  type OnChangeFn,
  type Row,
  type SortingState,
  type Table as TanstackTable,
  type Updater,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Columns3Icon,
  XIcon,
} from "lucide-react";
import { useQueryStates } from "nuqs";

import SearchInput from "@/components/search-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { commonFiltersKeyMap } from "@/lib/nuqs";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends unknown, TValue> {
    headerClassName?: string;
    cellClassName?: string;
    label?: string;
  }
}

type DataTableRowClassName<TData> =
  | string
  | ((row: Row<TData>) => string | undefined);

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50];

export interface DataTableFilterField {
  columnId: string;
  placeholder?: string;
  label?: string;
  className?: string;
}

export interface DataTableSelectionContext<TData> {
  table: TanstackTable<TData>;
  selectedRows: Row<TData>[];
  selectedData: TData[];
  selectedIds: string[];
  selectedCount: number;
  isAllPageRowsSelected: boolean;
  isSomePageRowsSelected: boolean;
  clearSelection: () => void;
  selectAllPageRows: () => void;
  closeSelectionMode: () => void;
  enterSelectionMode: (row?: Row<TData>) => void;
  toggleRowSelection: (row: Row<TData>) => void;
}

export interface DataTableSelectionAction<TData> {
  key: string;
  label: string;
  onClick: (context: DataTableSelectionContext<TData>) => void;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost";
  disabled?:
    | boolean
    | ((context: DataTableSelectionContext<TData>) => boolean);
}

interface DataTableSelectionOptions<TData> {
  bulkActions?: DataTableSelectionAction<TData>[];
  longPressMs?: number;
  onSelectionChange?: (selectedData: TData[]) => void;
  getContextMenuContent?: (
    row: Row<TData>,
    context: DataTableSelectionContext<TData>
  ) => React.ReactNode;
}

interface DataTablePaginationOptions {
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalRecords?: number;
  emptyMessage?: React.ReactNode;
  className?: string;
  tableClassName?: string;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  getRowClassName?: DataTableRowClassName<TData>;
  enableColumnVisibility?: boolean;
  pagination?: boolean | DataTablePaginationOptions;
  toolbar?:
    | React.ReactNode
    | ((table: TanstackTable<TData>) => React.ReactNode);
  initialSorting?: SortingState;
  initialColumnVisibility?: VisibilityState;
  selection?: DataTableSelectionOptions<TData>;
}

const INTERACTIVE_SELECTOR = [
  "button",
  "a",
  "input",
  "select",
  "textarea",
  "label",
  "summary",
  "[role='button']",
  "[role='checkbox']",
  "[role='menuitem']",
  "[role='link']",
  "[contenteditable='true']",
  "[data-row-selection-ignore='true']",
].join(", ");

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement
    ? Boolean(target.closest(INTERACTIVE_SELECTOR))
    : false;
}

function resolveUpdater<TValue>(updater: Updater<TValue>, current: TValue) {
  return typeof updater === "function"
    ? (updater as (value: TValue) => TValue)(current)
    : updater;
}

function isSortingState(value: unknown): value is SortingState {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) =>
        typeof entry === "object" &&
        entry !== null &&
        "id" in entry &&
        typeof entry.id === "string" &&
        "desc" in entry &&
        typeof entry.desc === "boolean"
    )
  );
}

function resolveRowClassName<TData>(
  row: Row<TData>,
  className?: DataTableRowClassName<TData>
) {
  return typeof className === "function" ? className(row) : className;
}

function getColumnLabel<TData, TValue>(column: Column<TData, TValue>) {
  if (column.columnDef.meta?.label) {
    return column.columnDef.meta.label;
  }

  if (typeof column.columnDef.header === "string") {
    return column.columnDef.header;
  }

  return column.id;
}

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  "use no memo";
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>;
  }

  const sortingState = column.getIsSorted();
  const toggleSorting = column.getToggleSortingHandler();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("-ml-2", className)}
      onClick={toggleSorting}
    >
      <span>{title}</span>
      {sortingState ? (
        <ArrowUpIcon
          data-desc={sortingState === "desc" || undefined}
          className="data-desc:rotate-x-180 transition-transform"
        />
      ) : (
        <ArrowUpDownIcon />
      )}
    </Button>
  );
}

interface DataTableViewOptionsProps<TData> {
  table: TanstackTable<TData>;
}

function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  "use no memo";

  const columns = table.getAllColumns().filter((column) => column.getCanHide());

  if (!columns.length) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" className="ml-auto" />}
      >
        <Columns3Icon data-icon="inline-start" />
        Columnas
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {columns.map((column) => {
            const isVisible = column.getIsVisible();

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={isVisible}
                closeOnClick={false}
                className="pr-8"
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {getColumnLabel(column)}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DataTablePaginationProps<TData> {
  table: TanstackTable<TData>;
  pageSizeOptions: number[];
}

function DataTablePagination<TData>({
  table,
  pageSizeOptions,
}: DataTablePaginationProps<TData>) {
  "use no memo";
  const currentPageRows = table.getRowModel().rows.length;
  const totalRows = table.getRowCount();
  const pageCount = Math.max(table.getPageCount(), 1);
  const { pageIndex, pageSize } = table.getState().pagination;
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to =
    totalRows === 0
      ? 0
      : Math.min(pageIndex * pageSize + currentPageRows, totalRows);
  const normalizedPageSizeOptions = Array.from(
    new Set([...pageSizeOptions, pageSize])
  ).sort((left, right) => left - right);

  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm text-muted-foreground">
        Mostrando {from} a {to} de {totalRows} resultado(s)
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Filas por página
          </span>
          <Select
            aria-label="Filas por página"
            value={pageSize}
            onValueChange={(value) => table.setPageSize(value!)}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={"min-w-none"}>
              {normalizedPageSizeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="min-w-28 text-center text-sm text-muted-foreground">
          Página {pageIndex + 1} de {pageCount}
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon data-icon="inline-start" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
            <ChevronRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DataTableSelectionBarProps<TData> {
  context: DataTableSelectionContext<TData>;
  actions: DataTableSelectionAction<TData>[];
}

function DataTableSelectionBar<TData>({
  context,
  actions,
}: DataTableSelectionBarProps<TData>) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-4xl flex-col gap-3 rounded-2xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
            {context.selectedCount} seleccionada(s)
          </span>
          <span className="text-muted-foreground">Modo selección activo</span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {actions.map((action) => {
            const isDisabled =
              typeof action.disabled === "function"
                ? action.disabled(context)
                : action.disabled;

            return (
              <Button
                key={action.key}
                variant={action.variant ?? "outline"}
                size="sm"
                onClick={() => action.onClick(context)}
                disabled={isDisabled}
              >
                {action.label}
              </Button>
            );
          })}
          <Button variant="outline" size="sm" onClick={context.clearSelection}>
            Desmarcar todas
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={context.selectAllPageRows}
            disabled={context.isAllPageRowsSelected}
          >
            Marcar toda
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={context.closeSelectionMode}
          >
            <XIcon data-icon="inline-start" />
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = "Sin resultados.",
  className,
  tableClassName,
  getRowId,
  totalRecords,
  getRowClassName,
  enableColumnVisibility = true,
  pagination = true,
  toolbar,
  initialSorting,
  initialColumnVisibility,
  selection,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility ?? {});
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>(
    {}
  );
  const [isSelectionMode, setIsSelectionMode] = React.useState(false);
  const paginationOptions =
    typeof pagination === "object" ? pagination : undefined;
  const isPaginationEnabled = pagination !== false;
  const isManualPagination =
    isPaginationEnabled && typeof totalRecords === "number";
  const initialPageSize =
    paginationOptions?.initialPageSize ?? DEFAULT_PAGE_SIZE_OPTIONS[0];
  const isSelectionEnabled = Boolean(selection);
  const longPressMs = selection?.longPressMs ?? 450;
  const longPressTimerRef = React.useRef<number | null>(null);
  const suppressClickRowIdRef = React.useRef<string | null>(null);

  const tableStateParsers = {
    sorting: commonFiltersKeyMap.sort,
    pageIndex: commonFiltersKeyMap.page,
    pageSize: commonFiltersKeyMap.pageSize,
  };

  const tableStateUrlKeys = {
    sorting: `sort`,
    pageIndex: `page`,
    pageSize: `pageSize`,
  };

  const [{ sorting, pageIndex, pageSize }, setTableQueryState] = useQueryStates(
    tableStateParsers,
    {
      urlKeys: tableStateUrlKeys,
    }
  );
  const resolvedSorting = isSortingState(sorting)
    ? sorting
    : initialSorting ?? [];

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const nextSorting = resolveUpdater(updater, resolvedSorting);

    void setTableQueryState({
      sorting: nextSorting.length ? nextSorting : null,
      ...(isPaginationEnabled ? { pageIndex: 0 } : {}),
    });
  };
  const handlePaginationChange = (
    updater: Updater<{ pageIndex: number; pageSize: number }>
  ) => {
    const nextPagination = resolveUpdater(updater, { pageIndex, pageSize });

    void setTableQueryState({
      pageIndex: nextPagination.pageIndex,
      pageSize: nextPagination.pageSize,
    });
  };

  const selectionColumn = React.useMemo<ColumnDef<TData, TValue>>(
    () => ({
      id: "__selection__",
      enableHiding: false,
      enableSorting: false,
      header: ({ table }) => (
        <div className="flex justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={
              table.getIsSomePageRowsSelected() &&
              !table.getIsAllPageRowsSelected()
            }
            aria-label="Seleccionar filas visibles"
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        </div>
      ),
      meta: {
        label: "Seleccionar",
        headerClassName: "w-12 text-center",
        cellClassName: "w-12 text-center",
      },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            aria-label="Seleccionar fila"
            onClick={(event) => event.stopPropagation()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        </div>
      ),
    }),
    []
  );

  const resolvedColumns = React.useMemo(
    () => (isSelectionMode ? [selectionColumn, ...columns] : columns),
    [columns, isSelectionMode, selectionColumn]
  );

  const table = useReactTable({
    data,
    columns: resolvedColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: handlePaginationChange,
    onRowSelectionChange: setRowSelection,
    getRowId,
    enableRowSelection: isSelectionEnabled,
    manualPagination: isManualPagination,
    manualSorting: true,
    rowCount: totalRecords,
    state: {
      sorting: resolvedSorting,
      columnVisibility,
      rowSelection,
      ...(isPaginationEnabled
        ? {
            pagination: {
              pageIndex,
              pageSize,
            },
          }
        : {}),
    },
  });

  React.useEffect(() => {
    if (!isSelectionEnabled) {
      return;
    }

    const rowIds = new Set(data.map((row, index) => getRowId?.(row, index)));

    setRowSelection((current) => {
      const nextEntries = Object.entries(current).filter(([rowId, isSelected]) => {
        return isSelected && rowIds.has(rowId);
      });

      if (nextEntries.length === Object.keys(current).length) {
        return current;
      }

      return Object.fromEntries(nextEntries);
    });
  }, [data, getRowId, isSelectionEnabled]);

  React.useEffect(() => {
    if (!isSelectionEnabled) {
      return;
    }

    selection?.onSelectionChange?.(
      table.getSelectedRowModel().rows.map((row) => row.original)
    );
  }, [isSelectionEnabled, selection, rowSelection, table]);

  React.useEffect(() => {
    if (isSelectionMode && table.getSelectedRowModel().rows.length === 0) {
      setIsSelectionMode(false);
    }
  }, [isSelectionMode, rowSelection, table]);

  React.useEffect(() => {
    return () => {
      if (longPressTimerRef.current !== null) {
        window.clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const clearSelection = React.useCallback(() => {
    table.resetRowSelection();
  }, [table]);

  const closeSelectionMode = React.useCallback(() => {
    setIsSelectionMode(false);
    table.resetRowSelection();
  }, [table]);

  const enterSelectionMode = React.useCallback(
    (row?: Row<TData>) => {
      if (!isSelectionEnabled) {
        return;
      }

      setIsSelectionMode(true);

      if (row && !row.getIsSelected()) {
        row.toggleSelected(true);
      }
    },
    [isSelectionEnabled]
  );

  const toggleRowSelection = React.useCallback(
    (row: Row<TData>) => {
      if (!isSelectionEnabled) {
        return;
      }

      row.toggleSelected(!row.getIsSelected());
    },
    [isSelectionEnabled]
  );

  const selectedRows = table.getSelectedRowModel().rows;
  const selectionContext = React.useMemo<DataTableSelectionContext<TData>>(
    () => ({
      table,
      selectedRows,
      selectedData: selectedRows.map((row) => row.original),
      selectedIds: selectedRows.map((row) => row.id),
      selectedCount: selectedRows.length,
      isAllPageRowsSelected: table.getIsAllPageRowsSelected(),
      isSomePageRowsSelected: table.getIsSomePageRowsSelected(),
      clearSelection,
      selectAllPageRows: () => table.toggleAllPageRowsSelected(true),
      closeSelectionMode,
      enterSelectionMode,
      toggleRowSelection,
    }),
    [
      clearSelection,
      closeSelectionMode,
      enterSelectionMode,
      selectedRows,
      table,
      toggleRowSelection,
    ]
  );

  const clearLongPressTimer = React.useCallback(() => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleRowClick = React.useCallback(
    (row: Row<TData>, event: React.MouseEvent<HTMLTableRowElement>) => {
      if (!isSelectionEnabled || !isSelectionMode) {
        return;
      }

      if (suppressClickRowIdRef.current === row.id) {
        suppressClickRowIdRef.current = null;
        return;
      }

      if (isInteractiveTarget(event.target)) {
        return;
      }

      toggleRowSelection(row);
    },
    [isSelectionEnabled, isSelectionMode, toggleRowSelection]
  );

  const handleRowDoubleClick = React.useCallback(
    (row: Row<TData>, event: React.MouseEvent<HTMLTableRowElement>) => {
      if (!isSelectionEnabled || isSelectionMode || isInteractiveTarget(event.target)) {
        return;
      }

      enterSelectionMode(row);
    },
    [enterSelectionMode, isSelectionEnabled, isSelectionMode]
  );

  const handleRowPointerDown = React.useCallback(
    (row: Row<TData>, event: React.PointerEvent<HTMLTableRowElement>) => {
      if (
        !isSelectionEnabled ||
        isSelectionMode ||
        event.pointerType === "mouse" ||
        isInteractiveTarget(event.target)
      ) {
        return;
      }

      clearLongPressTimer();
      longPressTimerRef.current = window.setTimeout(() => {
        suppressClickRowIdRef.current = row.id;
        enterSelectionMode(row);
        longPressTimerRef.current = null;
      }, longPressMs);
    },
    [clearLongPressTimer, enterSelectionMode, isSelectionEnabled, isSelectionMode, longPressMs]
  );

  const hasContextMenu = Boolean(selection?.getContextMenuContent) || isSelectionEnabled;

  const toolbarContent =
    typeof toolbar === "function" ? toolbar(table) : toolbar;
  const hasHideableColumns = table
    .getAllColumns()
    .some((column) => column.getCanHide());
  const hasToolbar =
    (enableColumnVisibility && hasHideableColumns) || Boolean(toolbarContent);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border",
        className
      )}
    >
      {hasToolbar ? (
        <div className="flex flex-col gap-3 border-b border-border px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput />
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {toolbarContent}
          </div>
          {enableColumnVisibility && hasHideableColumns ? (
            <DataTableViewOptions table={table} />
          ) : null}
        </div>
      ) : null}
      <Table className={tableClassName}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-secondary/50 hover:bg-secondary/50"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={header.column.columnDef.meta?.headerClassName}
                >
                  {header.isPlaceholder ? null : typeof header.column.columnDef
                      .header === "string" && header.column.getCanSort() ? (
                    <DataTableColumnHeader
                      column={header.column}
                      title={header.column.columnDef.header}
                    />
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              hasContextMenu ? (
                <ContextMenu key={row.id}>
                  <ContextMenuTrigger
                    render={
                      <TableRow
                        className={cn(
                          resolveRowClassName(row, getRowClassName),
                          isSelectionEnabled && "cursor-pointer select-none"
                        )}
                        data-state={row.getIsSelected() ? "selected" : undefined}
                        onClick={(event) => handleRowClick(row, event)}
                        onDoubleClick={(event) => handleRowDoubleClick(row, event)}
                        onPointerDown={(event) => handleRowPointerDown(row, event)}
                        onPointerUp={clearLongPressTimer}
                        onPointerLeave={clearLongPressTimer}
                        onPointerCancel={clearLongPressTimer}
                      />
                    }
                  >
                    {row.getVisibleCells().map((cell) =>
                      cell.column.id === "actions" ? (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "text-end",
                            cell.column.columnDef.meta?.cellClassName
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ) : (
                        <TableCell
                          key={cell.id}
                          className={cell.column.columnDef.meta?.cellClassName}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    )}
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    {selection?.getContextMenuContent?.(row, selectionContext)}
                    {selection?.getContextMenuContent ? <ContextMenuSeparator /> : null}
                    {isSelectionEnabled ? (
                      <ContextMenuItem
                        onClick={() => {
                          if (!isSelectionMode) {
                            enterSelectionMode(row);
                            return;
                          }

                          toggleRowSelection(row);
                        }}
                      >
                        {row.getIsSelected() ? "Deseleccionar" : "Seleccionar"}
                      </ContextMenuItem>
                    ) : null}
                  </ContextMenuContent>
                </ContextMenu>
              ) : (
                <TableRow
                  key={row.id}
                  className={cn(
                    resolveRowClassName(row, getRowClassName),
                    isSelectionEnabled && "cursor-pointer select-none"
                  )}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  onClick={(event) => handleRowClick(row, event)}
                  onDoubleClick={(event) => handleRowDoubleClick(row, event)}
                  onPointerDown={(event) => handleRowPointerDown(row, event)}
                  onPointerUp={clearLongPressTimer}
                  onPointerLeave={clearLongPressTimer}
                  onPointerCancel={clearLongPressTimer}
                >
                  {row.getVisibleCells().map((cell) =>
                    cell.column.id === "actions" ? (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "text-end",
                          cell.column.columnDef.meta?.cellClassName
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ) : (
                      <TableCell
                        key={cell.id}
                        className={cell.column.columnDef.meta?.cellClassName}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  )}
                </TableRow>
              )
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getVisibleFlatColumns().length || columns.length}
                className="h-24 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isPaginationEnabled && table.getRowCount() > 0 ? (
        <DataTablePagination
          table={table}
          pageSizeOptions={
            paginationOptions?.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS
          }
        />
      ) : null}
      {isSelectionMode ? (
        <DataTableSelectionBar
          context={selectionContext}
          actions={selection?.bulkActions ?? []}
        />
      ) : null}
    </div>
  );
}
