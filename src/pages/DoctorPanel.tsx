import React, { useState, useEffect } from 'react';
import { useQueue } from '@/store/queueStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Clock, Users, Timer, ArrowRight, AlertTriangle, Play, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export function DoctorPanel() {
  const { patients, currentPatient, insights, updateStatus, callNext } = useQueue();
  const waitingPatients = patients.filter(p => p.status === 'waiting');
  
  // Consultation Timer
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
       interval = setInterval(() => setSessionSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Auto-start timer when a patient is called
  useEffect(() => {
    if (currentPatient) {
      setSessionSeconds(0);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
      setSessionSeconds(0);
    }
  }, [currentPatient?.id]);

  const handleComplete = () => {
    if (currentPatient) {
      updateStatus(currentPatient.id, 'completed');
    }
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const nextUp = waitingPatients[0];
  const urgentCount = waitingPatients.filter(p => p.priority === 'emergency' || p.priority === 'urgent').length;

  // Determine if over time
  const isOverTime = sessionSeconds > insights.averageWaitTime * 60;

  return (
    <div className="h-full flex flex-col gap-6 max-w-6xl mx-auto w-full relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Doctor Console</h1>
          <p className="text-muted-foreground text-sm mt-1">Room 1 • Dr. Sarah Chen</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1.5 bg-muted border border-border rounded-lg flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-bold text-foreground">{waitingPatients.length} Waiting</span>
          </div>
          {urgentCount > 0 && (
            <div className="px-3 py-1.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-bold text-red-700 dark:text-red-400">{urgentCount} Priority</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Main Active Session Column */}
        <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
          <div className="glass-card bg-card/60 backdrop-blur-md border border-border/50 flex flex-col overflow-hidden relative flex-1 min-h-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] rounded-3xl">
            <div className="px-8 py-5 border-b border-border/50 bg-muted/20 flex items-center justify-between">
               <h2 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                 <span className="w-2.5 h-2.5 rounded-full bg-hcblue-500 animate-pulse shadow-[0_0_12px_rgba(37,99,235,0.5)]" />
                 Currently Serving
               </h2>
               {currentPatient && (
                 <Badge variant="outline" className="border-hcblue-200 dark:border-hcblue-800 text-hcblue-700 dark:text-hcblue-300 bg-hcblue-50/80 dark:bg-hcblue-500/10 shadow-sm px-3 py-1 font-bold">
                   In Progress
                 </Badge>
               )}
            </div>
            
            <div className="flex-1 p-10 flex flex-col items-center justify-center text-center relative overflow-hidden bg-background/30 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-hcblue-500/5 to-emerald-500/5 pointer-events-none" />
              {currentPatient ? (
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center max-w-lg w-full">
                  <div className="w-full bg-card/80 backdrop-blur-md border border-border/50 rounded-[2rem] p-10 shadow-xl relative z-10 group transition-all duration-300 hover:border-hcblue-500/30">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-hcblue-500 to-emerald-500" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Token</p>
                    <div className="text-8xl font-bold tracking-tighter text-foreground mb-6 bg-clip-text text-transparent bg-gradient-to-r from-hcblue-600 to-emerald-500 dark:from-hcblue-400 dark:to-emerald-400 drop-shadow-sm">
                      {currentPatient.tokenId}
                    </div>
                    <div className="w-full h-px bg-border/50 my-6" />
                    <p className="text-3xl font-bold tracking-tight text-foreground">{currentPatient.name}</p>
                    <div className="mt-6 flex justify-center">
                       <Badge variant={currentPatient.priority === 'emergency' ? 'error' : currentPatient.priority === 'urgent' ? 'warning' : 'outline'} className="px-4 py-1.5 shadow-sm font-bold uppercase tracking-widest text-[10px]">
                         {currentPatient.priority} Priority
                       </Badge>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "mt-10 py-5 px-8 rounded-full border-2 flex items-center justify-center gap-4 transition-all duration-300 font-mono text-3xl font-bold bg-background/50 backdrop-blur-md shadow-md w-full max-w-sm",
                    isOverTime ? "border-red-500 text-red-500 shadow-red-500/20" : "border-border/50 text-foreground"
                  )}>
                    <Timer className={cn("w-8 h-8", isOverTime ? "text-red-500 animate-pulse" : "text-muted-foreground")} />
                    {formatTime(sessionSeconds)}
                  </div>
                  <div className="mt-4 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    Target: {insights.averageWaitTime}m
                  </div>

                  <div className="mt-12 flex gap-4 w-full max-w-md relative z-10">
                    <Button variant="outline" size="lg" className="flex-1 h-16 rounded-2xl border-border/50 bg-background/50 backdrop-blur-md shadow-sm font-bold text-base hover:bg-muted" onClick={handleComplete}>
                      <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-500" />
                      Complete
                    </Button>
                    <Button size="lg" className="flex-1 h-16 rounded-2xl bg-gradient-to-r from-hcblue-600 to-hcblue-500 hover:from-hcblue-500 hover:to-hcblue-400 text-white shadow-md font-bold text-base transition-all active:scale-[0.98]" onClick={() => {
                        handleComplete();
                        callNext();
                    }}>
                      Next <ArrowRight className="w-5 h-5 ml-3" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground relative z-10">
                   <div className="w-32 h-32 rounded-full bg-muted/40 border-[3px] border-dashed border-border/50 flex items-center justify-center mb-8 bg-card shadow-inner">
                     <Users className="w-12 h-12 opacity-30 text-hcblue-600 dark:text-hcblue-400" />
                   </div>
                   <h3 className="text-2xl font-bold text-foreground tracking-tight mb-3">No Active Patient</h3>
                   <p className="text-base font-medium">Ready to see the next person.</p>
                   {nextUp ? (
                     <Button className="mt-10 bg-gradient-to-r from-hcblue-600 to-hcblue-500 hover:from-hcblue-500 hover:to-hcblue-400 text-white shadow-md h-16 px-8 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95" size="lg" onClick={callNext}>
                       Call Next ({nextUp.tokenId})
                     </Button>
                   ) : (
                     <Button variant="outline" className="mt-10 border-border/50 h-16 px-8 rounded-full font-bold shadow-sm" disabled>
                       Queue is Empty
                     </Button>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6 min-h-0">
          
          <div className="glass-card bg-card/60 backdrop-blur-md border border-border/50 flex flex-col p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.1)] rounded-3xl relative overflow-hidden group">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-5 relative z-10">Up Next</h3>
            {nextUp ? (
              <div className="bg-background/80 backdrop-blur-sm border border-border/50 p-6 rounded-2xl relative z-10 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
                 <div className="absolute inset-0 bg-gradient-to-br from-hcblue-500/5 to-emerald-500/5 pointer-events-none rounded-2xl" />
                 <div className="flex justify-between items-start mb-5 relative z-10">
                   <div className="text-4xl font-bold tracking-tighter text-foreground drop-shadow-sm">{nextUp.tokenId}</div>
                   <Badge variant={nextUp.priority === 'emergency' ? 'error' : nextUp.priority === 'urgent' ? 'warning' : 'outline'} className="shadow-sm font-bold px-2 py-0.5">{nextUp.priority}</Badge>
                 </div>
                 <p className="text-lg font-bold text-foreground tracking-tight relative z-10">{nextUp.name}</p>
                 <div className="flex items-center gap-2 mt-5 text-[10px] font-bold uppercase tracking-widest text-hcblue-600 dark:text-hcblue-400 bg-hcblue-50/80 dark:bg-hcblue-500/10 px-3 py-1.5 rounded-lg w-fit shadow-sm border border-hcblue-200/50 dark:border-hcblue-500/20 relative z-10">
                   Ready in Waiting Area
                 </div>
              </div>
            ) : (
              <div className="p-6 border-2 border-dashed border-border/50 bg-muted/20 rounded-2xl flex flex-col items-center text-center text-muted-foreground relative z-10 h-[178px] justify-center">
                 <CheckCircle2 className="w-10 h-10 mb-3 opacity-30 text-emerald-500" />
                 <p className="text-sm font-bold tracking-wide uppercase">Queue Clear</p>
              </div>
            )}
            
            <div className="mt-8 flex flex-col gap-3 relative z-10 custom-scrollbar">
               {waitingPatients.slice(1, 4).map((p, i) => (
                 <div key={p.id} className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm transition-colors hover:bg-muted/50 group/item">
                   <div className="flex items-center gap-4">
                     <span className="text-xs font-bold text-muted-foreground w-4">{i + 2}.</span>
                     <div>
                       <p className="text-sm font-bold text-foreground group-hover/item:text-hcblue-600 dark:group-hover/item:text-hcblue-400 transition-colors">{p.tokenId}</p>
                       <p className="text-[11px] font-medium text-muted-foreground w-32 truncate">{p.name}</p>
                     </div>
                   </div>
                   <span className="text-[11px] font-bold font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">+{insights.averageWaitTime * (i+1)}m</span>
                 </div>
               ))}
               {waitingPatients.length > 4 && (
                 <p className="text-xs font-bold text-center text-muted-foreground mt-3 border-t border-border/50 pt-5 uppercase tracking-widest">
                   + {waitingPatients.length - 4} more waiting
                 </p>
               )}
            </div>
          </div>

          <div className="glass-card bg-card/60 backdrop-blur-md border border-border/50 flex flex-col p-6 flex-1 min-h-0 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.1)] rounded-3xl relative overflow-hidden">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-5 relative z-10">Live Alerts</h3>
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar relative z-10">
               {urgentCount > 0 && (
                 <div className="p-3 bg-red-50 dark:bg-red-950/20 border-l-2 border-red-500 rounded-r-lg">
                   <div className="flex items-center gap-2 mb-1">
                     <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                     <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase">Emergency Override</span>
                   </div>
                   <p className="text-[11px] text-red-600/80 dark:text-red-300">
                     There are {urgentCount} priority patients waiting. Please expedite session.
                   </p>
                 </div>
               )}
               {isOverTime && (
                 <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border-l-2 border-amber-500 rounded-r-lg">
                   <div className="flex items-center gap-2 mb-1">
                     <Clock className="w-3.5 h-3.5 text-amber-500" />
                     <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Schedule Drift</span>
                   </div>
                   <p className="text-[11px] text-amber-600/80 dark:text-amber-400">
                     Current session is exceeding the targeted {insights.averageWaitTime} minute slot.
                   </p>
                 </div>
               )}
               {urgentCount === 0 && !isOverTime && (
                 <div className="h-full flex items-center justify-center text-muted-foreground text-xs font-medium">
                   All systems nominal.
                 </div>
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
