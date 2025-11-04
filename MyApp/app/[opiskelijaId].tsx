import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

interface CompletedTask {
  id: string
  nimi: string
  oppiaine: string
  suoritettu: string
  status: 'approved' | 'submitted' | 'needs_corrections'
}

export default function StudentDetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const studentId = params.id as string || '1'

  // Mock data - should come from backend
  const studentName = 'Matti Meikäläinen'
  const studentEmail = 'matti.meikalainen@helsinki.fi'
  const overallProgress = 65

  const completedTasks: CompletedTask[] = [
    {
      id: '1',
      nimi: 'Hampaiden tunnistus',
      oppiaine: 'Kariologia',
      suoritettu: '29.9.2025',
      status: 'approved',
    },
    {
      id: '2',
      nimi: 'Käsi-instrumentteihin tutustuminen',
      oppiaine: 'Kariologia',
      suoritettu: '28.9.2025',
      status: 'submitted',
    },
    {
      id: '3',
      nimi: 'Suun tarkastus',
      oppiaine: 'Kirurgia',
      suoritettu: '25.9.2025',
      status: 'approved',
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return { text: 'Hyväksytty', style: styles.statusApproved }
      case 'submitted':
        return { text: 'Odottaa', style: styles.statusSubmitted }
      case 'needs_corrections':
        return { text: 'Korjattava', style: styles.statusNeedsCorrection }
      default:
        return { text: '', style: {} }
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return '#4CAF50'
    if (progress >= 40) return '#FFA500'
    return '#F44336'
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Opiskelijan tiedot</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Student Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={80} color="#007AFF" />
          </View>
          <Text style={styles.studentName}>{studentName}</Text>
          <Text style={styles.studentEmail}>{studentEmail}</Text>

          {/* Overall Progress */}
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Kokonaisedistyminen</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${overallProgress}%`,
                    backgroundColor: getProgressColor(overallProgress),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{overallProgress}%</Text>
          </View>
        </View>

        {/* Completed Tasks */}
        <Text style={styles.sectionTitle}>Suoritetut tehtävät</Text>
        {completedTasks.map((task) => {
          const badge = getStatusBadge(task.status)
          return (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskInfo}>
                <Text style={styles.taskName}>{task.nimi}</Text>
                <Text style={styles.taskSubject}>{task.oppiaine}</Text>
                <Text style={styles.taskDate}>Suoritettu: {task.suoritettu}</Text>
              </View>
              <View style={[styles.statusBadge, badge.style]}>
                <Text style={styles.statusText}>{badge.text}</Text>
              </View>
            </View>
          )
        })}
      </ScrollView>
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
  content: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  studentName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
  },
  progressSection: {
    width: '100%',
    marginTop: 16,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
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
    marginBottom: 4,
  },
  taskSubject: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  taskDate: {
    fontSize: 13,
    color: '#888',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  statusApproved: {
    backgroundColor: '#4CAF50',
  },
  statusSubmitted: {
    backgroundColor: '#FFA500',
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
