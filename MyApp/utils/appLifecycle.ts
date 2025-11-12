import { useEffect } from 'react';
import { initializeTasks } from './taskManager';

// Hook to manage app lifecycle and data reset
export const useAppLifecycle = () => {
    useEffect(() => {
        // Initialize tasks when the app starts - this will reset data to defaults
        initializeTasks();
    }, []); // Empty dependency array means this only runs once when the component mounts
};

// Alternative: Simple initialization function if you prefer not to use the hook
export const initializeAppData = () => {
    return initializeTasks();
};
