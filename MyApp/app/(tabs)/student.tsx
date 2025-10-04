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
        { id: '1', nimi: 'H1 Syksy', tehty: true },
        { id: '2', nimi: 'H1 Kevät', tehty: false },
        { id: '3', nimi: 'H2 Syksy', tehty: false },
        { id: '4', nimi: 'H2 Kevät', tehty: false },
        { id: '5', nimi: 'H3 Syksy', tehty: false },
        { id: '6', nimi: 'H3 Kevät', tehty: false },
        { id: '7', nimi: 'Mini-OSCE', tehty: false },
      ],
    },
    {
      id: '2',
      nimi: 'Kirurgia',
      tehtavat: [
        { id: '1', nimi: 'H3 Aseptiikan ryhmäopetus', tehty: false },
        { id: '2', nimi: 'H3 Puudutus-harjoitus', tehty: false },
        { id: '3', nimi: 'H3 Hampaan poistoharjoitus', tehty: false },
        { id: '4', nimi: 'H3 Ompeluharjoitus', tehty: false },
        { id: '5', nimi: 'H4 Leikkausharjoitus', tehty: false },
      ],
    },
  ])

  const [openKurssiId, setOpenKurssiId] = useState<string | null>(null)

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

  const renderTehtava = (kurssiId: string) => ({ item }: { item: Tehtava }) => {
    const progressWidth = item.tehty ? '80%' : '10%'
    return (
      <TouchableOpacity onPress={() => toggleTehtava(kurssiId, item.id)}>
        <View style={styles.tehtavaCard}>
          <Text style={styles.tehtavaText}>{item.nimi}</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: progressWidth }]} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderKurssi = ({ item }: { item: Kurssi }) => {
    const isOpen = openKurssiId === item.id
    return (
      <View style={styles.kurssiCard}>
        <TouchableOpacity onPress={() => setOpenKurssiId(isOpen ? null : item.id)} style={styles.kurssiHeader}>
          <Text style={styles.kurssiTitle}>{item.nimi}</Text>
          <Text style={styles.arrow}>{isOpen ? '▲' : '▼'}</Text>
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
    backgroundColor: '#f0f0f0',
  },
  kurssiCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  kurssiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kurssiTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  arrow: {
    fontSize: 20,
  },
  tehtavaCard: {
    marginTop: 10,
  },
  tehtavaText: {
    fontSize: 16,
    marginBottom: 5,
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#007bff',
    borderRadius: 3,
  },
})
