import { View, Text, StyleSheet, FlatList, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'

interface Kurssi {
  id: string
  nimi: string
}

const OpettajaNakyma = () => {
  const router = useRouter()
  const [kurssit, setKurssit] = useState<Kurssi[]>([
    { id: '1', nimi: 'Kariologia' },
    { id: '2', nimi: 'Kirurgia' },
  ])

  const [kurssiNimi, setKurssiNimi] = useState('')

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
  }

  // Renderöi yksittäinen kurssi
  const renderKurssi = ({ item }: { item: Kurssi }) => (
    <View style={styles.kurssiCard}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/kurssi/[id]',
            params: { id: item.id },
          })
        }
        style={styles.kurssiHeader}
      >
        <Text style={styles.kurssiTitle}>{item.nimi}</Text>
        <TouchableOpacity onPress={() => poistaKurssi(item.id)} style={styles.deleteButtonSmall}>
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Opettajan hallintanäkymä</Text>

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
})
