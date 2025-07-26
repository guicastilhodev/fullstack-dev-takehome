"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { erpApi, type Order, type OrderCreateRequest } from "@/lib/api/erp"
import { useToast } from "@/hooks/use-toast"
import { Package, Plus, RefreshCw } from "lucide-react"

const ORDER_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
]

export function ErpIntegration() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<OrderCreateRequest>()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const data = await erpApi.listOrders()
      setOrders(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: OrderCreateRequest) => {
    if (!selectedStatus) {
      toast({
        title: "Error",
        description: "Please select an order status",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        ...data,
        status: selectedStatus,
        total: Number(data.total),
      }

      await erpApi.createOrder(orderData)

      toast({
        title: "Success",
        description: "Order created successfully in ERP",
      })

      reset()
      setSelectedStatus("")
      fetchOrders() 
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order in ERP",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Order in ERP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name</Label>
                <Input
                  id="customer"
                  {...register("customer", {
                    required: "Customer name is required",
                  })}
                  placeholder="Enter customer name"
                />
                {errors.customer && <p className="text-sm text-red-600">{errors.customer.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="total">Order Total</Label>
                <Input
                  id="total"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("total", {
                    required: "Order total is required",
                    min: { value: 0, message: "Total must be positive" },
                  })}
                  placeholder="0.00"
                />
                {errors.total && <p className="text-sm text-red-600">{errors.total.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Order Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Order"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              ERP Orders
            </CardTitle>
            <Button variant="outline" size="sm" onClick={fetchOrders} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
