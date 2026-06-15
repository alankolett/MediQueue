import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Patient, QueueInsights, Announcement, PriorityLevel, PatientStatus } from '@/types';

interface QueueContextType {
  patients: Patient[];
  insights: QueueInsights;
  announcements: Announcement[];
  averageConsultationTime: number;
  addPatient: (patient: Omit<Patient, 'id' | 'addedAt' | 'status' | 'tokenId'>) => void;
  updateStatus: (id: string, status: PatientStatus) => void;
  callNext: () => void;
  removePatient: (id: string) => void;
  reorderWaiting: (newWaiting: Patient[]) => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  updateAverageTime: (time: number) => void;
  currentPatient: Patient | null;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

// Define default socket URL - using empty string connects to the host serving the page.
const SOCKET_URL = '/'; 

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [averageConsultationTime, setAverageConsultationTime] = useState(15);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: '1', message: 'System connected and ready.', timestamp: Date.now() }
  ]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('queue_update', (data: { patients: any[], averageConsultationTime: number }) => {
      // Data might come from SQLite 'patients' table
      const formattedPatients: Patient[] = data.patients.map(p => ({
        id: p.id,
        tokenId: p.tokenId,
        name: p.name,
        condition: '', // Optional in this backend
        priority: p.type || 'normal',
        status: p.status as PatientStatus,
        estimatedWaitTimeMinutes: 0, // Will be computed below
        addedAt: new Date(p.createdAt).getTime(),
      }));

      // Sort: 'in_session' -> 'called' -> 'waiting' sorted by time
      const sorted = formattedPatients.sort((a, b) => {
        if (a.status !== 'waiting' && b.status === 'waiting') return -1;
        if (b.status !== 'waiting' && a.status === 'waiting') return 1;
        return a.addedAt - b.addedAt; // FCFS for waiting by default
      });

      // Compute estimated wait time dynamically based on tokens ahead
      let waitTimeAccumulator = 0;
      const computedPatients = sorted.map(p => {
        if (p.status === 'waiting') {
           const myWait = waitTimeAccumulator;
           waitTimeAccumulator += data.averageConsultationTime;
           return { ...p, estimatedWaitTimeMinutes: myWait };
        }
        return { ...p, estimatedWaitTimeMinutes: 0 };
      });

      setPatients(computedPatients);
      setAverageConsultationTime(data.averageConsultationTime);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Derived state
  const currentPatient = patients.find(p => p.status === 'in_session') || patients.find(p => p.status === 'called') || null;
  const waitingPatients = patients.filter(p => p.status === 'waiting');
  
  const insights: QueueInsights = {
    averageWaitTime: averageConsultationTime,
    totalWaiting: waitingPatients.length,
    totalServed: patients.filter(p => p.status === 'completed').length,
    urgentCount: waitingPatients.filter(p => p.priority !== 'normal').length,
  };

  const addPatient = (patientData: Omit<Patient, 'id' | 'addedAt' | 'status' | 'tokenId'>) => {
    if (socket) {
      socket.emit('add_patient', {
        name: patientData.name,
        type: patientData.priority
      });
    }
  };

  const updateStatus = (id: string, status: PatientStatus) => {
    if (socket) {
      socket.emit('update_status', { id, status }, (response: any) => {
        if (!response.success) {
          console.error("Failed to update status:", response.error);
        }
      });
      // Optimistic update
      setPatients(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    }
  };

  const callNext = () => {
    if (socket) {
      socket.emit('call_next', {}, (response: any) => {
        if (!response.success) {
           console.error("Failed to call next:", response.error);
        }
      });
    }
  };

  const updateAverageTime = (time: number) => {
    if (socket) {
      socket.emit('update_settings', { averageConsultationTime: time });
    }
  };

  const removePatient = (id: string) => {
    if (socket) {
      // Soft delete: setting status as cancelled
      socket.emit('update_status', { id, status: 'cancelled' });
    }
  };

  const reorderWaiting = (newWaiting: Patient[]) => {
    // Reordering via DB can be complex, skipping drag/drop sync for this scope to keep it stable real-time
    // But we update locale state to preserve UX temporarily
    setPatients(prev => {
      const nonWaiting = prev.filter(p => p.status !== 'waiting');
      return [...nonWaiting, ...newWaiting];
    });
  };

  const reorderQueue = (fromIndex: number, toIndex: number) => {
    // Placeholder - no-op for real backend without ordering logic
  };

  return (
    <QueueContext.Provider value={{ 
      patients, 
      insights, 
      announcements, 
      averageConsultationTime,
      addPatient, 
      updateStatus, 
      callNext,
      removePatient, 
      reorderWaiting, 
      reorderQueue, 
      updateAverageTime,
      currentPatient 
    }}>
      {children}
    </QueueContext.Provider>
  );
}

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (context === undefined) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
