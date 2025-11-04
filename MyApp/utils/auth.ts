import AsyncStorage from '@react-native-async-storage/async-storage'

// Constants for storage keys
const AUTH_TOKEN_KEY = '@auth_token'
const USER_ROLE_KEY = '@user_role'
const USER_DATA_KEY = '@user_data'

export type UserRole = 'teacher' | 'student'

export interface UserData {
    id: string
    name: string
    email: string
    role: UserRole
}

export class AuthService {
    /**
     * Check if user is currently authenticated
     */
    static async isAuthenticated(): Promise<boolean> {
        try {
            const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY)
            return token !== null
        } catch (error) {
            console.error('Error checking authentication:', error)
            return false
        }
    }

    /**
     * Get current user's role
     */
    static async getUserRole(): Promise<UserRole | null> {
        try {
            const role = await AsyncStorage.getItem(USER_ROLE_KEY)
            return role as UserRole | null
        } catch (error) {
            console.error('Error getting user role:', error)
            return null
        }
    }

    /**
     * Get current user's data
     */
    static async getUserData(): Promise<UserData | null> {
        try {
            const userData = await AsyncStorage.getItem(USER_DATA_KEY)
            return userData ? JSON.parse(userData) : null
        } catch (error) {
            console.error('Error getting user data:', error)
            return null
        }
    }

    /**
     * Login user and store authentication data
     */
    static async login(token: string, userData: UserData): Promise<void> {
        try {
            await AsyncStorage.setItem(AUTH_TOKEN_KEY, token)
            await AsyncStorage.setItem(USER_ROLE_KEY, userData.role)
            await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
        } catch (error) {
            console.error('Error storing authentication data:', error)
            throw error
        }
    }

    /**
     * Logout user and clear authentication data
     */
    static async logout(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_ROLE_KEY, USER_DATA_KEY])
        } catch (error) {
            console.error('Error clearing authentication data:', error)
            throw error
        }
    }

    /**
     * Get the authentication token
     */
    static async getAuthToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(AUTH_TOKEN_KEY)
        } catch (error) {
            console.error('Error getting auth token:', error)
            return null
        }
    }
}

/**
 * Determine which route to navigate to based on authentication and user role
 */
export const getInitialRoute = async (): Promise<'/(tabs)/login' | '/(tabs)/teacher' | '/(tabs)/student'> => {
    const isAuthenticated = await AuthService.isAuthenticated()

    if (!isAuthenticated) {
        return '/(tabs)/login'
    }

    const userRole = await AuthService.getUserRole()

    switch (userRole) {
        case 'teacher':
            return '/(tabs)/teacher'
        case 'student':
            return '/(tabs)/student'
        default:
            // If role is unknown, logout and go to login
            await AuthService.logout()
            return '/(tabs)/login'
    }
}
