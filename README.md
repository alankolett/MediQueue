ediQueue 🏥
<p align="center">
  <img src="https://img.shields.io/badge/React-18.2+-61DAFB?logo=react&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Socket.IO-4.0+-010101?logo=socket.io&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Vite-5.0+-646CFF?logo=vite&logoColor=white&style=for-the-badge" />
</p>
<p align="center">
  <b>Real-Time Patient Flow Management for Modern Clinics</b><br/>
  Eliminate paper tokens. Streamline queues. Enhance patient experience.
</p>
<p align="center">
  <a href="#-live-demo">Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-documentation">API Docs</a>
</p>
📸 Screenshots
Receptionist Dashboard — Real-Time Overview
<p align="center">
  <img src="./docs/screenshots/overview.png" alt="MediQueue Overview Dashboard" width="800"/>
</p>
Code Architecture & Project Structure
<p align="center">
  <img src="./docs/screenshots/code-structure-1.png" alt="Project File Structure" width="800"/>
  <img src="./docs/screenshots/code-structure-2.png" alt="Component Architecture" width="800"/>
</p>
🎯 Problem Statement
Healthcare clinics worldwide still rely on paper token systems and manual queue management, creating critical operational inefficiencies:
Table
Challenge	Impact
🕐 Long patient waiting times	Patient dissatisfaction, perceived poor service quality
👁️ No queue visibility	Patients anxious, staff overwhelmed with status inquiries
📋 Inefficient receptionist workflows	Manual tracking, human error, duplicate entries
📢 Poor patient-staff communication	Missed announcements, confusion about consultation status
MediQueue solves these challenges through a real-time, synchronized queue management ecosystem with intelligent wait-time estimation and multi-role dashboards.
✨ Key Features
🖥️ Receptionist Dashboard
The central command center for clinic operations:
🎫 Token Issuance — Generate unique patient tokens with priority flags
📢 Smart Call System — Call next patient with one-click status updates
⚡ Priority Triage — Urgent cases automatically bubble to the top of the queue
⏱️ Consultation Time Configuration — Set average consultation duration for accurate wait-time predictions
📊 Live Queue Monitoring — Real-time count of waiting, in-session, and completed patients
🔔 Smart Announcements — Automated voice/text announcements for token calls
🔄 Real-Time Sync — Instant updates across all connected clients via Socket.IO
👤 Patient Dashboard
Empower patients with transparency and control:
📍 Live Queue Status — Track exact position in queue in real time
🔢 Current Token Display — See which token is currently being served
👥 Ahead Count — Know exactly how many patients are ahead
⏳ Estimated Waiting Time — AI-powered wait-time calculation based on live consultation data
📈 Progress Tracking — Visual stepper showing: Registered → Waiting → In Session → Completed
📺 Public Waiting Room Display
Large-screen display for waiting areas:
🔢 Current Token — Prominent display of the active consultation token
📋 Upcoming Queue — Preview of next 3-5 patients in line
📢 Live Announcements — Scrolling clinic announcements and health tips
⚡ Zero-Refresh Updates — Seamless real-time updates via WebSocket
🌗 Day/Night Mode — Automatic theme switching for ambient lighting
👨‍⚕️ Doctor Panel
Optimized consultation workflow:
👤 Current Patient Info — Full patient context at a glance
👁️ Next Patient Preview — Prepare for upcoming consultations
📊 Queue Overview — Manage personal consultation queue
✅ Workflow Support — Mark complete, refer, or flag for follow-up
🤖 AI Copilot
Intelligent operational insights:
🩺 Queue Health Analysis — Detect bottlenecks and irregular patterns
⏱️ Wait-Time Monitoring — Alert when average wait exceeds thresholds
🚦 Congestion Detection — Predict and warn about peak load times
💡 Operational Recommendations — Suggest staff allocation and break timing
🛠️ Tech Stack
Frontend
Table
Technology	Purpose
React 18	UI framework with concurrent features
TypeScript	Type-safe development, reduced runtime errors
Vite	Ultra-fast build tool and dev server
Tailwind CSS	Utility-first styling with custom healthcare design system
Socket.IO Client	Real-time bidirectional event communication
Zustand	Lightweight state management for queue store
Lucide React	Consistent, crisp iconography
Backend & Infrastructure
Table
Technology	Purpose
Node.js + Express	RESTful API and Socket.IO server
Socket.IO	WebSocket-based real-time synchronization
Redis (planned)	Session store and pub/sub for multi-server scaling
PostgreSQL (planned)	Persistent storage for analytics and audit logs
Design System
Healthcare-First Color Palette — Calming blues, clinical whites, and alert ambers
Glassmorphism UI — backdrop-blur and translucent cards for modern aesthetics
Accessibility (a11y) — WCAG 2.1 AA compliant contrast ratios and keyboard navigation
Responsive Grid — Optimized for desktop dashboards, tablet kiosks, and mobile phones
🏗️ Architecture
plain
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │ Receptionist │ │   Patient    │ │    Public    │             │
│  │  Dashboard   │ │  Dashboard   │ │   Display    │             │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │ Doctor Panel │ │  AI Copilot  │ │   Admin      │             │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘             │
│         └─────────────────┼─────────────────┘                    │
│                           │ Socket.IO                            │
└───────────────────────────┼─────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                      SERVER LAYER                                │
│                           │                                      │
│  ┌────────────────────────┴────────────────────────┐            │
│  │              Socket.IO Server                      │            │
│  │  • Room Management (per clinic/wing)             │            │
│  │  • Event Broadcasting (token updates, calls)     │            │
│  │  • Presence Detection (online/offline status)    │            │
│  └────────────────────────┬────────────────────────┘            │
│                           │                                      │
│  ┌────────────────────────┴────────────────────────┐            │
│  │              Queue Engine                        │            │
│  │  • Concurrency-Safe Operations (atomic updates)  │            │
│  │  • Priority Queue Algorithm (triage support)     │            │
│  │  • Wait-Time Calculation (moving average)        │            │
│  │  • Audit Logging (HIPAA-compliant tracking)      │            │
│  └──────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
Real-Time Event Flow
plain
Receptionist issues token
         │
         ▼
  ┌──────────────┐
  │  queueStore  │ ─── Zustand state update (local)
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Socket.IO    │ ─── emit('token:issued', payload)
  │   Client     │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Socket.IO    │ ─── broadcast to room/clinic
  │   Server     │
  └──────┬───────┘
         │
    ┌────┴────┐
    ▼         ▼
Patient    Public
Dashboard   Display
📁 Project Structure
plain
MediQueue/
├── 📂 assets/                  # Static images, icons, and media
├── 📂 docs/                    # Documentation and screenshots
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 📂 layout/          # AppLayout, Sidebar, Header
│   │   └── 📂 ui/              # Reusable UI primitives
│   │       ├── Badge.tsx       # Status badges (Live, Waiting, etc.)
│   │       ├── Button.tsx      # Gradient, glass, and outline variants
│   │       ├── Premium.tsx     # Premium feature indicators
│   │       ├── SmartAnn.tsx    # Smart announcement component
│   │       ├── ThemePr.tsx     # Theme provider wrapper
│   │       └── ThemeT.tsx      # Theme toggle (light/dark)
│   │
│   ├── 📂 pages/               # Route-level page components
│   │   ├── AdminPage.tsx       # Admin configuration panel
│   │   ├── AICopilot.tsx       # AI insights dashboard
│   │   ├── DoctorPanel.tsx     # Doctor consultation view
│   │   ├── Executive.tsx       # Executive analytics overview
│   │   ├── Hospital.tsx        # Multi-clinic management
│   │   ├── PatientDashboard.tsx # Patient self-service portal
│   │   └── ReceptionistDashboard.tsx # Receptionist command center
│   │
│   ├── 📂 store/
│   │   └── queueStore.tsx      # Zustand store: queue state, actions, selectors
│   │
│   ├── 📂 types/
│   │   └── App.tsx             # Global TypeScript interfaces
│   │       # Patient, Token, QueueStatus, ConsultationEvent, etc.
│   │
│   ├── 📂 lib/                 # Utility functions and helpers
│   │
│   ├── App.tsx                 # Root component with routing
│   ├── main.tsx                # Entry point (React 18 createRoot)
│   └── index.css               # Tailwind directives + custom CSS variables
│
├── 📄 .env.example             # Environment variable template
├── 📄 .gitignore
├── 📄 index.html               # HTML entry point
├── 📄 metadata.json            # App metadata and PWA config
├── 📄 package.json             # Dependencies and scripts
├── 📄 package-lock.json
├── 📄 README.md                # This file
├── 📄 tsconfig.json            # TypeScript configuration
├── 📄 tsconfig.app.json        # App-specific TS config
└── 📄 vite.config.ts           # Vite build configuration
🚀 Getting Started
Prerequisites
Node.js >= 18.0.0
npm >= 9.0.0 or yarn >= 1.22.0
Git
Installation
bash
# 1. Clone the repository
git clone https://github.com/your-org/mediqueue.git
cd mediqueue

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and set:
# VITE_SOCKET_SERVER_URL=ws://localhost:3001
# VITE_CLINIC_ID=wing-a
# VITE_API_BASE_URL=http://localhost:3001/api

# 4. Start the development server
npm run dev
The application will be available at http://localhost:5173.
Build for Production
bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
Docker Deployment (Optional)
bash
# Build Docker image
docker build -t mediqueue:latest .

# Run container
docker run -p 5173:80 -e VITE_SOCKET_SERVER_URL=ws://your-server mediqueue:latest
📡 Socket.IO Events Documentation
Client → Server Events
Table
Event	Payload	Description
token:issue	{ patientName, priority?, type }	Receptionist issues new token
token:call	{ tokenId }	Call next patient to consultation
token:complete	{ tokenId, duration, notes? }	Mark consultation as completed
token:skip	{ tokenId, reason }	Skip/token no-show handling
config:update	{ avgConsultationTime, maxQueueSize }	Update clinic configuration
room:join	{ clinicId, role }	Client joins clinic-specific room
Server → Client Events
Table
Event	Payload	Description
queue:update	{ tokens[], stats, estimatedWait }	Full queue state broadcast
token:announce	{ tokenId, room, audio? }	Announce token call (with TTS)
stats:realtime	{ avgWait, throughput, activeDoctors }	Live operational metrics
alert:congestion	{ severity, message, recommendations[] }	AI congestion warning
error:queue	{ code, message, context }	Error handling and validation
🧪 Testing
bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run E2E tests (Cypress)
npm run test:e2e
🗺️ Roadmap & Future Enhancements
Table
Phase	Feature	Status
v1.1	Multi-clinic / multi-wing support	🚧 In Progress
v1.2	WhatsApp/SMS notifications	📋 Planned
v1.3	Digital appointment integration	📋 Planned
v1.4	Advanced AI queue forecasting (LSTM)	📋 Planned
v2.0	HIS (Hospital Information System) integration	🔮 Future
v2.0	Mobile app (React Native)	🔮 Future
v2.0	Voice-enabled token calling (Alexa/Google)	🔮 Future
🤝 Contributing
We welcome contributions! Please follow these steps:
Fork the repository
Create a feature branch: git checkout -b feature/amazing-feature
Commit your changes: git commit -m 'Add amazing feature'
Push to the branch: git push origin feature/amazing-feature
Open a Pull Request
Contribution Guidelines
Follow the existing TypeScript strict typing
Maintain Tailwind CSS utility-first approach
Add unit tests for new store actions
Ensure Socket.IO events are documented
Respect healthcare accessibility standards (a11y)
📄 License
This project is licensed under the MIT License — see the LICENSE file for details.
🙏 Acknowledgments
React Team for the concurrent rendering engine
Socket.IO for rock-solid WebSocket abstractions
Tailwind Labs for the utility-first CSS framework
Healthcare UX Research community for accessibility insights
<p align="center">
  <b>Built with 💙 for better healthcare experiences</b><br/>
  <sub>MediQueue — Modernizing patient flow, one token at a time.</sub>
</p>
