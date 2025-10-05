import { View, Text, StyleSheet, FlatList, SafeAreaView, TextInput, Button, TouchableOpacity } from 'react-native'
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

const App = () => {
  const [kurssit, setKurssit] = useState<Kurssi[]>([
    {
      id: '1',
      nimi: 'Kariologia',
      tehtavat: [
        { id: '1', nimi: 'Tehtävä 1', tehty: false },
        { id: '2', nimi: 'Tehtävä 2', tehty: true },
      ],
    },
    {
      id: '2',
      nimi: 'Kirurgia',
      tehtavat: [
        { id: '1', nimi: 'Tehtävä 1', tehty: false },
        { id: '2', nimi: 'Tehtävä 2', tehty: true },
      ],
    },
  ])

  const [openKurssiId, setOpenKurssiId] = useState<string | null>(null)
  const [kurssiNimi, setKurssiNimi] = useState('')
  const [tehtavaNimi, setTehtavaNimi] = useState('')

  // Toggle tehtävä status
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

  // Add new kurssi
  const lisaaKurssi = () => {
    if (!kurssiNimi.trim()) return
    const uusiKurssi: Kurssi = {
      id: (kurssit.length + 1).toString(),
      nimi: kurssiNimi,
      tehtavat: [],
    }
    setKurssit([...kurssit, uusiKurssi])
    setKurssiNimi('')
  }

  // Add new tehtävä to currently open kurssi
  const lisaaTehtava = () => {
    if (!openKurssiId || !tehtavaNimi.trim()) return

    setKurssit(prev =>
      prev.map(kurssi =>
        kurssi.id === openKurssiId
          ? {
              ...kurssi,
              tehtavat: [
                ...kurssi.tehtavat,
                { id: (kurssi.tehtavat.length + 1).toString(), nimi: tehtavaNimi, tehty: false },
              ],
            }
          : kurssi
      )
    )
    setTehtavaNimi('')
  }

  // Delete kurssi
  const poistaKurssi = (kurssiId: string) => {
    setKurssit(prev => prev.filter(kurssi => kurssi.id !== kurssiId))
    if (openKurssiId === kurssiId) setOpenKurssiId(null)
  }

  // Delete tehtävä
  const poistaTehtava = (kurssiId: string, tehtavaId: string) => {
    setKurssit(prev =>
      prev.map(kurssi =>
        kurssi.id === kurssiId
          ? {
              ...kurssi,
              tehtavat: kurssi.tehtavat.filter(tehtava => tehtava.id !== tehtavaId),
            }
          : kurssi
      )
    )
  }

  const renderTehtava = (kurssiId: string) => ({ item }: { item: Tehtava }) => (
    <View style={styles.tehtavaCard}>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => toggleTehtava(kurssiId, item.id)}>
        <Text style={styles.tehtavaText}>
          {item.nimi} — {item.tehty ? 'Tehty ✅' : 'Ei tehty ❌'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => poistaTehtava(kurssiId, item.id)}>
        <Text style={styles.deleteButtonText}>Poista</Text>
      </TouchableOpacity>
    </View>
  )

  const renderKurssi = ({ item }: { item: Kurssi }) => {
    const isOpen = openKurssiId === item.id

    return (
      <View style={styles.kurssiCard}>
        <TouchableOpacity
          onPress={() => setOpenKurssiId(isOpen ? null : item.id)}
          style={styles.kurssiHeader}
        >
          <Text style={styles.kurssiTitle}>{item.nimi}</Text>
          <TouchableOpacity onPress={() => poistaKurssi(item.id)} style={styles.deleteButtonSmall}>
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {isOpen && (
          <>
            <FlatList
              data={item.tehtavat}
              renderItem={renderTehtava(item.id)}
              keyExtractor={t => t.id}
            />

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Uusi tehtävä"
                value={tehtavaNimi}
                onChangeText={setTehtavaNimi}
              />
              <TouchableOpacity style={styles.addButton} onPress={lisaaTehtava}>
                <Text style={styles.addButtonText}>Lisää tehtävä</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Opettajan hallintanäkymä</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Kurssin nimi"
          value={kurssiNimi}
          onChangeText={setKurssiNimi}
        />
        <TouchableOpacity style={styles.addButton} onPress={lisaaKurssi}>
          <Text style={styles.addButtonText}>Lisää kurssi</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={kurssit}
        renderItem={renderKurssi}
        keyExtractor={k => k.id}
      />
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#222',
  },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  kurssiCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  kurssiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 10,
  },
  kurssiTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  tehtavaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tehtavaText: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  deleteButtonSmall: {
    backgroundColor: '#eee',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
})
