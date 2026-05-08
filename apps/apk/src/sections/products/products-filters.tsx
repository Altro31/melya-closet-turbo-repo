"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { allSizes } from "./products-content";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import type { ProductsFilters as ProductsFiltersType } from "@/sections/products/hook/use-products-filters";
import type { BaleOption } from "./add-product-dialog";

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

interface ProductsFiltersProps {
  filters: ProductsFiltersType;
  onFiltersChange: (filters: ProductsFiltersType) => void;
  onClearFilters: () => void;
  bales: BaleOption[];
}

export function ProductsFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  bales,
}: ProductsFiltersProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const hasActiveFilters =
    (filters.search ?? "") ||
    filters.bale ||
    (filters.size ?? "") ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minQuantity ||
    filters.maxQuantity;

  const updateFilter = <K extends keyof ProductsFiltersType>(
    key: K,
    value: ProductsFiltersType[K]
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
            placeholder="Buscar por nombre o descripción..."
            value={filters.search ?? ""}
            onChange={(e) => updateFilter("search", getInputValue(e))}
            className="pl-9"
          />
        </div>

        {/* Bale */}
        <Select
          value={filters.bale ?? "all"}
          onValueChange={(value) =>
            updateFilter("bale", value === "all" ? null : (value ?? null))
          }
        >
          <SelectTrigger className="w-full md:w-50">
            <SelectValue placeholder="Paca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las pacas</SelectItem>
            {bales.map((bale) => (
              <SelectItem key={bale.id} value={bale.id}>
                {bale.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Size */}
        <Select
          value={filters.size ?? "all"}
          onValueChange={(value) =>
            updateFilter("size", value === "all" ? null : (value ?? null))
          }
        >
          <SelectTrigger className="w-full md:w-30">
            <SelectValue placeholder="Talla" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las tallas</SelectItem>
            {allSizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4 bg-secondary/30 rounded-lg">
            {/* Price Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Rango de Precio
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Mín"
                  value={filters.minPrice ?? ""}
                  onChange={(e) =>
                    updateFilter(
                      "minPrice",
                      getInputValue(e) ? parseFloat(getInputValue(e)) : null
                    )
                  }
                  className="w-full"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filters.maxPrice ?? ""}
                  onChange={(e) =>
                    updateFilter(
                      "maxPrice",
                      getInputValue(e) ? parseFloat(getInputValue(e)) : null
                    )
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Quantity Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Rango de Cantidad
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Mín"
                  value={filters.minQuantity ?? ""}
                  onChange={(e) =>
                    updateFilter(
                      "minQuantity",
                      getInputValue(e) ? parseInt(getInputValue(e)) : null
                    )
                  }
                  className="w-full"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filters.maxQuantity ?? ""}
                  onChange={(e) =>
                    updateFilter(
                      "maxQuantity",
                      getInputValue(e) ? parseInt(getInputValue(e)) : null
                    )
                  }
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
