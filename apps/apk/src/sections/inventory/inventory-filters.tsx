"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { useBalesFilters } from "@/sections/inventory/hooks/use-bales-filters";

type InputChangeEvent = {
  target: {
    value: string;
  };
};

const getInputValue = (event: unknown) => {
  const maybeEvent = event as Partial<InputChangeEvent>;
  return typeof maybeEvent.target?.value === "string"
    ? maybeEvent.target.value
    : "";
};

const formatDateTimeLocal = (date: Date | null) => {
  if (!date) return "";
  const timezoneOffsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 16);
};

const formatDateOnly = (date: Date | null) => {
  if (!date) return "";
  const timezoneOffsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
};

export function InventoryFilters() {
  const [filters, setFilters] = useBalesFilters();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleNumberChange = (
    key: "minPrice" | "maxPrice" | "minQuantity" | "maxQuantity",
    value: string
  ) => {
    setFilters({ [key]: value === "" ? null : Number(value) });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.minQuantity ||
      filters.maxQuantity
  );

  const handleClearFilters = () => {
    setFilters({
      dateFrom: null,
      dateTo: null,
      maxPrice: null,
      maxQuantity: null,
      minPrice: null,
      minQuantity: null,
      search: null,
    });
  };

  return (
    <div className="space-y-4">
      {/* Main Filters Row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        {/* Search */}
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="search" className="text-xs text-muted-foreground">
            Buscar
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por nombre, ID o descripción..."
              value={filters.search}
              onChange={(e) => setFilters({ search: getInputValue(e) })}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
            />
          }
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros avanzados
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Limpiar
          </Button>
        )}
        <CollapsibleContent className="pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4 bg-secondary/30 rounded-lg">
            {/* Date Range */}
            <div className="space-y-1.5">
              <Label
                htmlFor="dateFrom"
                className="text-xs text-muted-foreground"
              >
                Fecha creación desde
              </Label>
              <Input
                id="dateFrom"
                type="datetime-local"
                value={formatDateTimeLocal(filters.dateFrom)}
                onChange={(e) =>
                  setFilters({
                    dateFrom: getInputValue(e)
                      ? new Date(getInputValue(e))
                      : null,
                  })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dateTo" className="text-xs text-muted-foreground">
                Fecha creación hasta
              </Label>
              <Input
                id="dateTo"
                type="date"
                value={formatDateOnly(filters.dateTo)}
                onChange={(e) =>
                  setFilters({
                    dateTo: getInputValue(e)
                      ? new Date(`${getInputValue(e)}T00:00:00`)
                      : null,
                  })
                }
              />
            </div>

            {/* Price Range */}
            <div className="space-y-1.5">
              <Label
                htmlFor="minPrice"
                className="text-xs text-muted-foreground"
              >
                Precio mínimo ($)
              </Label>
              <Input
                id="minPrice"
                type="number"
                step="100"
                min="0"
                placeholder="0"
                value={filters.minPrice ?? ""}
                onChange={(e) =>
                  handleNumberChange("minPrice", getInputValue(e))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="maxPrice"
                className="text-xs text-muted-foreground"
              >
                Precio máximo ($)
              </Label>
              <Input
                id="maxPrice"
                type="number"
                step="100"
                min="0"
                placeholder="Sin límite"
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  handleNumberChange("maxPrice", getInputValue(e))
                }
              />
            </div>

            {/* Quantity Range */}
            <div className="space-y-1.5">
              <Label
                htmlFor="minQuantity"
                className="text-xs text-muted-foreground"
              >
                Cantidad mínima
              </Label>
              <Input
                id="minQuantity"
                type="number"
                min="0"
                placeholder="0"
                value={filters.minQuantity ?? ""}
                onChange={(e) =>
                  handleNumberChange("minQuantity", getInputValue(e))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="maxQuantity"
                className="text-xs text-muted-foreground"
              >
                Cantidad máxima
              </Label>
              <Input
                id="maxQuantity"
                type="number"
                min="0"
                placeholder="Sin límite"
                value={filters.maxQuantity ?? ""}
                onChange={(e) =>
                  handleNumberChange("maxQuantity", getInputValue(e))
                }
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
