import { parseApiError } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCart,
  useClearCart,
  useDeleteCartItem,
  useUpdateCartItem,
} from "@/hooks/useCart";
import { Link } from "react-router";

export const CartPage = () => {
  const { data: cart, isPending, isError, error } = useCart();
  const updateMutation = useUpdateCartItem();
  const deleteMutation = useDeleteCartItem();
  const clearMutation = useClearCart();

  const isMutating =
    updateMutation.isPending ||
    deleteMutation.isPending ||
    clearMutation.isPending;

  const handleClearCart = () => {
    if (window.confirm("Remove all items from your cart?")) {
      clearMutation.mutate();
    }
  };

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }
  if (isError) {
    return <p className="text-destructive">{parseApiError(error)}</p>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Your cart</h1>
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link to="/products" className="underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Your cart</h1>
        <Button
          type="button"
          variant="destructive"
          disabled={isMutating}
          onClick={handleClearCart}
        >
          {clearMutation.isPending ? "Clearing..." : "Clear cart"}
        </Button>
      </div>

      <ul className="divide-y rounded-xl border">
        {cart.items.map((item) => (
          <li key={item.id} className="flex gap-4 p-4">
            {item.product.imageUrl ? (
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="size-20 rounded-md object-cover"
              />
            ) : (
              <div className="flex size-20 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                No image
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-muted-foreground">
                Unit price: {item.product.price}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label={`Decrease ${item.product.name}`}
                  disabled={isMutating || !item.product.isActive}
                  onClick={() => {
                    if (item.quantity === 1) {
                      deleteMutation.mutate(item.productId);
                    } else {
                      updateMutation.mutate({
                        productId: item.productId,
                        quantity: item.quantity - 1,
                      });
                    }
                  }}
                >
                  -
                </Button>
                <span>{item.quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label={`Increase ${item.product.name}`}
                  disabled={
                    isMutating ||
                    !item.product.isActive ||
                    item.quantity >= Math.min(100, item.product.stock)
                  }
                  onClick={() =>
                    updateMutation.mutate({
                      productId: item.productId,
                      quantity: item.quantity + 1,
                    })
                  }
                >
                  +
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  disabled={isMutating}
                  onClick={() => deleteMutation.mutate(item.productId)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {updateMutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          {parseApiError(updateMutation.error)}
        </p>
      )}
      {deleteMutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          {parseApiError(deleteMutation.error)}
        </p>
      )}
      {clearMutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          {parseApiError(clearMutation.error)}
        </p>
      )}

      <div className="text-right">
        <p>Total items: {cart.totalItems}</p>
        <p className="text-lg font-semibold">Subtotal: {cart.subtotal}</p>
      </div>
    </div>
  );
};
