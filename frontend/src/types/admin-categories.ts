export interface CreateAdminCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  parentId: string | null;
}
