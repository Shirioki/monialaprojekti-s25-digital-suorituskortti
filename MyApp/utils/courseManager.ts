import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Course {
  id: string;
  name: string;
  subject: string; // 'Kariologia', 'Kirurgia', 'Endodontia'
  visibility: 'student' | 'teacher' | 'both'; // Where it shows up
  yearGroup?: string; // For teacher view: '2023', '2024', '2025'
  studentCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  createdBy: string;
}

const COURSES_STORAGE_KEY = '@courses_list';

// Get all courses
export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const coursesJson = await AsyncStorage.getItem(COURSES_STORAGE_KEY);
    if (coursesJson) {
      return JSON.parse(coursesJson);
    }
    // Return default courses if none exist
    return getDefaultCourses();
  } catch (error) {
    console.error('Error loading courses:', error);
    return getDefaultCourses();
  }
};

// Get courses for student view (filtered by subject)
export const getStudentCourses = async (): Promise<Course[]> => {
  try {
    const allCourses = await getAllCourses();
    return allCourses.filter(
      course => 
        (course.visibility === 'student' || course.visibility === 'both') && 
        course.status === 'active'
    );
  } catch (error) {
    console.error('Error loading student courses:', error);
    return [];
  }
};

// Get courses for teacher view (filtered by year group)
export const getTeacherCourses = async (): Promise<Course[]> => {
  try {
    const allCourses = await getAllCourses();
    return allCourses.filter(
      course => 
        (course.visibility === 'teacher' || course.visibility === 'both') && 
        course.status === 'active'
    );
  } catch (error) {
    console.error('Error loading teacher courses:', error);
    return [];
  }
};

// Get courses by subject
export const getCoursesBySubject = async (subject: string): Promise<Course[]> => {
  try {
    const allCourses = await getAllCourses();
    return allCourses.filter(course => course.subject === subject);
  } catch (error) {
    console.error('Error loading courses by subject:', error);
    return [];
  }
};

// Add new course
export const addCourse = async (course: Omit<Course, 'id' | 'createdAt'>): Promise<Course> => {
  try {
    const allCourses = await getAllCourses();
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedCourses = [...allCourses, newCourse];
    await AsyncStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updatedCourses));
    return newCourse;
  } catch (error) {
    console.error('Error adding course:', error);
    throw error;
  }
};

// Update course
export const updateCourse = async (courseId: string, updates: Partial<Course>): Promise<void> => {
  try {
    const allCourses = await getAllCourses();
    const updatedCourses = allCourses.map(course =>
      course.id === courseId ? { ...course, ...updates } : course
    );
    await AsyncStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updatedCourses));
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

// Delete course
export const deleteCourse = async (courseId: string): Promise<void> => {
  try {
    const allCourses = await getAllCourses();
    const filteredCourses = allCourses.filter(course => course.id !== courseId);
    await AsyncStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(filteredCourses));
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Get default courses (initial data)
const getDefaultCourses = (): Course[] => {
  return [
    // Kariologia courses (Student view)
    {
      id: '1',
      name: 'H1 Syksy',
      subject: 'Kariologia',
      visibility: 'student',
      studentCount: 28,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
    },
    {
      id: '2',
      name: 'H1 Kevät',
      subject: 'Kariologia',
      visibility: 'student',
      studentCount: 26,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
    },
    {
      id: '3',
      name: 'H2 Syksy',
      subject: 'Kariologia',
      visibility: 'student',
      studentCount: 30,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
    },
    {
      id: '4',
      name: 'H2 Kevät',
      subject: 'Kariologia',
      visibility: 'student',
      studentCount: 29,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
    },
    {
      id: '5',
      name: 'H3 Syksy',
      subject: 'Kariologia',
      visibility: 'student',
      studentCount: 25,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
    },
    {
      id: '6',
      name: 'H3 Kevät',
      subject: 'Kariologia',
      visibility: 'student',
      studentCount: 27,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
    },
    {
      id: '7',
      name: 'Mini-OSCE',
      subject: 'Kariologia',
      visibility: 'student',
      studentCount: 24,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
    },
    // Teacher view courses (Year groups)
    {
      id: '8',
      name: 'Vuosikurssi 2023',
      subject: 'General',
      visibility: 'teacher',
      yearGroup: '2023',
      studentCount: 2,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
    },
    {
      id: '9',
      name: 'Vuosikurssi 2024',
      subject: 'General',
      visibility: 'teacher',
      yearGroup: '2024',
      studentCount: 2,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
    },
    {
      id: '10',
      name: 'Vuosikurssi 2025',
      subject: 'General',
      visibility: 'teacher',
      yearGroup: '2025',
      studentCount: 2,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'system',
    },
  ];
};

// Get subjects with course counts
export const getSubjectsWithCounts = async (): Promise<{ name: string; count: number; icon: string; color: string }[]> => {
  try {
    const allCourses = await getAllCourses();
    
    const subjects = [
      { name: 'Kariologia', icon: 'medical', color: '#4CAF50' },
      { name: 'Kirurgia', icon: 'cut', color: '#2196F3' },
      { name: 'Endodontia', icon: 'fitness', color: '#9C27B0' },
    ];

    return subjects.map(subject => ({
      ...subject,
      count: allCourses.filter(course => course.subject === subject.name).length,
    }));
  } catch (error) {
    console.error('Error getting subjects with counts:', error);
    return [];
  }
};
