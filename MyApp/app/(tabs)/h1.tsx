import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

interface Tehtava {
  id: string
  nimi: string
  tehty: boolean
  suoritettuPvm?: string
}

interface Kurssi {
  id: string
  nimi: string
  tehtavat: Tehtava[]
}

const StudentView = () => {
  const [kurssit, setKurssit] = useState<Kurssi[]>([
    {
      id: '1',
      nimi: 'H1 Syksy',
      tehtavat: [
        { id: '1', nimi: 'Hampaiden tunnistus', tehty: true, suoritettuPvm: '29.9.2025' },
        { id: '2', nimi: 'Käsi-instrumentteihin tutustuminen', tehty: false },
      ],
    },
  ])

  const toggleTehtava = (kurssiId: string, tehtavaId: string) => {
    setKurssit(prev =>
      prev.map(kurssi =>
        kurssi.id === kurssiId
          ? {
              ...kurssi,
              tehtavat: kurssi.tehtavat.map(t =>
                t.id === tehtavaId
                  ? { ...t, tehty: !t.tehty, suoritettuPvm: !t.tehty ? new Date().toLocaleDateString('fi-FI') : undefined }
                  : t
              ),
            }
          : kurssi
      )
    )
  }

  const renderTehtava = (kurssiId: string) => ({ item }: { item: Tehtava }) => (
    <View style={styles.tehtavaCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.tehtavaNimi}>{item.nimi}</Text>
        {item.tehty && (
          <>
            <Text style={styles.suoritettu}>Suoritettu: {item.suoritettuPvm}</Text>
            <Text style={styles.hyvaksyntatila}>Odottaa hyväksyntää</Text>
          </>
        )}
      </View>

      <TouchableOpacity
        onPress={() => toggleTehtava(kurssiId, item.id)}
        style={[styles.statusButton, item.tehty && styles.statusButtonDone]}
      >
        <Text style={[styles.statusText, item.tehty && styles.statusTextDone]}>
          {item.tehty ? 'Tehty' : 'Tee'}
        </Text>
      </TouchableOpacity>
    </View>
  )

  const renderKurssi = ({ item }: { item: Kurssi }) => (
    <View style={styles.kurssiCard}>
      <Text style={styles.kurssiTitle}>{item.nimi}</Text>
      <FlatList
        data={item.tehtavat}
        renderItem={renderTehtava(item.id)}
        keyExtractor={t => t.id}
      />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={kurssit}
        renderItem={renderKurssi}
        keyExtractor={k => k.id}
      />
    </SafeAreaView>
  )
}

export default StudentView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  kurssiCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  kurssiTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  tehtavaCard: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tehtavaNimi: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  suoritettu: {
    fontSize: 13,
    color: '#555',
  },
  hyvaksyntatila: {
    fontSize: 13,
    color: '#888',
  },
  statusButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  statusButtonDone: {
    backgroundColor: '#333',
  },
  statusText: {
    color: '#333',
    fontWeight: '600',
  },
  statusTextDone: {
    color: '#fff',
  },
})
