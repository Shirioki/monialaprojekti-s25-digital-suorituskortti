import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { getInitialRoute } from '../utils/auth'

export default function MainRouter() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuthAndRoute = async () => {
            try {
                // Use the centralized auth service to determine initial route
                const initialRoute = await getInitialRoute()

                // Small delay to show loading state (optional, remove if not needed)
                await new Promise(resolve => setTimeout(resolve, 500))

                router.replace(initialRoute)
            } catch (error) {
                console.error('Error during initial routing:', error)
                // On error, default to login
                router.replace('/(tabs)/login')
            } finally {
                setIsLoading(false)
            }
        }

        checkAuthAndRoute()
    }, [router])

    // Show loading screen while determining where to route
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066cc" />
            </View>
        )
    }

    // This component should never render its content since we're routing away
    return null
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
})
