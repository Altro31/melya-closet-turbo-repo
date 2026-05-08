"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserLogsFilters } from "@/sections/user-logs/hooks/use-user-logs-filters";
import { Search, X } from "lucide-react";

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

interface UserLogsFiltersProps {
  filters: UserLogsFilters;
  onFiltersChange: (filters: UserLogsFilters) => void;
  onClearFilters: () => void;
}

export function UserLogsFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: UserLogsFiltersProps) {
  const hasActiveFilters = Boolean(filters.search);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="user-logs-search" className="text-xs text-muted-foreground">
            Buscar
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="user-logs-search"
              placeholder="Buscar por acción, detalle o usuario..."
              value={filters.search ?? ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: getInputValue(e) })
              }
              className="pl-9"
            />
          </div>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
}

