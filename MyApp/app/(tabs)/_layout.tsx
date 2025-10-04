import { Drawer } from 'expo-router/drawer'
import { TouchableOpacity, Text } from 'react-native'

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: '#1e1e1e' },
        headerTintColor: 'white',
        drawerStyle: { backgroundColor: '#1e1e1e' },
        drawerActiveTintColor: 'white',
        drawerInactiveTintColor: 'gray',
      }}
    >
      <Drawer.Screen
        name="index"
        options={{ title: 'Home' }}
      />
      <Drawer.Screen
        name="explore"
        options={{ title: 'Explore' }}
      />
      <Drawer.Screen
        name="settings"
        options={{ title: 'Settings' }}
      />
            <Drawer.Screen
        name="student"
        options={{ title: 'Student' }}
      />
    </Drawer>
  )
}
