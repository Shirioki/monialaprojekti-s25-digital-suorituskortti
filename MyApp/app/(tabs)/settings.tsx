import { View, Text, StyleSheet } from 'react-native'

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Asetukset tulossa pian...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e1e1e' },
  text: { color: 'white', fontSize: 20 }
})
