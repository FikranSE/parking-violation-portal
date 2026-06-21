export type Role = 'OFFICER' | 'MEMBER';

export interface TimeMultiplier {
  start_time: string;
  end_time: string;
  multiplier: number;
}

export interface FineRule {
  id: number;
  version: number;
  effective_from: string;
  effective_to?: string;
  base_amounts: Record<string, number>;
  time_multipliers: TimeMultiplier[];
  repeat_multipliers: Record<string, number>;
}

export interface Violation {
  id: number;
  license_plate: string;
  violation_type: string;
  location: string;
  violation_time: string;
  photo_url?: string;
  rule_version_id: number;
  calculated_fine: number;
  status: 'UNPAID' | 'PAID';
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  violation_id: number;
  amount: number;
  payment_scenario: 'success' | 'failed';
  transaction_id: string;
  status: 'paid' | 'failed';
  created_at: string;
}

export interface TransactionHistoryItem extends Violation {
  payment_status?: string; // Appended by the GetHistory endpoint
}
