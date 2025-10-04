import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

interface Tehtava {
  id: string
  nimi: string
  tehty: boolean
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
      nimi: 'Kariologia',
      tehtavat: [
        { id: '1', nimi: 'H1 Syksy', tehty: false },
        { id: '2', nimi: 'H1 Kevät', tehty: true },
        { id: '3', nimi: 'H2 Syksy', tehty: false },
      ],
    },
    {
      id: '2',
      nimi: 'Kirurgia',
      tehtavat: [
        { id: '1', nimi: 'H3 Aseptiikan ryhmäopetus', tehty: false },
        { id: '2', nimi: 'H3 Puudutus-harjoitus', tehty: false },
        { id: '3', nimi: 'H3 Hampaan poistoharjoitus', tehty: true },
      ],
    },
  ])

  const [openKurssiId, setOpenKurssiId] = useState<string | null>(null)

  // opiskelija voi halutessa merkitä tehtävän tehdyksi
  const toggleTehtava = (kurssiId: string, tehtavaId: string) => {
    setKurssit(prev =>
      prev.map(kurssi =>
        kurssi.id === kurssiId
          ? {
              ...kurssi,
              tehtavat: kurssi.tehtavat.map(tehtava =>
                tehtava.id === tehtavaId
                  ? { ...tehtava, tehty: !tehtava.tehty }
                  : tehtava
              ),
            }
          : kurssi
      )
    )
  }

  const renderTehtava = (kurssiId: string) => ({ item }: { item: Tehtava }) => (
    <TouchableOpacity
      style={[
        styles.tehtavaCard,
        { backgroundColor: item.tehty ? '#2e7d32' : '#b71c1c' },
      ]}
      onPress={() => toggleTehtava(kurssiId, item.id)}
    >
      <Text style={styles.tehtavaText}>
        {item.nimi}: {item.tehty ? 'Tehty ✅' : 'Ei tehty ❌'}
      </Text>
    </TouchableOpacity>
  )

  const renderKurssi = ({ item }: { item: Kurssi }) => {
    const isOpen = openKurssiId === item.id

    return (
      <View style={styles.kurssiCard}>
        <TouchableOpacity onPress={() => setOpenKurssiId(isOpen ? null : item.id)}>
          <Text style={styles.kurssiTitle}>{item.nimi}</Text>
        </TouchableOpacity>

        {isOpen && (
          <FlatList
            data={item.tehtavat}
            renderItem={renderTehtava(item.id)}
            keyExtractor={t => t.id}
          />
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Opiskelijan suorituskortti</Text>

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
    padding: 20,
    backgroundColor: '#1e1e1e',
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  kurssiCard: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  kurssiTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  tehtavaCard: {
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  tehtavaText: {
    color: 'white',
    fontSize: 18,
  },
})
