import { useLocalSearchParams, useRouter } from 'expo-router'
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useState } from 'react'

export default function KurssiSivu() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  const [kurssi, setKurssi] = useState({
    id,
    nimi: `Kariologia ${id}`,
    kuvaus:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis venenatis porta aliquet. Morbi egestas in lectus eget varius.',
    tehtavat: [
      { id: '1', nimi: 'Tehtävä 1', tehty: true },
      { id: '2', nimi: 'Tehtävä 2', tehty: false },
      { id: '3', nimi: 'Tehtävä 3', tehty: false },
    ],
  })

  const toggleTehty = (tehtavaId: string) => {
    setKurssi(prev => ({
      ...prev,
      tehtavat: prev.tehtavat.map(t =>
        t.id === tehtavaId ? { ...t, tehty: !t.tehty } : t
      ),
    }))
  }

  return (
    <View style={styles.container}>
      {/* Takaisin-nuoli ja otsikko */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{kurssi.nimi}</Text>
      </View>

      {/* Kuvaus */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kurssin kuvaus</Text>
        <Text style={styles.description}>{kurssi.kuvaus}</Text>
      </View>

      {/* Tehtävät */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tehtävät</Text>
        <FlatList
          data={kurssi.tehtavat}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskRow}>
              <Text style={styles.taskName}>{item.nimi}</Text>
              <TouchableOpacity
                style={[styles.taskButton, item.tehty && styles.taskButtonDone]}
                onPress={() => toggleTehty(item.id)}
              >
                <Text style={item.tehty ? styles.taskButtonTextDone : styles.taskButtonText}>
                  {item.tehty ? 'Tehty' : 'Tee'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backArrow: { fontSize: 24, marginRight: 12 },
  headerTitle: { fontSize: 22, fontWeight: '600' },
  section: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  description: { color: '#333' },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  taskName: { fontSize: 16 },
  taskButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  taskButtonDone: { backgroundColor: '#4CAF50' },
  taskButtonText: { color: '#333', fontWeight: '500' },
  taskButtonTextDone: { color: 'white', fontWeight: '600' },
})
