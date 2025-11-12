import { Stack } from 'expo-router'
import { useAppLifecycle } from '../utils/appLifecycle'

export default function RootLayout() {
  // Initialize app data and handle lifecycle
  useAppLifecycle()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="role-selection" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="[opiskelijaId]" />
      <Stack.Screen name="h1-tasks" />
      <Stack.Screen name="task-detail" />
      <Stack.Screen name="teacher-tasks" />
      <Stack.Screen name="teacher-task-review" />
      <Stack.Screen name="modal" />
    </Stack>
  )
}
