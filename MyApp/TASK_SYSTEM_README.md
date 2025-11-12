# Local Task Management System with Conversation History

This system provides a complete task management workflow for students and teachers with a conversation-like dialog system using local storage to simulate a database.

## Features

### For Students
- **View Tasks**: See all available tasks with their current status
- **Submit Tasks**: Complete tasks with completion date and self-assessment
- **Track Progress**: See task status (Not Started, Submitted, Approved, Needs Corrections)
- **Handle Corrections**: When a task is returned for corrections, students can:
  - View the conversation history between them and the teacher
  - Add new comments to address teacher feedback
  - Resubmit the task with corrections
- **Conversation View**: See a complete dialog history with timestamps

### For Teachers  
- **Review Submissions**: View all tasks submitted by students
- **Conversation History**: See complete dialog between teacher and student
- **Provide Feedback**: Give detailed feedback to students
- **Approve/Decline**: Approve tasks or request corrections
- **Real-time Updates**: All changes are reflected immediately across the app

## New Conversation System

### Student Experience
1. **First Submission**: Student submits task with self-assessment
2. **Teacher Feedback**: If teacher requests corrections, student sees:
   - **Conversation History**: Complete timeline of all interactions
   - **Teacher's Feedback**: What needs to be corrected
   - **New Comment Section**: Additional text box for addressing corrections
3. **Resubmission**: Student can add new comments and resubmit

### Teacher Experience
1. **Review Interface**: Teachers see:
   - **Conversation History**: Timeline of all student-teacher interactions
   - **Latest Submission**: Most recent student submission
   - **Feedback Section**: Area to provide new feedback
2. **Dialog Flow**: Each interaction is recorded with timestamps and sender identification

## Task Status Flow

1. **not_started** - Student hasn't started the task
2. **submitted** - Student has submitted the task for review
3. **approved** - Teacher has approved the task
4. **needs_corrections** - Teacher has requested corrections (triggers conversation view)

## Conversation Message Types

- **submission**: Initial task submission
- **feedback**: Teacher response/feedback
- **resubmission**: Student response to corrections with new comments

## File Structure

### Core Files
- `utils/taskManager.ts` - Core task management logic, conversation handling, and local storage
- `app/h1-tasks.tsx` - Student task list view
- `app/task-detail.tsx` - Student task detail with conversation history and submission
- `app/teacher-tasks.tsx` - Teacher task review list
- `app/teacher-task-review.tsx` - Teacher review interface with conversation history

### Key Functions

#### taskManager.ts
- `initializeTasks()` - Initialize default tasks with conversation history
- `getTasks()` - Get all tasks
- `submitTask()` - Submit a task for review (adds conversation message)
- `reviewTask()` - Teacher review and feedback (adds conversation message)
- `addConversationMessage()` - Add new message to conversation
- `getTaskConversation()` - Get conversation history for a task

## Data Storage

The system uses AsyncStorage to persist data locally:
- **Tasks**: Stored with completion status, dates, feedback, and conversation history
- **Submissions**: Tracks which students submitted which tasks
- **Conversation Messages**: Complete dialog history with timestamps and sender info

## Usage Flow

### Student Workflow - Corrections Handling
1. Student receives task feedback requiring corrections
2. Opens task detail to see:
   - Original submission in conversation history
   - Teacher's feedback with specific correction requests
   - New comment section to address feedback
3. Student adds response/corrections in new comment field
4. Resubmits task (creates new conversation message)

### Teacher Workflow - Conversation Review
1. Teacher opens submitted task for review
2. Sees complete conversation history if task was previously reviewed
3. Reviews latest student submission/corrections
4. Provides feedback and decides approval/further corrections
5. Decision creates new conversation message

## UI Components

### Conversation Display
- **Message Bubbles**: Different colors for student (blue) vs teacher (purple)
- **Timestamps**: When each message was sent
- **Message Types**: Visual indicators for submissions, feedback, resubmissions
- **Expandable**: Conversation can be collapsed/expanded
- **Chronological Order**: Messages display in time order

### New Comment Section (Students)
- Appears when task status is "needs_corrections"
- Separate input field for addressing teacher feedback
- Preserves original self-assessment while allowing new responses

## Local Storage Keys
- `tasks` - All task definitions, student progress, and conversation history
- `task_submissions` - Submission records for teacher review

The system automatically initializes with sample conversation data to demonstrate the dialog functionality.
