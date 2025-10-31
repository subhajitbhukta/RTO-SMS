// components/common/DataTable.jsx
const DataTable = ({ columns, data, renderRow, emptyMessage = "No records found" }) => {
  if (!data?.length)
    return <p className="text-center text-gray-500 mt-6">{emptyMessage}</p>;

  return (
    <div className="bg-white rounded-lg border border-gray-400 mt-2 shadow-md overflow-hidden">
      <div className="overflow-x-auto ">
        <table className="w-full  ">
          <thead className="bg-gray-50 border-b border-gray-300 ">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6  py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map(renderRow)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
