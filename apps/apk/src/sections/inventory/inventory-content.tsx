"use client";

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
import InventoryDialogs from "@/sections/inventory/components/dialogs";
import { useBales } from "@/sections/inventory/hooks/use-bales";
import {
  AlertTriangle,
  Archive,
  DollarSign,
  Package,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { addBaleDialog } from "./components/dialogs/add-bale-dialog";
import { InventoryTable } from "./inventory-table";
import { InventoryFilters } from "@/sections/inventory/inventory-filters";
import { useBalesFilters } from "@/sections/inventory/hooks/use-bales-filters";

export const lotStatuses = [
  { value: "activo", label: "Activo" },
  { value: "completado", label: "Completado" },
  { value: "pausado", label: "Pausado" },
];

export default function InventoryContent() {
  const [filters] = useBalesFilters();
  const { data: bales, ...rest } = useBales(filters);

  // Filter lots based on current filters
  // const filteredLots = useMemo(() => {
  //   return lots.filter((lot) => {

  //     // Date range filter (creation date)
  //     if (filters.dateFrom) {
  //       const lotDate = new Date(lot.createdDate);
  //       const fromDate = new Date(filters.dateFrom);
  //       if (lotDate < fromDate) {
  //         return false;
  //       }
  //     }
  //     if (filters.dateTo) {
  //       const lotDate = new Date(lot.createdDate);
  //       const toDate = new Date(filters.dateTo);
  //       toDate.setHours(23, 59, 59, 999);
  //       if (lotDate > toDate) {
  //         return false;
  //       }
  //     }

  //     // Price range filter
  //     if (filters.minPrice && lot.price < parseFloat(filters.minPrice)) {
  //       return false;
  //     }
  //     if (filters.maxPrice && lot.price > parseFloat(filters.maxPrice)) {
  //       return false;
  //     }

  //     // Quantity range filter
  //     if (
  //       filters.minQuantity &&
  //       lot.availableQuantity < parseInt(filters.minQuantity)
  //     ) {
  //       return false;
  //     }
  //     if (
  //       filters.maxQuantity &&
  //       lot.availableQuantity > parseInt(filters.maxQuantity)
  //     ) {
  //       return false;
  //     }

  //     // Damaged items filter
  //     if (filters.hasDamaged === "yes" && lot.damagedItems === 0) {
  //       return false;
  //     }
  //     if (filters.hasDamaged === "no" && lot.damagedItems > 0) {
  //       return false;
  //     }

  //     return true;
  //   });
  // }, [lots, filters]);

  // Stats
  const totalLots = bales.length;
  const totalValue = bales.reduce((acc, l) => acc + l.price, 0);
  const totalDamaged = bales.reduce((acc, l) => acc + l.merma, 0);
  const totalAvailable = bales.reduce((acc, l) => acc + l.currentTotal, 0);
  const cards = [
    {
      title: "Total Lotes",
      value: totalLots,
      Icon: Package,
      mediaClassName: "bg-primary/10 text-primary",
    },
    {
      title: "Valor Total Activo",
      value: `$${totalValue.toLocaleString()}`,
      description: "en lotes activos",
      Icon: DollarSign,
      mediaClassName: "bg-green-100 text-green-600",
    },
    {
      title: "Productos Disponibles",
      value: totalAvailable,
      description: "unidades en stock",
      Icon: Archive,
      mediaClassName: "bg-blue-100 text-blue-600",
    },
    {
      title: "Productos Dañados",
      value: totalDamaged,
      description: "en todos los lotes",
      Icon: AlertTriangle,
      mediaClassName: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      <InventoryDialogs />

      {/* Quick Stats */}
      <DataCardGroud className="xs:grid-cols-2 md:grid-cols-4">
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
              {description ? (
                <DataCardValueDescription>
                  {description}
                </DataCardValueDescription>
              ) : null}
            </DataCardContent>
          </DataCard>
        ))}
      </DataCardGroud>

      {/* Filters and Add Button */}
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Listado de Lotes
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {bales.length} de {totalLots} lotes
            </p>
          </div>
          <Button onClick={() => addBaleDialog.open(null)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Lote
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <InventoryFilters />

          {/* Table */}
          <InventoryTable />
        </CardContent>
      </Card>
    </div>
  );
}
