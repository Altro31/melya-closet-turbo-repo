"use client";

import { cn } from "@/lib/utils";
import {
  ClipboardList,
  FileClock,
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Shirt,
  Tags,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Pedidos", href: "/orders", icon: ClipboardList },
  { name: "Productos", href: "/products", icon: Shirt },
  { name: "Categorías", href: "/bale-categories", icon: Tags },
  { name: "Inventario", href: "/inventory", icon: Package },
  { name: "Clientes", href: "/clients", icon: Users },
];

const secondaryNavigation = [
  { name: "Configuración", href: "/configuracion", icon: Settings },
  { name: "Usuarios", href: "/users", icon: UserRound },
  { name: "ClientLog", href: "/client-logs", icon: FileClock },
  { name: "UserLog", href: "/user-logs", icon: FileClock },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = router.asPath.split("?")[0];

  return (
    <aside className="max-lg:hidden fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-6 border-b border-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-primary">Melya</h1>
            <p className="text-xs text-muted-foreground -mt-0.5">Closet</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Menú Principal
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-6">
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Ajustes
            </p>
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
              M
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                Melya Admin
              </p>
              <p className="text-xs text-muted-foreground truncate">
                admin@melyacloset.com
              </p>
            </div>
            <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
