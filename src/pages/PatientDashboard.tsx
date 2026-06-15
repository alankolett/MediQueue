import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useQueue } from '@/store/queueStore';
import { Bell, Clock, ChevronRight, CheckCircle2, UserRound, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

export function PatientDashboard() {
  const { token } = useParams<{ token?: string }>();
  const { patients, announcements, currentPatient, insights } = useQueue();
  const waitingPatients = patients.filter(p => p.status === 'waiting');
  
  // Real-time clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const personalPatient = token ? patients.find(p => p.tokenId === token) : null;
  const isPersonalView = !!token;

  if (isPersonalView && !personalPatient) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <Clock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Token Not Found</h1>
        <p className="text-muted-foreground mt-2 max-w-sm">
          We couldn't find token <span className="font-mono font-bold text-foreground">{token}</span>. It may have been completed, canceled, or is incorrect.
        </p>
      </div>
    );
  }

  // Personal Patient view
  if (isPersonalView && personalPatient) {
    const myIndex = waitingPatients.findIndex(p => p.id === personalPatient.id);
    const tokensAhead = myIndex >= 0 ? myIndex : 0;
    const isCompleted = personalPatient.status === 'completed';
    const isServing = personalPatient.status === 'in_session';
    const isWaiting = personalPatient.status === 'waiting';

    const estWait = myIndex >= 0 ? personalPatient.estimatedWaitTimeMinutes || ((myIndex + 1) * insights.averageWaitTime) : 0;

    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
        <header className="px-6 py-4 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-hcblue-600 flex items-center justify-center shadow-sm">
              <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">MediQueue Clinic</h1>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 flex flex-col items-center p-6 lg:p-12 relative overflow-hidden">
           <div className="w-full max-w-md w-full glass-card border border-border p-8 text-center relative z-10">
             <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6">Your Status Tracking</h2>
             
             <div className="text-[6rem] leading-none font-bold tracking-tighter text-foreground mb-4">
                {personalPatient.tokenId}
             </div>
             <p className="text-lg font-medium text-muted-foreground uppercase tracking-wider mb-10">{personalPatient.name}</p>

             {isCompleted && (
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex flex-col items-center">
                 <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
                 <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">Consultation Complete</h3>
                 <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-2">Thank you for visiting.</p>
               </motion.div>
             )}

             {isServing && (
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-6 bg-hcblue-50 dark:bg-hcblue-900/30 border border-hcblue-200 dark:border-hcblue-800 rounded-2xl flex flex-col items-center shadow-sm">
                 <div className="w-12 h-12 rounded-full bg-hcblue-500/20 text-hcblue-600 dark:text-hcblue-400 flex items-center justify-center mb-3">
                   <UserRound className="w-6 h-6 animate-pulse" />
                 </div>
                 <h3 className="text-xl font-bold text-hcblue-700 dark:text-hcblue-400 mb-1">It's your turn</h3>
                 <p className="text-sm text-hcblue-600 dark:text-hcblue-500 font-medium">Please proceed to Room 1 immediately.</p>
               </motion.div>
             )}

             {isWaiting && (
               <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-muted border border-border rounded-xl">
                     <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Tokens Ahead</p>
                     <p className="text-3xl font-semibold tabular-nums text-foreground">{tokensAhead}</p>
                   </div>
                   <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl">
                     <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-500 mb-1">Est. Wait</p>
                     <p className="text-3xl font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">{estWait} <span className="text-lg">m</span></p>
                   </div>
                 </div>

                 <div className="p-4 bg-muted border border-border rounded-xl flex items-center justify-between text-left">
                   <div>
                     <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-0.5">Currently Serving</p>
                     <p className="text-lg font-bold text-foreground">{currentPatient ? currentPatient.tokenId : 'None'}</p>
                   </div>
                   {currentPatient && <div className="w-2 h-2 rounded-full bg-hcblue-500 animate-pulse" />}
                 </div>

                 <div className="mt-8 pt-6 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                   <span>Avg. Time per Patient: <b>{insights.averageWaitTime}m</b></span>
                   <span>Last updated: just now</span>
                 </div>
               </div>
             )}
           </div>

           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-hcblue-300/10 dark:bg-hcblue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        </main>
      </div>
    );
  }

  // Public Waiting Room View
  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden relative font-sans transition-colors duration-300">
      {/* Header */}
      <header className="px-10 py-6 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-hcblue-600 shadow-sm flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white rounded-sm" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Outpatient Hub</h1>
            <p className="text-hcblue-600 dark:text-hcblue-400 font-bold tracking-widest uppercase text-[10px] mt-0.5">Public Display Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <div className="text-right">
            <div className="text-4xl font-semibold tracking-tight text-foreground tabular-nums">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-muted-foreground font-bold text-[10px] tracking-widest uppercase">
              {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row p-8 lg:p-10 gap-8 z-10 overflow-hidden relative bg-transparent">
        
        {/* Left Column: Massive Token Display & Announcements */}
        <div className="flex-1 flex flex-col gap-8 relative max-w-3xl">
          
          {/* Main Token Card */}
          <div className="flex-1 rounded-[2rem] glass-card bg-card/60 backdrop-blur-md border border-border/50 overflow-hidden relative flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-colors duration-300">
            {/* Soft inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-hcblue-500/10 blur-[100px] pointer-events-none" />
            
            <div className="p-12 flex flex-col items-center justify-center flex-1 text-center relative z-10">
              <h2 className="text-hcblue-600 dark:text-hcblue-400 font-bold uppercase tracking-[0.2em] text-sm mb-8 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-hcblue-500 animate-pulse shadow-[0_0_12px_rgba(37,99,235,0.5)]" />
                Now Serving
                <span className="w-2.5 h-2.5 rounded-full bg-hcblue-500 animate-pulse shadow-[0_0_12px_rgba(37,99,235,0.5)]" />
              </h2>
              
              <AnimatePresence mode="wait">
                {currentPatient ? (
                  <motion.div
                    key={currentPatient.id}
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }}
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.8 }}
                    className="flex flex-col items-center w-full"
                  >
                    <div className="text-[12rem] md:text-[16rem] leading-none font-bold tracking-tighter text-foreground mb-10 drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/80">
                      {currentPatient.tokenId}
                    </div>
                    <motion.div 
                      className="inline-flex items-center gap-6 px-10 py-5 rounded-2xl bg-gradient-to-r from-hcblue-50 to-hcblue-100/50 dark:from-hcblue-900/30 dark:to-hcblue-800/20 border border-hcblue-200/50 dark:border-hcblue-800/50 text-hcblue-800 dark:text-hcblue-300 shadow-md backdrop-blur-md"
                    >
                      <span className="text-3xl lg:text-4xl font-medium tracking-tight">Proceed to <b>Room 1</b></span>
                      <ArrowRight className="w-10 h-10 opacity-80 animate-pulse" />
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center pt-8"
                  >
                    <div className="w-28 h-28 rounded-full border-[3px] border-dashed border-border/50 flex items-center justify-center mb-8 bg-muted/30 shadow-inner">
                      <Clock className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                    <div className="text-3xl font-medium text-muted-foreground tracking-tight">
                      Waiting for next patient...
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Announcements Card */}
          <div className="h-44 rounded-[2rem] glass-card bg-card/60 backdrop-blur-md border border-border/50 p-8 flex flex-col relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
            <h3 className="text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-[0.1em] text-[10px] flex items-center gap-3 mb-4">
              <Bell className="w-4 h-4" /> Hospital Announcements
            </h3>
            <div className="flex-1 overflow-hidden relative text-foreground text-2xl font-medium tracking-tight">
              <AnimatePresence>
                {announcements.map((ann) => (
                  <motion.div
                     key={ann.id}
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     className="absolute inset-0 flex items-center font-bold"
                  >
                    {ann.message}
                  </motion.div>
                ))}
                {announcements.length === 0 && (
                  <div className="flex items-center h-full text-muted-foreground font-medium text-xl">
                    No active announcements at this time.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Queue Progress Tracker */}
        <div className="flex-1 flex flex-col gap-6 max-w-lg min-w-[400px]">
          <div className="glass-card bg-card/60 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 flex flex-col h-full relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
            <div className="flex items-center justify-between mb-8 relative z-10 border-b border-border/50 pb-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight uppercase">Up Next</h2>
              <div className="px-4 py-1.5 rounded-lg bg-background/50 backdrop-blur-md text-foreground font-bold text-sm border border-border/50 shadow-sm">
                {waitingPatients.length} Waiting
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <div className="space-y-4 h-full overflow-y-auto pr-2 pb-12 relative z-10 custom-scrollbar">
                <AnimatePresence>
                  {waitingPatients.map((patient, index) => {
                     const estWait = patient.estimatedWaitTimeMinutes || ((index + 1) * insights.averageWaitTime);
                     return (
                      <motion.div
                        key={patient.id}
                        layoutId={`patient-list-card-${patient.id}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        className={cn(
                          "flex items-center justify-between p-6 rounded-2xl border transition-all duration-300",
                          index === 0 
                            ? "bg-gradient-to-r from-hcblue-50 to-background dark:from-hcblue-900/20 dark:to-background border-hcblue-200/50 dark:border-hcblue-800/50 shadow-md scale-[1.02]" 
                            : "bg-background/40 backdrop-blur-sm border-border/50 shadow-sm hover:bg-background/60"
                        )}
                      >
                        <div className="flex items-center gap-6">
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl transition-all duration-300",
                            index === 0 
                              ? "bg-gradient-to-br from-hcblue-600 to-hcblue-500 text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)]" 
                              : "bg-muted/50 text-muted-foreground border border-border/50"
                          )}>
                            {index + 1}
                          </div>
                          <div>
                             <p className={cn("text-4xl font-bold tracking-tight transition-colors", index === 0 ? "text-hcblue-700 dark:text-hcblue-300" : "text-foreground")}>{patient.tokenId}</p>
                             {index === 0 && <p className="text-[10px] font-bold uppercase tracking-widest text-hcblue-600 dark:text-hcblue-400 mt-1">Next in Line</p>}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Est. Wait</p>
                          <p className={cn("text-3xl font-bold tabular-nums tracking-tight transition-colors", index === 0 ? "text-hcblue-700 dark:text-hcblue-400" : "text-foreground")}>
                            {estWait}<span className="text-base font-medium ml-1">m</span>
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {waitingPatients.length === 0 && (
                   <div className="flex flex-col items-center justify-center pt-24 text-muted-foreground">
                     <CheckCircle2 className="w-14 h-14 mb-5 opacity-20 text-emerald-500" />
                     <p className="font-medium tracking-tight text-lg">The queue is currently empty.</p>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

