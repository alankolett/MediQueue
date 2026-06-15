# MediQueue

**Real-Time Patient Flow Management**

MediQueue is a professional Healthcare SaaS application designed to manage clinical patient flow in real-time. Built for maximum efficiency, it features dual synchronized modules for the Receptionist workflow and Public Facing Waiting Room Displays, built over a robust Express + Socket.IO backend architecture.

## Features
- **Realtime Synchronization**: Instant updates across every screen via WebSockets.
- **Receptionist Dashboard**: Issue tokens, call the next patient based on Triage logic (Emergency, Urgent, Routine), and track clinic pacing.
- **Patient Dashboard & TV Display**: Real-time large-format displays for waiting rooms.
- **AI Copilot**: Live analysis of wait times and emergency allocations, calculating metrics off real queue data.
- **Voice Commands**: Lightweight voice assistant for hands-free token issuing or calling.

## Architecture Highlights
- Mutex-locked concurrency preventing race conditions when handling multiple queue updates.
- Predictable estimated wait metrics dynamically scaling with average session time configuration.
- Graceful empty states and dynamic Dark/Light theme generation.

## Development Docs
See the `/docs` folder for detailed breakdowns of Socket.IO Events and Concurrency Handling intended for hackathon evaluations.
