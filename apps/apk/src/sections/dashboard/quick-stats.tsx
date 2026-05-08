"use client";

import {
  DataCard,
  DataCardContent,
  DataCardGroud,
  DataCardHeader,
  DataCardMedia,
  DataCardTitle,
  DataCardValue,
} from "@/components/ui/data-card";
import { Package, Users, ShoppingCart, Star } from "lucide-react";

interface QuickStat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const quickStats: QuickStat[] = [
  {
    label: "Productos Activos",
    value: "248",
    icon: Package,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Clientes Totales",
    value: "1,432",
    icon: Users,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Pedidos Pendientes",
    value: "12",
    icon: ShoppingCart,
    color: "bg-amber-100 text-amber-700",
  },
  {
    label: "Valoración Promedio",
    value: "4.8",
    icon: Star,
    color: "bg-blue-100 text-blue-700",
  },
];

export function QuickStats() {
  return (
    <DataCardGroud className="xs:grid-cols-2 lg:grid-cols-4">
      {quickStats.map((stat) => (
        <DataCard key={stat.label}>
          <DataCardHeader>
            <DataCardTitle>{stat.label}</DataCardTitle>
            <DataCardMedia className={stat.color}>
              <stat.icon />
            </DataCardMedia>
          </DataCardHeader>
          <DataCardContent>
            <DataCardValue>{stat.value}</DataCardValue>
          </DataCardContent>
        </DataCard>
      ))}
    </DataCardGroud>
  );
}
