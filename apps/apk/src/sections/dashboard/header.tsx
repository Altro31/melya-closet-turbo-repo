"use client";

import { Input } from "@/components/ui/input";
import { Calendar, Search } from "lucide-react";

export function Header() {
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-6">
      <div className="flex items-center gap-4">
        <div className="max-lg:pl-9">
          <h2 className="text-lg font-semibold text-foreground">
            ¡Bienvenida de nuevo!
          </h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {today}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar productos, pedidos..."
            className="w-64 pl-9 bg-secondary/50 border-border focus:bg-card"
          />
        </div>
      </div>
    </header>
  );
}
