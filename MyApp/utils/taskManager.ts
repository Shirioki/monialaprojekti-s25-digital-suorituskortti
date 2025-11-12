import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ConversationMessage {
    id: string;
    sender: 'student' | 'teacher';
    message: string;
    timestamp: string;
    type: 'submission' | 'feedback' | 'resubmission';
}

export interface Task {
    id: string;
    nimi: string;
    status: 'not_started' | 'submitted' | 'approved' | 'needs_corrections';
    suoritettuPvm?: string;
    itsearviointi?: string;
    opettajanPalaute?: string;
    palautePvm?: string;
    hyvaksyja?: string; // Name of the teacher who approved the task
    opiskelija?: string; // For teacher view
    conversation?: ConversationMessage[]; // New conversation history
}

export interface TaskSubmission {
    taskId: string;
    studentId: string;
    studentName: string;
    completionDate: string;
    selfAssessment: string;
    submissionDate: string;
    status: 'submitted' | 'approved' | 'needs_corrections';
    teacherFeedback?: string;
    teacherFeedbackDate?: string;
}

const TASKS_KEY = 'tasks';
const SUBMISSIONS_KEY = 'task_submissions';

// Simple flag to track if app data has been initialized in this app session
let dataInitializedThisSession = false;

// Default tasks
const defaultTasks: Task[] = [
    {
        id: '1',
        nimi: 'Hampaiden tunnistus',
        status: 'not_started',
    },
    {
        id: '2',
        nimi: 'Käsi-instrumentteihin tutustuminen',
        status: 'not_started',

    },
    {
        id: '3',
        nimi: 'Suun tarkastus',
        status: 'not_started',

    },
    { id: '4', nimi: 'Röntgenkuvien tulkinta', status: 'not_started' },
    { id: '5', nimi: 'Anestesia', status: 'not_started' },
];

// Task Management Functions
export const initializeTasks = async (): Promise<void> => {
    console.log('initializeTasks called, dataInitializedThisSession:', dataInitializedThisSession);

    try {
        // Only initialize once per app session
        if (!dataInitializedThisSession) {
            console.log('Clearing all data and resetting to defaults...');
            // Always clear and reset data on fresh app start
            await AsyncStorage.multiRemove([TASKS_KEY, SUBMISSIONS_KEY]);
            await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(defaultTasks));
            await AsyncStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([]));

            dataInitializedThisSession = true;
            console.log('✅ Fresh app start - data reset to defaults');
        } else {
            console.log('⏭️  Data already initialized this session, skipping reset');
        }
    } catch (error) {
        console.error('❌ Error initializing tasks:', error);
        // Fallback: ensure we have data even if reset fails
        try {
            await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(defaultTasks));
            await AsyncStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([]));
            console.log('🔄 Fallback initialization completed');
        } catch (fallbackError) {
            console.error('❌ Fallback initialization also failed:', fallbackError);
        }
    }
};

// Manual function to clear all data and reset to defaults
export const clearAllDataAndReset = async (): Promise<void> => {
    console.log('🔄 Manual reset requested...');
    try {
        await AsyncStorage.multiRemove([TASKS_KEY, SUBMISSIONS_KEY]);
        await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(defaultTasks));
        await AsyncStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([]));
        dataInitializedThisSession = false; // Allow re-initialization
        console.log('✅ All data cleared and reset to defaults');
    } catch (error) {
        console.error('❌ Error clearing and resetting data:', error);
    }
};

export const getTasks = async (): Promise<Task[]> => {
    try {
        const tasks = await AsyncStorage.getItem(TASKS_KEY);
        return tasks ? JSON.parse(tasks) : defaultTasks;
    } catch (error) {
        console.error('Error getting tasks:', error);
        return defaultTasks;
    }
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<void> => {
    try {
        const tasks = await getTasks();
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
        );
        await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
        console.error('Error updating task:', error);
    }
};

export const submitTask = async (
    taskId: string,
    completionDate: string,
    selfAssessment: string,
    studentId: string = '1',
    studentName: string = 'Test Student'
): Promise<void> => {
    try {
        const currentTask = await getTaskById(taskId);
        const isResubmission = currentTask?.status === 'needs_corrections';

        // Update task status
        await updateTask(taskId, {
            status: 'submitted',
            suoritettuPvm: completionDate,
            itsearviointi: selfAssessment
        });

        // Add conversation message
        await addConversationMessage(
            taskId,
            'student',
            selfAssessment,
            isResubmission ? 'resubmission' : 'submission'
        );

        // Create submission record for teacher review
        const submissions = await getTaskSubmissions();
        const newSubmission: TaskSubmission = {
            taskId,
            studentId,
            studentName,
            completionDate,
            selfAssessment,
            submissionDate: new Date().toLocaleDateString('fi-FI'),
            status: 'submitted'
        };

        submissions.push(newSubmission);
        await AsyncStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
    } catch (error) {
        console.error('Error submitting task:', error);
    }
};

// Teacher Functions
export const getTaskSubmissions = async (): Promise<TaskSubmission[]> => {
    try {
        const submissions = await AsyncStorage.getItem(SUBMISSIONS_KEY);
        return submissions ? JSON.parse(submissions) : [];
    } catch (error) {
        console.error('Error getting submissions:', error);
        return [];
    }
};

export const reviewTask = async (
    taskId: string,
    studentId: string,
    decision: 'approved' | 'needs_corrections',
    teacherFeedback: string,
    teacherName?: string
): Promise<void> => {
    try {
        const now = new Date();
        const feedbackDate = `${now.toLocaleDateString('fi-FI')} ${now.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })}`;

        // Update task
        const updateData: any = {
            status: decision,
            opettajanPalaute: teacherFeedback,
            palautePvm: feedbackDate
        };

        // If approving and teacher name is provided, store the approver
        if (decision === 'approved' && teacherName) {
            updateData.hyvaksyja = teacherName;
        }

        await updateTask(taskId, updateData);

        // Add teacher conversation message
        await addConversationMessage(
            taskId,
            'teacher',
            teacherFeedback,
            'feedback'
        );

        // Update submission
        const submissions = await getTaskSubmissions();
        const updatedSubmissions = submissions.map(submission => {
            if (submission.taskId === taskId && submission.studentId === studentId) {
                return {
                    ...submission,
                    status: decision,
                    teacherFeedback,
                    teacherFeedbackDate: feedbackDate
                };
            }
            return submission;
        });

        await AsyncStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updatedSubmissions));
    } catch (error) {
        console.error('Error reviewing task:', error);
    }
};

export const getPendingSubmissions = async (): Promise<TaskSubmission[]> => {
    try {
        const submissions = await getTaskSubmissions();
        return submissions.filter(submission => submission.status === 'submitted');
    } catch (error) {
        console.error('Error getting pending submissions:', error);
        return [];
    }
};

export const getTaskById = async (taskId: string): Promise<Task | undefined> => {
    try {
        const tasks = await getTasks();
        return tasks.find(task => task.id === taskId);
    } catch (error) {
        console.error('Error getting task by ID:', error);
        return undefined;
    }
};

// Conversation Management Functions
export const addConversationMessage = async (
    taskId: string,
    sender: 'student' | 'teacher',
    message: string,
    type: 'submission' | 'feedback' | 'resubmission'
): Promise<void> => {
    try {
        const tasks = await getTasks();
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                const conversation = task.conversation || [];
                const newMessage: ConversationMessage = {
                    id: `${taskId}-${Date.now()}`,
                    sender,
                    message,
                    timestamp: new Date().toLocaleString('fi-FI'),
                    type
                };
                return {
                    ...task,
                    conversation: [...conversation, newMessage]
                };
            }
            return task;
        });

        await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
        console.error('Error adding conversation message:', error);
    }
};

export const getTaskConversation = async (taskId: string): Promise<ConversationMessage[]> => {
    try {
        const task = await getTaskById(taskId);
        return task?.conversation || [];
    } catch (error) {
        console.error('Error getting task conversation:', error);
        return [];
    }
};

// Progress calculation functions
export const calculateTaskProgress = (status: string): number => {
    switch (status) {
        case 'not_started':
            return 0;
        case 'submitted':
            return 50;
        case 'approved':
            return 100;
        case 'needs_corrections':
            return 25;
        default:
            return 0;
    }
};

export const calculateCourseProgress = async (courseId: string = 'h1'): Promise<number> => {
    try {
        const tasks = await getTasks();
        if (tasks.length === 0) return 0;

        const totalProgress = tasks.reduce((sum, task) => sum + calculateTaskProgress(task.status), 0);
        return Math.round(totalProgress / tasks.length);
    } catch (error) {
        console.error('Error calculating course progress:', error);
        return 0;
    }
};

export interface CourseProgress {
    courseId: string;
    courseName: string;
    progress: number;
    taskCount: number;
    completedTasks: number;
}

export const getAllCoursesProgress = async (): Promise<CourseProgress[]> => {
    try {
        const tasks = await getTasks();

        // Only calculate progress for Kariologia courses
        const h1Progress = await calculateCourseProgress();
        const completedTasks = tasks.filter(task => task.status === 'approved').length;

        return [
            {
                courseId: 'h1-kariologia',
                courseName: 'H1 Syksy',
                progress: h1Progress,
                taskCount: tasks.length,
                completedTasks: completedTasks
            },
            {
                courseId: 'h1-kevat-kariologia',
                courseName: 'H1 Kevät',
                progress: 0, // No tasks yet
                taskCount: 0,
                completedTasks: 0
            }
            // Kirurgia and Endodontia courses removed - no tasks available
        ];
    } catch (error) {
        console.error('Error getting all courses progress:', error);
        return [];
    }
};
