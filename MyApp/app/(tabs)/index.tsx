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
        { id: '3', nimi: 'Tehtävä 3', tehty: false },
      ],
    },
    {
      id: '2',
      nimi: 'Kirurgia',
      tehtavat: [
        { id: '1', nimi: 'Tehtävä 1', tehty: false },
        { id: '2', nimi: 'Tehtävä 2', tehty: false },
        { id: '3', nimi: 'Tehtävä 3', tehty: true },
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

  const renderTehtava = (kurssiId: string) => ({ item }: { item: Tehtava }) => (
    <TouchableOpacity
      style={[
        styles.tehtavaCard,
        { backgroundColor: item.tehty ? '#2e7d32' : '#b71c1c' }, // green if done, red if not
      ]}
      onPress={() => toggleTehtava(kurssiId, item.id)}
    >
      <Text style={styles.tehtavaText}>
        {item.nimi}: {item.tehty ? 'Tehty ✅' : 'Tee ❌'}
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
                placeholderTextColor="#aaa"
                value={tehtavaNimi}
                onChangeText={setTehtavaNimi}
              />
              <Button title="Lisää tehtävä" onPress={lisaaTehtava} />
            </View>
          </>
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Digital Reports</Text>

      {/* Add kurssi form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Kurssin nimi"
          placeholderTextColor="#aaa"
          value={kurssiNimi}
          onChangeText={setKurssiNimi}
        />
        <Button title="Lisää kurssi" onPress={lisaaKurssi} />
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
    backgroundColor: '#1e1e1e',
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  kurssiCard: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  kurssiTitle: {
    color: 'white',
    fontSize: 24,
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
