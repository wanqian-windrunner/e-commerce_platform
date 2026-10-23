import { Link, useParams } from "react-router";
import { parseApiError } from "@/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOrderById, useUpdateAdminOrderStatus } from "@/hooks/useAdminOrders";
import type { UpdateAdminOrderStatusPayload } from "@/types/admin-orders";
import { toast } from "sonner";

type OrderStatus = UpdateAdminOrderStatusPayload["status"];

const nextStatuses: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const { data: order, isPending, isError, isFetching, error, refetch } = useAdminOrderById(id ?? "");
  const updateMutation = useUpdateAdminOrderStatus(id ?? "");

  const handleStatusChange = (status: OrderStatus) => {
    if (!order || isError || updateMutation.isPending || isFetching ||
        !nextStatuses[order.status].includes(status)) return;

    if (status === "cancelled" &&
        !window.confirm(`Cancel order ${order.orderNumber}? Its items will be returned to stock.`)) return;

    updateMutation.mutate({ status }, {
      onSuccess: () => toast.success(`Order status updated to ${status}`),
      onError: (mutationError) => toast.error(parseApiError(mutationError)),
    });
  };

  if (!id) {
    return (
      <p role="alert" className="text-destructive">
        Order ID is missing.
      </p>
    );
  }

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <p role="alert" className="text-destructive">
          {parseApiError(error)}
        </p>
        <Button type="button" variant="outline" onClick={() => void refetch()} disabled={isFetching}>
          {isFetching ? "Retrying..." : "Retry"}
        </Button>
        <Link to="/admin/orders" className="block text-sm underline">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Order {order.orderNumber}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Order: {order.status}</Badge>
          <Badge variant="outline">Payment: {order.paymentStatus}</Badge>
          <span className="text-sm text-muted-foreground">
            Placed {new Date(order.createdAt).toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">
            Updated {new Date(order.updatedAt).toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Customer ID: {order.userId}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update order status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {nextStatuses[order.status].length === 0 ? (
            <p className="text-sm text-muted-foreground">No further status changes available.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {nextStatuses[order.status].map((status) => (
                <Button
                  key={status}
                  type="button"
                  variant={status === "cancelled" ? "destructive" : "outline"}
                  disabled={updateMutation.isPending || isFetching}
                  onClick={() => handleStatusChange(status)}
                >
                  {updateMutation.isPending ? "Updating..." : status === "cancelled" ? "Cancel order" : `Mark ${status}`}
                </Button>
              ))}
            </div>
          )}
          {isFetching && <p className="text-sm text-muted-foreground">Refreshing order...</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 gap-3">
                  {item.currentProductImage && (
                    <img
                      src={item.currentProductImage}
                      alt={`Current image for ${item.productName}`}
                      className="size-16 shrink-0 rounded-md object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    {item.currentProductImage && (
                      <p className="text-xs text-muted-foreground">Current product image</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × {item.unitPrice}
                    </p>
                  </div>
                </div>
                <span className="font-medium">{item.subtotal}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p>{order.shippingName}</p>
            <p>{order.shippingPhone}</p>
            <p className="whitespace-pre-line">{order.shippingAddress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{order.shippingAmount}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>{order.totalAmount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Link to="/admin/orders" className="inline-block text-sm underline">
        Back to orders
      </Link>
    </div>
  );
};
