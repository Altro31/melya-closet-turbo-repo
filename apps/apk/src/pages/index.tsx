import { Page } from "@/components/ui/page";
import { DailyIncome } from "@/sections/dashboard/daily-income";
import { QuickStats } from "@/sections/dashboard/quick-stats";
import { RecentOrders } from "@/sections/dashboard/recent-orders";
import { RevenueChart } from "@/sections/dashboard/revenue-chart";
import { StatsCards } from "@/sections/dashboard/stats-cards";
import { TopProducts } from "@/sections/dashboard/top-products";

export default function DashboardPage() {
  return (
    <Page>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary to-accent p-6 md:p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">
              Melya Closet
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-md">
              Tu dashboard de gestión. Aquí puedes ver el resumen de tus ventas,
              inversiones y ganancias del mes.
            </p>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 right-24 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
        </div>

        {/* Main Stats */}
        <StatsCards />

        {/* Quick Stats Bar */}
        <QuickStats />

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <RevenueChart />
          <DailyIncome />
        </div>

        {/* Orders and Products */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentOrders />
          <TopProducts />
        </div>
      </div>
    </Page>
  );
}
