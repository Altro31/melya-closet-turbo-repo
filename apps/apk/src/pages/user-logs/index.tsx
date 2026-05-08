"use client";

import { OfflineRouteLoading } from "@/components/offline-route-loading";
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import { loadUserLogsContent } from "@/lib/route-content-modules";
import dynamic from "next/dynamic";

const UserLogsContent = dynamic(loadUserLogsContent, {
  ssr: false,
  loading: () => <OfflineRouteLoading label="logs de usuarios" />,
});

export default function UserLogsPage() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Logs de usuarios</PageTitle>
        <PageDescription>
          Historial y trazabilidad de cambios en usuarios.
        </PageDescription>
      </PageHeader>
      <UserLogsContent />
    </Page>
  );
}
