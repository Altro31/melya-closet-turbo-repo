"use client";

import { OfflineRouteLoading } from "@/components/offline-route-loading";
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import { loadBaleCategoriesContent } from "@/lib/route-content-modules";
import dynamic from "next/dynamic";

const BaleCategoriesContent = dynamic(loadBaleCategoriesContent, {
  ssr: false,
  loading: () => <OfflineRouteLoading label="categorías de pacas" />,
});

export default function BaleCategoriesPage() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Gestión de Categorías de Pacas</PageTitle>
        <PageDescription>
          Crea, edita y elimina categorías para organizar mejor tu inventario de
          pacas.
        </PageDescription>
      </PageHeader>
      <BaleCategoriesContent />
    </Page>
  );
}
