"use client";

import { OfflineRouteLoading } from "@/components/offline-route-loading";
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import { loadClientLogsContent } from "@/lib/route-content-modules";
import dynamic from "next/dynamic";

const ClientLogsContent = dynamic(loadClientLogsContent, {
  ssr: false,
  loading: () => <OfflineRouteLoading label="logs de clientes" />,
});

export default function ClientLogsPage() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>ClientLog</PageTitle>
        <PageDescription>
          Historial y trazabilidad de cambios en clientes.
        </PageDescription>
      </PageHeader>
      <ClientLogsContent />
    </Page>
  );
}
