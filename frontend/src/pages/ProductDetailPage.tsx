import { Link, useLocation, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { parseApiError } from "@/api/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddCartItem } from "@/hooks/useCart";
import { useProductBySlug } from "@/hooks/useProducts";
import { useAuthStore } from "@/stores/authStore";

const formatPrice = (value: string) =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const { data: product, isPending, isError, error } = useProductBySlug(slug ?? "");
  const { mutate, isPending: isAdding } = useAddCartItem();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();
  const location = useLocation();

  if (isPending) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="aspect-4/3 w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <p role="alert" className="text-destructive">{parseApiError(error)}</p>
        <Link to="/products" className="text-sm underline">Back to products</Link>
      </div>
    );
  }

  const unavailable = !product.isActive || product.stock < 1;

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login", {
        state: { from: `${location.pathname}${location.search}${location.hash}` },
      });
      return;
    }

    mutate(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => toast.success(`${product.name} added to cart`),
        onError: (mutationError) => toast.error(parseApiError(mutationError)),
      },
    );
  };

  return (
    <div className="space-y-6">
      <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to products
      </Link>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-4/3 overflow-hidden rounded-xl bg-muted">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <div className="space-y-5">
          {product.category && <Badge variant="secondary">{product.category.name}</Badge>}
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="font-heading text-2xl font-semibold">{formatPrice(product.price)}</p>
          {product.description && (
            <p className="whitespace-pre-line text-muted-foreground">{product.description}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {unavailable ? "Unavailable" : `${product.stock} in stock`}
          </p>
          <Button
            type="button"
            disabled={isLoading || isAdding || unavailable}
            onClick={handleAddToCart}
          >
            {unavailable ? "Unavailable" : isAdding ? "Adding..." : "Add to cart"}
          </Button>
        </div>
      </div>
    </div>
  );
};
