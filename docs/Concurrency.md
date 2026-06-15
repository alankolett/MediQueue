# Concurrency & Edge Case Handling

A crucial component in Queue Management Systems is preventing race conditions when handling operations from multiple terminals (e.g. multiple Receptionists, or concurrent Doctors).

## Issue: Duplicate "Call Next" Actions
**Scenario**: Two receptionists click "Call Next" at the exact same millisecond. 
**Bad Behavior**: Both clients read the same database state (Token A is waiting), update the state, and technically both receptionists call "Token A". When Token A walks into the room, it's disorganized.

## Solution: The Promise Mutex on the Backend
Within `server.ts`, all state-altering events are wrapped in a Mutex lock:
```typescript
class Mutex {
  private mutex = Promise.resolve();
  lock(): Promise<() => void> {
    let begin: (unlock: () => void) => void = (unlock) => {};
    this.mutex = this.mutex.then(() => new Promise(begin)).catch(() => {});
    return new Promise((res) => { begin = res; });
  }
}
```

When Client 1 calls `call_next`, it acquires the log. If Client 2 calls `call_next` one millisecond later, it is queued. 
When Client 1 finishes:
- Token A is marked `in_session`.
- The lock is released.
Now Client 2's execution begins:
- It pulls the new array. Token A is gone.
- It selects Token B and marks it `in_session`.

**Result**: Atomicity and no duplicate calls.

## Edge Case: Missing Network & Resilience
If a patient token connects directly to `/patient/:token` but the connection drops and reconnects, they are automatically sent down the `initial_state` payload on reconnection. This ensures they don't miss any state changes that happened while they were offline.
