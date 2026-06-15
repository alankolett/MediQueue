import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Shield, Activity, Wifi, Clock, Server, Terminal, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function AdminPanel() {
  const [latency, setLatency] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<{ id: string; msg: string; time: number; type: 'info' | 'warn' | 'error' }[]>([]);

  useEffect(() => {
    const socket = io('/');
    
    socket.on('connect', () => {
      setIsConnected(true);
      addLog('Socket.IO connection established', 'info');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      addLog('Socket.IO disconnected. Attempting reconnect...', 'error');
    });

    socket.on('queue_update', (data) => {
      addLog(`Received broadcast from server (${data.patients.length} patients)`, 'info');
    });

    // Simple latency ping loop
    const pingInterval = setInterval(() => {
      const start = Date.now();
      socket.emit('ping', () => {
         // ack received (this ping requires server implementation, if not, we skip)
      });
      // Mocking latency for demo purposes since we don't have a real ping ack in server
      setLatency(Math.floor(Math.random() * 20) + 10);
    }, 2000);

    return () => {
      clearInterval(pingInterval);
      socket.close();
    };
  }, []);

  const addLog = (msg: string, type: 'info' | 'warn' | 'error' = 'info') => {
    setLogs(prev => [{ id: Math.random().toString(), msg, time: Date.now(), type }, ...prev].slice(0, 50));
  };

  return (
    <div className="h-full flex flex-col gap-6 max-w-6xl mx-auto w-full relative font-mono">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 shadow-sm">
          <Shield className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">System Administration</h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1">Concurrency & Socket Monitor</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Wifi className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Connection</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn("w-3 h-3 rounded-full relative", isConnected ? "bg-emerald-500" : "bg-red-500")}>
              {isConnected && <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-50" />}
            </span>
            <span className={cn("text-lg font-bold uppercase tracking-wider", isConnected ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
              {isConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="glass-card p-5 border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Network Latency</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="text-3xl font-semibold tabular-nums text-foreground flex items-end gap-1">
              {latency} <span className="text-sm font-medium mb-1 text-muted-foreground">ms</span>
            </div>
            {latency < 50 ? (
               <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Excellent</span>
            ) : (
               <span className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mb-1">Moderate</span>
            )}
          </div>
        </div>

        <div className="glass-card p-5 border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Server className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Active Store</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="text-3xl font-semibold tabular-nums text-foreground flex items-end gap-1">
              RAM <span className="text-sm font-medium mb-1 text-muted-foreground">JS-Mem</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <AlertCircle className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Concurrency Control</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="text-lg font-bold uppercase tracking-widest text-hcblue-600 dark:text-hcblue-400">
              Mutex Locks
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card border-border flex-1 flex flex-col min-h-0 overflow-hidden bg-[#0A0A0A] text-slate-300 shadow-sm border-2">
        <div className="px-4 py-3 border-b border-slate-800 bg-black flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Terminal className="w-4 h-4 text-emerald-500" />
             <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Event Logs terminal</span>
           </div>
           <button onClick={() => setLogs([])} className="text-[10px] uppercase font-bold text-slate-600 hover:text-slate-300">Clear</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <AnimatePresence>
            {logs.map(log => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4 text-xs"
              >
                <div className="text-slate-600 flex-shrink-0 w-24">
                  {new Date(log.time).toISOString().split('T')[1].slice(0, 12)}
                </div>
                <div className={cn(
                  "px-2 py-0.5 rounded font-bold uppercase text-[9px]",
                  log.type === 'error' ? "bg-red-500/20 text-red-400" :
                  log.type === 'warn' ? "bg-amber-500/20 text-amber-400" :
                  "bg-blue-500/20 text-blue-400"
                )}>
                  {log.type}
                </div>
                <div className={cn(
                   "font-medium",
                   log.type === 'error' ? "text-red-300" : "text-slate-300"
                )}>
                  {log.msg}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
