import { View, Text, StyleSheet, FlatList, SafeAreaView, TextInput, Button, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker'

interface Tehtava {
  id: string
  nimi: string
  pisteet: number
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
        { id: '1', nimi: 'Tehtävä 1', pisteet: 5 },
        { id: '2', nimi: 'Tehtävä 2', pisteet: 4 },
        { id: '3', nimi: 'Tehtävä 3', pisteet: 3 },
      ],
    },
    {
      id: '2',
      nimi: 'Kirurgia',
      tehtavat: [
        { id: '1', nimi: 'Tehtävä 1', pisteet: 4 },
        { id: '2', nimi: 'Tehtävä 2', pisteet: 5 },
        { id: '3', nimi: 'Tehtävä 3', pisteet: 2 },
      ],
    },
  ])

  const [valittuKurssi, setValittuKurssi] = useState(kurssit[0].id)
  const [tehtavaNimi, setTehtavaNimi] = useState('')
  const [tehtavaPisteet, setTehtavaPisteet] = useState('')
  const [openKurssiId, setOpenKurssiId] = useState<string | null>(null)

  const lisaaTehtava = () => {
    if (!tehtavaNimi || !tehtavaPisteet) return

    setKurssit(prevKurssit =>
      prevKurssit.map(kurssi => {
        if (kurssi.id === valittuKurssi) {
          const uusiTehtava: Tehtava = {
            id: (kurssi.tehtavat.length + 1).toString(),
            nimi: tehtavaNimi,
            pisteet: parseInt(tehtavaPisteet),
          }
          return { ...kurssi, tehtavat: [...kurssi.tehtavat, uusiTehtava] }
        }
        return kurssi
      })
    )
    setTehtavaNimi('')
    setTehtavaPisteet('')
  }

  const renderTehtava = ({ item }: { item: Tehtava }) => (
    <View style={styles.tehtavaCard}>
      <Text style={styles.tehtavaText}>{item.nimi}: {item.pisteet} pistettä</Text>
    </View>
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
            renderItem={renderTehtava}
            keyExtractor={t => t.id}
          />
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Digital Reports</Text>

      <View style={styles.form}>
        <Picker
          selectedValue={valittuKurssi}
          onValueChange={(itemValue) => setValittuKurssi(itemValue)}
          style={styles.picker}
        >
          {kurssit.map(kurssi => (
            <Picker.Item key={kurssi.id} label={kurssi.nimi} value={kurssi.id} />
          ))}
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Tehtävän nimi"
          placeholderTextColor="#aaa"
          value={tehtavaNimi}
          onChangeText={setTehtavaNimi}
        />
        <TextInput
          style={styles.input}
          placeholder="Pisteet"
          placeholderTextColor="#aaa"
          value={tehtavaPisteet}
          onChangeText={setTehtavaPisteet}
          keyboardType="numeric"
        />
        <Button title="Lisää tehtävä" onPress={lisaaTehtava} />
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
  picker: {
    color: 'white',
    marginBottom: 10,
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
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  tehtavaText: {
    color: 'white',
    fontSize: 18,
  },
})
