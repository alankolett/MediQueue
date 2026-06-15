import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Navigation, AlertCircle, TestTube, Pill, Users, Stethoscope, MapPin, ChevronRight, ShieldAlert, Crosshair } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

type NodeType = 'room' | 'waypoint';

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  type: NodeType;
  icon?: any;
  color?: string;
  desc?: string;
}

const NODES: Node[] = [
  { id: 'reception', x: 500, y: 500, label: 'Main Reception', type: 'room', icon: Users, color: 'text-blue-400', desc: 'Check-in & Inquiries' },
  { id: 'j1', x: 500, y: 400, label: '', type: 'waypoint' },
  { id: 'emergency', x: 800, y: 400, label: 'Emergency (ER)', type: 'room', icon: ShieldAlert, color: 'text-red-400', desc: 'Critical care unit' },
  { id: 'pharmacy', x: 200, y: 400, label: 'Pharmacy', type: 'room', icon: Pill, color: 'text-emerald-400', desc: 'Prescription pickup' },
  { id: 'j2', x: 500, y: 250, label: '', type: 'waypoint' },
  { id: 'doc1', x: 300, y: 250, label: 'Consultation 1', type: 'room', icon: Stethoscope, color: 'text-slate-300', desc: 'Dr. Smith' },
  { id: 'doc2', x: 700, y: 250, label: 'Consultation 2', type: 'room', icon: Stethoscope, color: 'text-slate-300', desc: 'Dr. Chen' },
  { id: 'j3', x: 500, y: 100, label: '', type: 'waypoint' },
  { id: 'lab', x: 500, y: 50, label: 'Laboratory', type: 'room', icon: TestTube, color: 'text-purple-400', desc: 'Diagnostics & Testing' },
];

const EDGES: [string, string][] = [
  ['reception', 'j1'],
  ['j1', 'emergency'],
  ['j1', 'pharmacy'],
  ['j1', 'j2'],
  ['j2', 'doc1'],
  ['j2', 'doc2'],
  ['j2', 'j3'],
  ['j3', 'lab']
];

function findShortestPath(start: string, end: string): string[] {
  const adj = new Map<string, string[]>();
  for (const n of NODES) adj.set(n.id, []);
  for (const [u, v] of EDGES) {
    adj.get(u)?.push(v);
    adj.get(v)?.push(u);
  }

  const q = [[start]];
  const visited = new Set([start]);

  while (q.length > 0) {
    const path = q.shift()!;
    const node = path[path.length - 1];
    
    if (node === end) return path;

    for (const neighbor of adj.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        q.push([...path, neighbor]);
      }
    }
  }
  return [];
}

export function HospitalMap() {
  const [startNode, setStartNode] = useState('reception');
  const [endNode, setEndNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const rooms = NODES.filter(n => n.type === 'room');
  const filteredRooms = rooms.filter(n => 
    n.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (n.desc && n.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentPath = useMemo(() => {
    if (!startNode || !endNode) return [];
    return findShortestPath(startNode, endNode);
  }, [startNode, endNode]);

  const getPathString = (path: string[]) => {
    if (path.length < 2) return '';
    let d = '';
    for (let i = 0; i < path.length; i++) {
        const node = NODES.find(n => n.id === path[i])!;
        if (i === 0) d += `M ${node.x} ${node.y} `;
        else d += `L ${node.x} ${node.y} `;
    }
    return d;
  };

  const getDistance = (path: string[]) => {
    if (path.length < 2) return 0;
    let dist = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const a = NODES.find(n => n.id === path[i])!;
      const b = NODES.find(n => n.id === path[i+1])!;
      dist += Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
    // roughly convert svg units to meters
    return Math.round(dist / 5);
  };

  return (
    <div className="h-full flex flex-col md:flex-row relative bg-[#02050a] text-slate-200 overflow-hidden font-sans">
      
      {/* Sidebar Navigator */}
      <div className="w-full md:w-96 flex flex-col border-r border-white/5 bg-black/40 backdrop-blur-3xl z-20 flex-shrink-0">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-blue-400" /> Wayfinder
          </h2>
          
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination..." 
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600 focus:bg-white/[0.05] text-white"
            />
          </div>

          <div className="flex items-center gap-3 text-xs">
             <div className="flex-1 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 flex items-center gap-2">
                <Navigation className="w-3 h-3" /> Starting from:
             </div>
             <span className="font-semibold text-white">Reception</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {filteredRooms.map(room => {
              const Icon = room.icon;
              const isSelected = endNode === room.id;
              return (
                <motion.div
                  key={room.id}
                  layout
                  initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                  whileHover={{ scale: 1.01, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEndNode(room.id)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden",
                    isSelected 
                      ? "bg-gradient-to-r from-blue-500/10 to-transparent border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                      : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                  )}
                >
                  {isSelected && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" 
                    />
                  )}
                  
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2.5 rounded-xl bg-white/5 shadow-inner", room.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className={cn("font-semibold text-sm", isSelected ? "text-white" : "text-slate-300 group-hover:text-white")}>{room.label}</h3>
                      <p className="text-xs text-slate-500">{room.desc}</p>
                    </div>
                    {isSelected ? (
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Navigation className="w-4 h-4" />
                      </div>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {endNode && currentPath.length > 0 && (
          <div className="p-6 border-t border-white/5 bg-gradient-to-t from-blue-500/10 to-transparent">
            <div className="flex justify-between items-end mb-4">
               <div>
                 <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-1">Estimated Walk</p>
                 <p className="text-2xl font-light text-white tracking-tight">{Math.ceil(getDistance(currentPath) / 80)} <span className="text-sm text-slate-400">min</span></p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Distance</p>
                 <p className="text-lg font-medium text-slate-300">{getDistance(currentPath)}m</p>
               </div>
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-[0_10px_20px_rgba(59,130,246,0.3)]">
              Start Navigation
            </Button>
          </div>
        )}
      </div>

      {/* Map Canvas */}
      <div className="flex-1 relative bg-black/20 overflow-hidden flex items-center justify-center cursor-move">
         {/* Grid Background */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
         
         <svg 
           viewBox="0 0 1000 600" 
           className="w-full max-w-[1200px] h-auto drop-shadow-2xl" 
           style={{ filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.5))' }}
         >
           <defs>
             <linearGradient id="pathGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2dd4bf" />
             </linearGradient>
             <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur stdDeviation="8" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
             </filter>
             <filter id="glow-small" x="-50%" y="-50%" width="200%" height="200%">
               <feGaussianBlur stdDeviation="3" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
             </filter>
           </defs>

           {/* Draw Base Edges (Corridors) */}
           {EDGES.map((edge, i) => {
             const n1 = NODES.find(n => n.id === edge[0])!;
             const n2 = NODES.find(n => n.id === edge[1])!;
             return (
               <line 
                 key={i} 
                 x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} 
                 stroke="rgba(255,255,255,0.05)" 
                 strokeWidth="24" 
                 strokeLinecap="round" 
               />
             );
           })}

           {/* Draw Active Path */}
           {currentPath.length > 0 && (
             <>
               <motion.path
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
                 d={getPathString(currentPath)}
                 fill="none"
                 stroke="url(#pathGradient)"
                 strokeWidth="6"
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 filter="url(#glow)"
               />
               {/* Pulsing dots along path */}
               <motion.path
                 d={getPathString(currentPath)}
                 fill="none"
                 stroke="#fff"
                 strokeWidth="6"
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 strokeDasharray="2 20"
                 className="animate-[dash_1s_linear_infinite]"
               />
             </>
           )}

           {/* Draw Nodes */}
           {NODES.map((node) => {
             const isStart = node.id === startNode;
             const isEnd = node.id === endNode;
             const isWaypoint = node.type === 'waypoint';

             if (isWaypoint) {
                const isInPath = currentPath.includes(node.id);
                return (
                  <circle 
                    key={node.id} 
                    cx={node.x} cy={node.y} 
                    r="4" 
                    fill={isInPath ? "#2dd4bf" : "rgba(255,255,255,0.1)"} 
                    filter={isInPath ? "url(#glow-small)" : "none"}
                  />
                );
             }

             // Draw Room nodes as 3D-ish tech elements
             return (
               <g key={node.id} className="cursor-pointer transition-transform hover:scale-105" onClick={() => setEndNode(node.id)} style={{ transformOrigin: `${node.x}px ${node.y}px` }}>
                 <circle cx={node.x} cy={node.y} r="28" fill="#0f172a" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                 
                 {/* Internal icon placeholder */}
                 <circle cx={node.x} cy={node.y} r="20" fill="rgba(255,255,255,0.05)" />
                 
                 {(isEnd || isStart) && (
                   <circle cx={node.x} cy={node.y} r="34" fill="none" stroke={isStart ? "#3b82f6" : "#2dd4bf"} strokeWidth="2" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${node.x}px ${node.y}px` }} filter="url(#glow-small)" />
                 )}

                 {/* Icon SVG */}
                 {node.icon && (
                    <svg x={node.x - 12} y={node.y - 12} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={node.color || "text-slate-400"}>
                        {node.id === 'emergency' && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
                        {node.id === 'emergency' && <line x1="12" y1="8" x2="12" y2="12" />}
                        {node.id === 'emergency' && <line x1="12" y1="16" x2="12.01" y2="16" />}
                        
                        {node.id === 'reception' && <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />}
                        {node.id === 'reception' && <circle cx="9" cy="7" r="4" />}
                        {node.id === 'reception' && <path d="M23 21v-2a4 4 0 0 0-3-3.87" />}
                        {node.id === 'reception' && <path d="M16 3.13a4 4 0 0 1 0 7.75" />}

                        {node.id === 'pharmacy' && <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />}
                        {node.id === 'pharmacy' && <path d="m8.5 8.5 7 7" />}

                        {node.id === 'lab' && <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2" />}
                        {node.id === 'lab' && <path d="M8.5 2h7" />}
                        {node.id === 'lab' && <path d="M14.5 16h-5" />}

                        {(node.id === 'doc1' || node.id === 'doc2') && <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />}
                        {(node.id === 'doc1' || node.id === 'doc2') && <path d="M8 15v8" />}
                        {(node.id === 'doc1' || node.id === 'doc2') && <circle cx="8" cy="23" r="1" />}
                    </svg>
                 )}

                 <text x={node.x} y={node.y + 45} textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="600" className="drop-shadow-md">
                   {node.label}
                 </text>
               </g>
             );
           })}
         </svg>
         
         <style dangerouslySetInnerHTML={{__html: `
            @keyframes dash {
              to { stroke-dashoffset: -22; }
            }
         `}} />
      </div>
    </div>
  );
}
