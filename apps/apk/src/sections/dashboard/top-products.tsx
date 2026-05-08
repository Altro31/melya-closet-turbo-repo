"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { Sparkles, TrendingUp } from "lucide-react";

interface Product {
  name: string;
  category: string;
  sales: number;
  revenue: number;
  trend: number;
}

const topProducts: Product[] = [
  {
    name: "Vestido Elegante Rosa",
    category: "Vestidos",
    sales: 48,
    revenue: 4320,
    trend: 15,
  },
  {
    name: "Blusa Seda Premium",
    category: "Blusas",
    sales: 36,
    revenue: 2520,
    trend: 12,
  },
  {
    name: "Pantalón Palazzo Beige",
    category: "Pantalones",
    sales: 32,
    revenue: 2560,
    trend: 8,
  },
  {
    name: "Falda Plisada Midi",
    category: "Faldas",
    sales: 28,
    revenue: 1960,
    trend: 22,
  },
];

export function TopProducts() {
  const maxSales = Math.max(...topProducts.map((p) => p.sales));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">
              Productos Más Vendidos
            </CardTitle>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    ${formatNumber(product.revenue)}
                  </p>
                  <p className="text-xs text-emerald-600 flex items-center gap-0.5 justify-end">
                    <TrendingUp className="h-3 w-3" />+{product.trend}%
                  </p>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-linear-to-r from-primary to-accent transition-all"
                  style={{ width: `${(product.sales / maxSales) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {product.sales} ventas
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
