import React from "react";

type StatCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string | number;
  color: string;
};

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between gap-2">
      <div className="flex-1 min-w-0">
        <p className="text-gray-600 text-xs sm:text-sm mb-0.5 sm:mb-1 truncate">{label}</p>
        <p className="text-gray-900 text-lg sm:text-xl font-bold">{value}</p>
      </div>

      <div className={`${color} p-2.5 sm:p-3 rounded-lg flex-shrink-0`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
    </div>
  </div>
);

export default StatCard;
