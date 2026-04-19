"use client";

import { useCategories } from "@/hooks/useCategories";
import { CrudList } from "@/components/ui/CrudList";

export default function CategoriesPage() {
  const { categories, isLoading, createCategory, updateCategory, deleteCategory } =
    useCategories();

  return (
    <CrudList
      title="📂 カテゴリー管理"
      items={categories}
      isLoading={isLoading}
      onAdd={(name, memo) => createCategory({ name, memo: memo || null })}
      onUpdate={(id, name, memo) => updateCategory(id, { name, memo: memo || null })}
      onDelete={deleteCategory}
    />
  );
}
