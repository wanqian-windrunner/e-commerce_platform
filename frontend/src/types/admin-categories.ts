export interface CreateAdminCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  parentId: string | null;
}

export interface UpdateAdminCategoryPayload {
  name?: string;
  slug?: string;
  description?: string | null;
  parentId?: string | null;
  isActive?: boolean;
}
