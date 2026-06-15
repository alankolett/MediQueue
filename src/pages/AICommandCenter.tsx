import React from 'react';
import { useQueue } from '@/store/queueStore';
import { Activity, AlertTriangle, Crosshair, Radar, Fingerprint, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export function AICommandCenter() {
  const { patients, insights } = useQueue();
  const waitingPatients = patients.filter(p => p.status === 'waiting');
  
  // Real analysis logic instead of mock data
  const isQueueEmpty = waitingPatients.length === 0;
  
  const emergencyCount = waitingPatients.filter(p => p.priority === 'emergency').length;
  const urgentCount = waitingPatients.filter(p => p.priority === 'urgent').length;
  const routineCount = waitingPatients.filter(p => p.priority === 'routine').length;

  const avgWait = insights.averageWaitTime;
  const totalWaitTime = waitingPatients.length * avgWait;

  // Simple heuristic for health
  let queueHealth = 100;
  if (emergencyCount > 0) queueHealth -= emergencyCount * 15;
  if (urgentCount > 2) queueHealth -= (urgentCount - 2) * 5;
  if (totalWaitTime > 120) queueHealth -= 20;
  queueHealth = Math.max(0, Math.min(100, queueHealth));

  const statusColor = queueHealth > 80 ? 'text-emerald-500' : queueHealth > 50 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="h-full flex flex-col gap-6 max-w-6xl mx-auto w-full relative">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Activity className="w-6 h-6 text-hcblue-600 dark:text-hcblue-400" />
          AI Copilot
        </h1>
        <p className="text-muted-foreground text-sm mt-1 mb-6">Real-time intelligence and queue analysis</p>
      </div>

      {isQueueEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-10 glass-card border flex flex-col">
          <ShieldCheck className="w-16 h-16 text-emerald-500/50 mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Queue is Empty</h2>
          <p className="text-muted-foreground max-w-md">The clinic currently has no waiting patients. The AI Copilot will begin analysis once patients are registered.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="glass-card p-6 border flex flex-col gap-4 shadow-sm">
            <h3 className="text-xs uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-2">
              <Crosshair className="w-4 h-4" />
              Queue Health
            </h3>
            <div className="flex items-end gap-2">
              <span className={cn("text-5xl font-bold tracking-tighter", statusColor)}>{queueHealth}</span>
              <span className="text-lg font-semibold text-muted-foreground mb-1">/ 100</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2 border border-border">
              <div 
                className={cn("h-full transition-all duration-1000", queueHealth > 80 ? 'bg-emerald-500' : queueHealth > 50 ? 'bg-amber-500' : 'bg-red-500')} 
                style={{ width: `${queueHealth}%` }} 
              />
            </div>
          </div>

          <div className="glass-card p-6 border flex flex-col gap-4 shadow-sm">
            <h3 className="text-xs uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-2">
              <Radar className="w-4 h-4" />
              Triage Analysis
            </h3>
            <div className="space-y-4 pt-2">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-red-500 font-semibold flex items-center gap-2">Emergency</span>
                  <span className="font-bold">{emergencyCount}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-amber-500 font-semibold">Urgent</span>
                  <span className="font-bold">{urgentCount}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-semibold">Routine</span>
                  <span className="font-bold">{routineCount}</span>
               </div>
            </div>
          </div>

          <div className="glass-card p-6 border flex flex-col gap-4 shadow-sm">
            <h3 className="text-xs uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-2">
              <Fingerprint className="w-4 h-4" />
              Wait Time Analysis
            </h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tighter text-foreground">{avgWait}</span>
              <span className="text-sm font-semibold text-muted-foreground mb-1">min / patient</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Estimated wait for the last person in queue: <span className="font-bold text-foreground">{totalWaitTime} mins</span>
            </p>
          </div>

          <div className="lg:col-span-3 glass-card p-6 border shadow-sm">
            <h3 className="text-xs uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
               <AlertTriangle className="w-4 h-4" />
               Recommendations
            </h3>
            <div className="space-y-3">
              {emergencyCount > 0 && (
                 <div className="p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-red-700 dark:text-red-400">Critical: Expedite Emergency Cases</h4>
                      <p className="text-sm text-red-600/80 dark:text-red-300 mt-1">There are {emergencyCount} emergency patients waiting. Standard triage should be paused.</p>
                    </div>
                 </div>
              )}
              {totalWaitTime > 60 && (
                 <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-lg flex items-start gap-3">
                    <Activity className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400">High Wait Times Detected</h4>
                      <p className="text-sm text-amber-600/80 dark:text-amber-300 mt-1">Overall wait time has exceeded 1 hour. Consider allocating an additional medical professional to this wing.</p>
                    </div>
                 </div>
              )}
              {totalWaitTime <= 60 && emergencyCount === 0 && (
                 <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-lg flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Optimal Operations</h4>
                      <p className="text-sm text-emerald-600/80 dark:text-emerald-300 mt-1">Queue volume is manageable. No structural interventions required at this time.</p>
                    </div>
                 </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
