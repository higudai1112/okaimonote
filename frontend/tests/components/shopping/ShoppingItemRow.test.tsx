import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ShoppingItemRow } from "@/components/shopping/ShoppingItemRow";

const mockItem = {
  id: 1,
  name: "にんじん",
  memo: "特売品",
  purchased: false,
};

describe("ShoppingItemRow", () => {
  it("商品名とメモが表示される", () => {
    render(
      <ShoppingItemRow
        item={mockItem}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("にんじん")).toBeInTheDocument();
    expect(screen.getByText("特売品")).toBeInTheDocument();
  });

  it("購入済みの場合、打ち消し線が付く", () => {
    const purchasedItem = { ...mockItem, purchased: true };
    render(
      <ShoppingItemRow
        item={purchasedItem}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const nameEl = screen.getByText("にんじん");
    expect(nameEl).toHaveClass("line-through");
  });

  it("トグルボタンをクリックすると onToggle が呼ばれる", () => {
    const onToggle = vi.fn();
    render(
      <ShoppingItemRow item={mockItem} onToggle={onToggle} onDelete={vi.fn()} />
    );

    fireEvent.click(screen.getByRole("button", { name: /購入済みにする/ }));
    expect(onToggle).toHaveBeenCalledWith(1, false);
  });

  it("削除ボタンをクリックすると onDelete が呼ばれる", () => {
    const onDelete = vi.fn();
    render(
      <ShoppingItemRow
        item={mockItem}
        onToggle={vi.fn()}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /削除/ }));
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
