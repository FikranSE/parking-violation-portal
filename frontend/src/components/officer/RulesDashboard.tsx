'use client';

import { useState, useEffect } from 'react';
import { FineRule } from '@/types';

export default function RulesDashboard() {
  const [activeRule, setActiveRule] = useState<FineRule | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [expiredMeter, setExpiredMeter] = useState(0);
  const [noParking, setNoParking] = useState(0);

  useEffect(() => {
    fetchActiveRule();
  }, []);

  const fetchActiveRule = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/rules/active');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch rules');
      
      const rule = data.rule as FineRule;
      setActiveRule(rule);
      setExpiredMeter(rule.base_amounts.expired_meter || 0);
      setNoParking(rule.base_amounts.no_parking_zone || 0);
    } catch (err: any) {
      setErrorMsg('Failed to load active rules configuration.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRule) return;

    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

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
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!activeRule && !errorMsg) {
    return <div className="bg-white p-8 rounded-lg border border-neutral-200 animate-pulse h-64"></div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-neutral-200 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Fine Rules Dashboard</h2>
          <p className="text-sm text-neutral-500 mt-1">Configure baseline parameters for calculation.</p>
        </div>
        <span className="bg-neutral-900 text-white text-xs font-medium px-2 py-1 rounded">
          v{activeRule?.version} Active
        </span>
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

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-8">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 border-b border-neutral-200 pb-2">Base Fine Amounts</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-1.5">Expired Meter (IDR)</label>
              <input
                type="number"
                value={expiredMeter}
                onChange={(e) => setExpiredMeter(Number(e.target.value))}
                className="w-full px-3 py-2 bg-transparent border border-neutral-200 rounded-md text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-1.5">No Parking Zone (IDR)</label>
              <input
                type="number"
                value={noParking}
                onChange={(e) => setNoParking(Number(e.target.value))}
                className="w-full px-3 py-2 bg-transparent border border-neutral-200 rounded-md text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 border-b border-neutral-200 pb-2">Multiplier Configuration</h3>
          <div className="p-4 bg-neutral-50 rounded-md border border-neutral-200 text-sm text-neutral-600">
            <p className="font-medium text-neutral-900 mb-2">Time Multiplier:</p>
            <ul className="list-inside space-y-1 mb-4">
              <li className="flex gap-2"><span className="text-neutral-400">&bull;</span> 06:00 - 22:00 = 1.0x</li>
              <li className="flex gap-2"><span className="text-neutral-400">&bull;</span> 22:00 - 06:00 = 1.5x</li>
            </ul>
            <p className="font-medium text-neutral-900 mb-2">Repeat Offender Multiplier:</p>
            <ul className="list-inside space-y-1">
              <li className="flex gap-2"><span className="text-neutral-400">&bull;</span> 1st Offense = 1.0x</li>
              <li className="flex gap-2"><span className="text-neutral-400">&bull;</span> 2nd Offense = 1.5x</li>
              <li className="flex gap-2"><span className="text-neutral-400">&bull;</span> 3rd+ Offense = 2.0x</li>
            </ul>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white text-sm font-medium py-2.5 px-4 rounded-md hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Publishing...' : 'Publish New Rule Version'}
          </button>
        </div>
      </form>
    </div>
  );
}
