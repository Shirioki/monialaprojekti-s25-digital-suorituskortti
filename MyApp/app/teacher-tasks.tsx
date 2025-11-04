import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

interface Task {
  id: string
  nimi: string
  opiskelija: string
  completionDate: string
  status: 'submitted' | 'approved' | 'needs_corrections'
  selfAssessment: string
}

export default function TeacherTasksScreen() {
  const router = useRouter()
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      nimi: 'Hampaiden tunnistus',
      opiskelija: 'Matti Meikäläinen',
      completionDate: '29.9.2025',
      status: 'submitted',
      selfAssessment: 'Tehtävä sujui hyvin, opin tunnistamaan eri hampaat.',
    },
    {
      id: '2',
      nimi: 'Käsi-instrumentteihin tutustuminen',
      opiskelija: 'Maija Mallikas',
      completionDate: '28.9.2025',
      status: 'submitted',
      selfAssessment: 'En ollut varma kaikkien instrumenttien käyttötarkoituksista.',
    },
    {
      id: '3',
      nimi: 'Suun tarkastus',
      opiskelija: 'Teppo Testaaja',
      completionDate: '27.9.2025',
      status: 'approved',
      selfAssessment: 'Harjoittelin tarkastusta useaan otteeseen.',
    },
  ])

  const handleTaskPress = (task: Task) => {
    router.push({
      pathname: '/teacher-task-review',
      params: {
        name: task.nimi,
        student: task.opiskelija,
        completionDate: task.completionDate,
        selfAssessment: task.selfAssessment,
      }
    } as any)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return { text: 'Odottaa arviointia', style: styles.statusSubmitted }
      case 'approved':
        return { text: 'Hyväksytty', style: styles.statusApproved }
      case 'needs_corrections':
        return { text: 'Korjattava', style: styles.statusNeedsCorrection }
      default:
        return { text: 'Tuntematon', style: styles.statusSubmitted }
    }
  }

  const renderTask = ({ item }: { item: Task }) => {
    const badge = getStatusBadge(item.status)
    return (
      <TouchableOpacity
        style={styles.taskCard}
        onPress={() => handleTaskPress(item)}
      >
        <View style={styles.taskInfo}>
          <Text style={styles.taskName}>{item.nimi}</Text>
          <Text style={styles.studentName}>Opiskelija: {item.opiskelija}</Text>
          <Text style={styles.completionDate}>Suoritettu: {item.completionDate}</Text>
        </View>
        <View style={[styles.statusBadge, badge.style]}>
          <Text style={styles.statusText}>{badge.text}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Arvioitavat tehtävät</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/explore' as any)}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  )
}

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
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  taskInfo: {
    marginBottom: 12,
  },
  taskName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  studentName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  completionDate: {
    fontSize: 13,
    color: '#888',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  statusSubmitted: {
    backgroundColor: '#FFA500',
  },
  statusApproved: {
    backgroundColor: '#4CAF50',
  },
  statusNeedsCorrection: {
    backgroundColor: '#F44336',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
})
