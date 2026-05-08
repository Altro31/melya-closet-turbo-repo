"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ClipboardList,
  FileClock,
  LayoutDashboard,
  Package,
  Settings,
  Menu,
  Heart,
  Shirt,
  Tags,
  UserRound,
  Users,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Productos", href: "/products", icon: Shirt },
  { name: "Inventario", href: "/inventory", icon: Package },
  { name: "Pedidos", href: "/orders", icon: ClipboardList },
  { name: "Clientes", href: "/clients", icon: Users },
  { name: "Usuarios", href: "/users", icon: UserRound },
  { name: "ClientLog", href: "/client-logs", icon: FileClock },
  { name: "UserLog", href: "/user-logs", icon: FileClock },
  { name: "Categorías", href: "/bale-categories", icon: Tags },
  { name: "Configuración", href: "/configuracion", icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = router.asPath.split("?")[0];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden bg-card shadow-md"
          />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-6 border-b border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-primary">
                Melya
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Closet</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
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
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
