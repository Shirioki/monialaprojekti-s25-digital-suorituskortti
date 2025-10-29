import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
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

  // Mock data – nämä tiedot tulisivat oikeasti tietokannasta
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
      status: 'needs_corrections',
      selfAssessment: 'En ollut varma kaikkien instrumenttien käyttötarkoituksista.',
    },
    {
      id: '3',
      nimi: 'H3 Puudutusharjoitus',
      opiskelija: 'Teppo Testaaja',
      completionDate: '25.9.2025',
      status: 'approved',
      selfAssessment: 'Tehtävä meni hyvin ja opin puuduttamaan turvallisesti.',
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return '#FFA500' // oranssi
      case 'approved':
        return '#4CAF50' // vihreä
      case 'needs_corrections':
        return '#F44336' // punainen
      default:
        return '#999'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Odottaa arviointia'
      case 'approved':
        return 'Hyväksytty'
      case 'needs_corrections':
        return 'Vaatii korjauksia'
      default:
        return 'Tuntematon tila'
    }
  }

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/teacher-task-review',
          params: {
            name: item.nimi,
            student: item.opiskelija,
            completionDate: item.completionDate,
            selfAssessment: item.selfAssessment,
          },
        })
      }
    >
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.taskTitle}>{item.nimi}</Text>
          <Text style={styles.studentName}>{item.opiskelija}</Text>
          <Text style={styles.dateText}>Suoritettu: {item.completionDate}</Text>
        </View>

        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}
        >
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>

        <Ionicons name="chevron-forward" size={22} color="#666" />
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Arvioitavat tehtävät</Text>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  studentName: {
    fontSize: 15,
    color: '#555',
    marginTop: 2,
  },
  dateText: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginRight: 10,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
})
