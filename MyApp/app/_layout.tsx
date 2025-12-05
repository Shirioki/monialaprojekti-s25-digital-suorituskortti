import { Stack } from 'expo-router'
import { useAppLifecycle } from '../utils/appLifecycle'

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Initialize app data and handle lifecycle
  useAppLifecycle()

  const [loaded, error] = useFonts({
    'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
    'OpenSans-SemiBold': require('../assets/fonts/OpenSans-SemiBold.ttf'),
    'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-Light': require('../assets/fonts/OpenSans-Light.ttf')
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

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
