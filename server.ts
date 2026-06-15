import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Simple async Mutex to handle concurrency and avoid race conditions (e.g. 2 receptionists clicking "Call Next")
class Mutex {
  private mutex: Promise<void> = Promise.resolve();
  lock(): Promise<() => void> {
    let begin: (unlock: () => void) => void = () => {};
    this.mutex = this.mutex.then(() => new Promise<void>(begin)).catch(() => {});
    return new Promise((res) => { begin = res; });
  }
}
const queueMutex = new Mutex();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// In-memory JavaScript database to bypass GLIBC issues with node_sqlite3
interface Patient {
  id: string;
  name: string;
  tokenId: string;
  status: string;
  type: string;
  createdAt: string;
}

const db = {
  patients: [] as Patient[],
  settings: { averageConsultationTime: 15 },
  daily_tokens: new Map<string, number>()
};

const getSettings = async () => {
  return { averageConsultationTime: db.settings.averageConsultationTime };
};

const getPatients = async () => {
  return db.patients
    .filter(p => p.status !== 'cancelled')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

const getNextTokenId = async (dateStr: string, type: string): Promise<string> => {
  const current = db.daily_tokens.get(dateStr) || 0;
  const next = current + 1;
  db.daily_tokens.set(dateStr, next);
  const prefix = type === 'emergency' ? 'E' : type === 'urgent' ? 'U' : 'T';
  return `${prefix}-${next.toString().padStart(3, '0')}`;
};

const broadcastState = async () => {
  const patients = await getPatients();
  const settings = await getSettings();
  io.emit('queue_update', {
    patients,
    averageConsultationTime: settings.averageConsultationTime
  });
};

io.on('connection', async (socket) => {
  console.log('Client connected:', socket.id);
  
  const patients = await getPatients();
  const settings = await getSettings();
  socket.emit('queue_update', {
    patients,
    averageConsultationTime: settings.averageConsultationTime
  });

  socket.on('add_patient', async (patientData, ack) => {
    if (!patientData || !patientData.name || !patientData.type) {
      if (typeof ack === 'function') ack({ success: false, error: 'Invalid patient data' });
      return;
    }

    const unlock = await queueMutex.lock();
    try {
      const id = uuidv4();
      const today = new Date().toISOString().split('T')[0];
      const tokenId = await getNextTokenId(today, patientData.type);
      
      db.patients.push({
        id,
        name: patientData.name,
        tokenId,
        status: 'waiting',
        type: patientData.type,
        createdAt: new Date().toISOString()
      });
      
      await broadcastState();
      if (typeof ack === 'function') ack({ success: true, tokenId });
    } catch (e: any) {
      if (typeof ack === 'function') ack({ success: false, error: e.message });
    } finally {
      unlock();
    }
  });

  socket.on('call_next', async (_, ack) => {
    const unlock = await queueMutex.lock();
    try {
      // Find the next waiting patient based on priority and time
      // Priority: emergency > urgent > routine
      const waitingPatients = db.patients.filter(p => p.status === 'waiting');
      waitingPatients.sort((a, b) => {
        const typeWeight = { emergency: 1, urgent: 2, routine: 3 };
        const wA = typeWeight[a.type as keyof typeof typeWeight] || 3;
        const wB = typeWeight[b.type as keyof typeof typeWeight] || 3;
        if (wA !== wB) return wA - wB;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

      const nextPatient = waitingPatients[0];

      if (!nextPatient) {
         if (typeof ack === 'function') ack({ success: false, error: 'Queue is empty' });
         unlock();
         return;
      }

      nextPatient.status = 'in_session';
      
      await broadcastState();
      if (typeof ack === 'function') ack({ success: true, calledId: nextPatient.id });
    } catch (e: any) {
      if (typeof ack === 'function') ack({ success: false, error: e.message });
    } finally {
      unlock();
    }
  });

  socket.on('update_status', async (data, ack) => {
    if (!data || !data.id || !data.status) return;
    const unlock = await queueMutex.lock();
    try {
      const patient = db.patients.find(p => p.id === data.id);
      if (patient) {
        patient.status = data.status;
      }
      await broadcastState();
      if (typeof ack === 'function') ack({ success: true });
    } catch (e: any) {
      if (typeof ack === 'function') ack({ success: false, error: e.message });
    } finally {
      unlock();
    }
  });

  socket.on('update_settings', async (data, ack) => {
    const unlock = await queueMutex.lock();
    try {
      db.settings.averageConsultationTime = data.averageConsultationTime;
      await broadcastState();
      if (typeof ack === 'function') ack({ success: true });
    } catch (e: any) {
      if (typeof ack === 'function') ack({ success: false, error: e.message });
    } finally {
      unlock();
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API Routes to make sure we fulfill the "Backend APIs" requirement
app.get('/api/queue', async (req, res) => {
  const patients = await getPatients();
  const settings = await getSettings();
  res.json({ patients, averageConsultationTime: settings.averageConsultationTime });
});

async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

startServer();
