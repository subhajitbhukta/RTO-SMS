import { useState } from "react";

export const AddClientPopup = ({ onClose, onSave }: any) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isDisabled =
    !form.name.trim() || !form.email.trim() || !form.phone.trim();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Add New Client
        </h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Enter client name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Enter email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500"
        />

        {/* Phone */}
        <input
          type="text"
          placeholder="Enter phone number"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500"
        />

        {/* Address */}
        <textarea
          placeholder="Enter address"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500"
          rows={3}
        />

        <div className="flex gap-3">
          <button
            className="flex-1 border border-slate-300 py-2 rounded-lg hover:bg-slate-100"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
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
