"use client";

import { OfflineRouteLoading } from "@/components/offline-route-loading";
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import { loadOrdersContent } from "@/lib/route-content-modules";
import dynamic from "next/dynamic";

const OrdersContent = dynamic(loadOrdersContent, {
  ssr: false,
  loading: () => <OfflineRouteLoading label="pedidos" />,
});

export default function PedidosPage() {
  return (
    <Page>
      <PageHeader>
        <PageTitle> Gestión de Pedidos</PageTitle>
        <PageDescription>
          Administra y da seguimiento a los pedidos de tu tienda
        </PageDescription>
      </PageHeader>
      <OrdersContent />
    </Page>
  );
}
