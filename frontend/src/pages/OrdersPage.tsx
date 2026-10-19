import { useState } from "react";
import { Link } from "react-router";
import { parseApiError } from "@/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/useOrders";

export const OrdersPage = () => {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error } = useOrders({ page, limit: 10 });

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError) {
    return <p role="alert" className="text-destructive">{parseApiError(error)}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My orders</h1>

      {data.data.length === 0 ? (
        <div className="space-y-2">
          <p className="text-muted-foreground">No orders found.</p>
          <Link to="/products" className="text-sm underline">Browse products</Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {data.data.map((order) => (
            <li key={order.id}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Link to={`/orders/${order.id}`} className="hover:underline">
                      Order {order.orderNumber}
                    </Link>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Placed {new Date(order.createdAt).toLocaleString()}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Order: {order.status}</Badge>
                    <Badge variant="outline">Payment: {order.paymentStatus}</Badge>
                  </div>
                  <p className="font-semibold">Total: {order.totalAmount}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {data.pagination.totalPages > 0 && (
        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={!data.pagination.hasPreviousPage}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={!data.pagination.hasNextPage}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
