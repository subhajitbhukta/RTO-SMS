import React, { useMemo } from "react";
import StatCard from "../components/shared/StatCard";
import {
  FileQuestionMark,
  Wrench,
  Hourglass,
  Ban,
  CalendarDays,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ===== TYPES =====
type Service = {
  id: string | number;
  type: string;
  nextDue: string;
  vehicleId: string | number;
  status: "active" | "disputed" | "completed" | "overdue";
  amount?: number;
};

// ===== STATUS BADGE =====
const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    active: { bg: "bg-blue-100", text: "text-blue-800", label: "Active" },
    disputed: { bg: "bg-orange-100", text: "text-orange-800", label: "Disputed" },
    completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
    overdue: { bg: "bg-red-100", text: "text-red-800", label: "Overdue" },
  };
  const { bg, text, label } = config[status] || config.active;

  return (
    <span className={`${bg} ${text} px-3 py-1 rounded-full text-xs font-semibold`}>
      {label}
    </span>
  );
};

// ===== DASHBOARD =====
const Dashboard: React.FC = () => {
  // Static service data
  const services: Service[] = [
    { id: 1, type: "Oil Change", status: "active", nextDue: "2025-11-20", amount: 1500, vehicleId: 1 },
    { id: 2, type: "Tyre Replacement", status: "completed", nextDue: "2025-11-10", amount: 2500, vehicleId: 2 },
    { id: 3, type: "Brake Service", status: "disputed", nextDue: "2025-11-12", amount: 1200, vehicleId: 3 },
    { id: 4, type: "Car Wash", status: "overdue", nextDue: "2025-11-05", amount: 800, vehicleId: 4 },
    { id: 5, type: "Battery Check", status: "active", nextDue: "2025-11-21", amount: 1000, vehicleId: 5 },
  ];

  // Static payment data
  const paymentData = [
    { date: "Nov 1", amount: 1200 },
    { date: "Nov 2", amount: 900 },
    { date: "Nov 3", amount: 1500 },
    { date: "Nov 4", amount: 800 },
    { date: "Nov 5", amount: 1300 },
    { date: "Nov 6", amount: 1750 },
    { date: "Nov 7", amount: 1100 },
  ];

  // Status distribution for pie chart
  const statusDistribution = useMemo(() => {
    const dist = services.reduce((acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: "Active", value: dist.active || 0, color: "#3B82F6" },
      { name: "Disputed", value: dist.disputed || 0, color: "#F97316" },
      { name: "Completed", value: dist.completed || 0, color: "#10B981" },
      { name: "Overdue", value: dist.overdue || 0, color: "#EF4444" },
    ];
  }, [services]);

  // Total revenue
  const totalRevenue = paymentData.reduce((sum, day) => sum + day.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ===== STAT CARDS ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard icon={FileQuestionMark} label="Total Enquiries" value={102} color="bg-blue-500" />
          <StatCard icon={Wrench} label="Active Services" value={58} color="bg-purple-600" />
          <StatCard icon={Hourglass} label="Pending Payments" value={28} color="bg-amber-600" />
          <StatCard icon={Ban} label="Disputes" value={19} color="bg-red-600" />
          <StatCard icon={CalendarDays} label="Upcoming Reminders" value={68} color="bg-yellow-600" />
        </div>

        {/* ===== CHARTS ROW ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ===== BAR CHART (Payments) ===== */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between p-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Payment Collection Trend</h2>
                <p className="text-sm text-gray-600 mt-1">Daily collection (Bar Chart)</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }} />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: any) => [`₹${value}`, "Amount"]}
                />
                <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ===== PIE CHART (Service Status) ===== */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Service Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== RECENT SERVICES TABLE ===== */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Services</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Next Due</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{service.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {service.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={service.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {service.nextDue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{service.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
