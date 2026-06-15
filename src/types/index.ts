export type PriorityLevel = 'normal' | 'urgent' | 'emergency';
export type PatientStatus = 'waiting' | 'called' | 'in_session' | 'completed' | 'cancelled';

export interface Patient {
  id: string;
  tokenId: string; // e.g., A-001
  name: string;
  condition: string;
  priority: PriorityLevel;
  status: PatientStatus;
  estimatedWaitTimeMinutes: number;
  addedAt: number;
  calledAt?: number;
}

export interface QueueInsights {
  averageWaitTime: number;
  totalWaiting: number;
  totalServed: number;
  urgentCount: number;
}

export type Announcement = {
  id: string;
  message: string;
  timestamp: number;
};
