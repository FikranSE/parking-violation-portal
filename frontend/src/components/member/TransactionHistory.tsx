'use client';

import { useState, useEffect } from 'react';
import { Violation } from '@/types';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/transactions');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch history');
      
      const sorted = (data.data || []).sort((a: Violation, b: Violation) => 
        new Date(b.created_at || b.violation_time).getTime() - new Date(a.created_at || a.violation_time).getTime()
      );
      setTransactions(sorted);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-neutral-200 bg-neutral-50/50">
        <h3 className="font-semibold tracking-tight text-neutral-900">Transaction Ledger</h3>
        <p className="text-sm text-neutral-500 mt-1">Immutable record of all violation states and rule versions.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-600 font-medium border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 whitespace-nowrap">ID</th>
              <th className="px-6 py-3 whitespace-nowrap">License Plate</th>
              <th className="px-6 py-3 whitespace-nowrap">Type</th>
              <th className="px-6 py-3 whitespace-nowrap">Rule Ver</th>
              <th className="px-6 py-3 text-right whitespace-nowrap">Calculated Fine</th>
              <th className="px-6 py-3 text-right whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-neutral-400">Loading records...</td>
              </tr>
            ) : errorMsg ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-red-600">{errorMsg}</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">No transactions recorded yet.</td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500">#{txn.id}</td>
                  <td className="px-6 py-4 font-medium text-neutral-900">{txn.license_plate}</td>
                  <td className="px-6 py-4 text-neutral-600 capitalize">{txn.violation_type.replace(/_/g, ' ')}</td>
                  <td className="px-6 py-4">
                    <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200 text-xs font-mono">v{txn.rule_version_id}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-neutral-900">
                    IDR {txn.calculated_fine.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {txn.status === 'PAID' ? (
                      <span className="text-neutral-500 font-medium text-xs">PAID</span>
                    ) : (
                      <span className="text-red-600 font-medium text-xs">UNPAID</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
