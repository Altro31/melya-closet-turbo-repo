"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  customer: string
  product: string
  amount: number
  status: "pendiente" | "enviado" | "entregado"
  date: string
}

const recentOrders: Order[] = [
  {
    id: "#MC-2024-001",
    customer: "María García",
    product: "Vestido Floral",
    amount: 89.99,
    status: "entregado",
    date: "Hace 2 horas",
  },
  {
    id: "#MC-2024-002",
    customer: "Laura Martínez",
    product: "Blusa Elegante",
    amount: 45.00,
    status: "enviado",
    date: "Hace 4 horas",
  },
  {
    id: "#MC-2024-003",
    customer: "Ana López",
    product: "Falda Midi",
    amount: 65.50,
    status: "pendiente",
    date: "Hace 6 horas",
  },
  {
    id: "#MC-2024-004",
    customer: "Carmen Ruiz",
    product: "Pantalón Palazzo",
    amount: 78.00,
    status: "enviado",
    date: "Hace 8 horas",
  },
  {
    id: "#MC-2024-005",
    customer: "Sofia Torres",
    product: "Top Crop",
    amount: 35.00,
    status: "entregado",
    date: "Ayer",
  },
]

const statusStyles = {
  pendiente: "bg-amber-100 text-amber-700 border-amber-200",
  enviado: "bg-blue-100 text-blue-700 border-blue-200",
  entregado: "bg-emerald-100 text-emerald-700 border-emerald-200",
}

const statusLabels = {
  pendiente: "Pendiente",
  enviado: "Enviado",
  entregado: "Entregado",
}

export function RecentOrders() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">
              Pedidos Recientes
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Últimas transacciones
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary gap-1">
          Ver todos
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-medium text-primary">
                  {order.customer.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {order.customer}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.product} • {order.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={statusStyles[order.status]}
                >
                  {statusLabels[order.status]}
                </Badge>
                <span className="text-sm font-semibold text-foreground">
                  ${order.amount.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
