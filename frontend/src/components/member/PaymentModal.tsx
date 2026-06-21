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

  const handlePay = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('http://localhost:8080/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          violation_id: violationId,
          amount: amount,
          payment_scenario: scenario
        })
      });
      
      const data = await res.json();
      
      if (!res.ok || data.payment?.status === 'failed') {
        throw new Error(data.message || 'Payment failed');
      }
      
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md border border-neutral-200 overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-neutral-200 flex justify-between items-center bg-neutral-50/50">
          <h3 className="font-semibold tracking-tight text-neutral-900">Settle Violation #{violationId}</h3>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-md border border-neutral-200">
            <span className="text-sm font-medium text-neutral-600">Total Due</span>
            <span className="text-xl font-bold text-neutral-900">IDR {amount.toLocaleString()}</span>
          </div>
          
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded-md border border-red-200">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-800 mb-2">Simulate Payment Gateway Scenario</label>
            <select 
              value={scenario}
              onChange={(e) => setScenario(e.target.value as 'success' | 'failed')}
              className="w-full px-3 py-2 bg-transparent border border-neutral-200 rounded-md text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
            >
              <option value="success">Success (Card Accepted)</option>
              <option value="failed">Failed (Insufficient Funds)</option>
            </select>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-neutral-600 bg-transparent border border-neutral-300 rounded-md hover:bg-neutral-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handlePay}
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
