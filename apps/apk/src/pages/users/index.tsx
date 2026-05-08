"use client";

import { OfflineRouteLoading } from "@/components/offline-route-loading";
import {
  Page,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import { loadUsersContent } from "@/lib/route-content-modules";
import dynamic from "next/dynamic";

const UsersContent = dynamic(loadUsersContent, {
  ssr: false,
  loading: () => <OfflineRouteLoading label="usuarios" />,
});

export default function UsersPage() {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Gestión de Usuarios</PageTitle>
        <PageDescription>Administra los usuarios del sistema.</PageDescription>
      </PageHeader>
      <UsersContent />
    </Page>
  );
}
