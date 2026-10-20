import { getCategories } from "@/api/categories.api";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () =>
  useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: getCategories,
    select: (response) => response.data,
  });
