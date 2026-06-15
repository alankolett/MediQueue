# Socket.IO Event lifecycle

## Connection Phase
When a client connects, it receives an immediate initialization payload:
```mermaid
sequenceDiagram
    participant Client
    participant Server
    Client->>Server: connect
    Server-->>Client: emit('queue_update', { patients, averageConsultationTime })
```

## Adding a Patient
1. Client submits a new patient.
2. Server acquires `queueMutex` lock.
3. Server generates token and adds to list.
4. Server broadcasts `queue_update` to all connected clients.
5. Mutex releases.

## Calling Next Patient
```mermaid
sequenceDiagram
    participant Receptionist
    participant Server
    participant Display (Public)
    
    Receptionist->>Server: emit('call_next')
    Note over Server: Acquire Mutex
    Server->>Server: Calculate next highest priority
    Server->>Server: Mark as 'in_session'
    Server-->>Display (Public): emit('queue_update', { patients })
    Server-->>Receptionist: ack({ success: true })
    Note over Server: Release Mutex
```

## Modifying Wait-Time Target
If a doctor notices that average wait times are drifting, the receptionist can modify the `averageConsultationTime`.
- Client emits `update_settings(time)`.
- Server updates global value and immediately broadcasts `queue_update`.
- Clients instantly recalculate their Estimated Wait Time and repaint the UI.
