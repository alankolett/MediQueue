import React from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Users, UserRound, Settings, Activity, Search, Bell, Map, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

export function AppLayout() {
  const location = useLocation();
  const isPatientView = location.pathname.startsWith('/patient');

  if (isPatientView) {
    return (
      <div className="min-h-screen pb-safe bg-background text-foreground transition-colors duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, scale: 0.99, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, scale: 0.99, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-full relative z-10"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  const navItems = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Queue Management', href: '/queue', icon: Users },
    { name: 'Patient Tracking', href: '/patient', icon: UserRound },
    { name: 'Doctor Panel', href: '/doctor', icon: UserRound },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'AI Copilot', href: '/insights', icon: Activity },
    { name: 'Settings', href: '/admin', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground relative transition-colors duration-300">
      
      {/* Dynamic Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft blue glow top left */}
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#dbeafe] dark:bg-[#1e3a8a] opacity-60 blur-[120px] mix-blend-multiply dark:mix-blend-lighten transition-colors duration-700" />
        
        {/* Soft teal glow bottom right */}
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#ccfbf1] dark:bg-[#0f766e] opacity-60 blur-[120px] mix-blend-multiply dark:mix-blend-lighten transition-colors duration-700" />
        
        {/* Subtle purple center highlight */}
        <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-[#ede9fe] dark:bg-[#312e81] opacity-40 blur-[120px] mix-blend-multiply dark:mix-blend-lighten transition-colors duration-700" />
      </div>

      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-border/50 bg-card/60 backdrop-blur-xl z-20 hidden md:flex transition-colors duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between px-6 h-16 border-b border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-hcblue-500/10 to-transparent dark:from-hcblue-400/10 pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-hcblue-500 to-hcblue-700 flex items-center justify-center shadow-lg shadow-hcblue-500/30">
              <div className="w-4 h-4 border-[2.5px] border-white rounded-sm opacity-90"></div>
            </div>
            <span className="font-bold tracking-tight text-xl text-foreground">MediQueue</span>
          </div>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          <nav className="space-y-1.5 ">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Menu</div>
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || (location.pathname === '/' && item.href === '/queue');
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.01, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium relative overflow-hidden group border border-transparent',
                      isActive 
                        ? 'text-hcblue-700 dark:text-hcblue-300 bg-hcblue-50/80 dark:bg-hcblue-500/10 border-hcblue-200/50 dark:border-hcblue-500/20 shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeNav"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-gradient-to-b from-hcblue-400 to-hcblue-600 rounded-r-full" 
                      />
                    )}
                    <item.icon className={cn("w-[18px] h-[18px] relative z-10 transition-colors", isActive ? "text-hcblue-600 dark:text-hcblue-400" : "group-hover:text-foreground")} />
                    <span className="relative z-10 font-semibold">{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-border/50 bg-background/30">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/80 cursor-pointer transition-all duration-200 border border-transparent hover:border-border/50 hover:shadow-sm">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 border border-border/50 flex items-center justify-center shadow-inner">
              <UserRound className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">Dr. Sarah Chen</p>
              <p className="text-[10px] font-semibold text-muted-foreground truncate tracking-wide">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 bg-transparent">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-border/50 bg-card/60 backdrop-blur-xl flex items-center justify-between px-8 z-20 transition-colors duration-300 relative shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex flex-1 items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Outpatient Wing A</h1>
            <div className="h-4 w-px bg-border"></div>
            <span className="px-2.5 py-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-500/20" />
              Live Sync
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-8 w-px bg-border mx-1"></div>
            <button className="relative p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/80 border border-transparent hover:border-border/50">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_0_2px_var(--bg-base)]" />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto scroll-smooth p-6 md:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15, scale: 0.99, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, scale: 0.99, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full relative z-10"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
