import { parseApiError } from "@/api/client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrders";
import { checkoutSchema, type CheckoutValues } from "@/lib/validations/order";
import type { CreatedOrder } from "@/types/orders";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

export const CheckoutPage = () => {
  const { data: cart, isPending, isError, error } = useCart();
  const createMutation = useCreateOrder();
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);

  // 使用 Zod 校验结算表单
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingName: "",
      shippingPhone: "",
      shippingAddress: "",
    },
  });

  if (createdOrder) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold"> Order placed</h1>
        <p>Order number: {createdOrder.orderNumber}</p>
        <p>Total: {createdOrder.totalAmount}</p>
        <Link to={`/orders/${createdOrder.id}`} className="block underline">
          View order details
        </Link>
        <Link to="/products" className="underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (isPending) {
    return <Skeleton className="h-64 w-full" />;
  }
  if (isError) {
    return (
      <p role="alert" className="text-destructive">
        {parseApiError(error)}
      </p>
    );
  }
  if (!cart || cart.items.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p>Your cart is empty.</p>
        <Link to="/cart" className="underline">
          Back to cart
        </Link>
      </div>
    );
  }
  const onSubmit = (value: CheckoutValues) => {
    createMutation.mutate(value, {
      onSuccess: (Response) => setCreatedOrder(Response.data),
    });
  };
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="shippingName">Recipient name</FieldLabel>
            <Input
              id="shippingName"
              autoComplete="name"
              {...register("shippingName")}
            />
            <FieldError errors={[errors.shippingName]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="shippingPhone">Phone</FieldLabel>
            <Input
              id="shippingPhone"
              type="tel"
              autoComplete="tel"
              {...register("shippingPhone")}
            />
            <FieldError errors={[errors.shippingPhone]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="shippingAddress">Shipping address</FieldLabel>
            <Input
              id="shippingAddress"
              autoComplete="street-address"
              {...register("shippingAddress")}
            />
            <FieldError errors={[errors.shippingAddress]} />
          </Field>

          <p className="text-sm text-muted-foreground">
            Cart subtotal: {cart.subtotal}. Final amount is determined by the
            server.
          </p>

          {createMutation.isError && (
            <p role="alert" className="text-sm text-destructive">
              {parseApiError(createMutation.error)}
            </p>
          )}

          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Placing order..." : "Place order"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};
