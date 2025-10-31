import React, { useState } from 'react';
import { X, Car, Calendar, Hash, Palette, Gauge, CreditCard, User } from 'lucide-react';

const AddVehicleModal = ({ isOpen, onClose, onSubmit, clients }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    vin: '',
    color: '',
    mileage: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (!formData.clientId || !formData.make || !formData.model || !formData.year || !formData.licensePlate) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
    setFormData({
      clientId: '',
      make: '',
      model: '',
      year: '',
      licensePlate: '',
      vin: '',
      color: '',
      mileage: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/20 animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50 sticky top-0 bg-white/95 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">New Vehicle</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 space-y-3">
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all bg-white/50 appearance-none cursor-pointer"
            >
              <option value="">Select Client *</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Car className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all bg-white/50"
                placeholder="Make *"
              />
            </div>

            <div className="relative">
              <Car className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all bg-white/50"
                placeholder="Model *"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1900"
                max="2099"
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all bg-white/50"
                placeholder="Year *"
              />
            </div>

            <div className="relative">
              <Palette className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all bg-white/50"
                placeholder="Color"
              />
            </div>
          </div>

          <div className="relative">
            <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all bg-white/50"
              placeholder="License Plate *"
            />
          </div>

          <div className="relative">
            <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              maxLength="17"
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all bg-white/50"
              placeholder="VIN (Optional)"
            />
          </div>

          <div className="relative">
            <Gauge className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              min="0"
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all bg-white/50"
              placeholder="Current Mileage"
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
              className="flex-1 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl shadow-lg shadow-green-500/30 transition-all"
            >
              Add Vehicle
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddVehicleModal;