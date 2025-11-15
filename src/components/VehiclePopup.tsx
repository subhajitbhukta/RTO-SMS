import { useState } from "react";

export const AddVehiclePopup = ({ onClose, onSave }: any) => {
  const [form, setForm] = useState({
    vehicle_no: "",
    chassis_no: "",
    engine_no: "",
    manufacturer: "",
    registration_date: "",
    owner_name: "",
    notes: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isDisabled = !form.vehicle_no.trim();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Add Vehicle</h2>

        {/* Vehicle No */}
        <input
          type="text"
          placeholder="Vehicle No *"
          value={form.vehicle_no}
          onChange={(e) => handleChange("vehicle_no", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3"
        />

        {/* Chassis No */}
        <input
          type="text"
          placeholder="Chassis No"
          value={form.chassis_no}
          onChange={(e) => handleChange("chassis_no", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3"
        />

        {/* Engine No */}
        <input
          type="text"
          placeholder="Engine No"
          value={form.engine_no}
          onChange={(e) => handleChange("engine_no", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3"
        />

        {/* Manufacturer */}
        <input
          type="text"
          placeholder="Manufacturer"
          value={form.manufacturer}
          onChange={(e) => handleChange("manufacturer", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3"
        />

        {/* Registration Date */}
        <label className="text-sm text-slate-600">Registration Date</label>
        <input
          type="date"
          value={form.registration_date}
          onChange={(e) => handleChange("registration_date", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3"
        />

        {/* Owner Name */}
        <input
          type="text"
          placeholder="Owner Name"
          value={form.owner_name}
          onChange={(e) => handleChange("owner_name", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3"
        />

        {/* Notes */}
        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4"
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            className="flex-1 border border-slate-300 py-2 rounded-lg hover:bg-slate-100"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            disabled={isDisabled}
            onClick={() => alert("in Development Phase")}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
