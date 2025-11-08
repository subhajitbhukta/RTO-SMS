import React, { useState } from "react";
import { Users, Car, Bell, AlertCircle } from "lucide-react";
import StatCard from "./shared/StatCard.tsx";
import ServiceCard from "./shared/ServiceCard.tsx";
import CardGrid from "./shared/CardGrid.tsx";
import DataTable from "./shared/DataTable.tsx";
import ViewToggle from "./shared/ViewToggle.tsx";
import { getDaysUntil } from "./utils/dateUtils";

// ===== TYPES =====
type Service = {
  id: string | number;
  type: string;
  nextDue: string;
  vehicleId: string | number;
};

type Vehicle = {
  id: string | number;
  model: string;
  plate: string;
  clientId: string | number;
};

type Client = {
  id: string | number;
  name: string;
};

type Stats = {
  totalClients: number;
  totalVehicles: number;
  upcomingServices: number;
  overdueServices: number;
};

type DashboardProps = {
  stats: Stats;
  services: Service[];
  vehicles: Vehicle[];
  clients: Client[];
};

// ===== COMPONENT =====

const Dashboard: React.FC<DashboardProps> = ({
  stats,
  services,
  vehicles,
  clients,
}) => {
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const recentServices = services.slice(0, 10);

const renderCard = (service: any) => (
  <ServiceCard
    key={service.id}
    service={service}
    vehicles={vehicles}
    clients={clients}
  />
);


  const columns = ["Service", "Vehicle", "Client", "Next Due", "Days Left"];

  const renderRow = (service: Service) => {
    const vehicle = vehicles.find((v) => v.id === service.vehicleId);
    const client = clients.find((c) => c.id === vehicle?.clientId);
    const daysLeft = getDaysUntil(service.nextDue);

    const statusColor =
      daysLeft < 0
        ? "text-red-600"
        : daysLeft <= 15
        ? "text-amber-600"
        : "text-green-600";

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
      </tr>
    );
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Clients"
          value={stats.totalClients}
          color="bg-blue-600"
        />
        <StatCard
          icon={Car}
          label="Total Vehicles"
          value={stats.totalVehicles}
          color="bg-purple-600"
        />
        <StatCard
          icon={Bell}
          label="Upcoming (15d)"
          value={stats.upcomingServices}
          color="bg-amber-600"
        />
        <StatCard
          icon={AlertCircle}
          label="Overdue"
          value={stats.overdueServices}
          color="bg-red-600 mt-2"
        />
      </div>

      <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 shadow-sm">
        <div className="flex sm:flex-row justify-between items-center mb-3 sm:mb-4 md:mb-6 gap-2 sm:gap-4">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
            Recent Services
          </h2>
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>

        {viewMode === "card" ? (
          <CardGrid
            items={recentServices}
            renderCard={renderCard}
            emptyMessage="No recent services found"
          />
        ) : (
          <DataTable
            columns={columns}
            data={recentServices}
            renderRow={renderRow}
            emptyMessage="No recent services found"
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
