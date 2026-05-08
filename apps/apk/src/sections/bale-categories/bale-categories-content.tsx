"use client";

import { useLiveQuery } from "@tanstack/react-db";
import type { ColumnDef } from "@tanstack/react-table";
import {
  FolderTree,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DataCard,
  DataCardContent,
  DataCardGroud,
  DataCardHeader,
  DataCardMedia,
  DataCardTitle,
  DataCardValue,
  DataCardValueDescription,
} from "@/components/ui/data-card";
import { DataTable } from "@/components/ui/data-table";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocalRowBadge, isLocalRow } from "@/components/ui/local-row-badge";
import {
  baleCollection,
  createBaleCategoryAction,
  deleteBaleCategoryAction,
  updateBaleCategoryAction,
} from "@/lib/collections";
import { useBaleCategories } from "@/sections/bale-categories/hooks/use-bale-categories";
import { useBaleCategoriesFilters } from "@/sections/bale-categories/hooks/use-bale-categories-filters";
import { useBaleCategoriesStats } from "@/sections/bale-categories/hooks/use-bale-categories-stats";

interface CategoryFormState {
  name: string;
}

type InputChangeEvent = {
  target: {
    value: string;
  };
};

const defaultForm: CategoryFormState = { name: "" };

type BaleCategoryRow = ReturnType<typeof useBaleCategories>["data"][number];

const getInputValue = (event: unknown) => {
  const maybeEvent = event as Partial<InputChangeEvent>;
  return typeof maybeEvent.target?.value === "string"
    ? maybeEvent.target.value
    : "";
};

export default function BaleCategoriesContent() {
  const [filters, setFilters] = useBaleCategoriesFilters();
  const { data: categories } = useBaleCategories(filters);
  const { data: stats } = useBaleCategoriesStats();
  const { data: bales } = useLiveQuery((q) =>
    q.from({ bale: baleCollection }).select(({ bale }) => ({
      categoryId: bale.categoryId,
      currentTotal: bale.currentTotal,
    }))
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState<CategoryFormState>(defaultForm);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  const summaryByCategoryId = useMemo(() => {
    return bales.reduce<Map<string, { count: number; units: number }>>(
      (acc, bale) => {
        const current = acc.get(bale.categoryId) ?? { count: 0, units: 0 };
        acc.set(bale.categoryId, {
          count: current.count + 1,
          units: current.units + bale.currentTotal,
        });
        return acc;
      },
      new Map()
    );
  }, [bales]);

  const totalBales = bales.length;
  const totalUnits = bales.reduce((acc, bale) => acc + bale.currentTotal, 0);
  const cards = [
    {
      title: "Categorías",
      value: categories.length,
      description: "categorías registradas",
      Icon: FolderTree,
      mediaClassName: "bg-primary/10 text-primary",
    },
    {
      title: "Pacas Asociadas",
      value: totalBales,
      description: "pacas con categoría asignada",
      Icon: Package,
      mediaClassName: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Piezas Disponibles",
      value: totalUnits.toLocaleString(),
      description: "sumadas en todas las categorías",
      Icon: Package,
      mediaClassName: "bg-blue-100 text-blue-600",
    },
  ];

  const openCreateDialog = () => {
    setForm(defaultForm);
    setCreateOpen(true);
  };

  const openEditDialog = (categoryId: string) => {
    const category = categoryById.get(categoryId);
    if (!category) return;
    setSelectedCategoryId(categoryId);
    setForm({ name: category.name });
    setEditOpen(true);
  };

  const openDeleteDialog = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setDeleteOpen(true);
  };

  const resetDialogs = () => {
    setCreateOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setForm(defaultForm);
    setSelectedCategoryId(null);
  };

  const handleCreate = () => {
    const name = form.name.trim();
    if (!name) {
      toast.error("El nombre de la categoría es obligatorio");
      return;
    }

    const duplicated = categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicated) {
      toast.error("Ya existe una categoría con ese nombre");
      return;
    }

    createBaleCategoryAction({
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    toast.success("Categoría creada correctamente");
    resetDialogs();
  };

  const handleUpdate = () => {
    if (!selectedCategoryId) return;

    const name = form.name.trim();
    if (!name) {
      toast.error("El nombre de la categoría es obligatorio");
      return;
    }

    const duplicated = categories.some(
      (category) =>
        category.id !== selectedCategoryId &&
        category.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicated) {
      toast.error("Ya existe una categoría con ese nombre");
      return;
    }

    updateBaleCategoryAction([selectedCategoryId, { name }]);

    toast.success("Categoría actualizada");
    resetDialogs();
  };

  const handleDelete = () => {
    if (!selectedCategoryId) return;

    const categorySummary = summaryByCategoryId.get(selectedCategoryId);
    if (categorySummary && categorySummary.count > 0) {
      toast.error("No puedes eliminar una categoría que tiene pacas asociadas");
      return;
    }

    deleteBaleCategoryAction(selectedCategoryId);
    toast.success("Categoría eliminada");
    resetDialogs();
  };

  const selectedCategoryName =
    selectedCategoryId && categoryById.get(selectedCategoryId)
      ? categoryById.get(selectedCategoryId)?.name
      : "";

  const columns: ColumnDef<BaleCategoryRow>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex flex-wrap items-center gap-2 font-medium text-foreground">
            <span>{category.name}</span>
            <LocalRowBadge isLocal={isLocalRow(category)} />
          </div>
        );
      },
    },
    {
      id: "count",
      accessorFn: (category) =>
        summaryByCategoryId.get(category.id)?.count ?? 0,
      header: "Pacas",
      cell: ({ row }) => {
        const summary = summaryByCategoryId.get(row.original.id) ?? {
          count: 0,
          units: 0,
        };

        return summary.count;
      },
    },
    {
      id: "units",
      accessorFn: (category) =>
        summaryByCategoryId.get(category.id)?.units ?? 0,
      header: "Piezas",
      cell: ({ row }) => {
        const summary = summaryByCategoryId.get(row.original.id) ?? {
          count: 0,
          units: 0,
        };

        return summary.units.toLocaleString();
      },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Creada",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      id: "updatedAt",
      accessorKey: "updatedAt",
      header: "Actualizada",
      cell: ({ row }) =>
        row.original.updatedAt
          ? new Date(row.original.updatedAt).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-",
    },
    {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => {
        const category = row.original;
        return (
          <DataTableRowActions>
            <DropdownMenuItem
              className="gap-2"
              onClick={() => openEditDialog(category.id)}
            >
              <Pencil className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive"
              onClick={() => openDeleteDialog(category.id)}
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DataTableRowActions>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <DataCardGroud className="xs:grid-cols-2 md:grid-cols-3">
        {cards.map(({ Icon, description, mediaClassName, title, value }) => (
          <DataCard key={title}>
            <DataCardHeader>
              <DataCardTitle>{title}</DataCardTitle>
              <DataCardMedia className={mediaClassName}>
                <Icon />
              </DataCardMedia>
            </DataCardHeader>
            <DataCardContent>
              <DataCardValue>{value}</DataCardValue>
              <DataCardValueDescription>{description}</DataCardValueDescription>
            </DataCardContent>
          </DataCard>
        ))}
      </DataCardGroud>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Listado de Categorías
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {categories.length} categorías encontradas
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva categoría
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="search-categories"
              className="text-xs text-muted-foreground"
            >
              Buscar categoría
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search-categories"
                placeholder="Ej: Ajuares, Pantalones, Vintage..."
                value={filters.search}
                onChange={(event) =>
                  setFilters({ search: getInputValue(event) })
                }
                className="pl-9"
                type="search"
              />
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <FolderTree className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-1 text-lg font-medium text-foreground">
                No hay categorías para mostrar
              </h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Crea una categoría nueva o cambia el filtro de búsqueda.
              </p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={categories}
              getRowClassName="group"
              getRowId={(category) => category.id}
              pagination={{ pageSizeOptions: [1, 5, 10] }}
              totalRecords={stats?.totalRecords}
              selection={{}}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">
              Nueva categoría
            </DialogTitle>
            <DialogDescription>
              Crea una categoría para clasificar mejor tus pacas.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="new-category-name">Nombre</Label>
            <Input
              id="new-category-name"
              placeholder="Ej: Ajuares"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: getInputValue(event),
                }))
              }
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button onClick={handleCreate}>Crear categoría</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">
              Editar categoría
            </DialogTitle>
            <DialogDescription>
              Ajusta el nombre de la categoría seleccionada.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="edit-category-name">Nombre</Label>
            <Input
              id="edit-category-name"
              placeholder="Ej: Ajuares Premium"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: getInputValue(event),
                }))
              }
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button onClick={handleUpdate}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">
              Eliminar categoría
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará la categoría
              <span className="font-semibold text-foreground">
                {" "}
                {selectedCategoryName}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
