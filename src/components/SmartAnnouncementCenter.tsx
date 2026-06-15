import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Settings2, Megaphone, AlertTriangle, MessageSquare, FastForward } from 'lucide-react';
import { useQueue } from '@/store/queueStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function SmartAnnouncementCenter() {
  const { patients, callNext } = useQueue();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [language, setLanguage] = useState('en-US'); // en-US, hi-IN, mr-IN
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [customText, setCustomText] = useState('');
  const [lastAnnouncement, setLastAnnouncement] = useState('');

  const synth = window.speechSynthesis;

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoiceURI) {
        // Try to pick a default voice matching the initial language
        const defaultVoice = availableVoices.find(v => v.lang.startsWith(language.split('-')[0])) || availableVoices[0];
        setSelectedVoiceURI(defaultVoice.voiceURI);
      }
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, [selectedVoiceURI, language, synth]);

  const speak = (text: string) => {
    if (synth.speaking) {
      synth.cancel();
    }
    
    if (text !== '') {
      setLastAnnouncement(text);
      const utterThis = new SpeechSynthesisUtterance(text);
      
      const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
      if (selectedVoice) {
        utterThis.voice = selectedVoice;
      }
      
      utterThis.volume = volume;
      utterThis.rate = rate;
      
      // Override language if not en-US but we force the utterance (though voice dictates accent)
      utterThis.lang = language;
      
      synth.speak(utterThis);
    }
  };

  const handleCallNext = () => {
    const waiting = patients.filter(p => p.status === 'waiting');
    if (waiting.length > 0) {
      const nextPatient = waiting[0];
      const text = `Token ${nextPatient.token}, please proceed to the consultation room.`;
      callNext();
      speak(text);
    } else {
      speak('The queue is clear.');
    }
  };

  const handleRepeatLast = () => {
    if (lastAnnouncement) {
      speak(lastAnnouncement);
    } else {
      speak('No previous announcement to repeat.');
    }
  };

  const handleEmergency = () => {
    const text = 'Attention please. We have a medical emergency. Please clear the primary corridors. Thank you for your cooperation.';
    speak(text);
  };

  const handleTestSpeaker = () => {
    speak('Speaker test successful. The announcement system is online.');
  };

  const handleCustomAnnouncement = () => {
    if (customText.trim()) {
      speak(customText);
      setCustomText('');
    }
  };

  return (
    <div className="glass-card border border-border flex flex-col p-4 w-full relative shadow-sm h-[320px] overflow-hidden">
      <div className="flex justify-between items-center pb-3 border-b border-border">
         <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
           <Volume2 className="w-4 h-4" />
           Smart Announcement Center
         </h3>
      </div>

      <div className="flex-1 overflow-y-auto mt-3 flex flex-col gap-3 custom-scrollbar">
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
           <Button onClick={handleCallNext} size="sm" className="bg-hcblue-600 hover:bg-hcblue-700 text-white flex gap-2">
             <Play className="w-4 h-4" /> Call Next
           </Button>
           <Button onClick={handleRepeatLast} size="sm" variant="outline" className="flex gap-2">
             <Megaphone className="w-4 h-4" /> Repeat Last
           </Button>
           <Button onClick={handleEmergency} size="sm" variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex gap-2">
             <AlertTriangle className="w-4 h-4" /> Emergency
           </Button>
           <Button onClick={handleTestSpeaker} size="sm" variant="outline" className="flex gap-2 text-muted-foreground">
             <Settings2 className="w-4 h-4" /> Test Speaker
           </Button>
        </div>

        {/* Custom Announcement */}
        <div className="flex gap-2">
           <input 
             type="text" 
             value={customText}
             onChange={(e) => setCustomText(e.target.value)}
             placeholder="Custom announcement..."
             className="flex-1 text-sm bg-muted rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-hcblue-500 border border-transparent focus:border-hcblue-500 transition-all font-medium text-foreground placeholder:text-muted-foreground/60"
             onKeyDown={(e) => e.key === 'Enter' && handleCustomAnnouncement()}
           />
           <Button onClick={handleCustomAnnouncement} size="sm" variant="outline" className="px-3 shrink-0">
             <MessageSquare className="w-4 h-4" />
           </Button>
        </div>

        {/* Settings */}
        <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-3 bg-muted/30 p-3 rounded-lg border border-border">
          <div className="space-y-1">
             <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center justify-between">
                Language
             </label>
             <select 
               className="w-full text-xs bg-background border border-border rounded p-1 text-foreground"
               value={language}
               onChange={(e) => setLanguage(e.target.value)}
             >
               <option value="en-US">English</option>
               <option value="hi-IN">Hindi</option>
               <option value="mr-IN">Marathi</option>
             </select>
          </div>
          <div className="space-y-1">
             <label className="text-[10px] font-bold uppercase text-muted-foreground">Voice</label>
             <select 
               className="w-full text-xs bg-background border border-border rounded p-1 text-foreground"
               value={selectedVoiceURI}
               onChange={(e) => setSelectedVoiceURI(e.target.value)}
             >
               {voices.filter(v => v.lang.startsWith(language.split('-')[0]) || language === 'en-US').map(voice => (
                 <option key={voice.voiceURI} value={voice.voiceURI}>
                   {voice.name}
                 </option>
               ))}
               {voices.length === 0 && <option>Loading voices...</option>}
             </select>
          </div>
          
          <div className="space-y-1">
             <label className="text-[10px] font-bold uppercase text-muted-foreground flex justify-between">
               Volume <span>{Math.round(volume * 100)}%</span>
             </label>
             <input 
               type="range" min="0" max="1" step="0.1" value={volume} 
               onChange={(e) => setVolume(parseFloat(e.target.value))}
               className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer" 
             />
          </div>

          <div className="space-y-1">
             <label className="text-[10px] font-bold uppercase text-muted-foreground flex justify-between">
               Speed <span>{rate}x</span>
             </label>
             <input 
               type="range" min="0.5" max="2" step="0.1" value={rate} 
               onChange={(e) => setRate(parseFloat(e.target.value))}
               className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer" 
             />
          </div>
        </div>

      </div>
    </div>
  );
}
