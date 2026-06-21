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
      setSuccessMsg(`Violation recorded. Calculated Fine: IDR ${created.calculated_fine.toLocaleString()}`);
      
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
    <div className="bg-white p-8 rounded-lg border border-neutral-200">
      <div className="mb-8">
        <h3 className="text-lg font-semibold tracking-tight text-neutral-900">Submit Violation</h3>
        <p className="text-sm text-neutral-500 mt-1">Record a new incident into the system.</p>
      </div>
      
      {successMsg && (
        <div className="mb-6 p-4 bg-neutral-50 text-neutral-900 text-sm font-medium rounded-md border border-neutral-200 flex items-center gap-2">
          <svg className="w-4 h-4 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-neutral-50 text-red-600 text-sm font-medium rounded-md border border-red-200 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1.5">License Plate</label>
          <input
            type="text"
            name="license_plate"
            required
            value={formData.license_plate}
            onChange={handleChange}
            placeholder="e.g. B 1234 XYZ"
            className="w-full px-3 py-2 bg-transparent border border-neutral-200 rounded-md text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1.5">Violation Type</label>
          <div className="relative">
            <select
              name="violation_type"
              value={formData.violation_type}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-transparent border border-neutral-200 rounded-md text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors appearance-none"
            >
              <option value="expired_meter">Expired Meter (IDR 50k base)</option>
              <option value="no_parking_zone">No Parking Zone (IDR 150k base)</option>
              <option value="blocking_hydrant">Blocking Hydrant (IDR 250k base)</option>
              <option value="disabled_spot">Disabled Spot (IDR 500k base)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1.5">Location</label>
          <input
            type="text"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Sudirman St."
            className="w-full px-3 py-2 bg-transparent border border-neutral-200 rounded-md text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-800 mb-1.5">Timestamp</label>
            <input
              type="datetime-local"
              name="violation_time"
              required
              value={formData.violation_time}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-transparent border border-neutral-200 rounded-md text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-800 mb-1.5">Photo URL</label>
            <input
              type="url"
              name="photo_url"
              value={formData.photo_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-transparent border border-neutral-200 rounded-md text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white text-sm font-medium py-2.5 px-4 rounded-md hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Submit Record'}
          </button>
        </div>
      </form>
    </div>
  );
}
