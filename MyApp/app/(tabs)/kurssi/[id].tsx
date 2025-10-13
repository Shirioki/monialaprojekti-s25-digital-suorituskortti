import { useLocalSearchParams, useRouter } from 'expo-router'
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useState } from 'react'

interface Tehtava {
  id: string
  nimi: string
  tehty: boolean
}

interface Moduuli {
  nimi: string
  tehtavat: Tehtava[]
}

interface Kurssi {
  nimi: string
  moduulit: Moduuli[]
}

export default function KurssiSivu() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  // Käytetään fallback-nimeä, jos id puuttuu
  const opiskelijaId = id ?? 'Tuntematon'

  // Alustetaan opiskelija data
  const [opiskelija, setOpiskelija] = useState({
    nimi: `Oppilas ${opiskelijaId}`,
    kurssit: [
      {
        nimi: 'Kariologia',
        moduulit: [
          {
            nimi: 'H1 Kevät',
            tehtavat: [
              { id: '1', nimi: 'Tehtävä 1', tehty: true },
              { id: '2', nimi: 'Tehtävä 2', tehty: false },
            ],
          },
          {
            nimi: 'H2 Syksy',
            tehtavat: [
              { id: '3', nimi: 'Tehtävä 3', tehty: false },
              { id: '4', nimi: 'Tehtävä 4', tehty: true },
            ],
          },
        ],
      },
      {
        nimi: 'Kirurgia',
        moduulit: [
          {
            nimi: 'H1 Kevät',
            tehtavat: [
              { id: '5', nimi: 'Tehtävä 5', tehty: false },
              { id: '6', nimi: 'Tehtävä 6', tehty: false },
            ],
          },
          {
            nimi: 'H2 Syksy',
            tehtavat: [
              { id: '7', nimi: 'Tehtävä 7', tehty: true },
              { id: '8', nimi: 'Tehtävä 8', tehty: false },
            ],
          },
        ],
      },
    ] as Kurssi[],
  })

  // Avoimet moduulit - useampi voi olla auki samanaikaisesti
  const [openModuulit, setOpenModuulit] = useState<Set<string>>(new Set())

  const toggleModuuli = (moduuliKey: string) => {
    const uusiSet = new Set(openModuulit)
    if (uusiSet.has(moduuliKey)) {
      uusiSet.delete(moduuliKey)
    } else {
      uusiSet.add(moduuliKey)
    }
    setOpenModuulit(uusiSet)
  }

  const toggleTehty = (kurssiNimi: string, moduuliNimi: string, tehtavaId: string) => {
    const updatedKurssit = opiskelija.kurssit.map(kurssi => {
      if (kurssi.nimi !== kurssiNimi) return kurssi
      return {
        ...kurssi,
        moduulit: kurssi.moduulit.map(moduuli => {
          if (moduuli.nimi !== moduuliNimi) return moduuli
          return {
            ...moduuli,
            tehtavat: moduuli.tehtavat.map(t =>
              t.id === tehtavaId ? { ...t, tehty: !t.tehty } : t
            ),
          }
        }),
      }
    })
    setOpiskelija({ ...opiskelija, kurssit: updatedKurssit })
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{opiskelija.nimi}</Text>
      </View>

      {/* Kurssit */}
      {opiskelija.kurssit.map(kurssi => (
        <View key={kurssi.nimi} style={styles.section}>
          <Text style={styles.sectionTitle}>{kurssi.nimi}</Text>
          {kurssi.moduulit.map(moduuli => {
            const moduuliKey = kurssi.nimi + '-' + moduuli.nimi
            const isOpen = openModuulit.has(moduuliKey)

            // Lasketaan edistymä
            const total = moduuli.tehtavat.length
            const done = moduuli.tehtavat.filter(t => t.tehty).length
            const progress = total > 0 ? done / total : 0

            return (
              <View key={moduuliKey} style={styles.moduuliContainer}>
                <TouchableOpacity
                  onPress={() => toggleModuuli(moduuliKey)}
                  style={styles.moduuliHeader}
                >
                  <Text style={styles.moduuliText}>{moduuli.nimi}</Text>
                  <Text>{isOpen ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {/* Edistymispalkki */}
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                </View>

                {isOpen && (
                  <FlatList
                    data={moduuli.tehtavat}
                    keyExtractor={t => t.id}
                    renderItem={({ item }) => (
                      <View style={styles.taskRow}>
                        <Text style={styles.taskName}>{item.nimi}</Text>
                        <TouchableOpacity
                          style={[
                            styles.taskButton,
                            item.tehty && styles.taskButtonDone,
                          ]}
                          onPress={() =>
                            toggleTehty(kurssi.nimi, moduuli.nimi, item.id)
                          }
                        >
                          <Text
                            style={
                              item.tehty
                                ? styles.taskButtonTextDone
                                : styles.taskButtonText
                            }
                          >
                            {item.tehty ? 'Tehty' : 'Tee'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                )}
              </View>
            )
          })}
        </View>
      ))}
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
  moduuliContainer: { marginBottom: 10 },
  moduuliHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 6,
  },
  moduuliText: { fontSize: 16, fontWeight: '500' },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 3,
    marginVertical: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2196F3', // sininen
  },
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
    marginTop: 5,
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
