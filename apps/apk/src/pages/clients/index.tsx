"use client";

import { OfflineRouteLoading } from "@/components/offline-route-loading";
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import { loadClientsContent } from "@/lib/route-content-modules";
import dynamic from "next/dynamic";

const ClientsContent = dynamic(loadClientsContent, {
  ssr: false,
  loading: () => <OfflineRouteLoading label="clientes" />,
});

export default function ClientsPage() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Gestión de Clientes</PageTitle>
        <PageDescription>
          Administra y consulta la información de clientes.
        </PageDescription>
      </PageHeader>
      <ClientsContent />
    </Page>
  );
}
