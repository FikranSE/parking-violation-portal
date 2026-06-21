'use client';

import { useState } from 'react';

interface PaymentModalProps {
  violationId: number;
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ violationId, amount, onClose, onSuccess }: PaymentModalProps) {
  const [scenario, setScenario] = useState<'success' | 'failed'>('success');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:8080/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          violation_id: violationId,
          amount: amount,
          scenario: scenario,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Payment processing error');
      }

      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Process Payment</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
          <p className="text-sm text-blue-800 mb-1">Amount Due</p>
          <p className="text-3xl font-bold text-blue-900">IDR {amount.toLocaleString()}</p>
          <p className="text-xs text-blue-600 mt-2">Violation ID: #{violationId}</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
            {errorMsg}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mock Payment Gateway Scenario
          </label>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value as 'success' | 'failed')}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="success">Simulate Successful Payment</option>
            <option value="failed">Simulate Failed Payment</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-200 disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
