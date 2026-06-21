'use client';

import { TransactionHistoryItem } from '@/types';

// Mock history data based on the transaction GET endpoint
const mockHistory: TransactionHistoryItem[] = [
  {
    id: 1,
    license_plate: 'B 1234 XYZ',
    violation_type: 'expired_meter',
    location: 'Sudirman St.',
    violation_time: new Date(Date.now() - 86400000).toISOString(),
    rule_version_id: 1,
    calculated_fine: 50000,
    status: 'PAID',
    payment_status: 'SUCCESS',
    created_at: new Date(Date.now() - 80000000).toISOString(),
    updated_at: new Date(Date.now() - 80000000).toISOString(),
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
    payment_status: 'SUCCESS',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  }
];

export default function TransactionHistory() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Transaction & Audit History</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">Violation ID</th>
              <th scope="col" className="px-6 py-3 font-medium">Type & Location</th>
              <th scope="col" className="px-6 py-3 font-medium">Rule Version</th>
              <th scope="col" className="px-6 py-3 font-medium">Calculated Fine</th>
              <th scope="col" className="px-6 py-3 font-medium">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {mockHistory.map((item) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-gray-500">
                  #{item.id}
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 capitalize">{item.violation_type.replace(/_/g, ' ')}</p>
                  <p className="text-gray-500 text-xs">{item.location}</p>
                  <p className="text-gray-400 text-xs">{new Date(item.violation_time).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                    v{item.rule_version_id}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  IDR {item.calculated_fine.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {item.payment_status === 'SUCCESS' ? (
                    <span className="text-green-600 font-medium text-xs flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      SUCCESS
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium text-xs flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      FAILED
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
