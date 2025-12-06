import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { getTasks, calculateCourseProgress } from '../utils/taskManager'
import { hyColors } from '@/constants/hy-colors'

interface CompletedTask {
  id: string
  nimi: string
  oppiaine: string
  suoritettu: string
  status: 'approved' | 'submitted' | 'needs_corrections'
  itsearviointi?: string
  palautePvm?: string
  hyvaksyja?: string
}

export default function StudentDetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const studentId = params.opiskelijaId as string || '1'

  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    progress: 0
  })
  const [tasks, setTasks] = useState<CompletedTask[]>([])

  // Student data mapping
  const studentDatabase = {
    '1': { name: 'Matti Meikäläinen', email: 'matti.meikalainen@helsinki.fi' },
    '2': { name: 'Maija Mallikas', email: 'maija.mallikas@helsinki.fi' },
    '3': { name: 'Teppo Testaaja', email: 'teppo.testaaja@helsinki.fi' },
    '4': { name: 'Liisa Luova', email: 'liisa.luova@helsinki.fi' },
    '5': { name: 'Matti Opiskelija', email: 'matti.opiskelija@helsinki.fi' }, // This is our main student
    '6': { name: 'Juha Järjestelmällinen', email: 'juha.jarjestelmalinen@helsinki.fi' },
  }

  const loadStudentData = async () => {
    try {
      // Get student info from our database
      const student = studentDatabase[studentId as keyof typeof studentDatabase]
      if (!student) {
        // Default fallback
        setStudentData({
          name: 'Opiskelija',
          email: 'opiskelija@helsinki.fi',
          progress: 0
        })
        return
      }

      // For Matti Opiskelija (id: 5), load real task data
      if (studentId === '5') {
        const realTasks = await getTasks()
        const progress = await calculateCourseProgress()

        // Convert real tasks to completed tasks format with additional details
        const completedTasks: CompletedTask[] = realTasks
          .filter(task => task.status !== 'not_started')
          .map(task => ({
            id: task.id,
            nimi: task.nimi,
            oppiaine: 'Kariologia',
            suoritettu: task.suoritettuPvm || 'Ei päivämäärää',
            status: task.status === 'approved' ? 'approved' :
              task.status === 'submitted' ? 'submitted' : 'needs_corrections',
            itsearviointi: task.itsearviointi || 'Ei itsearviointia annettu',
            palautePvm: task.palautePvm,
            hyvaksyja: task.hyvaksyja
          }))

        setTasks(completedTasks)
        setStudentData({
          name: student.name,
          email: student.email,
          progress: progress
        })
      } else {
        // For other students, use mock data
        setStudentData({
          name: student.name,
          email: student.email,
          progress: Math.floor(Math.random() * 100) // Random progress for demo
        })

        // Mock some tasks for other students
        setTasks([
          {
            id: '1',
            nimi: 'Esimerkkitehtävä',
            oppiaine: 'Kariologia',
            suoritettu: '15.10.2025',
            status: 'approved',
          }
        ])
      }
    } catch (error) {
      console.error('Error loading student data:', error)
    }
  }

  useEffect(() => {
    loadStudentData()
  }, [studentId])

  // Refresh data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadStudentData()
    }, [studentId])
  )

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
          <Text style={styles.studentName}>{studentData.name}</Text>
          <Text style={styles.studentEmail}>{studentData.email}</Text>

          {/* Overall Progress */}
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Kokonaisedistyminen</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${studentData.progress}%`,
                    backgroundColor: getProgressColor(studentData.progress),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{studentData.progress}%</Text>
          </View>
        </View>

        {/* Completed Tasks */}
        <Text style={styles.sectionTitle}>Suoritetut tehtävät</Text>
        {tasks.map((task) => {
          const badge = getStatusBadge(task.status)
          return (
            <TouchableOpacity
              key={task.id}
              style={styles.taskCard}
              onPress={() => {
                router.push({
                  pathname: '/teacher-task-review',
                  params: {
                    taskId: task.id,
                    name: task.nimi,
                    student: studentData.name,
                    studentId: studentId,
                    completionDate: task.suoritettu,
                    selfAssessment: task.itsearviointi || 'Ei itsearviointia annettu',
                    submissionDate: task.palautePvm || task.suoritettu, // Use feedback date if available, otherwise completion date
                    taskStatus: task.status // Pass current task status
                  }
                })
              }}
            >
              <View style={styles.taskRow}>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskName}>{task.nimi}</Text>
                  <Text style={styles.taskSubject}>{task.oppiaine}</Text>
                  <Text style={styles.taskDate}>Suoritettu: {task.suoritettu}</Text>
                  {task.status === 'approved' && task.hyvaksyja && (
                    <Text style={styles.approverInfo}>Hyväksyjä: {task.hyvaksyja}</Text>
                  )}
                </View>
                <View style={styles.taskActions}>
                  <View style={[styles.statusBadge, badge.style]}>
                    <Text style={styles.statusText}>{badge.text}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" style={styles.chevron} />
                </View>
              </View>
            </TouchableOpacity>
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
    borderBottomColor: hyColors.borderColor.light,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: hyColors.textColor.default,
  },
  content: {
    padding: 16,
  },
  // Student card starts
  infoCard: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  studentName: {
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
    color: hyColors.textColor.default,
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 15,
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
    marginBottom: 10,
  },
  progressSection: {
    width: '100%',
    marginTop: 16,
  },
  progressLabel: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: hyColors.textColor.default,
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
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: hyColors.textColor.default,
    marginBottom: 16,
  },
  // Student card ends
  taskCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskInfo: {
    flex: 1,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskName: {
    fontSize: 17,
    fontFamily: 'OpenSans-SemiBold',
    color: hyColors.textColor.default,
    marginBottom: 4,
  },
  taskSubject: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
    marginBottom: 2,
  },
  taskDate: {
    fontSize: 13,
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
  },
  approverInfo: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: hyColors.extraColor.green,
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  statusApproved: {
    backgroundColor: hyColors.extraColor.mediumGreen,
  },
  statusSubmitted: {
    backgroundColor: hyColors.extraColor.lightYellow,
  },
  statusNeedsCorrection: {
    backgroundColor: hyColors.extraColor.lightRed,
  },
  statusText: {
    fontSize: 13,
    fontFamily: 'OpenSans-Bold',
    color: hyColors.textColor.secondary,
  },
  chevron: {
    marginLeft: 8,
  },
})
