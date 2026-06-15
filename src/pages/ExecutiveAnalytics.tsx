import React, { useState } from 'react';
import { useQueue } from '@/store/queueStore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Clock, ShieldAlert, Activity, ArrowUpRight, ArrowDownRight, Calendar, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export function ExecutiveAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const { patients, insights } = useQueue();

  const totalPatients = patients.length;
  const servedPatients = patients.filter(p => p.status === 'completed').length;
  const avgWaitTime = insights.averageWaitTime;
  const emergencyCount = patients.filter(p => p.priority === 'emergency').length;
  const urgentCount = patients.filter(p => p.priority === 'urgent').length;
  const routineCount = patients.filter(p => p.priority === 'routine').length;

  const efficiency = totalPatients > 0 ? ((servedPatients / totalPatients) * 100).toFixed(1) : '100.0';

  // Construct a simple timeline of queue volume based on the real data
  // Since we don't have historical days in an empty state, let's group by hours of the current day.
  const chartData = React.useMemo(() => {
    // Generate empty buckets for the last 12 hours
    const now = new Date();
    const buckets: Record<string, any> = {};
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hourStr = `${d.getHours()}:00`;
        buckets[hourStr] = { time: hourStr, emergency: 0, urgent: 0, routine: 0, sortKey: d.getTime() };
    }

    // Populate with real data
    patients.forEach(p => {
        const d = new Date(p.addedAt || Date.now());
        const hourStr = `${d.getHours()}:00`;
        if (buckets[hourStr]) {
            if (p.priority === 'emergency') buckets[hourStr].emergency++;
            else if (p.priority === 'urgent') buckets[hourStr].urgent++;
            else buckets[hourStr].routine++;
        }
    });

    return Object.values(buckets).sort((a, b) => a.sortKey - b.sortKey);
  }, [patients]);


  return (
    <div className="h-full flex flex-col p-6 gap-6 bg-background text-foreground overflow-y-auto font-sans relative">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 flex-shrink-0 relative z-10 pb-6 border-b border-border/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-hcblue-600 dark:text-hcblue-400 font-bold tracking-tight text-sm uppercase mb-2">
             <Activity className="w-4 h-4" />
             MediQueue Overview
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Real-Time Patient Flow Management</h1>
          <p className="text-sm text-muted-foreground font-medium pt-1">Today's live status and operational metrics.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-card glass shadow-sm border border-border/50 p-1 rounded-xl flex text-sm">
            {['today', '24h', '7d'].map(range => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-2 rounded-lg font-semibold capitalize transition-all duration-200",
                  timeRange === range ? "bg-hcblue-50 text-hcblue-600 dark:bg-hcblue-500/20 dark:text-hcblue-300 shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 flex-shrink-0">
        <MetricCard title="Total Registrations" value={totalPatients.toString()} change="LIVE" isPositive={true} icon={Users} color="blue" />
        <MetricCard title="Awaiting or Served" value={servedPatients.toString()} change="LIVE" isPositive={true} icon={Activity} color="emerald" />
        <MetricCard title="Emergency Load" value={emergencyCount.toString()} change="LIVE" isPositive={false} icon={ShieldAlert} color="red" />
        <MetricCard title="System Throughput" value={`${efficiency}%`} change="LIVE" isPositive={true} icon={Clock} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Main Traffic Chart */}
        <div className="lg:col-span-3 glass-card bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-foreground">Live Patient Volume</h3>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Arrivals today by priority tier</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground bg-muted/30 px-4 py-2 rounded-xl">
               <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" /> Routine</div>
               <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" /> Urgent</div>
               <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" /> Emergency</div>
            </div>
          </div>
          <div className="h-[320px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRoutine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUrgent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEmergency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="emergency" stackId="1" stroke="#ef4444" fill="url(#colorEmergency)" strokeWidth={2} />
                <Area type="monotone" dataKey="urgent" stackId="1" stroke="#f59e0b" fill="url(#colorUrgent)" strokeWidth={2} />
                <Area type="monotone" dataKey="routine" stackId="1" stroke="#3b82f6" fill="url(#colorRoutine)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, isPositive, icon: Icon, inverseTrend, color = "blue" }: any) {
  const isGood = inverseTrend ? !isPositive : isPositive;
  
  const colorStyles: Record<string, string> = {
    blue: "text-blue-500 bg-blue-50/50 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-900",
    emerald: "text-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900",
    red: "text-red-500 bg-red-50/50 dark:bg-red-500/10 dark:text-red-400 border-red-100 dark:border-red-900",
    amber: "text-amber-500 bg-amber-50/50 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-900",
    indigo: "text-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900"
  };

  const bgGradient: Record<string, string> = {
    blue: "from-blue-500/5 dark:from-blue-400/5",
    emerald: "from-emerald-500/5 dark:from-emerald-400/5",
    red: "from-red-500/5 dark:from-red-400/5",
    amber: "from-amber-500/5 dark:from-amber-400/5",
    indigo: "from-indigo-500/5 dark:from-indigo-400/5"
  };

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn("glass-card bg-card/80 backdrop-blur-md border border-border/50 rounded-3xl p-6 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300", 
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none opacity-50 transition-opacity duration-500 group-hover:opacity-100", bgGradient[color])} />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={cn("p-3 rounded-2xl flex items-center justify-center border shadow-sm transition-transform duration-500 group-hover:scale-110", colorStyles[color])}>
           <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-background/50 backdrop-blur-md border border-border/50 text-foreground uppercase tracking-wider shadow-sm">
           <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", color === 'red' ? 'bg-red-500' : 'bg-emerald-500')} />
           {change}
        </div>
      </div>
      
      <div className="relative z-10">
        <h2 className="text-4xl font-bold text-foreground tracking-tight mb-2">{value}</h2>
        <p className="text-sm font-semibold text-muted-foreground tracking-wide">{title}</p>
      </div>
      
      <div className={cn("absolute -bottom-8 -right-8 p-4 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.06] dark:group-hover:opacity-[0.08] transition-all duration-700 ease-out group-hover:scale-[1.2] group-hover:-rotate-12", colorStyles[color].split(" ")[0])}>
        <Icon className="w-40 h-40" />
      </div>
    </motion.div>
  );
}
