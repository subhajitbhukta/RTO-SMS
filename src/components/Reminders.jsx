import React, { useState, useMemo } from "react";
import { Bell, Search, Mail, MessageCircle } from "lucide-react";
import ViewToggle from "./shared/ViewToggle";
import CardGrid from "./shared/CardGrid";
import DataTable from "./shared/DataTable";
import ServiceCard from "./shared/ServiceCard";
import { getDaysUntil } from "./utils/dateUtils";

const Reminders = ({ services, vehicles, clients }) => {
  const [reminderFilter, setReminderFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'

  // Filter services
  const filteredServices = useMemo(() => {
    let filtered = services;

    if (reminderFilter === "15days") {
      filtered = filtered.filter((s) => {
        const days = getDaysUntil(s.nextDue);
        return days <= 15 && days >= 0;
      });
    } else if (reminderFilter === "60days") {
      filtered = filtered.filter((s) => {
        const days = getDaysUntil(s.nextDue);
        return days <= 60 && days >= 0;
      });
    } else if (reminderFilter === "overdue") {
      filtered = filtered.filter((s) => getDaysUntil(s.nextDue) < 0);
    }

    if (searchTerm) {
      filtered = filtered.filter((s) => {
        const vehicle = vehicles.find((v) => v.id === s.vehicleId);
        const client = clients.find((c) => c.id === vehicle?.clientId);
        return (
          vehicle?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    return filtered;
  }, [services, reminderFilter, searchTerm, vehicles, clients]);

  // ========== CARD VIEW ==========
  const renderCard = (service) => (
    <ServiceCard
      key={service.id}
      service={service}
      vehicles={vehicles}
      clients={clients}
    />
  );

  // ========== TABLE VIEW ==========
  const columns = [
    "Service",
    "Vehicle",
    "Client",
    "Next Due",
    "Days Left",
    "WhatsApp",
    "Email",
  ];

  const renderRow = (service) => {
    const vehicle = vehicles.find((v) => v.id === service.vehicleId);
    const client = clients.find((c) => c.id === vehicle?.clientId);
    const daysLeft = getDaysUntil(service.nextDue);
    const statusColor =
      daysLeft < 0
        ? "text-red-600"
        : daysLeft <= 15
        ? "text-yellow-600"
        : "text-green-600";

    const whatsappLink = client?.phone
      ? `https://wa.me/${client.phone.replace(/\D/g, "")}`
      : null;
    const emailLink = client?.email ? `mailto:${client.email}` : null;

    return (
      <tr key={service.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 text-sm font-medium text-gray-900">
          {service.type}
        </td>
        <td className="px-6 py-4 text-sm text-gray-700">{vehicle?.model}</td>
        <td className="px-6 py-4 text-sm text-gray-700">{client?.name}</td>
        <td className="px-6 py-4 text-sm text-gray-700">{service.nextDue}</td>
        <td className={`px-6 py-4 text-sm font-medium ${statusColor}`}>
          {daysLeft < 0
            ? `${Math.abs(daysLeft)} Days Overdue`
            : `${daysLeft} Days`}
        </td>

        {/* WhatsApp button */}
        <td className="px-6 py-4 text-sm text-gray-700">
          {whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Chat</span>
            </a>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </td>

        {/* Email button */}
        <td className="px-6 py-4 text-sm text-gray-700">
          {emailLink ? (
            <a
              href={emailLink}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Mail className="w-5 h-5" />
              <span className="hidden sm:inline">Email</span>
            </a>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-3">
      {/* FILTER BAR */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          {/* Search */}
          <div className="flex-1 relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by vehicle or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto">
            {["all", "15days", "60days", "overdue"].map((filter) => (
              <button
                key={filter}
                onClick={() => setReminderFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  reminderFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter === "15days"
                  ? "15 Days"
                  : filter === "60days"
                  ? "60 Days"
                  : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

      {/* CONTENT */}
      {viewMode === "card" ? (
        <CardGrid
          items={filteredServices}
          renderCard={renderCard}
          emptyMessage="No services found"
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredServices}
          renderRow={renderRow}
          emptyMessage="No services found"
        />
      )}

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="col-span-full bg-white rounded-xl p-12 border border-gray-200 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No reminders found</p>
        </div>
      )}
    </div>
  );
};

export default Reminders;
