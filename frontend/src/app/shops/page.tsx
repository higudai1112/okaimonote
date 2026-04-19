"use client";

import { useShops } from "@/hooks/useShops";
import { CrudList } from "@/components/ui/CrudList";

export default function ShopsPage() {
  const { shops, isLoading, createShop, updateShop, deleteShop } = useShops();

  return (
    <CrudList
      title="🏪 店舗管理"
      items={shops}
      isLoading={isLoading}
      onAdd={(name, memo) => createShop({ name, memo: memo || null })}
      onUpdate={(id, name, memo) => updateShop(id, { name, memo: memo || null })}
      onDelete={deleteShop}
    />
  );
}
