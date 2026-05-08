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
import { useUserLogs } from "@/sections/user-logs/hooks/use-user-logs";
import { useUserLogsFilters } from "@/sections/user-logs/hooks/use-user-logs-filters";
import { UserLogsFilters } from "@/sections/user-logs/user-logs-filters";
import { UserLogsTable } from "@/sections/user-logs/user-logs-table";
import { UserLogDetailsDialog } from "@/sections/user-logs/user-log-details-dialog";
import { FileClock, UserRound } from "lucide-react";

export default function UserLogsContent() {
  const [filters, setFilters] = useUserLogsFilters();
  const { data: logs } = useUserLogs(filters);

  const totalLogs = logs.length;
  const uniqueUsers = new Set(logs.map((l) => l.userId).filter(Boolean)).size;
  const cards = [
    {
      title: "Total Logs de Usuario",
      value: totalLogs,
      description: "registros encontrados",
      Icon: FileClock,
      mediaClassName: "bg-primary/10 text-primary",
    },
    {
      title: "Usuarios con actividad",
      value: uniqueUsers,
      description: "usuarios distintos con logs",
      Icon: UserRound,
      mediaClassName: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <UserLogDetailsDialog />

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
            Historial de Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserLogsFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={() => setFilters({ search: null })}
          />
          <UserLogsTable filters={filters} />
        </CardContent>
      </Card>
    </div>
  );
}
