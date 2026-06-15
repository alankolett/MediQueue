/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { QueueProvider } from '@/store/queueStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { ReceptionistDashboard } from '@/pages/ReceptionistDashboard';
import { PatientDashboard } from '@/pages/PatientDashboard';
import { DoctorPanel } from '@/pages/DoctorPanel';
import { AICommandCenter } from '@/pages/AICommandCenter';
import { HospitalMap } from '@/pages/HospitalMap';
import { ExecutiveAnalytics } from '@/pages/ExecutiveAnalytics';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AdminPanel } from '@/pages/AdminPanel';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="mediqueue-theme">
      <QueueProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<ExecutiveAnalytics />} />
              <Route path="queue" element={<ReceptionistDashboard />} />
              <Route path="doctor" element={<DoctorPanel />} />
              <Route path="insights" element={<AICommandCenter />} />
              <Route path="analytics" element={<ExecutiveAnalytics />} />
              <Route path="admin" element={<AdminPanel />} />
            </Route>
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/patient/:token" element={<PatientDashboard />} />
          </Routes>
        </BrowserRouter>
      </QueueProvider>
    </ThemeProvider>
  );
}
