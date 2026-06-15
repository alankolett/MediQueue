MediQueue 🏥
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
  
Problem:
Clinics relying on paper tokens and manual queue management face three core issues:
Long waiting times — Patients wait without knowing their position or estimated duration.
No queue visibility — Staff and patients lack a shared, real-time view of the queue.
Manual receptionist workflows — Receptionists track queues by hand, leading to errors and inefficiency.

  
Solution:
MediQueue replaces paper-based systems with a real-time digital queue management platform.
Real-time synchronization — All dashboards update instantly via Socket.IO when a token is issued, called, or completed.
Dynamic wait-time calculation — Estimated wait times are computed from live consultation durations and queue depth.
Patient transparency — Patients see their exact queue position, current token being served, and projected wait time.

Screenshots:
<img width="1918" height="808" alt="image" src="https://github.com/user-attachments/assets/98922bd3-1497-4680-b0fe-903f12561485" />
<img width="1918" height="808" alt="image" src="https://github.com/user-attachments/assets/3b53f261-030c-48a5-908c-103282fb6254" />
<img width="1918" height="808" alt="image" src="https://github.com/user-attachments/assets/bdffbb98-2b32-45d3-b88a-00d42530429c" />




Features:
| Feature                | Description                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| Receptionist Dashboard | Issue tokens, call the next patient, manage priority triage, and monitor live queue status.            |
| Patient Dashboard      | View real-time queue position, current token being served, patients ahead, and estimated waiting time. |
| Doctor Panel           | See current patient information, preview the next patient, and review the consultation queue.          |
| Public Display         | Large-screen view showing the current token and upcoming patients, updated without page refresh.       |
| AI Copilot             | Analyze queue health, monitor wait times, detect congestion, and provide operational recommendations.  |
| Real-Time Sync         | Socket.IO broadcasts queue changes to all connected clients simultaneously.                            |
| Smart Announcements    | Automated token call announcements triggered when a patient is called to consultation.                 |


Architecture:

<img width="1230" height="622" alt="image" src="https://github.com/user-attachments/assets/64157fff-b378-4dd7-833b-f32a658e4db8" />

Real-Time Workflow
1.Issue Token — Receptionist creates a patient token via the dashboard.
2.Socket Event — The token is emitted to the Socket.IO server.
3.Queue Update — The Queue Engine updates the global queue state.
4.Patient Update — The Patient Dashboard receives the update and recalculates position and wait time.
5.Public Display Update — The public screen refreshes to show the new token and queue.



Tech Stack:

| Technology         | Purpose                                                          |
| ------------------ | ---------------------------------------------------------------- |
| React + TypeScript | Frontend framework and type-safe development                     |
| Vite               | Build tool and development server                                |
| Tailwind CSS       | Utility-first styling and custom design system                   |
| Socket.IO          | Real-time bidirectional communication between clients and server |
| Zustand            | Lightweight client-side state management for queue data          |
| Lucide React       | Consistent iconography across the UI                             |



Local Setup:
git clone https://github.com/alankolett/mediqueue.git
cd mediqueue
npm install
npm run dev
The application runs at http://localhost:5173 by default.


Future Enhancements:
Multi-clinic and multi-wing support
WhatsApp and SMS patient notifications
Digital appointment scheduling integration
Advanced AI queue forecasting
Hospital Information System (HIS) integration


License:
MIT
