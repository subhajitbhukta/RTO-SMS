import React, { useState, ChangeEvent } from "react";
import { X, Calendar, Clock, FileText, Car, Wrench } from "lucide-react";

interface Vehicle {
  id: string | number;
  model: string;
  plate: string;
}

interface FormDataType {
  serviceType: string;
  scheduledDate: string;
  scheduledTime: string;
  notes: string;
}

interface BookNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  vehicle?: Vehicle;
}

const BookNowModal: React.FC<BookNowModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vehicle,
}) => {
  const [formData, setFormData] = useState<FormDataType>({
    serviceType: "",
    scheduledDate: "",
    scheduledTime: "",
    notes: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!formData.serviceType || !formData.scheduledDate || !formData.scheduledTime) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit({
      ...formData,
      vehicleId: vehicle?.id,
      vehicleModel: vehicle?.model,
      vehiclePlate: vehicle?.plate,
    });

    setFormData({
      serviceType: "",
      scheduledDate: "",
      scheduledTime: "",
      notes: "",
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-white/20 animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Book Service</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Vehicle Info */}
        {vehicle && (
          <div className="mx-4 mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Car className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{vehicle.model}</p>
                <p className="text-sm text-gray-600">{vehicle.plate}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="p-4 space-y-3">
          <div className="relative">
            <Wrench className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all bg-white/50 appearance-none cursor-pointer"
            >
              <option value="">Select Service Type *</option>
              <option value="oil-change">Oil Change</option>
              <option value="tire-rotation">Tire Rotation</option>
              <option value="brake-service">Brake Service</option>
              <option value="general-inspection">General Inspection</option>
              <option value="engine-repair">Engine Repair</option>
              <option value="transmission">Transmission Service</option>
              <option value="ac-service">A/C Service</option>
              <option value="detailing">Detailing</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all bg-white/50"
            />
          </div>

          <div className="relative">
            <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="time"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all bg-white/50"
            />
          </div>

          <div className="relative">
            <FileText className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none bg-white/50"
              placeholder="Additional notes or concerns (Optional)"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
            >
              Book Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookNowModal;
