import { Link, useLocation, useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types/products";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useAddCartItem } from "@/hooks/useCart";
import { toast } from "sonner";
import { parseApiError } from "@/api/client";

const formatPrice = (value: string) =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));

export const ProductCard = ({ product }: { product: Product }) => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const { mutate, isPending } = useAddCartItem();
  const navigate = useNavigate();
  const location = useLocation(); // 防止定义hook的时候直接调用了

  const unavailable = !product.isActive || product.stock < 1;

  const handleAddToCart = () => {
    // 没登录的话去登录
    if (!user) {
      navigate("/login", {
        state: {
          from: `${location.pathname}${location.search}${location.hash}`,
        },
      });
      return;
    }
    mutate(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => {
          toast.success(`${product.name} added to cart`);
        },
        onError: (mutationError) => {
          toast.error(parseApiError(mutationError));
        },
      },
    );
  };
  return (
    <Card className="h-full pt-0">
      <Link
        to={`/products/${product.slug}`}
        className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <div className="aspect-4/3 w-full overflow-hidden bg-muted">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2">{product.name}</CardTitle>
            {product.category && (
              <Badge variant="secondary" className="shrink-0">
                {product.category.name}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Link>

      <CardContent className="mt-auto">
        <p className="font-heading text-lg font-semibold">
          {formatPrice(product.price)}
        </p>
        <Button
          type="button"
          className="w-full"
          disabled={isLoading || isPending || unavailable}
          onClick={handleAddToCart}
        >
          {unavailable
            ? "Unavailable"
            : isPending
              ? "Adding..."
              : "Add to cart"}
        </Button>
      </CardContent>
    </Card>
  );
};
