import { Link, useParams } from "react-router";
import { parseApiError } from "@/api/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrderById } from "@/hooks/useOrders";

export const OrderDetailPage = () => {
  const { id } = useParams();
  const { data: order, isPending, isError, error } = useOrderById(id ?? "");

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
        <Link to="/products" className="text-sm underline">
          Back to products
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
        </div>
      </div>

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
                <div>
                  <p className="font-medium">{item.productName}</p>
                  {item.productSku && (
                    <p className="text-xs text-muted-foreground">
                      SKU: {item.productSku}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} × {item.unitPrice}
                  </p>
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
              <span>Tax</span>
              <span>{order.taxAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{order.shippingAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>{order.discountAmount}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>{order.totalAmount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Link to="/products" className="inline-block text-sm underline">
        Continue shopping
      </Link>
    </div>
  );
};
