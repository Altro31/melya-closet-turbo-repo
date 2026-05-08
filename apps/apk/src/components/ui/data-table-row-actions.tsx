"use client";

import * as React from "react";
import { MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  srLabel?: string;
  buttonClassName?: string;
}

export function DataTableRowActions({
  children,
  align = "end",
  srLabel = "Abrir menú",
  buttonClassName,
}: DataTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className={buttonClassName} />
        }
      >
        <MoreHorizontalIcon className="h-4 w-4" />
        <span className="sr-only">{srLabel}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}
