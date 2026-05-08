"use client";

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
import { ClientLogDetailsDialog } from "@/sections/client-logs/client-log-details-dialog";
import { ClientLogsFilters } from "@/sections/client-logs/client-logs-filters";
import { ClientLogsTable } from "@/sections/client-logs/client-logs-table";
import { useClientLogs } from "@/sections/client-logs/hooks/use-client-logs";
import { useClientLogsFilters } from "@/sections/client-logs/hooks/use-client-logs-filters";
import { FileClock, UserRound } from "lucide-react";

export default function ClientLogsContent() {
  const [filters, setFilters] = useClientLogsFilters();
  const { data: logs } = useClientLogs(filters);

  const totalLogs = logs.length;
  const uniqueClients = new Set(logs.map((l) => l.clientId).filter(Boolean))
    .size;
  const cards = [
    {
      title: "Total Logs de Cliente",
      value: totalLogs,
      description: "registros encontrados",
      Icon: FileClock,
      mediaClassName: "bg-primary/10 text-primary",
    },
    {
      title: "Clientes con actividad",
      value: uniqueClients,
      description: "clientes distintos con logs",
      Icon: UserRound,
      mediaClassName: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <ClientLogDetailsDialog />

      <DataCardGroud className="xs:grid-cols-2">
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
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Historial de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ClientLogsFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={() => setFilters({ search: null })}
          />
          <ClientLogsTable filters={filters} />
        </CardContent>
      </Card>
    </div>
  );
}
