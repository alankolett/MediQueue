import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { useQueue } from '@/store/queueStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Users, Clock, AlertTriangle, CheckCircle2, MoreVertical, X, Activity, UserRound, ArrowUpRight, Zap, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SmartAnnouncementCenter } from '@/components/SmartAnnouncementCenter';

export function ReceptionistDashboard() {
  const { patients, insights, currentPatient, addPatient, updateStatus, callNext, removePatient, reorderWaiting } = useQueue();
  const waitingPatients = patients.filter(p => p.status === 'waiting');

  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + I -> Issue Token
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        setIsAdding(true);
      }
      // Cmd/Ctrl + N -> Call Next
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        callNext();
      }
      // Escape -> close modal
      if (e.key === 'Escape') {
        setIsAdding(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callNext]);
  
  return (
    <div className="h-full flex flex-col gap-6 relative">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
        <StatCard title="Total Waiting" value={insights.totalWaiting} icon={Users} trend="+2 from last hour" color="text-amber-500" />
        <TimeSettingsCard />
        <StatCard title="Emergency Queue" value={insights.urgentCount} icon={AlertTriangle} trend="Prioritized" color="text-red-500" pulse />
        <StatCard title="Served Today" value={insights.totalServed} icon={CheckCircle2} trend="Great job" color="text-emerald-500" />
      </div>

      <div className="flex flex-1 gap-6 min-h-0 flex-col xl:flex-row">
        {/* Central Queue Area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Active Queue</h2>
              <Badge variant="outline" className="bg-muted text-muted-foreground border-border">{waitingPatients.length} entries</Badge>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => callNext()} 
                className="px-4 py-2 bg-hcblue-600 hover:bg-hcblue-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2"
              >
                <Users className="w-4 h-4" /> Call Next
              </button>
              <button 
                onClick={() => setIsAdding(true)} 
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Issue Token
              </button>
            </div>
          </div>

          <div className="flex-1 glass-card flex flex-col overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border-border/50">
            {/* Table Header */}
            <div className="grid grid-cols-[auto_2fr_1fr_1fr_auto] gap-4 px-8 py-4 border-b border-border/50 text-[10px] uppercase font-bold tracking-widest text-muted-foreground bg-muted/20 relative z-10 w-full">
              <div className="w-8">Pos</div>
              <div>Patient</div>
              <div>Triage</div>
              <div>Est Wait</div>
              <div className="w-24 text-right">Actions</div>
            </div>

            {/* Now Serving Highlight */}
            {currentPatient && (
              <div className="bg-hcblue-50/50 dark:bg-hcblue-900/20 border-b border-hcblue-200/50 dark:border-hcblue-800/50 relative z-20 overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-hcblue-500/5 to-transparent pointer-events-none" />
                <div className="grid grid-cols-[auto_2fr_1fr_1fr_auto] gap-4 px-8 py-5 items-center relative z-10">
                  <div className="w-8 flex justify-center relative">
                    <span className="w-3.5 h-3.5 rounded-full bg-hcblue-500 shadow-[0_0_12px_rgba(37,99,235,0.5)] animate-pulse relative z-10" />
                  </div>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="truncate">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-foreground truncate text-xl tracking-tight">{currentPatient.name}</span>
                        <span className="px-2.5 py-1 rounded-md bg-hcblue-100 dark:bg-hcblue-900 border border-hcblue-200 dark:border-hcblue-800 text-xs font-mono text-hcblue-700 dark:text-hcblue-300 font-bold flex-shrink-0 shadow-sm">
                          {currentPatient.tokenId}
                        </span>
                      </div>
                      <p className="text-xs text-hcblue-600 dark:text-hcblue-400 mt-1.5 uppercase tracking-widest font-bold">Now Serving in Room 1</p>
                    </div>
                  </div>
                  <div>
                    <Badge variant={currentPatient.priority === 'emergency' ? 'error' : currentPatient.priority === 'urgent' ? 'warning' : 'outline'} className="shadow-sm">
                      {currentPatient.priority}
                    </Badge>
                  </div>
                  <div className="text-sm font-bold text-hcblue-600 dark:text-hcblue-400 uppercase tracking-widest text-[11px]">IN PROGRESS</div>
                  <div className="w-24 flex justify-end gap-2 text-right">
                    <Button size="sm" variant="outline" className="h-9 px-4 text-xs font-bold border-hcblue-200 dark:border-hcblue-800 hover:bg-hcblue-100 dark:hover:bg-hcblue-900/50 text-hcblue-700 dark:text-hcblue-300 w-full shadow-sm" onClick={() => updateStatus(currentPatient.id, 'completed')}>
                      Complete
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Waiting List */}
            <div className="flex-1 overflow-y-auto relative z-10 bg-background/30 backdrop-blur-sm">
              {waitingPatients.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/10">
                  <div className="w-24 h-24 mb-6 rounded-full bg-muted/40 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight mb-2">Queue is Clear</h3>
                  <p className="text-sm">There are no patients waiting for consultation.</p>
                </div>
              ) : (
                <Reorder.Group axis="y" values={waitingPatients} onReorder={reorderWaiting} className="pb-8">
                  <AnimatePresence>
                    {waitingPatients.map((patient, index) => {
                      const isEmergency = patient.priority === 'emergency';
                      return (
                        <Reorder.Item
                          key={patient.id}
                          value={patient}
                          initial={{ opacity: 0, scale: 0.98, y: 15, filter: 'blur(4px)' }}
                          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                          whileDrag={{ scale: 1.02, backgroundColor: 'var(--muted-base)', zIndex: 50, cursor: 'grabbing', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                          className={cn(
                            "grid grid-cols-[auto_2fr_1fr_1fr_auto] gap-4 px-8 py-4 items-center border-b border-border/50 hover:bg-muted/40 transition-all duration-200 group relative cursor-grab z-10",
                            isEmergency && "bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100/50 dark:hover:bg-red-900/30"
                          )}
                        >
                          {isEmergency && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />}
                          <div className="w-8 text-center text-sm font-mono font-bold text-muted-foreground flex items-center justify-center gap-2 relative z-10">
                            <GripVertical className="w-4 h-4 opacity-0 group-hover:opacity-40 absolute left-2 transition-opacity flex-shrink-0" />
                            <span className="transition-colors pl-4">{index + 1}</span>
                          </div>
                          
                          <div className="min-w-0 relative z-10 pl-2">
                            <div className="flex items-center gap-3">
                              <span className={cn("font-bold truncate transition-colors text-base tracking-tight", isEmergency ? "text-red-700 dark:text-red-400" : "text-foreground")}>{patient.name}</span>
                              <span className={cn(
                                "px-2 py-0.5 rounded text-xs font-mono font-bold flex-shrink-0 border shadow-sm",
                                isEmergency ? "bg-red-100 border-red-200 text-red-700 dark:bg-red-900/40 dark:border-red-800 dark:text-red-300" : "bg-card border-border text-foreground"
                              )}>
                                {patient.tokenId}
                              </span>
                            </div>
                          </div>
                          
                          <div className="relative z-10">
                            {isEmergency ? (
                               <Badge variant="error" className="animate-pulse shadow-sm px-2.5 py-1 text-[10px] tracking-widest font-bold">CRITICAL</Badge>
                            ) : patient.priority === 'urgent' ? (
                               <Badge variant="warning" className="shadow-sm px-2.5 py-1 text-[10px] tracking-widest font-bold">URGENT</Badge>
                            ) : (
                               <Badge variant="outline" className="bg-muted text-muted-foreground border-border/50 shadow-sm px-2.5 py-1 text-[10px] tracking-widest font-bold">ROUTINE</Badge>
                            )}
                          </div>
                          
                          <div className={cn("text-sm font-bold italic relative z-10", isEmergency ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>
                             ~{patient.estimatedWaitTimeMinutes || (index + 1) * insights.averageWaitTime}m
                          </div>
                          
                          <div className="w-24 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-10 focus-within:opacity-100">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400" onClick={(e) => { e.stopPropagation(); removePatient(patient.id); }}>
                              <X className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 px-4 text-xs font-bold bg-card hover:bg-muted border-border/50 shadow-sm" onClick={(e) => { e.stopPropagation(); updateStatus(patient.id, 'in_session'); }}>
                              Call
                            </Button>
                          </div>
                        </Reorder.Item>
                       );
                    })}
                  </AnimatePresence>
                </Reorder.Group>
              )}
            </div>
            
            <div className="bg-muted/30 border-t border-border/50 px-8 py-4 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-muted-foreground relative z-30">
              <span>{waitingPatients.length} remaining in queue</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar Widget Column */}
        <div className="xl:w-[22rem] flex flex-col gap-6 flex-shrink-0 min-h-0">
          
          <SmartAnnouncementCenter />
          
          <div className="glass-card bg-card/60 backdrop-blur-md p-6 border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] rounded-3xl flex-shrink-0 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-hcblue-500/5 to-hcblue-700/5 pointer-events-none" />
            <h3 className="text-[10px] uppercase tracking-widest text-hcblue-600 dark:text-hcblue-400 font-bold mb-5 flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-hcblue-500 animate-pulse" /> Operational AI
            </h3>
            <div className="space-y-3 relative z-10">
              <div className="p-4 bg-background/50 backdrop-blur-md border border-border/50 rounded-2xl flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                <Zap className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Predictive spike in Emergency expected at <span className="text-foreground font-bold">14:30</span>.
                </p>
              </div>
              <div className="p-4 bg-background/50 backdrop-blur-md border border-border/50 rounded-2xl flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                <Users className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Optimal allocation: Shift 3 nurses to Triage 2.
                </p>
              </div>
            </div>
            {waitingPatients.length > 0 && !currentPatient && (
              <Button 
                className="w-full mt-5 bg-gradient-to-r from-hcblue-600 to-hcblue-500 hover:from-hcblue-500 hover:to-hcblue-400 text-white font-bold h-10 shadow-md relative z-10 rounded-xl" 
                onClick={() => updateStatus(waitingPatients[0].id, 'in_session')}
              >
                Call Recommended ({waitingPatients[0].tokenId})
              </Button>
            )}
          </div>

          <div className="glass-card bg-card/60 backdrop-blur-md p-6 border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] rounded-3xl flex-1 flex flex-col min-h-0 relative">
            <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-6">Activity Feed</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
               <div className="relative pl-6 border-l-2 border-border/50 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-hcblue-500 outline outline-[3px] outline-card shadow-sm" />
                  <p className="text-sm text-muted-foreground font-medium"><span className="font-bold text-foreground">EMR-02</span> evaluation completed</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1 font-bold uppercase tracking-widest">2 mins ago</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-amber-500 outline outline-[3px] outline-card shadow-sm" />
                  <p className="text-sm text-muted-foreground font-medium"><span className="font-bold text-foreground">URG-01</span> registered at kiosk</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1 font-bold uppercase tracking-widest">15 mins ago</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-slate-400 outline outline-[3px] outline-card shadow-sm" />
                  <p className="text-sm text-muted-foreground font-medium"><span className="font-bold text-foreground">NOR-24</span> registered at desk</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1 font-bold uppercase tracking-widest">32 mins ago</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50 text-center relative z-10">
               <button className="text-[10px] uppercase font-bold text-hcblue-600 dark:text-hcblue-400 hover:text-hcblue-700 transition-colors tracking-widest">View All Logs</button>
            </div>
          </div>
        </div>
      </div>

       {/* Quick Issue Modal */}
       <AnimatePresence>
        {isAdding && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               transition={{ duration: 0.3 }}
               className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
               onClick={() => setIsAdding(false)}
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(8px)' }}
               animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
               exit={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(8px)' }}
               transition={{ type: "spring", stiffness: 400, damping: 30 }}
               className="glass-card bg-card/80 backdrop-blur-xl border border-border/50 w-full max-w-md p-8 relative z-10 shadow-[0_24px_60px_rgb(0,0,0,0.1)] rounded-3xl"
             >
               <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-hcblue-50 dark:bg-hcblue-500/10 text-hcblue-600 dark:text-hcblue-400 flex flex-shrink-0 items-center justify-center">
                    <Plus className="w-5 h-5" />
                 </div>
                 Issue New Token
               </h2>
               <form 
                 onSubmit={(e) => {
                   e.preventDefault();
                   const fd = new FormData(e.currentTarget);
                   addPatient({
                     name: fd.get('name') as string,
                     priority: fd.get('type') as any,
                     condition: '',
                     estimatedWaitTimeMinutes: 0
                   });
                   setIsAdding(false);
                 }}
                 className="space-y-5"
               >
                 <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Patient Full Name</label>
                   <input required name="name" className="w-full px-4 py-3 bg-background border border-border/50 shadow-sm text-foreground rounded-xl focus:ring-2 focus:ring-hcblue-500/20 focus:border-hcblue-500 focus:outline-none transition-all text-sm font-medium" placeholder="e.g. John Doe" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Triage Priority</label>
                   <select name="type" className="w-full px-4 py-3 bg-background border border-border/50 shadow-sm text-foreground rounded-xl focus:ring-2 focus:ring-hcblue-500/20 focus:border-hcblue-500 focus:outline-none transition-all text-sm font-medium cursor-pointer">
                     <option value="routine">Routine Care</option>
                     <option value="urgent">Urgent</option>
                     <option value="emergency">Critical / Emergency</option>
                   </select>
                 </div>
                 <div className="pt-6 flex gap-3">
                   <Button type="button" variant="outline" className="flex-1 border-border/50 h-12 rounded-xl font-bold shadow-sm" onClick={() => setIsAdding(false)}>Cancel</Button>
                   <Button type="submit" className="flex-1 bg-gradient-to-r from-hcblue-600 to-hcblue-500 hover:from-hcblue-500 hover:to-hcblue-400 text-white h-12 rounded-xl font-bold shadow-md">Create & Print</Button>
                 </div>
               </form>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color, pulse }: any) {
  return (
    <div className="glass-card bg-card/60 backdrop-blur-md p-6 flex flex-col justify-between border-border/50 hover:border-hcblue-200 dark:hover:border-hcblue-800 transition-all duration-300 relative overflow-hidden group shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.1)] rounded-2xl">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
         <Icon className="w-24 h-24" />
      </div>
      <div className="flex items-start justify-between relative z-10">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{title}</p>
        <div className={cn("p-2 rounded-xl bg-background/50 border border-border/50 text-muted-foreground group-hover:text-foreground transition-colors shadow-sm")}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4 relative z-10">
        <div className="flex items-center gap-3">
          <p className="text-4xl font-bold tabular-nums tracking-tight text-foreground">{value}</p>
          {pulse && <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]" />}
        </div>
        <p className={cn("text-[10px] mt-2 font-bold uppercase tracking-widest", color)}>{trend}</p>
      </div>
    </div>
  );
}

function TimeSettingsCard() {
  const { averageConsultationTime, updateAverageTime } = useQueue();
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(averageConsultationTime.toString());

  return (
    <div className="glass-card bg-card/60 backdrop-blur-md p-6 flex flex-col justify-between border-border/50 hover:border-hcblue-200 dark:hover:border-hcblue-800 transition-all duration-300 relative overflow-hidden group shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.1)] rounded-2xl">
       <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
         <Clock className="w-24 h-24 text-emerald-500" />
      </div>
      <div className="flex items-start justify-between relative z-10">
        <p className="text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">Avg Consult Time</p>
        <button 
           onClick={() => setIsEditing(!isEditing)}
           className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors shadow-sm"
        >
          <Clock className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-4 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditing ? (
             <input 
               type="number"
               autoFocus
               className="w-20 bg-background border border-emerald-500/30 text-foreground px-3 py-1 rounded-lg text-2xl font-bold shadow-inner focus:ring-2 ring-emerald-500/20 focus:outline-none transition-all"
               value={val}
               onChange={e => setVal(e.target.value)}
               onKeyDown={e => {
                 if (e.key === 'Enter') {
                   const parsed = parseInt(val) || 15;
                   updateAverageTime(parsed);
                   setIsEditing(false);
                 }
               }}
               onBlur={() => {
                 const parsed = parseInt(val) || 15;
                 updateAverageTime(parsed);
                 setIsEditing(false);
               }}
             />
          ) : (
            <p className="text-4xl font-bold tabular-nums tracking-tight text-foreground cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => { setVal(averageConsultationTime.toString()); setIsEditing(true); }}>
              {averageConsultationTime}<span className="text-xl text-muted-foreground ml-1">m</span>
            </p>
          )}
        </div>
        <p className="text-[10px] mt-2 font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500 text-right">Click to Edit</p>
      </div>
    </div>
  );
}
