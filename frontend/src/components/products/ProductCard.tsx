import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types/products";

const formatPrice = (value: string) =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));

export const ProductCard = ({ product }: { product: Product }) => (
  <Link
    to={`/products/${product.slug}`}
    className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
  >
    <Card className="h-full pt-0 transition-shadow group-hover:ring-foreground/20">
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

      <CardContent className="mt-auto">
        <p className="font-heading text-lg font-semibold">
          {formatPrice(product.price)}
        </p>
      </CardContent>
    </Card>
  </Link>
);
