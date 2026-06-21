'use client';

import { useState } from 'react';
import { Violation } from '@/types';

export default function ViolationForm() {
  const [formData, setFormData] = useState({
    license_plate: '',
    violation_type: 'expired_meter',
    location: '',
    violation_time: new Date().toISOString().slice(0, 16),
    photo_url: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // Formats timestamp correctly for Go backend
      const payload = {
        ...formData,
        violation_time: new Date(formData.violation_time).toISOString(),
      };

      const res = await fetch('http://localhost:8080/api/violations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit violation');
      }

      const created: Violation = data.violation;
      setSuccessMsg(`Violation submitted successfully! Calculated Fine: IDR ${created.calculated_fine}`);
      
      // Reset form
      setFormData({
        license_plate: '',
        violation_type: 'expired_meter',
        location: '',
        violation_time: new Date().toISOString().slice(0, 16),
        photo_url: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Submit Parking Violation</h2>
      
      {successMsg && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
          <input
            type="text"
            name="license_plate"
            required
            value={formData.license_plate}
            onChange={handleChange}
            placeholder="e.g. B 1234 XYZ"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Violation Type</label>
          <select
            name="violation_type"
            value={formData.violation_type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="expired_meter">Expired Meter (IDR 50k base)</option>
            <option value="no_parking_zone">No Parking Zone (IDR 150k base)</option>
            <option value="blocking_hydrant">Blocking Hydrant (IDR 250k base)</option>
            <option value="disabled_spot">Disabled Spot (IDR 500k base)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Sudirman St."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp</label>
          <input
            type="datetime-local"
            name="violation_time"
            required
            value={formData.violation_time}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL (Mock Upload)</label>
          <input
            type="text"
            name="photo_url"
            value={formData.photo_url}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Violation'}
        </button>
      </form>
    </div>
  );
}
