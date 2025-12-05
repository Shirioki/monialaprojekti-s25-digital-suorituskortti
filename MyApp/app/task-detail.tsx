import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Modal
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { getTaskById, submitTask, Task, getTaskConversation, ConversationMessage } from '../utils/taskManager'
import { getWorkCardById, WorkCard, WorkCardField } from '../utils/workCardManager'

export default function TaskDetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const taskId = params.taskId as string

  const [task, setTask] = useState<Task | null>(null)
  const [workCard, setWorkCard] = useState<WorkCard | null>(null)
  const [loading, setLoading] = useState(true)

  // Standard task fields
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selfAssessment, setSelfAssessment] = useState('')

  // Work card field values
  const [workCardValues, setWorkCardValues] = useState<{ [key: string]: any }>({})
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // Conversation history
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [isConversationExpanded, setIsConversationExpanded] = useState(false)

  // Check if task is approved (read-only mode)
  const isTaskApproved = task?.status === 'approved'

  useEffect(() => {
    loadTask()
  }, [taskId])

  const loadTask = async () => {
    try {
      setLoading(true)
      const taskData = await getTaskById(taskId)
      if (!taskData) {
        Alert.alert('Virhe', 'Tehtävää ei löytynyt')
        router.back()
        return
      }

      setTask(taskData)

      // Load conversation history
      const conversationData = await getTaskConversation(taskId)
      setConversation(conversationData)

      // If this is a work card task, load the work card
      if (taskData.type === 'workcard' && taskData.workCardId) {
        console.log('Loading work card with ID:', taskData.workCardId)
        const workCardData = await getWorkCardById(taskData.workCardId)
        if (workCardData) {
          console.log('Work card loaded:', workCardData.title, 'Fields:', workCardData.fields.length)
          setWorkCard(workCardData)

          // Initialize work card field values
          const initialValues: { [key: string]: any } = {}
          // ✅ FIX #1 & #2: Add WorkCardField type annotation
          workCardData.fields.map((field: WorkCardField) => {
            if (field.type === 'checkbox') {
              initialValues[field.id] = false
            } else if (field.type === 'multipleChoice') {
              initialValues[field.id] = []
            } else {
              initialValues[field.id] = field.value || ''
            }
          })
          setWorkCardValues(initialValues)
        } else {
          console.log('Work card not found')
        }
      }

      // Load existing data if task has been started
      if (taskData.suoritettuPvm) {
        const dateParts = taskData.suoritettuPvm.split('.')
        if (dateParts.length === 3) {
          setDate(new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0])))
        }
      }

      if (taskData.itsearviointi) {
        setSelfAssessment(taskData.itsearviointi)
      }
    } catch (error) {
      console.error('Error loading task:', error)
      Alert.alert('Virhe', 'Tehtävän lataaminen epäonnistui')
    } finally {
      setLoading(false)
    }
  }

  const updateWorkCardValue = (fieldId: string, value: any) => {
    setWorkCardValues(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const toggleMultipleChoice = (fieldId: string, option: string) => {
    setWorkCardValues(prev => {
      const currentValues = prev[fieldId] || []
      const isSelected = currentValues.includes(option)
      if (isSelected) {
        return {
          ...prev,
          [fieldId]: currentValues.filter((item: string) => item !== option)
        }
      } else {
        return {
          ...prev,
          [fieldId]: [...currentValues, option]
        }
      }
    })
  }

  const toggleDropdown = (fieldId: string) => {
    setOpenDropdownId(prev => prev === fieldId ? null : fieldId)
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }

    if (selectedDate) {
      setDate(selectedDate)
    }
  }

  const formatDate = (date: Date): string => {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  }

  const handleSubmit = async () => {
    // Validate based on task type
    if (task?.type === 'workcard' && workCard) {
      // Validate work card required fields
      for (const field of workCard.fields) {
        if (field.required) {
          const value = workCardValues[field.id]
          if (field.type === 'multipleChoice') {
            if (!value || !Array.isArray(value) || value.length === 0) {
              Alert.alert('Virhe', `Kenttä "${field.label}" on pakollinen`)
              return
            }
          } else if (!value || (typeof value === 'string' && !value.trim())) {
            Alert.alert('Virhe', `Kenttä "${field.label}" on pakollinen`)
            return
          }
        }
      }

      // Convert work card values to self assessment text
      const assessmentParts: string[] = []
      // ✅ FIX #5: Add WorkCardField type annotation.
      workCard.fields.map((field: WorkCardField) => {
        const value = workCardValues[field.id]
        if (value) {
          if (field.type === 'multipleChoice' && Array.isArray(value)) {
            assessmentParts.push(`${field.label}: ${value.join(', ')}`)
          } else if (field.type === 'checkbox') {
            assessmentParts.push(`${field.label}: ${value ? 'Kyllä' : 'Ei'}`)
          } else if (field.type !== 'text' && field.type !== 'teacherReview') {
            assessmentParts.push(`${field.label}: ${value}`)
          }
        }
      })

      const workCardAssessment = assessmentParts.join('\n')

      try {
        await submitTask(
          taskId,
          formatDate(date),
          workCardAssessment,
          '1',
          'Matti Opiskelija'
        )

        Alert.alert(
          'Onnistui!',
          'Suorituskortti lähetetty tarkistettavaksi',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        )
      } catch (error) {
        console.error('Error submitting work card:', error)
        Alert.alert('Virhe', 'Lähetys epäonnistui')
      }
    } else {
      // Standard task validation
      if (!selfAssessment.trim()) {
        Alert.alert('Virhe', 'Lisää itsearviointi')
        return
      }

      try {
        await submitTask(
          taskId,
          formatDate(date),
          selfAssessment,
          '1',
          'Matti Opiskelija'
        )

        Alert.alert(
          'Onnistui!',
          'Tehtävä lähetetty tarkistettavaksi',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        )
      } catch (error) {
        console.error('Error submitting task:', error)
        Alert.alert('Virhe', 'Lähetys epäonnistui')
      }
    }
  }

  const renderWorkCardField = (field: WorkCardField) => {
    return (
      <View key={field.id} style={[styles.section, isTaskApproved && styles.sectionDisabled]}>
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.sectionTitle}>
            {field.label}
            {field.required && <Text style={styles.requiredMark}> *</Text>}
          </Text>
        </View>

        {field.type === 'text' && (
          <Text style={styles.staticTextContent}>
            {field.staticText || field.value || 'Tekstikenttä (vain luku)'}
          </Text>
        )}

        {field.type === 'textInput' && (
          <TextInput
            style={[styles.textInput, isTaskApproved && styles.textInputDisabled]}
            placeholder="Kirjoita tähän..."
            value={workCardValues[field.id] || ''}
            onChangeText={(text) =>
              !isTaskApproved && updateWorkCardValue(field.id, text)
            }
            multiline
            textAlignVertical="top"
            placeholderTextColor="#999"
            editable={!isTaskApproved}
          />
        )}

        {field.type === 'multipleChoice' && field.options && (
          <View>
            {(!workCardValues[field.id] || workCardValues[field.id].length === 0) && (
              <Text style={styles.multipleChoiceHint}>Valitse vaihtoehdot:</Text>
            )}
            {/* ✅ FIX #3: Add string and number type annotations */}
            {field.options.map((option: string, index: number) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.multipleChoiceCard,
                  workCardValues[field.id]?.includes(option) && styles.multipleChoiceCardSelected,
                  isTaskApproved && styles.multipleChoiceCardDisabled
                ]}
                onPress={() =>
                  !isTaskApproved && toggleMultipleChoice(field.id, option)
                }
                disabled={isTaskApproved}
              >
                {workCardValues[field.id]?.includes(option) && (
                  <Ionicons name="checkmark" size={20} color={isTaskApproved ? "#999" : "#007AFF"} style={{ marginRight: 12 }} />
                )}
                <Text style={[styles.multipleChoiceText, isTaskApproved && styles.textDisabled]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {field.type === 'checkbox' && (
          <TouchableOpacity
            style={[styles.checkboxRow, isTaskApproved && styles.checkboxRowDisabled]}
            onPress={() =>
              !isTaskApproved && updateWorkCardValue(field.id, !workCardValues[field.id])
            }
            activeOpacity={isTaskApproved ? 1 : 0.7}
            disabled={isTaskApproved}
          >
            {workCardValues[field.id] && (
              <Ionicons name="checkbox" size={24} color={isTaskApproved ? "#999" : "#007AFF"} style={{ marginRight: 12 }} />
            )}
            {!workCardValues[field.id] && (
              <View style={[styles.checkbox, isTaskApproved && styles.checkboxDisabled]} />
            )}
            <Text style={[styles.checkboxLabel, isTaskApproved && styles.textDisabled]}>Kyllä</Text>
          </TouchableOpacity>
        )}

        {field.type === 'dropdown' && field.options && (
          <View>
            <TouchableOpacity
              style={[styles.dropdownButton, isTaskApproved && styles.dropdownButtonDisabled]}
              onPress={() =>
                !isTaskApproved && toggleDropdown(field.id)
              }
              disabled={isTaskApproved}
            >
              <Text style={[
                styles.dropdownButtonText,
                !workCardValues[field.id] && styles.dropdownPlaceholder,
                isTaskApproved && styles.textDisabled
              ]}>
                {workCardValues[field.id] || 'Valitse...'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={isTaskApproved ? "#ccc" : "#666"} />
            </TouchableOpacity>

            {openDropdownId === field.id && !isTaskApproved && (
              <View style={styles.dropdownOptions}>
                {/* ✅ FIX #4: Add string and number type annotations */}
                {field.options.map((option: string, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dropdownOptionCard,
                      workCardValues[field.id] === option && styles.dropdownOptionCardSelected
                    ]}
                    onPress={() => {
                      updateWorkCardValue(field.id, option)
                      setOpenDropdownId(null)
                    }}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      workCardValues[field.id] === option && styles.dropdownOptionTextSelected
                    ]}>
                      {option}
                    </Text>
                    {workCardValues[field.id] === option && (
                      <Ionicons name="checkmark" size={20} color="#007AFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {field.type === 'teacherReview' && (
          <View style={styles.teacherReviewContainer}>
            <View style={styles.teacherReviewHeader}>
              <Ionicons name="person" size={20} color="#E65100" />
              <Text style={styles.teacherReviewLabel}>Opettajan arviointi</Text>
            </View>
            <Text style={styles.teacherReviewPlaceholder}>
              Opettaja täyttää tämän kentän arvioinnin yhteydessä
            </Text>
          </View>
        )}
      </View>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tehtävä</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Ladataan tehtävää...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tehtävä</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Tehtävää ei löytynyt</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{task.nimi}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Date Picker (Always show) */}
        <View style={[styles.section, isTaskApproved && styles.sectionDisabled]}>
          <Text style={styles.sectionTitle}>Suorituksen päivämäärä <Text style={styles.requiredMark}>*</Text></Text>

          {/* Status indicator for approved tasks */}
          {isTaskApproved && (
            <View style={styles.statusCard}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.statusText}>Tehtävä on hyväksytty</Text>
              {task?.hyvaksyja && (
                <Text style={styles.approverText}>Hyväksyjä: {task.hyvaksyja}</Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[styles.dateButton, isTaskApproved && styles.dateButtonDisabled]}
            onPress={() => !isTaskApproved && setShowDatePicker(true)}
            disabled={isTaskApproved}
          >
            <Ionicons name="calendar" size={20} color={isTaskApproved ? "#ccc" : "#666"} />
            <Text style={[styles.dateText, isTaskApproved && styles.textDisabled]}>{formatDate(date)}</Text>
          </TouchableOpacity>

          {/* Date Picker Modal */}
          <Modal
            visible={showDatePicker && !isTaskApproved}
            transparent
            animationType="slide"
          >
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.datePickerCancelButton}>Peruuta</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Valitse päivämäärä</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.datePickerConfirmButton}>Valmis</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.datePickerContent}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  locale="fi"
                />
              </View>
            </View>
          </Modal>
        </View>

        {/* Render Work Card Fields or Standard Task Form */}
        {task.type === 'workcard' && workCard ? (
          <>
            {/* Work Card Title */}
            <View style={styles.section}>
              <Text style={styles.workCardTitle}>{workCard.title}</Text>
            </View>

            {/* Dynamic Work Card Fields */}
            {workCard.fields.map((field: WorkCardField) => renderWorkCardField(field))}
          </>
        ) : (
          <>
            {/* Standard Task Form - Only Itsearviointi */}
            <View style={[styles.section, isTaskApproved && styles.sectionDisabled]}>
              <Text style={styles.sectionTitle}>Itsearviointi <Text style={styles.requiredMark}>*</Text></Text>
              <TextInput
                style={[styles.textInput, { minHeight: 120 }, isTaskApproved && styles.textInputDisabled]}
                placeholder={isTaskApproved ? "" : "Kirjoita itse arvio siitä, miten sait tehtävän valmiiksi..."}
                value={selfAssessment}
                onChangeText={isTaskApproved ? undefined : setSelfAssessment}
                multiline
                textAlignVertical="top"
                placeholderTextColor="#999"
                editable={!isTaskApproved}
              />
            </View>
          </>
        )}

        {/* Conversation History */}
        {conversation.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              onPress={() => setIsConversationExpanded(!isConversationExpanded)}
              style={styles.conversationHeader}
            >
              <Text style={styles.sectionTitle}>Keskusteluhistoria ({conversation.length})</Text>
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
                        {message.sender === 'student' ? 'Minä (opiskelija)' : 'Opettaja'}
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

        {/* Submit Button - Only show if not approved */}
        {!isTaskApproved && (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Lähetä tarkistettavaksi</Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomSpacing} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  workCardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  requiredMark: {
    color: '#FF3B30',
    fontWeight: '700',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  datePickerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  datePickerCancelButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  datePickerConfirmButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  datePickerContent: {
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  staticTextContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  multipleChoiceHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  multipleChoiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  multipleChoiceCardSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  multipleChoiceRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  multipleChoiceRadioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  multipleChoiceText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  multipleChoiceTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownPlaceholder: {
    color: '#999',
  },
  dropdownOptions: {
    marginTop: 8,
  },
  dropdownOptionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownOptionCardSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  dropdownOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  teacherReviewContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  teacherReviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  teacherReviewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E65100',
    marginLeft: 8,
  },
  teacherReviewPlaceholder: {
    fontSize: 14,
    color: '#E65100',
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
  // Disabled state styles
  sectionDisabled: {
    opacity: 0.6,
    backgroundColor: '#f9f9f9',
  },
  textInputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  textDisabled: {
    color: '#999',
  },
  dateButtonDisabled: {
    backgroundColor: '#f0f0f0',
    opacity: 0.6,
  },
  dropdownButtonDisabled: {
    backgroundColor: '#f0f0f0',
    opacity: 0.6,
  },
  multipleChoiceCardDisabled: {
    opacity: 0.6,
    backgroundColor: '#f0f0f0',
  },
  checkboxRowDisabled: {
    opacity: 0.6,
  },
  checkboxDisabled: {
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
  },
  // Status styles
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 8,
    flex: 1,
  },
  approverText: {
    fontSize: 12,
    color: '#2E7D32',
    marginLeft: 8,
  },
  // Conversation styles
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
  },
  conversationContainer: {
    marginTop: 8,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  studentMessage: {
    backgroundColor: '#E3F2FD',
    borderLeftColor: '#2196F3',
  },
  teacherMessage: {
    backgroundColor: '#FFF3E0',
    borderLeftColor: '#FF9800',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  messageType: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FF5722',
    marginTop: 4,
    textTransform: 'uppercase',
  },
})
