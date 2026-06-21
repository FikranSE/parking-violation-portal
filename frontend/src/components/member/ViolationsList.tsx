'use client';

import { useState } from 'react';
import { Violation } from '@/types';
import PaymentModal from './PaymentModal';

export default function ViolationsList() {
  const [licensePlate, setLicensePlate] = useState('');
  const [violations, setViolations] = useState<Violation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licensePlate.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setHasSearched(true);

    try {
      const res = await fetch(`http://localhost:8080/api/violations/${encodeURIComponent(licensePlate)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch violations');
      
      const sortedData = (data.data || []).sort((a: Violation, b: Violation) => 
        new Date(b.violation_time).getTime() - new Date(a.violation_time).getTime()
      );
      setViolations(sortedData);
    } catch (err: any) {
      setErrorMsg(err.message);
      setViolations([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    handleSearch({ preventDefault: () => {} } as React.FormEvent);
    setSelectedViolation(null);
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 mb-12">
      <div className="px-6 py-5 border-b border-neutral-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="font-semibold tracking-tight text-neutral-900">Your Violations</h3>
          <p className="text-sm text-neutral-500">Search by license plate to view active and settled fines.</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <input 
            type="text" 
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
            placeholder="e.g. B 1234 XYZ"
            className="w-full sm:w-64 px-3 py-2 bg-transparent border border-neutral-200 rounded-md text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Find'}
          </button>
        </form>
      </div>
      
      <div className="divide-y divide-neutral-200">
        {errorMsg ? (
          <div className="p-12 text-center text-red-600 text-sm">{errorMsg}</div>
        ) : !hasSearched ? (
           <div className="p-12 text-center text-neutral-400 text-sm">Enter a license plate to view outstanding records.</div>
        ) : violations.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 text-sm">
            No active violations found for <span className="font-semibold text-neutral-900">{licensePlate}</span>
          </div>
        ) : (
          violations.map((violation) => (
            <div key={violation.id} className={`p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6 ${violation.status === 'PAID' ? 'bg-neutral-50/50' : ''}`}>
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  {violation.status === 'UNPAID' ? (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded-sm">Unpaid</span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-sm">Settled</span>
                  )}
                  <span className="text-neutral-900 text-sm font-semibold capitalize">{violation.violation_type.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-neutral-600 text-sm font-medium">{violation.location}</p>
                <p className="text-neutral-400 text-xs">{new Date(violation.violation_time).toLocaleString()}</p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-neutral-500 mb-0.5">Calculated Fine</p>
                  <p className={`font-semibold text-lg ${violation.status === 'PAID' ? 'text-neutral-400' : 'text-neutral-900'}`}>
                    IDR {violation.calculated_fine.toLocaleString()}
                  </p>
                </div>
                
                {violation.status === 'UNPAID' ? (
                  <button 
                    onClick={() => setSelectedViolation(violation)}
                    className="bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors border border-transparent shrink-0"
                  >
                    Pay Now
                  </button>
                ) : (
                  <button 
                    disabled
                    className="bg-transparent text-neutral-400 px-5 py-2 rounded-md text-sm font-medium border border-neutral-200 shrink-0 cursor-not-allowed"
                  >
                    Settled
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedViolation && (
        <PaymentModal 
          violationId={selectedViolation.id}
          amount={selectedViolation.calculated_fine}
          onClose={() => setSelectedViolation(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
