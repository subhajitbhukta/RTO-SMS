import React from "react";
import { LayoutGrid, Table } from "lucide-react";

type ViewMode = "card" | "table";

type ViewToggleProps = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
};

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => (
  <div className="inline-flex rounded-lg border border-gray-300 bg-white">
    <button
      onClick={() => setViewMode("card")}
      className={`px-4 py-2 rounded-l-lg flex items-center gap-2 transition-colors ${
        viewMode === "card"
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <LayoutGrid size={18} />
      Card
    </button>

    <button
      onClick={() => setViewMode("table")}
      className={`px-4 py-2 rounded-r-lg flex items-center gap-2 transition-colors ${
        viewMode === "table"
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Table size={18} />
      Table
    </button>
  </div>
);

export default ViewToggle;
