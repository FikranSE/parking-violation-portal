'use client';

import { useState } from 'react';
import { Violation } from '@/types';
import PaymentModal from './PaymentModal';

// Mock data for demonstration purposes
const mockViolations: Violation[] = [
  {
    id: 1,
    license_plate: 'B 1234 XYZ',
    violation_type: 'expired_meter',
    location: 'Sudirman St.',
    violation_time: new Date(Date.now() - 86400000).toISOString(),
    rule_version_id: 1,
    calculated_fine: 50000,
    status: 'UNPAID',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    license_plate: 'B 1234 XYZ',
    violation_type: 'no_parking_zone',
    location: 'Thamrin St.',
    violation_time: new Date(Date.now() - 5 * 86400000).toISOString(),
    rule_version_id: 1,
    calculated_fine: 150000,
    status: 'PAID',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export default function ViolationsList() {
  const [licensePlate, setLicensePlate] = useState('B 1234 XYZ');
  const [violations, setViolations] = useState<Violation[]>(mockViolations);
  
  // Payment Modal State
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate fetching based on license plate
    // In reality, this would be a GET request to /api/violations/:licensePlate
    if (licensePlate.trim() === 'B 1234 XYZ') {
      setViolations(mockViolations);
    } else {
      setViolations([]);
    }
  };

  const handlePaymentSuccess = () => {
    // Update local state to reflect paid status
    if (selectedViolation) {
      setViolations(violations.map(v => 
        v.id === selectedViolation.id ? { ...v, status: 'PAID' } : v
      ));
    }
    setSelectedViolation(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
      {/* Search Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h3 className="font-semibold text-gray-800">Your Violations</h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text" 
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            placeholder="Search License Plate"
            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 w-48"
          />
          <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700">
            Find
          </button>
        </form>
      </div>
      
      {/* Violations List */}
      <div className="divide-y divide-gray-100">
        {violations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No violations found for this license plate.
          </div>
        ) : (
          violations.map((violation) => (
            <div key={violation.id} className={`p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${violation.status === 'PAID' ? 'opacity-75' : ''}`}>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  {violation.status === 'UNPAID' ? (
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">UNPAID</span>
                  ) : (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">PAID</span>
                  )}
                  <span className="text-gray-500 text-sm font-medium capitalize">{violation.violation_type.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-gray-900 font-medium">{violation.location}</p>
                <p className="text-gray-500 text-sm">{new Date(violation.violation_time).toLocaleString()}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Fine Amount</p>
                  <p className="font-bold text-gray-900 text-lg">IDR {violation.calculated_fine.toLocaleString()}</p>
                </div>
                
                {violation.status === 'UNPAID' ? (
                  <button 
                    onClick={() => setSelectedViolation(violation)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-medium transition-colors shadow-sm"
                  >
                    Pay Now
                  </button>
                ) : (
                  <button 
                    disabled
                    className="bg-gray-100 text-gray-400 px-5 py-2 rounded-md font-medium border border-gray-200"
                  >
                    Settled
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Render Modal conditionally */}
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
