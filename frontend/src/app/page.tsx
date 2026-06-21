'use client';

import { useState } from 'react';
import { Role } from '@/types';
import ViolationForm from '@/components/officer/ViolationForm';
import RulesDashboard from '@/components/officer/RulesDashboard';
import ViolationsList from '@/components/member/ViolationsList';
import TransactionHistory from '@/components/member/TransactionHistory';

export default function Home() {
  const [role, setRole] = useState<Role>('OFFICER');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Global Header / Role Switcher */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Parking Violation Portal
            </h1>
          </div>
          
          <div className="flex items-center space-x-3 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setRole('OFFICER')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                role === 'OFFICER' 
                  ? 'bg-white shadow-sm text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Officer View
            </button>
            <button
              onClick={() => setRole('MEMBER')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                role === 'MEMBER' 
                  ? 'bg-white shadow-sm text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Member View
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {role === 'OFFICER' ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Officer Dashboard</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200">
                  System Active
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-600 mb-6">Use the form below to record a new parking violation. The system will automatically calculate the fine based on current rules.</p>
                  <ViolationForm />
                </div>
                <div>
                  <RulesDashboard />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Member Portal</h2>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-green-200">
                  Welcome Back
                </span>
              </div>
              
              <ViolationsList />
              
              <TransactionHistory />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
