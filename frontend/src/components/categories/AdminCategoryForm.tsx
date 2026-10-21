import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { categoryFormSchema, type CategoryFormValues } from "@/lib/validations/category";
import type { Category } from "@/types/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface AdminCategoryFormProps {
  categories: Category[];
  initialValues?: CategoryFormValues;
  categoryId?: string;
  submitting: boolean;
  submitLabel: string;
  onSubmit: (values: CategoryFormValues) => void;
}

export const AdminCategoryForm = ({ categories, initialValues, categoryId, submitting, submitLabel, onSubmit }: AdminCategoryFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialValues ?? { name: "", slug: "", description: "", parentId: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="category-name">Name</FieldLabel>
          <Input id="category-name" {...register("name")} />
          <FieldError errors={[errors.name]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="category-slug">Slug</FieldLabel>
          <Input id="category-slug" {...register("slug")} />
          <FieldError errors={[errors.slug]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="category-description">Description</FieldLabel>
          <textarea
            id="category-description"
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register("description")}
          />
          <FieldError errors={[errors.description]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="category-parent">Parent category</FieldLabel>
          <select
            id="category-parent"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            {...register("parentId")}
          >
            <option value="">None</option>
            {categories.filter((category) => category.id !== categoryId).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}{category.isActive ? "" : " (inactive)"}
              </option>
            ))}
          </select>
          <FieldError errors={[errors.parentId]} />
        </Field>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
};
