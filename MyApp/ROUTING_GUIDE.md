# Main Router Documentation

This app now has a centralized main routing system that handles authentication and user role-based navigation.

## File Structure

### Core Routing Files

1. **`app/index.tsx`** - Main router component
   - Entry point that checks authentication status
   - Routes users to appropriate screens based on their role
   - Shows loading screen while determining route

2. **`app/_layout.tsx`** - Root layout
   - Defines the main navigation stack
   - Includes all app screens (tabs, modals, individual pages)

3. **`utils/auth.ts`** - Authentication service
   - Handles login/logout functionality
   - Manages user data persistence with AsyncStorage
   - Determines initial route based on authentication state

## How It Works

### Initial App Launch
1. User opens app → `index.tsx` is loaded
2. `getInitialRoute()` checks authentication status
3. If authenticated: routes to appropriate dashboard (teacher/student)
4. If not authenticated: routes to login screen

### Login Process
1. User enters credentials in login screen
2. `AuthService.login()` stores auth data
3. User is redirected to role-based dashboard
4. Future app launches will skip login (until logout)

### Logout Process
1. User clicks logout button on any screen
2. `AuthService.logout()` clears stored data
3. User is redirected back to main router (`/`)
4. Main router detects no auth and shows login

## User Roles and Routes

### Teacher
- Login with email containing "teacher" or "opettaja"
- Routes to: `/(tabs)/teacher`
- Features: Student management, course creation, task review

### Student  
- Login with email containing "student" or "opiskelija"
- Routes to: `/(tabs)/student`
- Features: Course progress, task completion

## Key Features

- **Persistent Authentication**: Uses AsyncStorage to remember login state
- **Role-based Navigation**: Different interfaces for teachers vs students  
- **Automatic Routing**: Smart initial routing based on auth status
- **Logout Confirmation**: Prevents accidental logouts
- **Error Handling**: Graceful fallbacks for auth errors

## Testing the Authentication

To test different user roles, use these example credentials:

**Teacher Login:**
- Email: `teacher@example.com` or `opettaja@example.com`
- Password: any password

**Student Login:**
- Email: `student@example.com` or `opiskelija@example.com`  
- Password: any password

## Future Enhancements

The authentication system is designed to be easily extended:

- Replace mock authentication with real API calls
- Add password validation and security
- Implement token refresh functionality
- Add more user roles (admin, etc.)
- Add biometric authentication
- Add "Remember Me" functionality

## File Dependencies

Make sure these packages are installed:
- `@react-native-async-storage/async-storage` - For data persistence
- `expo-router` - For navigation
- `@react-navigation/native` - Navigation foundation
