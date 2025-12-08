import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { getTasks, Task } from '../utils/taskManager'
import { hyColors } from '@/constants/hy-colors'

export default function H1TasksScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // Get course info from params, default to H1 Syksy (courseId: '1')
  const courseId = typeof params.courseId === 'string' ? params.courseId : '1'
  const courseName = typeof params.courseName === 'string' ? params.courseName : 'H1 Syksy'

  useEffect(() => {
    loadTasks()
  }, [])

  // Refresh tasks when screen is focused (when coming back from other screens)
  useFocusEffect(
    React.useCallback(() => {
      loadTasks()
    }, [])
  )

  const loadTasks = async () => {
    try {
      setLoading(true)
      const allTasks = await getTasks()
      // Filter tasks to only show tasks for the selected course
      const courseTasks = allTasks.filter((task) => task.courseId === courseId)
      setTasks(courseTasks)
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#4CAF50'
      case 'submitted':
        return '#FFA500'
      case 'needs_corrections':
        return '#FF3B30'
      default:
        return '#999'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Hyväksytty'
      case 'submitted':
        return 'Lähetetty'
      case 'needs_corrections':
        return 'Vaatii korjauksia'
      default:
        return 'Ei aloitettu'
    }
  }

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => {
        router.push({
          pathname: '/task-detail',
          params: { taskId: item.id },
        } as any)
      }}
    >
      <View style={styles.taskInfo}>
        <Text style={styles.taskTitle}>{item.nimi}</Text>
        <View style={styles.statusContainer}>
          <View
            style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]}
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={hyColors.textColor.secondary} />
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={hyColors.textColor.default} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{courseName}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={hyColors.textColor.primary} />
          <Text style={styles.loadingText}>Ladataan tehtäviä...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={hyColors.textColor.default} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{courseName}</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={hyColors.textColor.secondary} />
            <Text style={styles.emptyText}>Ei tehtäviä saatavilla</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: hyColors.bgColor.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: hyColors.bgColor.white,
    borderBottomWidth: 1,
    borderBottomColor: hyColors.borderColor.light,
  },
  headerTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: hyColors.textColor.default,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: hyColors.bgColor.neutral,
    marginBottom: 10,
    borderRadius: 0, // Matching the flat list style from student view
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
    // Optional shadow to match student cards exactly if desired,
    // otherwise keep flat like list items
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.default,
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12, // Matches progress text size
    fontFamily: 'OpenSans-Regular',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
    marginTop: 12,
    fontStyle: 'italic',
  },
})
