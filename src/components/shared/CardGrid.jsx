// components/common/CardGrid.jsx
const CardGrid = ({ items, renderCard, emptyMessage = "No items found" }) => {
  if (!items?.length)
    return (
      <p className="text-center text-gray-500 mt-6">{emptyMessage}</p>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(renderCard)}
    </div>
  );
};

export default CardGrid;
