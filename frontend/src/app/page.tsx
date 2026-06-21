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
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-200">
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-neutral-900 rounded-sm flex items-center justify-center text-white text-xs font-bold">
              P
            </div>
            <h1 className="text-sm font-semibold tracking-tight text-neutral-900">
              Parking Violation Portal
            </h1>
          </div>
          
          <div className="flex items-center gap-1 bg-neutral-100/50 p-1 rounded-md border border-neutral-200">
            <button
              onClick={() => setRole('OFFICER')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                role === 'OFFICER' 
                  ? 'bg-white border border-neutral-200 text-neutral-900' 
                  : 'text-neutral-500 hover:text-neutral-900 border border-transparent'
              }`}
            >
              Officer View
            </button>
            <button
              onClick={() => setRole('MEMBER')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                role === 'MEMBER' 
                  ? 'bg-white border border-neutral-200 text-neutral-900' 
                  : 'text-neutral-500 hover:text-neutral-900 border border-transparent'
              }`}
            >
              Member View
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto px-6 py-12">
        <div className="animate-in fade-in duration-500">
          {role === 'OFFICER' ? (
            <div className="space-y-12">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Officer Dashboard</h2>
                <p className="text-sm text-neutral-500 max-w-2xl">
                  Record new parking violations or manage the system's dynamic fine configuration rules.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                  <ViolationForm />
                </div>
                <div>
                  <RulesDashboard />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Member Portal</h2>
                  <p className="text-sm text-neutral-500 max-w-2xl">
                    View your parking violations and settle outstanding fines.
                  </p>
                </div>
                <span className="bg-neutral-100 text-neutral-800 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border border-neutral-200">
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
