"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, SlidersHorizontal, Calendar } from "lucide-react";
import {
  orderStatuses,
  orderTypes,
  paymentMethods,
} from "./order-types";
import type { OrderFilters } from "@/sections/orders/hooks/use-orders-filters";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";

interface OrdersFiltersProps {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  onClearFilters: () => void;
}

export function OrdersFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: OrdersFiltersProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.orderType ||
    filters.paymentMethod ||
    filters.isActive ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.minAmount ||
    filters.maxAmount;

  const updateFilter = <K extends keyof OrderFilters>(
    key: K,
    value: OrderFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Main filters row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por ID, cliente o notas..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status */}
        <Select
          value={filters.status}
          onValueChange={(value) =>
            updateFilter("status", value === "all" ? "" : value ?? "")
          }
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {orderStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Order Type */}
        <Select
          value={filters.orderType}
          onValueChange={(value) =>
            updateFilter("orderType", value === "all" ? "" : value ?? "")
          }
        >
          <SelectTrigger className="w-full md:w-37.5">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {orderTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Payment Method */}
        <Select
          value={filters.paymentMethod}
          onValueChange={(value) =>
            updateFilter("paymentMethod", value === "all" ? "" : value ?? "")
          }
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Pago" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los pagos</SelectItem>
            {paymentMethods.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Advanced filters */}
      <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <div className="flex items-center gap-2">
          <CollapsibleTrigger
            render={<Button variant="outline" size="sm" className="gap-2" />}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros avanzados
          </CollapsibleTrigger>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="gap-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Limpiar filtros
            </Button>
          )}
        </div>

        <CollapsibleContent className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4 bg-secondary/30 rounded-lg">
            {/* Active filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Estado del Pedido
              </Label>
              <Select
                value={filters.isActive}
                onValueChange={(value) =>
                  updateFilter("isActive", value === "all" ? "" : value ?? "")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Desactivados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Rango de Fechas
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilter("dateFrom", e.target.value)}
                  className="w-full"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => updateFilter("dateTo", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Amount Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Rango de Importe ($)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Mín"
                  value={filters.minAmount}
                  onChange={(e) => updateFilter("minAmount", e.target.value)}
                  className="w-full"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filters.maxAmount}
                  onChange={(e) => updateFilter("maxAmount", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
