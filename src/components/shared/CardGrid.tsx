import React from "react";

type CardGridProps<T> = {
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
};

const CardGrid = <T,>({ items, renderCard, emptyMessage = "No items found" }: CardGridProps<T>) => {
  if (!items?.length)
    return <p className="text-center text-gray-500 mt-6">{emptyMessage}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, i) => renderCard(item, i))}
    </div>
  );
};

export default CardGrid;
