import React, { useState } from "react";
import { Mail, Phone } from "lucide-react";
import ViewToggle from "./shared/ViewToggle";
import CardGrid from "./shared/CardGrid";
import DataTable from "./shared/DataTable";

const Clients = ({ clients }) => {
  const [viewMode, setViewMode] = useState("card");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter by search term
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ========== CARD VIEW ==========
  const renderCard = (client) => (
    <div
      key={client.id}
      className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-blue-600 w-14 h-14 rounded-lg flex items-center justify-center text-white text-xl font-bold">
          {client.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-gray-900 font-bold text-lg">{client.name}</h3>
          <p className="text-gray-500 text-sm">
            {client.vehicles || 0} Vehicles
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <Mail className="w-4 h-4 text-gray-400" />
          {client.email ? (
            <a
              href={`mailto:${client.email}`}
              className="text-blue-600 hover:underline"
            >
              {client.email}
            </a>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <Phone className="w-4 h-4 text-gray-400" />
          {client.phone ? (
            <a
              href={`https://wa.me/${client.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              {client.phone}
            </a>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </div>
      </div>
    </div>
  );

  // ========== TABLE VIEW ==========
  const columns = ["Name", "Email", "Phone", "Vehicles"];

  const renderRow = (client) => (
    <tr key={client.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {client.name}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">
        {client.email ? (
          <a
            href={`mailto:${client.email}`}
            className="text-blue-600 hover:underline"
          >
            {client.email}
          </a>
        ) : (
          <span className="text-gray-400">N/A</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">
        {client.phone ? (
          <a
            href={`https://wa.me/${client.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            {client.phone}
          </a>
        ) : (
          <span className="text-gray-400">N/A</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">
        {client.vehicles || 0}
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Header + Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-row md:flex-row justify-between gap-4 items-center">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Content */}
      {viewMode === "card" ? (
        <CardGrid
          items={filteredClients}
          renderCard={renderCard}
          emptyMessage="No clients found"
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredClients}
          renderRow={renderRow}
          emptyMessage="No clients found"
        />
      )}
    </div>
  );
};

export default Clients;
