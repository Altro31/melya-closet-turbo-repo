"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { month: "Ene", ingresos: 12500, gastos: 4200 },
  { month: "Feb", ingresos: 15800, gastos: 5100 },
  { month: "Mar", ingresos: 14200, gastos: 4800 },
  { month: "Abr", ingresos: 18900, gastos: 6200 },
  { month: "May", ingresos: 21500, gastos: 7100 },
  { month: "Jun", ingresos: 19800, gastos: 6500 },
  { month: "Jul", ingresos: 23400, gastos: 7800 },
  { month: "Ago", ingresos: 25100, gastos: 8200 },
  { month: "Sep", ingresos: 22800, gastos: 7500 },
  { month: "Oct", ingresos: 26500, gastos: 8700 },
  { month: "Nov", ingresos: 28900, gastos: 9400 },
  { month: "Dic", ingresos: 24580, gastos: 8450 },
];

export function RevenueChart() {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">
              Resumen Anual
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Ingresos vs Inversión
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Ingresos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="text-xs text-muted-foreground">Inversión</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-70 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.6 0.2 350)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.6 0.2 350)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.7 0.15 350)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.7 0.15 350)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.9 0.02 350)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.5 0.02 350)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.5 0.02 350)", fontSize: 12 }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid oklch(0.9 0.02 350)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value) => [`$${formatNumber(Number(value))}`, ""]}
                labelStyle={{ color: "oklch(0.25 0.02 350)", fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="ingresos"
                stroke="oklch(0.6 0.2 350)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIngresos)"
                name="Ingresos"
              />
              <Area
                type="monotone"
                dataKey="gastos"
                stroke="oklch(0.7 0.15 350)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGastos)"
                name="Inversión"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
