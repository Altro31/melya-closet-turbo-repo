"use client";

import { OfflineRouteLoading } from "@/components/offline-route-loading";
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import { loadInventoryContent } from "@/lib/route-content-modules";
import dynamic from "next/dynamic";

const InventoryContent = dynamic(loadInventoryContent, {
  ssr: false,
  loading: () => <OfflineRouteLoading label="inventario" />,
});

export default function InventarioPage() {
  return (
    <Page>
      <PageHeader>
        <PageTitle> Gestión de Inventario</PageTitle>
        <PageDescription>
          Administra los lotes de productos de tu tienda
        </PageDescription>
      </PageHeader>
      <InventoryContent />
    </Page>
  );
}
