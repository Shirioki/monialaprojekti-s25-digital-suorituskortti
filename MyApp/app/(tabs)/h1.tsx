import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

interface KurssiTehtava {
  id: string
  nimi: string
  progress?: number // Progress percentage for visual indicator
}

interface Oppiaine {
  id: string
  nimi: string
  tehtavat: KurssiTehtava[]
  expanded: boolean
}

const CourseSelectionView = () => {
  const router = useRouter()
  const [oppiaineet, setOppiaineet] = useState<Oppiaine[]>([
    {
      id: '1',
      nimi: 'Kariologia',
      expanded: false,
      tehtavat: [
        { id: '1', nimi: 'H1 Syksy', progress: 50 },
        { id: '2', nimi: 'H1 Kevät', progress: 0 },
        { id: '3', nimi: 'H2 Syksy', progress: 0 },
        { id: '4', nimi: 'H2 Kevät', progress: 0 },
        { id: '5', nimi: 'H3 Syksy', progress: 0 },
        { id: '6', nimi: 'H3 Kevät', progress: 0 },
        { id: '7', nimi: 'Mini-OSCE', progress: 0 },
      ]
    },
    {
      id: '2',
      nimi: 'Kirurgia',
      expanded: false,
      tehtavat: [
        { id: '8', nimi: 'H3 Aseptiikan ryhmäopetus', progress: 0 },
        { id: '9', nimi: 'H3 Puudutus-harjoitus', progress: 0 },
        { id: '10', nimi: 'H3 Hampaan poistoharjoitus', progress: 0 },
        { id: '11', nimi: 'H3 Ompelu-harjoitus', progress: 0 },
        { id: '12', nimi: 'H4 Leikkaus-harjoitus', progress: 0 },
      ]
    }
  ])

  const toggleOppiaine = (oppiaineId: string) => {
    setOppiaineet(prev =>
      prev.map(oppiaine =>
        oppiaine.id === oppiaineId
          ? { ...oppiaine, expanded: !oppiaine.expanded }
          : oppiaine
      )
    )
  }

  const handleCoursePress = (tehtava: KurssiTehtava) => {
    // Navigate to specific course page (e.g., H1 tasks)
    if (tehtava.nimi === 'H1 Syksy') {
      router.push({
        pathname: '/h1-tasks' as any // TypeScript workaround for dynamic routes
      })
    }
    // Add more specific routes for other courses as needed
  }

  const renderProgressBar = (progress: number) => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  )

  const renderTehtava = ({ item }: { item: KurssiTehtava }) => (
    <TouchableOpacity
      style={styles.tehtavaItem}
      onPress={() => handleCoursePress(item)}
    >
      <Text style={styles.tehtavaNimi}>{item.nimi}</Text>
      {renderProgressBar(item.progress || 0)}
    </TouchableOpacity>
  )

  const renderOppiaine = ({ item }: { item: Oppiaine }) => (
    <View style={styles.oppiaineCard}>
      <TouchableOpacity
        style={styles.oppiaineHeader}
        onPress={() => toggleOppiaine(item.id)}
      >
        <Text style={styles.oppiaineTitle}>{item.nimi}</Text>
        <Ionicons
          name={item.expanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="#333"
        />
      </TouchableOpacity>

      {item.expanded && (
        <View style={styles.tehtavaList}>
          <FlatList
            data={item.tehtavat}
            renderItem={renderTehtava}
            keyExtractor={t => t.id}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Suoritta harjoituksia!</Text>
      <FlatList
        data={oppiaineet}
        renderItem={renderOppiaine}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

export default CourseSelectionView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  oppiaineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  oppiaineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  oppiaineTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  tehtavaList: {
    paddingBottom: 8,
  },
  tehtavaItem: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tehtavaNimi: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
})
