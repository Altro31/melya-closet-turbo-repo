"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { CalendarDays, ArrowUpRight } from "lucide-react";

interface DailyRecord {
  date: string;
  dayName: string;
  income: number;
  orders: number;
}

const weeklyData: DailyRecord[] = [
  { date: "25 Mar", dayName: "Lun", income: 1250, orders: 8 },
  { date: "26 Mar", dayName: "Mar", income: 980, orders: 6 },
  { date: "27 Mar", dayName: "Mié", income: 1520, orders: 10 },
  { date: "28 Mar", dayName: "Jue", income: 890, orders: 5 },
  { date: "29 Mar", dayName: "Vie", income: 2100, orders: 14 },
  { date: "30 Mar", dayName: "Sáb", income: 2450, orders: 16 },
  { date: "31 Mar", dayName: "Dom", income: 1680, orders: 11 },
];

const maxIncome = Math.max(...weeklyData.map((d) => d.income));

export function DailyIncome() {
  const todayIncome = weeklyData[weeklyData.length - 1];
  const yesterdayIncome = weeklyData[weeklyData.length - 2];
  const percentChange = (
    ((todayIncome.income - yesterdayIncome.income) / yesterdayIncome.income) *
    100
  ).toFixed(1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">
              Ingresos Diarios
            </CardTitle>
            <p className="text-xs text-muted-foreground">Últimos 7 días</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">
            ${formatNumber(todayIncome.income)}
          </p>
          <p className="text-xs text-emerald-600 flex items-center gap-0.5 justify-end">
            <ArrowUpRight className="h-3 w-3" />
            {percentChange}% vs. ayer
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyData.map((day, index) => {
            const heightPercent = (day.income / maxIncome) * 100;
            const isToday = index === weeklyData.length - 1;
            return (
              <div
                key={day.date}
                className="flex flex-col items-center gap-1 flex-1"
              >
                <div className="relative w-full flex flex-col items-center">
                  <span className="text-[10px] font-medium text-muted-foreground mb-1">
                    ${(day.income / 1000).toFixed(1)}k
                  </span>
                  <div
                    className={`w-full max-w-[40px] rounded-t-md transition-all ${
                      isToday
                        ? "bg-primary"
                        : "bg-primary/30 hover:bg-primary/50"
                    }`}
                    style={{ height: `${heightPercent}%`, minHeight: "8px" }}
                  />
                </div>
                <span
                  className={`text-xs ${
                    isToday
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {day.dayName}
                </span>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Total Semana</p>
            <p className="text-lg font-semibold text-foreground">
              ${formatNumber(weeklyData.reduce((acc, d) => acc + d.income, 0))}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Pedidos</p>
            <p className="text-lg font-semibold text-foreground">
              {weeklyData.reduce((acc, d) => acc + d.orders, 0)} pedidos
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
