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
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  description?: string;
}

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
}: StatCardProps) {
  return (
    <DataCard>
      <DataCardHeader>
        <DataCardTitle>{title}</DataCardTitle>
        <DataCardMedia className="bg-primary/10 text-primary">
          <Icon />
        </DataCardMedia>
      </DataCardHeader>
      <DataCardContent>
        <DataCardValue>{value}</DataCardValue>
        <div className="mt-1 flex items-center gap-2 max-sm:hidden">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md",
              changeType === "positive" && "bg-emerald-100 text-emerald-700",
              changeType === "negative" && "bg-red-100 text-red-700",
              changeType === "neutral" && "bg-gray-100 text-gray-700"
            )}
          >
            {changeType === "positive" ? (
              <TrendingUp className="h-3 w-3" />
            ) : changeType === "negative" ? (
              <TrendingDown className="h-3 w-3" />
            ) : null}
            {change}
          </span>
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      </DataCardContent>
    </DataCard>
  );
}

export function StatsCards() {
  const stats: StatCardProps[] = [
    {
      title: "Ingresos del Mes",
      value: "$24,580",
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      description: "vs. mes anterior",
    },
    {
      title: "Inversión del Mes",
      value: "$8,450",
      change: "+5.2%",
      changeType: "neutral",
      icon: PiggyBank,
      description: "en inventario",
    },
    {
      title: "Ganancia del Mes",
      value: "$16,130",
      change: "+18.3%",
      changeType: "positive",
      icon: Wallet,
      description: "margen neto",
    },
  ];

  return (
    <DataCardGroud className="xs:grid-cols-2 md:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </DataCardGroud>
  );
}
