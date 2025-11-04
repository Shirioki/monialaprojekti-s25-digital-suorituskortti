import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="h1-tasks" options={{ title: 'H1 Tasks' }} />
        <Stack.Screen name="teacher-tasks" options={{ title: 'Teacher Tasks' }} />
        <Stack.Screen name="teacher-task-review" options={{ title: 'Task Review' }} />
        <Stack.Screen name="task-detail" options={{ title: 'Task Detail' }} />
        <Stack.Screen name="[opiskelijaId]" options={{ title: 'Student Profile' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
