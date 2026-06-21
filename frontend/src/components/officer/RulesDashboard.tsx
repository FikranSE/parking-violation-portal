'use client';

import { useState } from 'react';
import { FineRule } from '@/types';

// Mock active rule
const defaultRule: FineRule = {
  id: 1,
  version: 1,
  effective_from: new Date().toISOString(),
  base_amounts: {
    expired_meter: 50000,
    no_parking_zone: 150000,
    blocking_hydrant: 250000,
    disabled_spot: 500000,
  },
  time_multipliers: [
    { start_time: '06:00', end_time: '22:00', multiplier: 1.0 },
    { start_time: '22:00', end_time: '06:00', multiplier: 1.5 },
  ],
  repeat_multipliers: {
    '0': 1.0,
    '1': 1.5,
    '2+': 2.0,
  },
};

export default function RulesDashboard() {
  const [activeRule, setActiveRule] = useState<FineRule>(defaultRule);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form state
  const [expiredMeter, setExpiredMeter] = useState(activeRule.base_amounts.expired_meter);
  const [noParking, setNoParking] = useState(activeRule.base_amounts.no_parking_zone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const payload = {
        base_amounts: {
          ...activeRule.base_amounts,
          expired_meter: Number(expiredMeter),
          no_parking_zone: Number(noParking),
        },
        time_multipliers: activeRule.time_multipliers,
        repeat_multipliers: activeRule.repeat_multipliers,
      };

      const res = await fetch('http://localhost:8080/api/rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update rules');

      setActiveRule(data.rule);
      setSuccessMsg(`Successfully published Rule Version v${data.rule.version}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Fine Rules Dashboard</h2>
        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
          v{activeRule.version} Active
        </span>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 border-b pb-2">Base Fine Amounts</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Expired Meter (IDR)</label>
              <input
                type="number"
                value={expiredMeter}
                onChange={(e) => setExpiredMeter(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">No Parking Zone (IDR)</label>
              <input
                type="number"
                value={noParking}
                onChange={(e) => setNoParking(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 border-b pb-2">Multiplier Configuration</h3>
          <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
            <p className="font-medium mb-1">Time Multiplier:</p>
            <ul className="list-disc list-inside mb-2">
              <li>06:00-22:00 = 1.0x</li>
              <li>22:00-06:00 = 1.5x</li>
            </ul>
            <p className="font-medium mb-1">Repeat Offender Multiplier:</p>
            <ul className="list-disc list-inside">
              <li>1st Offense = 1.0x</li>
              <li>2nd Offense = 1.5x</li>
              <li>3rd+ Offense = 2.0x</li>
            </ul>
            <p className="text-xs text-gray-400 mt-2 italic">*Multipliers locked for this demo assignment.</p>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish New Rule Version'}
          </button>
        </div>
      </form>
    </div>
  );
}
