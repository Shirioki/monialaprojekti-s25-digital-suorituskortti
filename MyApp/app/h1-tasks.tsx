import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

interface Tehtava {
  id: string
  nimi: string
  status: 'not_started' | 'submitted' | 'approved'
  suoritettuPvm?: string
  itsearviointi?: string
}

const H1TasksView = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  
  const [tehtavat, setTehtavat] = useState<Tehtava[]>([
    { 
      id: '1', 
      nimi: 'Hampaiden tunnistus', 
      status: 'approved', 
      suoritettuPvm: '29.9.2025', 
      itsearviointi: 'Tehtävä sujui hyvin, opin tunnistamaan eri hampaat.' 
    },
    { id: '2', nimi: 'Käsi-instrumentteihin tutustuminen', status: 'submitted', suoritettuPvm: '28.9.2025' },
    { id: '3', nimi: 'Suun tarkastus', status: 'not_started' },
    { id: '4', nimi: 'Röntgenkuvien tulkinta', status: 'not_started' },
    { id: '5', nimi: 'Anestesia', status: 'not_started' },
  ])

  useEffect(() => {
    if (params.updatedTask) {
      try {
        const updatedTaskData = JSON.parse(params.updatedTask as string)
        setTehtavat(prev =>
          prev.map(task =>
            task.id === updatedTaskData.id
              ? {
                  ...task,
                  status: updatedTaskData.status,
                  suoritettuPvm: updatedTaskData.completionDate,
                  itsearviointi: updatedTaskData.selfAssessment
                }
              : task
          )
        )
        router.setParams({ updatedTask: undefined })
      } catch (error) {
        console.error('Error parsing updated task data:', error)
      }
    }
  }, [params.updatedTask])

  const handleTaskPress = (task: Tehtava) => {
    router.push({
      pathname: '/task-detail',
      params: {
        taskId: task.id,
        name: task.nimi,
        status: task.status,
        completionDate: task.suoritettuPvm || '',
        selfAssessment: task.itsearviointi || ''
      }
    } as any)
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'Aloita'
      case 'submitted':
        return 'Odottaa'
      case 'approved':
        return 'Hyväksytty'
      default:
        return 'Aloita'
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'not_started':
        return styles.statusNotStarted
      case 'submitted':
        return styles.statusSubmitted
      case 'approved':
        return styles.statusApproved
      default:
        return styles.statusNotStarted
    }
  }

  const renderTehtava = ({ item }: { item: Tehtava }) => (
    <TouchableOpacity
      style={styles.tehtavaCard}
      onPress={() => handleTaskPress(item)}
    >
      <View style={styles.tehtavaContent}>
        <Text style={styles.tehtavaNimi}>{item.nimi}</Text>
        {item.suoritettuPvm && (
          <Text style={styles.suoritettu}>Suoritettu: {item.suoritettuPvm}</Text>
        )}
      </View>
      <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
        <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>H1 Syksy</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/explore' as any)}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tehtavat}
        renderItem={renderTehtava}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  )
}

export default H1TasksView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  listContent: {
    padding: 16,
  },
  tehtavaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tehtavaContent: {
    flex: 1,
  },
  tehtavaNimi: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  suoritettu: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  statusNotStarted: {
    backgroundColor: '#e0e0e0',
  },
  statusSubmitted: {
    backgroundColor: '#FFA500',
  },
  statusApproved: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
})
