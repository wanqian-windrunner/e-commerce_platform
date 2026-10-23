import type { CreateAdminCategoryPayload, UpdateAdminCategoryPayload } from "@/types/admin-categories";
import { z } from "zod";

// Mirrors backend/src/validations/category.validation.ts for category creation.
export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  slug: z.string().trim().min(2, "Slug must be at least 2 characters").max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  description: z.string().trim().max(1000),
  parentId: z.union([z.uuid(), z.literal("")]),
});

export type CategoryFormValues = z.output<typeof categoryFormSchema>;

export const toCreateCategoryPayload = (values: CategoryFormValues): CreateAdminCategoryPayload => ({
  name: values.name,
  slug: values.slug,
  description: values.description || undefined,
  parentId: values.parentId || null,
});

export const toUpdateCategoryPayload = (values: CategoryFormValues): UpdateAdminCategoryPayload => ({
  name: values.name,
  slug: values.slug,
  description: values.description || null,
  parentId: values.parentId || null,
});
