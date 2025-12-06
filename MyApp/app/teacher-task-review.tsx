import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView } from 'react-native'
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { reviewTask, getTaskConversation, ConversationMessage, getTaskById, Task } from '../utils/taskManager'
import { hyColors } from '@/constants/hy-colors'

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
      await reviewTask(taskId, studentId, decision, teacherFeedback, 'Leena Opettaja') // Using a default teacher name

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
    backgroundColor: hyColors.bgColor.white,
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
    fontFamily: 'OpenSans-Bold',
    color: hyColors.textColor.default,
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  taskTitle: {
    fontFamily: 'OpenSans-Bold',
    color: hyColors.textColor.default,
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 4,
  },
  card: {
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
    backgroundColor: hyColors.bgColor.neutral,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontFamily: 'OpenSans-SemiBold',
    color: hyColors.textColor.default,
    fontSize: 18,
    marginBottom: 12,
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
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
    gap: 8,
  },
  approveButton: {
    backgroundColor: hyColors.bgColor.primary,
  },
  rejectButton: {
    backgroundColor: hyColors.bgColor.black,
  },
  buttonText: {
    fontFamily: 'OpenSans-Bold',
    color: hyColors.textColor.white,
    fontSize: 16,
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
    borderLeftWidth: 4,
    borderWidth: 1,
  },
  studentMessage: {
    backgroundColor: hyColors.extraColor.lightGreen,
    borderLeftColor: hyColors.extraColor.green,
    borderColor: hyColors.extraColor.green
  },
  teacherMessage: {
    backgroundColor: hyColors.bgColor.secondaryHover,
    borderLeftColor: hyColors.borderColor.info,
    borderColor: hyColors.borderColor.info
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  messageSender: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: hyColors.textColor.default,
  },
  messageTime: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: hyColors.textColor.secondary,
  },
  messageText: {
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
  messageType: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
    marginTop: 4,
  },
  // APPROVED/FAILED
  statusCard: {
    backgroundColor: hyColors.extraColor.lightGreen,
    padding: 16,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: hyColors.extraColor.green,
  },
  statusContent: {
    flex: 1,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: hyColors.textColor.success,
  },
  approverText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
    marginTop: 2,
  },
  statusDate: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
    marginTop: 4,
  },
  inputReadOnly: {
    backgroundColor: hyColors.bgColor.neutral,
    color: hyColors.textColor.secondary,
  },
  noFeedbackText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
})
