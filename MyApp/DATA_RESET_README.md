# App Data Reset System

This system automatically resets the app data to defaults every time the application is freshly launched (not on page navigation).

## How it Works

### Automatic Reset on App Start
1. **App Lifecycle Management**: The app tracks sessions using a unique session ID stored in AsyncStorage
2. **Fresh App Detection**: When no session ID exists, it means the app was freshly started
3. **Data Reset**: On fresh app start, all task and submission data is cleared and reset to defaults
4. **Session Tracking**: A new session ID is created and stored

### Session Management
- **Session Creation**: When app starts, a new session ID is generated
- **Session Clearing**: When app goes to background/inactive, session ID is removed
- **Next App Start**: Since session ID is gone, it triggers a data reset

## Key Functions

### Automatic Functions (Used by App Lifecycle)
- `initializeTasks()`: Checks for new session and resets data if needed
- `isNewAppSession()`: Checks if this is a fresh app start
- `markCurrentSession()`: Creates a new session ID
- `clearCurrentSession()`: Removes session ID when app goes to background

### Manual Functions (For Development)
- `manualResetForDevelopment()`: Manually trigger reset for next app start
- `clearAllDataNow()`: Immediately clear all data (including session)
- `resetAppData()`: Reset tasks and submissions to defaults

## Usage

### Automatic Usage (Recommended)
The app automatically handles data reset via the `useAppLifecycle` hook in `_layout.tsx`. No additional code needed in individual screens.

### Manual Reset (For Testing)
```typescript
import { clearAllDataNow } from '../utils/taskManager';

// To immediately clear all data
await clearAllDataNow();

// To reset data on next app start
await manualResetForDevelopment();
```

## Important Notes

1. **Page Navigation**: Data does NOT reset when navigating between pages - only on fresh app starts
2. **App Background**: When app goes to background and comes back, data is preserved within the same session
3. **Fresh App Start**: Only when the app is completely closed and reopened does the data reset
4. **Development**: Use manual reset functions for testing different data states

## Files Involved

- `utils/taskManager.ts`: Core data management and reset functions
- `utils/appLifecycle.ts`: App lifecycle hook for automatic management
- `app/_layout.tsx`: Root layout that initializes the lifecycle management
- `app/h1-tasks.tsx`: Updated to use getTasks() without reinitializing

## Troubleshooting

If data is resetting on page navigation:
1. Make sure individual screens are using `getTasks()` and not `initializeTasks()`
2. Verify that `initializeTasks()` is only called from the app lifecycle hook
3. Check that the session management is working properly by looking at console logs

If data is not resetting on app start:
1. Make sure the app is completely closed (not just backgrounded)
2. Check console logs to see if session detection is working
3. Use `clearAllDataNow()` to force a reset for testing
