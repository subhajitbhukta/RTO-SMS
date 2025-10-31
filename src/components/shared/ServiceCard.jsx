import { getDaysUntil } from '../utils/dateUtils';
import { Clock, CheckCircle, AlertCircle, Calendar, Mail, Phone, FileText } from 'lucide-react';

const ServiceCard = ({ service, vehicles, clients }) => {
  const vehicle = vehicles.find(v => v.id === service.vehicleId);
  const client = clients.find(c => c.id === vehicle?.clientId);
  const daysUntil = getDaysUntil(service.nextDue);

  const statusConfig = {
    upcoming: { color: 'bg-blue-100 text-blue-700', text: 'Upcoming', icon: Clock },
    completed: { color: 'bg-green-100 text-green-700', text: 'Completed', icon: CheckCircle },
    overdue: { color: 'bg-red-100 text-red-700', text: 'Overdue', icon: AlertCircle },
    scheduled: { color: 'bg-purple-100 text-purple-700', text: 'Scheduled', icon: Calendar }
  };

  const config = statusConfig[service.status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-xl p-5  border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-gray-900 font-bold text-lg mb-1">{service.type}</h3>
          <p className="text-gray-600 text-sm">{vehicle?.model} • {vehicle?.plate}</p>
          <p className="text-gray-500 text-xs mt-1">{client?.name}</p>
        </div>
        <span className={`${config.color} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
          <StatusIcon className="w-3 h-3" />
          {config.text}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <p className="text-gray-500 text-xs mb-1">Next Due</p>
          <p className="text-gray-900 font-semibold text-sm">{service.nextDue}</p>
          <p className={`text-xs mt-1 ${daysUntil < 0 ? 'text-red-600' : daysUntil <= 15 ? 'text-amber-600' : 'text-green-600'}`}>
            {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days left`}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <p className="text-gray-500 text-xs mb-1">Cost</p>
          <p className="text-gray-900 font-bold text-lg">${service.cost}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
          <Mail className="w-4 h-4" />
          Email
        </button>
        <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2">
          <Phone className="w-4 h-4" />
          WhatsApp
        </button>
      </div>

      {service.documents.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-gray-600 text-xs mb-2 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Documents
          </p>
          <div className="flex gap-2 flex-wrap">
            {service.documents.map((doc, i) => (
              <span key={i} className="bg-gray-100 px-2 py-1 rounded text-gray-700 text-xs border border-gray-200">
                {doc}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
