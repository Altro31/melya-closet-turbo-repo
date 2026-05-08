"use client";

import { OfflineRouteLoading } from "@/components/offline-route-loading";
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import { loadProductsContent } from "@/lib/route-content-modules";
import dynamic from "next/dynamic";

const ProductsContent = dynamic(loadProductsContent, {
  ssr: false,
  loading: () => <OfflineRouteLoading label="productos" />,
});

export default function ProductosPage() {
  return (
    <Page>
      <PageHeader>
        <PageTitle> Gestión de Productos</PageTitle>
        <PageDescription>
          Administra y da seguimiento a los productos de tu tienda
        </PageDescription>
      </PageHeader>
      <ProductsContent />
    </Page>
  );
}
