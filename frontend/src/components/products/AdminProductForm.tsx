import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { productFormSchema, type ProductFormInput, type ProductFormValues } from "@/lib/validations/product";
import type { Category } from "@/types/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface AdminProductFormProps {
  categories: Category[];
  initialValues?: ProductFormInput;
  submitting: boolean;
  submitLabel: string;
  onSubmit: (values: ProductFormValues) => void;
}

export const AdminProductForm = ({
  categories,
  initialValues,
  submitting,
  submitLabel,
  onSubmit,
}: AdminProductFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialValues ?? {
      name: "",
      sku: "",
      categoryId: "",
      description: "",
      price: "",
      stock: "0",
      imageUrl: "",
      isActive: true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="product-name">Name</FieldLabel>
          <Input id="product-name" {...register("name")} />
          <FieldError errors={[errors.name]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="product-sku">SKU</FieldLabel>
          <Input id="product-sku" {...register("sku")} />
          <FieldError errors={[errors.sku]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="product-category">Category</FieldLabel>
          <select
            id="product-category"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            {...register("categoryId")}
          >
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}{category.isActive ? "" : " (inactive)"}</option>
            ))}
          </select>
          <FieldError errors={[errors.categoryId]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="product-description">Description</FieldLabel>
          <textarea
            id="product-description"
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register("description")}
          />
          <FieldError errors={[errors.description]} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="product-price">Price</FieldLabel>
            <Input id="product-price" type="number" min="0" step="0.01" {...register("price")} />
            <FieldError errors={[errors.price]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="product-stock">Stock</FieldLabel>
            <Input id="product-stock" type="number" min="0" step="1" {...register("stock")} />
            <FieldError errors={[errors.stock]} />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="product-image">Image URL</FieldLabel>
          <Input id="product-image" type="url" {...register("imageUrl")} />
          <FieldError errors={[errors.imageUrl]} />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isActive")} />
          Active
        </label>
        <Button type="submit" disabled={submitting || categories.length === 0}>
          {submitting ? "Saving..." : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
};
