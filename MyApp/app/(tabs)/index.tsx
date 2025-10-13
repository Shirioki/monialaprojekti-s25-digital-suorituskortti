import { View, Text, StyleSheet, FlatList, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'

interface Kurssi {
  id: string
  nimi: string
}

interface Opiskelija {
  id: string
  nimi: string
  edistys: number
}

const OpettajaNakyma = () => {
  const router = useRouter()
  const [kurssit, setKurssit] = useState<Kurssi[]>([
    { id: '1', nimi: 'Vuosikurssi 2023' },
    { id: '2', nimi: 'Vuosikurssi 2024' },
    { id: '3', nimi: 'Vuosikurssi 2025' },
  ])
  const [kurssiNimi, setKurssiNimi] = useState('')
  const [searchText, setSearchText] = useState('')
  const [avattuKurssi, setAvattuKurssi] = useState<string | null>(null) // Track open course

  // Mock opiskelijadata
  const opiskelijat: Record<string, Opiskelija[]> = {
    '1': [
      { id: '1', nimi: 'Matti Meikäläinen', edistys: 80 },
      { id: '2', nimi: 'Maija Mallikas', edistys: 40 },
    ],
    '2': [
      { id: '3', nimi: 'Teppo Testaaja', edistys: 60 },
      { id: '4', nimi: 'Liisa Luova', edistys: 30 },
    ],
    '3': [
      { id: '5', nimi: 'Jussi Juoksija', edistys: 90 },
    ],
  }

  // Lisää uusi kurssi
  const lisaaKurssi = () => {
    if (!kurssiNimi.trim()) return
    const uusiKurssi: Kurssi = {
      id: (kurssit.length + 1).toString(),
      nimi: kurssiNimi,
    }
    setKurssit([...kurssit, uusiKurssi])
    setKurssiNimi('')
  }

  // Poista kurssi
  const poistaKurssi = (kurssiId: string) => {
    setKurssit(prev => prev.filter(k => k.id !== kurssiId))
    if (avattuKurssi === kurssiId) setAvattuKurssi(null)
  }

  // Renderöi opiskelija korttinäkymällä
  const renderOpiskelija = ({ item }: { item: Opiskelija }) => {
    const progressColor = item.edistys >= 50 ? '#4CAF50' : '#FFC107' // vihreä/keltainen
    return (
      <View style={styles.opiskelijaCard}>
        <Text style={styles.opiskelijaNimi}>{item.nimi}</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${item.edistys}%`, backgroundColor: progressColor }]} />
        </View>
      </View>
    )
  }

  // Renderöi kurssi
  const renderKurssi = ({ item }: { item: Kurssi }) => {
    const filteredOpiskelijat = opiskelijat[item.id]?.filter(o =>
      o.nimi.toLowerCase().includes(searchText.toLowerCase())
    ) || []

    const isOpen = avattuKurssi === item.id

    return (
      <View style={styles.kurssiCard}>
        <TouchableOpacity
          onPress={() => setAvattuKurssi(isOpen ? null : item.id)}
          style={styles.kurssiHeader}
        >
          <Text style={styles.kurssiTitle}>{item.nimi}</Text>
          <TouchableOpacity onPress={() => poistaKurssi(item.id)} style={styles.deleteButtonSmall}>
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {isOpen && (
          <FlatList
            data={filteredOpiskelijat}
            renderItem={renderOpiskelija}
            keyExtractor={o => o.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 10 }}
          />
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Opettajan hallintanäkymä</Text>

      {/* Haku */}
      <TextInput
        style={styles.searchInput}
        placeholder="Etsi opiskelijaa..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Lisää kurssi -lomake */}
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

      {/* Kurssilista */}
      <FlatList
        data={kurssit}
        renderItem={renderKurssi}
        keyExtractor={k => k.id}
      />
    </SafeAreaView>
  )
}

export default OpettajaNakyma

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
    marginBottom: 10,
    color: '#222',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
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
  },
  kurssiTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
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
  opiskelijaCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    marginRight: 10,
    width: 160,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  opiskelijaNimi: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
})
