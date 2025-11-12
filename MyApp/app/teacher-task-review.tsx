import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView } from 'react-native'
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { reviewTask, getTaskConversation, ConversationMessage, getTaskById, Task } from '../utils/taskManager'

export default function TeacherTaskReview() {
  const router = useRouter()
  const params = useLocalSearchParams()

  const taskId = params.taskId as string || ''
  const taskName = params.name as string || 'Tehtävä'
  const studentName = params.student as string || 'Oppilas'
  const studentId = params.studentId as string || '1'
  const completionDate = params.completionDate as string || 'Ei ilmoitettu'
  const selfAssessment = params.selfAssessment as string || 'Ei itsearviointia'
  const submissionDate = params.submissionDate as string || ''

  const [teacherFeedback, setTeacherFeedback] = useState('')
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [isConversationExpanded, setIsConversationExpanded] = useState(true)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [isReadOnly, setIsReadOnly] = useState(false)

  // Load conversation history and task data
  const loadTaskData = async () => {
    if (taskId) {
      const conv = await getTaskConversation(taskId)
      setConversation(conv)

      const task = await getTaskById(taskId)
      setCurrentTask(task || null)

      // Set read-only mode if task is approved
      const readOnly = task?.status === 'approved'
      setIsReadOnly(readOnly)

      // Pre-fill teacher feedback if available and in read-only mode
      if (readOnly && task?.opettajanPalaute) {
        setTeacherFeedback(task.opettajanPalaute)
      }
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      loadTaskData()
    }, [taskId])
  )

  const handleDecision = async (decision: 'approved' | 'needs_corrections') => {
    // Prevent actions in read-only mode
    if (isReadOnly) {
      Alert.alert('Tehtävä on jo arvioitu', 'Tämä tehtävä on jo hyväksytty eikä sitä voi enää muokata.')
      return
    }

    if (!teacherFeedback.trim() && decision === 'needs_corrections') {
      Alert.alert('Puuttuva palaute', 'Anna palaute ennen korjausten vaatimista.')
      return
    }

    try {
      await reviewTask(taskId, studentId, decision, teacherFeedback, 'Dr. Leena Opettaja') // Using a default teacher name

      const message =
        decision === 'approved'
          ? `Tehtävä "${taskName}" on hyväksytty.`
          : `Tehtävä "${taskName}" palautettiin korjattavaksi.`

      Alert.alert('Päätös tallennettu', message, [
        {
          text: 'OK',
          onPress: () => {
            router.back()
          },
        },
      ])
    } catch (error) {
      Alert.alert('Virhe', 'Arvioinnin tallentaminen epäonnistui. Yritä uudelleen.')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isReadOnly ? 'Arviointi (Hyväksytty)' : 'Arviointi'}
        </Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/explore' as any)}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.taskTitle}>{taskName}</Text>
        <Text style={styles.subtitle}>Opiskelija: {studentName}</Text>
        <Text style={styles.subtitle}>Suoritettu: {completionDate}</Text>
        {submissionDate && (
          <Text style={styles.subtitle}>Lähetetty: {submissionDate}</Text>
        )}

        {/* Status Indicator */}
        {isReadOnly && (
          <View style={styles.statusCard}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <View style={styles.statusContent}>
              <Text style={styles.statusText}>Tehtävä on hyväksytty</Text>
              {currentTask?.hyvaksyja && (
                <Text style={styles.approverText}>Hyväksyjä: {currentTask.hyvaksyja}</Text>
              )}
              {currentTask?.palautePvm && (
                <Text style={styles.statusDate}>Hyväksytty: {currentTask.palautePvm}</Text>
              )}
            </View>
          </View>
        )}

        {/* Student Self Assessment */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Opiskelijan itsearviointi</Text>
          <Text style={styles.text}>{selfAssessment}</Text>
        </View>

        {/* Conversation History */}
        {conversation.length > 0 && (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => setIsConversationExpanded(!isConversationExpanded)}
              style={styles.cardHeader}
            >
              <Text style={styles.cardTitle}>Keskusteluhistoria ({conversation.length})</Text>
              <Ionicons
                name={isConversationExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>

            {isConversationExpanded && (
              <View style={styles.conversationContainer}>
                {conversation.map((message) => (
                  <View
                    key={message.id}
                    style={[
                      styles.messageContainer,
                      message.sender === 'student'
                        ? styles.studentMessage
                        : styles.teacherMessage
                    ]}
                  >
                    <View style={styles.messageHeader}>
                      <Text style={styles.messageSender}>
                        {message.sender === 'student' ? 'Opiskelija' : 'Opettaja'}
                      </Text>
                      <Text style={styles.messageTime}>{message.timestamp}</Text>
                    </View>
                    <Text style={styles.messageText}>{message.message}</Text>
                    {message.type === 'resubmission' && (
                      <Text style={styles.messageType}>Korjaus</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Teacher Feedback */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Opettajan palaute</Text>
          <TextInput
            style={[styles.input, isReadOnly && styles.inputReadOnly]}
            multiline
            placeholder={isReadOnly ? "" : "Kirjoita palaute opiskelijalle..."}
            value={teacherFeedback}
            onChangeText={isReadOnly ? undefined : setTeacherFeedback}
            textAlignVertical="top"
            editable={!isReadOnly}
          />
          {isReadOnly && !teacherFeedback && (
            <Text style={styles.noFeedbackText}>Ei palautetta annettu</Text>
          )}
        </View>

        {/* Decision Buttons - only show if not read-only */}
        {!isReadOnly && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.approveButton]}
              onPress={() => handleDecision('approved')}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Hyväksy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() => handleDecision('needs_corrections')}
            >
              <Ionicons name="close-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Vaadi korjauksia</Text>
            </TouchableOpacity>
          </View>
        )}
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
    flex: 1,
    padding: 20,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    minHeight: 120,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 40,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#FFA500',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  conversationContainer: {
    marginTop: 12,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  studentMessage: {
    backgroundColor: '#e3f2fd',
    borderLeftColor: '#2196F3',
  },
  teacherMessage: {
    backgroundColor: '#f3e5f5',
    borderLeftColor: '#9c27b0',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  messageType: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
    marginTop: 4,
  },
  statusCard: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  statusContent: {
    flex: 1,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d2e',
  },
  approverText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2e7d2e',
    marginTop: 2,
  },
  statusDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  inputReadOnly: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  noFeedbackText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
})
